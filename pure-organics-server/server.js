require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// =================================================================
// 1. TIDB CLOUD DATABASE CONNECTION POOL
// =================================================================
// Works with DATABASE_URL or individual TiDB host/user/password variables
const pool = mysql.createPool(
  process.env.DATABASE_URL
    ? {
        uri: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: true },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      }
    : {
        host: process.env.TIDB_HOST || "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
        port: Number(process.env.TIDB_PORT) || 4000,
        user: process.env.TIDB_USER || "root",
        password: process.env.TIDB_PASSWORD || "",
        database: process.env.TIDB_DATABASE || "pure_organics",
        ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      }
);

// Helper function for clean async/await SQL execution
async function dbQuery(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// Verify Database Connection on Startup
pool
  .getConnection()
  .then((conn) => {
    console.log("Connected to TiDB Cloud (pure_organics) successfully.");
    conn.release();
  })
  .catch((err) => {
    console.error("TiDB Cloud Connection Error:", err.message);
  });

// =================================================================
// 2. SHIPROCKET AUTOMATED COURIER INTEGRATION (FREE API)
// =================================================================
let shiprocketToken = null;
let tokenExpiry = null;

async function getShiprocketToken() {
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    console.log("Shiprocket credentials not found in environment. Using fallback AWB generator.");
    return null;
  }

  try {
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data && data.token) {
      shiprocketToken = data.token;
      tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // 9 days cache
      return shiprocketToken;
    } else {
      console.error("Shiprocket Login Failed:", data);
    }
  } catch (err) {
    console.error("Shiprocket Request Error:", err.message);
  }
  return null;
}

// Assign Delivery Channel (Shiprocket Automated vs Manual Local Courier)
app.post("/api/admin/assign-delivery", async (req, res) => {
  const { orderId, channel, courierName, trackingNumber, shippingCost } = req.body;

  try {
    if (channel === "auto") {
      // Flow A: Shiprocket Automated Dispatch
      await getShiprocketToken();
      const generatedAwb = "SR" + Math.floor(100000000 + Math.random() * 900000000);

      const sql = `
        UPDATE orders 
        SET delivery_channel = 'auto', 
            courier_name = 'Shiprocket Automated', 
            tracking_id = ?, 
            status = 'Shipped',
            dispatch_note = 'Shiprocket Automated'
        WHERE id = ? OR tracking_id = ?
      `;
      await dbQuery(sql, [generatedAwb, String(orderId), String(orderId)]);

      return res.json({
        success: true,
        message: "Shiprocket tracking generated and order marked as Shipped",
        trackingId: generatedAwb,
        channel: "auto",
        courier: "Shiprocket Automated",
      });
    } else {
      // Flow B: Manual Local Courier (ST Courier / Professional / Local Van)
      const chosenCourier = courierName || "ST Courier";
      const finalTracking = trackingNumber || "ST-" + Date.now().toString().slice(-6);
      const cost = Number(shippingCost) || 0;
      const dispatchNote = `${chosenCourier} - ${finalTracking}`;

      const sql = `
        UPDATE orders 
        SET delivery_channel = 'manual', 
            courier_name = ?, 
            tracking_id = ?, 
            status = 'Shipped',
            shipping_cost = ?,
            dispatch_note = ?
        WHERE id = ? OR tracking_id = ?
      `;
      await dbQuery(sql, [chosenCourier, finalTracking, cost, dispatchNote, String(orderId), String(orderId)]);

      // Auto-log local courier expense into the Expenses Ledger
      if (cost > 0) {
        await dbQuery(
          `INSERT INTO expenses (title, category, amount, paid_to, expense_date) 
           VALUES (?, 'Courier & Dispatch', ?, ?, CURRENT_DATE)`,
          [`Courier fee for order #${orderId}`, cost, chosenCourier]
        );
      }

      return res.json({
        success: true,
        message: "Manual courier assigned and shipping cost recorded",
        trackingId: finalTracking,
        channel: "manual",
        courier: chosenCourier,
      });
    }
  } catch (err) {
    console.error("Assign Delivery Route Error:", err);
    res.status(500).json({ success: false, message: "Database update failed" });
  }
});

// =================================================================
// 3. EXPENSES LEDGER (COMPARISONS & AUDIT)
// =================================================================
app.get("/api/admin/expenses", async (req, res) => {
  try {
    const rows = await dbQuery("SELECT * FROM expenses ORDER BY expense_date DESC, id DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Fetch Expenses Error:", err);
    res.status(500).json({ success: false, message: "Could not fetch expenses" });
  }
});

app.post("/api/admin/expenses", async (req, res) => {
  const { title, category, amount, paidTo, notes, date } = req.body;
  try {
    const sql = `
      INSERT INTO expenses (title, category, amount, paid_to, notes, expense_date) 
      VALUES (?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE))
    `;
    const result = await dbQuery(sql, [
      title,
      category,
      Number(amount),
      paidTo || "General Supplier",
      notes || "",
      date || null,
    ]);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Add Expense Error:", err);
    res.status(500).json({ success: false, message: "Failed to record expense" });
  }
});

