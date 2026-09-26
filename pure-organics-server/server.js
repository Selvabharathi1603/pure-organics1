require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Supports image URLs and JSON payloads

// Detect if running against a cloud database provider like TiDB/Aiven
const isCloudDatabase = Boolean(
  process.env.DB_HOST &&
  (process.env.DB_HOST.includes("tidbcloud.com") ||
   process.env.DB_HOST.includes("aivencloud.com") ||
   process.env.DB_PORT === "4000")
);

// MySQL connection pool configured for both local and cloud TLS instances
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || (isCloudDatabase ? 4000 : 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "pure_organics",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true, // Enables batch queries for admin analytics
  ...(isCloudDatabase && {
    ssl: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    },
  }),
});

// Verify connection & ensure required tables exist
db.getConnection((err, conn) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
  } else {
    console.log(`✅ Successfully connected to MySQL Database: ${process.env.DB_NAME || "pure_organics"}`);

    // Auto-create newsletter table if not exists
    conn.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Auto-create discount leads table if not exists
    conn.query(`
      CREATE TABLE IF NOT EXISTS discount_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(20) NOT NULL UNIQUE,
        dob DATE NULL,
        coupon_code VARCHAR(50) DEFAULT 'HARVEST10',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Auto-create search & filter analytics table if not exists
    conn.query(`
      CREATE TABLE IF NOT EXISTS search_analytics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        query_term VARCHAR(100) NOT NULL,
        filter_category VARCHAR(50) DEFAULT 'All',
        searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Auto-create homepage CMS table if not exists
    conn.query(`
      CREATE TABLE IF NOT EXISTS homepage_cms (
        section_key VARCHAR(100) PRIMARY KEY,
        content JSON NOT NULL
      )
    `);

    // Auto-seed discount_modal content with working high-res organic farm image
    const defaultDiscountModal = JSON.stringify({
      badge: "New Harvest Welcome",
      headline: "Unlock ₹100 off on your first order",
      subtext: "Share your birth date to receive seasonal birthday harvest surprises 🌱",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=80"
    });

    conn.query(`
      INSERT INTO homepage_cms (section_key, content)
      VALUES ('discount_modal', ?)
      ON DUPLICATE KEY UPDATE content = VALUES(content)
    `, [defaultDiscountModal]);

    conn.release();
  }
});

// ==========================================
// 1. PRODUCTS ROUTES
// ==========================================

app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/api/products", (req, res) => {
  const { name, category, price, unit, image, description } = req.body;
  const sql = `
    INSERT INTO products (name, category, price, unit, image, description, in_stock)
    VALUES (?, ?, ?, ?, ?, ?, true)
  `;
  db.query(sql, [name, category, price, unit, image, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, message: "Product created" });
  });
});

// Update Existing Product Details
app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, category, price, unit, image, description } = req.body;
  const sql = `
    UPDATE products 
    SET name = ?, category = ?, price = ?, unit = ?, image = ?, description = ?
    WHERE id = ?
  `;
  db.query(sql, [name, category, price, unit, image, description, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: "Product updated successfully" });
  });
});

app.patch("/api/products/:id/stock", (req, res) => {
  const { id } = req.params;
  const { in_stock } = req.body;
  db.query("UPDATE products SET in_stock = ? WHERE id = ?", [in_stock, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Stock status updated" });
  });
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: "Product deleted" });
  });
});

// ==========================================
// 2. ORDERS ROUTES
// ==========================================

app.get("/api/orders", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/api/orders", (req, res) => {
  const { tracking_id, customer_name, customer_phone, customer_address, total_amount, dispatch_note } = req.body;
  const sql = `
    INSERT INTO orders (tracking_id, customer_name, customer_phone, customer_address, total_amount, status, dispatch_note)
    VALUES (?, ?, ?, ?, ?, 'Placed', ?)
  `;
  db.query(
    sql,
    [tracking_id, customer_name, customer_phone, customer_address, total_amount, dispatch_note],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, message: "Order stored" });
    }
  );
});

app.patch("/api/orders/:trackingId/status", (req, res) => {
  const { trackingId } = req.params;
  const { status, dispatch_note } = req.body;
  db.query(
    "UPDATE orders SET status = ?, dispatch_note = ? WHERE tracking_id = ?",
    [status, dispatch_note, trackingId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Order logistics updated" });
    }
  );
});

// ==========================================
// 3. HOMEPAGE CMS ROUTES (Database Controlled)
// ==========================================

