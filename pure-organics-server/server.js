require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// =================================================================
// LOCAL MYSQL CONNECTION POOL (Reads DB_* from .env)
// =================================================================
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "pure_organics",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function dbQuery(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// Verify Database Connection on Startup
pool
  .getConnection()
  .then((conn) => {
    console.log(`Connected to local MySQL database [${process.env.DB_NAME || "pure_organics"}] successfully.`);
    conn.release();
  })
  .catch((err) => {
    console.error("Local MySQL Connection Error:", err.message);
  });

// =================================================================
// 1. PRODUCTS ENDPOINTS
// =================================================================
app.get("/api/products", async (req, res) => {
  try {
    const rows = await dbQuery("SELECT * FROM products ORDER BY id ASC");
    console.log(`[Products API] Returned ${rows.length} products.`);
    res.json(rows);
  } catch (err) {
    console.error("Database query error on /api/products:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/products", async (req, res) => {
  const { name, category, price, unit, image, stock_qty } = req.body;
  try {
    const sql = `
      INSERT INTO products (name, category, price, unit, image, in_stock, stock_qty) 
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `;
    const result = await dbQuery(sql, [
      name,
      category,
      Number(price),
      unit,
      image || "",
      stock_qty || 30,
    ]);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Create Product Error:", err);
    res.status(500).json({ success: false, message: "Failed to create product" });
  }
});

app.patch("/api/products/:id/stock", async (req, res) => {
  const { id } = req.params;
  const { in_stock } = req.body;
  try {
    await dbQuery("UPDATE products SET in_stock = ? WHERE id = ?", [
      in_stock ? 1 : 0,
      id,
    ]);
    res.json({ success: true, message: "Stock status updated" });
  } catch (err) {
    console.error("Stock update error:", err);
    res.status(500).json({ success: false });
  }
});

// =================================================================
// 2. CATEGORIES & BESTSELLERS (Fixes 404s)
// =================================================================
app.get("/api/categories", async (req, res) => {
  try {
    const rows = await dbQuery(
      "SELECT DISTINCT category FROM products WHERE category IS NOT NULL"
    );
    const categories = rows.map((r) => r.category);
    res.json(categories.length > 0 ? categories : ["Oil", "Ghee", "Rice", "Millets", "Breakfast"]);
  } catch (err) {
    res.json(["Oil", "Ghee", "Rice", "Millets", "Breakfast"]);
  }
});

app.get("/api/hero/bestsellers", async (req, res) => {
  try {
    const rows = await dbQuery("SELECT * FROM products LIMIT 4");
    res.json(rows);
  } catch (err) {
    res.json([]);
  }
});

// =================================================================
// 3. ORDERS ENDPOINTS
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

app.post("/api/orders", async (req, res) => {
  const { tracking_id, customer_name, customer_phone, customer_address, total_amount, dispatch_note } = req.body;
  try {
    const sql = `
      INSERT INTO orders (tracking_id, customer_name, customer_phone, customer_address, total_amount, dispatch_note, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Order Placed')
    `;
    await dbQuery(sql, [tracking_id, customer_name, customer_phone, customer_address, total_amount, dispatch_note]);
    res.json({ success: true });
  } catch (err) {
    console.error("Place Order Error:", err);
    res.status(500).json({ success: false });
  }
});

// Diagnostics
app.get("/api/debug/tables", async (req, res) => {
  try {
    const tables = await dbQuery("SHOW TABLES");
    const columns = await dbQuery("DESCRIBE products");
    res.json({ tables, columns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Pure Organics Local Server Active.");
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});