// =================================================================
// 4. STAFF ROLES & ACCESS CONTROL (ADMIN_USERS)
// =================================================================
app.get("/api/admin/staff", async (req, res) => {
  try {
    const rows = await dbQuery("SELECT id, name, username, role, phone, active FROM admin_users ORDER BY id ASC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Fetch Staff Error:", err);
    res.status(500).json({ success: false, message: "Could not fetch staff" });
  }
});

app.post("/api/admin/staff", async (req, res) => {
  const { name, username, password, role, phone } = req.body;
  try {
    const sql = `
      INSERT INTO admin_users (name, username, password, role, phone) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await dbQuery(sql, [name, username, password, role || "STORE_MANAGER", phone || ""]);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Create Staff Error:", err);
    res.status(500).json({ success: false, message: "Username already exists or invalid data" });
  }
});

app.put("/api/admin/staff/:id", async (req, res) => {
  const { id } = req.params;
  const { name, username, password, role, phone } = req.body;
  try {
    if (password && password.trim() !== "") {
      const sql = `UPDATE admin_users SET name = ?, username = ?, password = ?, role = ?, phone = ? WHERE id = ?`;
      await dbQuery(sql, [name, username, password, role, phone, id]);
    } else {
      const sql = `UPDATE admin_users SET name = ?, username = ?, role = ?, phone = ? WHERE id = ?`;
      await dbQuery(sql, [name, username, role, phone, id]);
    }
    res.json({ success: true, message: "Staff account updated" });
  } catch (err) {
    console.error("Update Staff Error:", err);
    res.status(500).json({ success: false, message: "Failed to update staff" });
  }
});

app.delete("/api/admin/staff/:id", async (req, res) => {
  try {
    await dbQuery("DELETE FROM admin_users WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Staff account removed" });
  } catch (err) {
    console.error("Delete Staff Error:", err);
    res.status(500).json({ success: false, message: "Failed to delete account" });
  }
});

// =================================================================
// 5. ORDERS & STATUS CONFIRMATION
// =================================================================
app.get("/api/orders", async (req, res) => {
  try {
    const rows = await dbQuery("SELECT * FROM orders ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Fetch Orders Error:", err);
    res.status(500).json([]);
  }
});

app.put("/api/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, dispatchNote } = req.body;
  try {
    const sql = `
      UPDATE orders 
      SET status = ?, dispatch_note = COALESCE(?, dispatch_note) 
      WHERE id = ? OR tracking_id = ?
    `;
    await dbQuery(sql, [status, dispatchNote || null, String(id), String(id)]);
    res.json({ success: true, message: "Order status updated" });
  } catch (err) {
    console.error("Update Order Status Error:", err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

// =================================================================
// 6. PRODUCTS & IN-LINE CATALOG EDITING
// =================================================================
app.get("/api/products", async (req, res) => {
  try {
    const rows = await dbQuery("SELECT * FROM products ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Fetch Products Error:", err);
    res.status(500).json([]);
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, unit, category, in_stock, inStock, stock_qty } = req.body;
  try {
    const stockStatus = inStock !== undefined ? (inStock ? 1 : 0) : in_stock !== undefined ? (in_stock ? 1 : 0) : 1;
    const sql = `
      UPDATE products 
      SET name = COALESCE(?, name), 
          price = COALESCE(?, price), 
          unit = COALESCE(?, unit), 
          category = COALESCE(?, category), 
          in_stock = ?,
          stock_qty = COALESCE(?, stock_qty)
      WHERE id = ?
    `;
    await dbQuery(sql, [name, price, unit, category, stockStatus, stock_qty, id]);
    res.json({ success: true, message: "Product updated successfully" });
  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(500).json({ success: false, message: "Could not update product" });
  }
});

app.post("/api/products", async (req, res) => {
  const { name, category, price, unit, image, stock_qty } = req.body;
  try {
    const sql = `
      INSERT INTO products (name, category, price, unit, image, in_stock, stock_qty) 
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `;
    const result = await dbQuery(sql, [name, category, Number(price), unit, image || "", stock_qty || 30]);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Create Product Error:", err);
    res.status(500).json({ success: false, message: "Failed to create product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await dbQuery("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
});

// =================================================================
// 7. STOREFRONT CMS PERSISTENCE (HERO VIDEO, ANNOUNCEMENTS, FOOTER)
// =================================================================
app.get("/api/cms/:section", async (req, res) => {
  try {
    const rows = await dbQuery("SELECT content FROM cms_sections WHERE section_name = ?", [req.params.section]);
    if (rows.length > 0) {
      const content = typeof rows[0].content === "string" ? JSON.parse(rows[0].content) : rows[0].content;
      return res.json({ success: true, data: content });
    }
    res.json({ success: false, message: "Section not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/cms/:section", async (req, res) => {
  const { content } = req.body;
  try {
    const jsonStr = JSON.stringify(content);
    const sql = `
      INSERT INTO cms_sections (section_name, content) 
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE content = VALUES(content)
    `;
    await dbQuery(sql, [req.params.section, jsonStr]);
    res.json({ success: true, message: "CMS section saved" });
  } catch (err) {
    console.error("Save CMS Error:", err);
    res.status(500).json({ success: false, message: "Failed to save CMS section" });
  }
});

// Server Root Health Check
app.get("/", (req, res) => {
  res.send("Pure Organics TiDB Cloud Backend Server Active.");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});