app.get("/api/cms/homepage", (req, res) => {
  db.query("SELECT section_key, content FROM homepage_cms", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const cmsData = {};
    results.forEach((row) => {
      cmsData[row.section_key] = typeof row.content === "string" ? JSON.parse(row.content) : row.content;
    });

    res.json(cmsData);
  });
});

app.put("/api/cms/homepage/:sectionKey", (req, res) => {
  const { sectionKey } = req.params;
  const content = JSON.stringify(req.body);

  const sql = `
    INSERT INTO homepage_cms (section_key, content)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE content = VALUES(content)
  `;

  db.query(sql, [sectionKey, content], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `Homepage section '${sectionKey}' updated in MySQL` });
  });
});

// ==========================================
// 4. NEWSLETTER & BIRTHDAY LEADS ROUTES
// ==========================================

// Save email subscriber
app.post("/api/newsletter", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email address is required" });
  }

  const sql = "INSERT INTO newsletter_subscribers (email) VALUES (?) ON DUPLICATE KEY UPDATE email=email";
  db.query(sql, [email.trim().toLowerCase()], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ success: true, message: "Subscribed to seasonal harvest notices!" });
  });
});

// Get all newsletter emails for admin
app.get("/api/newsletter", (req, res) => {
  db.query("SELECT * FROM newsletter_subscribers ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Save birthday lead from Welcome Modal
app.post("/api/leads", (req, res) => {
  const { phone, dob, coupon_code } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: "Valid 10-digit phone number is required" });
  }

  const sql = `
    INSERT INTO discount_leads (phone, dob, coupon_code)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE dob = VALUES(dob), coupon_code = VALUES(coupon_code)
  `;
  db.query(sql, [phone.trim(), dob || null, coupon_code || "HARVEST10"], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ success: true, message: "Customer lead saved" });
  });
});

// Get customer leads with automated 'is_birthday_today' check
app.get("/api/leads", (req, res) => {
  const sql = `
    SELECT 
      id, 
      phone, 
      DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
      coupon_code,
      created_at,
      CASE 
        WHEN DATE_FORMAT(dob, '%m-%d') = DATE_FORMAT(CURDATE(), '%m-%d') THEN 1 
        ELSE 0 
      END AS is_birthday_today
    FROM discount_leads
    ORDER BY is_birthday_today DESC, id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ==========================================
// 5. SEARCH ANALYTICS & INSIGHTS
// ==========================================

// Log live user search queries & selected category filters from /shop
app.post("/api/analytics/search", (req, res) => {
  const { query_term, filter_category } = req.body;
  const term = (query_term || "").trim().toLowerCase();
  const category = (filter_category || "All").trim();

  if (!term && category === "All") {
    return res.status(200).json({ message: "Default view ignored" });
  }

  const sql = "INSERT INTO search_analytics (query_term, filter_category) VALUES (?, ?)";
  db.query(sql, [term, category], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ success: true });
  });
});

// Fetch top searched keywords & most clicked category filters for Super Admin
app.get("/api/admin/search-insights", (req, res) => {
  const queries = `
    SELECT query_term, COUNT(*) AS count 
    FROM search_analytics 
    WHERE query_term != '' 
    GROUP BY query_term 
    ORDER BY count DESC 
    LIMIT 6;

    SELECT filter_category, COUNT(*) AS count 
    FROM search_analytics 
    WHERE filter_category != 'All' 
    GROUP BY filter_category 
    ORDER BY count DESC 
    LIMIT 6;
  `;

  db.query(queries, (err, results) => {
    if (err) {
      console.error("Search Analytics Query Error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({
      topKeywords: results[0] || [],
      topCategories: results[1] || [],
    });
  });
});

// Super Admin summary analytics
app.get("/api/admin/analytics", (req, res) => {
  const queries = `
    SELECT COUNT(*) AS totalOrders, IFNULL(SUM(total_amount), 0) AS totalRevenue FROM orders;
    SELECT 
      COUNT(*) AS totalProducts,
      SUM(CASE WHEN in_stock = 1 THEN 1 ELSE 0 END) AS inStockCount,
      SUM(CASE WHEN in_stock = 0 THEN 1 ELSE 0 END) AS outOfStockCount
    FROM products;
  `;

  db.query(queries, (err, results) => {
    if (err) {
      console.error("Analytics Query Error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({
      orders: results[0][0],
      products: results[1][0],
    });
  });
});

// ==========================================
// 6. AUTHENTICATION
// ==========================================

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT id, name, username, role, badge FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    res.json({ success: true, user: results[0] });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Pure Organics API server running on port ${PORT}`);
});