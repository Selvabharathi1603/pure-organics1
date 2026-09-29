require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Root Health-Check Route
app.get("/", (req, res) => {
  res.send("🌿 Pure Organics API server is live and running!");
});

// Detect cloud database provider (TiDB / Aiven)
const isCloudDatabase = Boolean(
  process.env.DB_HOST &&
  (process.env.DB_HOST.includes("tidbcloud.com") ||
   process.env.DB_HOST.includes("aivencloud.com") ||
   process.env.DB_PORT === "4000")
);

// MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || (isCloudDatabase ? 4000 : 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "pure_organics",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
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

    // 1. Products table
    conn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        unit VARCHAR(100) NOT NULL,
        image TEXT NOT NULL,
        description TEXT,
        in_stock BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Orders table
    conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tracking_id VARCHAR(50) NOT NULL UNIQUE,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        customer_address TEXT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Placed',
        dispatch_note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Users table
    conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        badge VARCHAR(100) NOT NULL
      )
    `);

    // 4. Newsletter table
    conn.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Discount leads table
    conn.query(`
      CREATE TABLE IF NOT EXISTS discount_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(20) NOT NULL UNIQUE,
        dob DATE NULL,
        coupon_code VARCHAR(50) DEFAULT 'HARVEST10',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Search & filter analytics table
    conn.query(`
      CREATE TABLE IF NOT EXISTS search_analytics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        query_term VARCHAR(100) NOT NULL,
        filter_category VARCHAR(50) DEFAULT 'All',
        searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. Homepage CMS table
    conn.query(`
      CREATE TABLE IF NOT EXISTS homepage_cms (
        section_key VARCHAR(100) PRIMARY KEY,
        content JSON NOT NULL
      )
    `);

    // 8. Serviceable pincodes table
    conn.query(`
      CREATE TABLE IF NOT EXISTS serviceable_pincodes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pincode VARCHAR(6) UNIQUE NOT NULL,
        district VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        delivery_days INT NOT NULL DEFAULT 3,
        cod_available BOOLEAN DEFAULT TRUE,
        shipping_charge DECIMAL(6, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Auto-seed discount_modal content
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

    // Seed default admin users
    conn.query("SELECT COUNT(*) AS count FROM users", (err, res) => {
      if (!err && res[0].count === 0) {
        const defaultUsers = [
          ['Farm Founder & Owner', 'owner', 'owner123', 'SUPER_ADMIN', 'Tier 1: Super Admin (Owner)'],
          ['Site Operations Admin', 'admin', 'site123', 'ADMIN', 'Tier 2: Storefront Admin'],
          ['Inventory Manager', 'manager', 'farm123', 'STORE_MANAGER', 'Tier 3: Store Manager'],
          ['Logistics Desk', 'dispatch', 'pack123', 'DISPATCH', 'Tier 4: Dispatch Logistics']
        ];
        conn.query("INSERT INTO users (name, username, password, role, badge) VALUES ?", [defaultUsers]);
      }
    });

    // Seed initial serviceable pincodes
    const seedPincodes = `
      INSERT INTO serviceable_pincodes (pincode, district, state, delivery_days, cod_available, shipping_charge)
      VALUES
        ('627001', 'Tirunelveli Town', 'Tamil Nadu', 1, TRUE, 0.00),
        ('627416', 'Ambasamudram', 'Tamil Nadu', 1, TRUE, 0.00),
        ('628001', 'Thoothukudi Central', 'Tamil Nadu', 1, TRUE, 0.00),
        ('628002', 'Thoothukudi Port', 'Tamil Nadu', 1, TRUE, 0.00),
        ('625001', 'Madurai', 'Tamil Nadu', 2, TRUE, 0.00),
        ('641001', 'Coimbatore', 'Tamil Nadu', 2, TRUE, 0.00),
        ('600001', 'Chennai Central', 'Tamil Nadu', 2, TRUE, 0.00),
        ('600028', 'Chennai (Mylapore/RA Puram)', 'Tamil Nadu', 2, TRUE, 0.00),
        ('560001', 'Bengaluru', 'Karnataka', 3, TRUE, 40.00),
        ('500001', 'Hyderabad', 'Telangana', 4, FALSE, 50.00)
      ON DUPLICATE KEY UPDATE district = VALUES(district);
    `;
    conn.query(seedPincodes, (err) => {
      if (err) console.warn("Pincode seed warning:", err.message);
    });

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
// 2. PINCODE SERVICEABILITY ROUTE
// ==========================================

app.get("/api/pincodes/check/:pincode", (req, res) => {
  const { pincode } = req.params;

  if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
    return res.status(400).json({ error: "Invalid 6-digit pincode format" });
  }

  const query = `
    SELECT pincode, district, state, delivery_days, cod_available, shipping_charge 
    FROM serviceable_pincodes 
    WHERE pincode = ?
  `;

  db.query(query, [pincode], (err, results) => {
    if (err) {
      console.error("Database pincode lookup error:", err);
      return res.status(500).json({ error: "Database error during pincode check" });
    }

    if (results.length > 0) {
      const data = results[0];
      return res.json({
        serviceable: true,
        pincode: data.pincode,
        district: data.district,
        state: data.state,
        deliveryDays: data.delivery_days,
        codAvailable: Boolean(data.cod_available),
        shippingCharge: Number(data.shipping_charge),
      });
    } else {
      return res.json({
        serviceable: false,
        message: "Currently we do not deliver to this pincode. Expanding soon!",
      });
    }
  });
});

// ==========================================
// 3. ORDERS ROUTES
// ==========================================

app.get("/api/orders", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/api/orders", (req, res) => {
  const {
    tracking_id,
    customer_name,
    customer_phone,
    customer_address,
    total_amount,
    dispatch_note,
  } = req.body;

  const sql = `
    INSERT INTO orders (
      tracking_id, 
      customer_name, 
      customer_phone, 
      customer_address, 
      total_amount, 
      status, 
      dispatch_note
    )
    VALUES (?, ?, ?, ?, ?, 'Placed', ?)
  `;

  db.query(
    sql,
    [
      tracking_id,
      customer_name,
      customer_phone,
      customer_address,
      total_amount,
      dispatch_note || "Order verified at farm collective. Awaiting packaging.",
    ],
    (err, result) => {
      if (err) {
        console.error("Order save error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, tracking_id, message: "Order stored successfully" });
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
// 4. HOMEPAGE CMS ROUTES
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
// 5. NEWSLETTER & BIRTHDAY LEADS ROUTES
// ==========================================

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

app.get("/api/newsletter", (req, res) => {
  db.query("SELECT * FROM newsletter_subscribers ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

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
// 6. SEARCH ANALYTICS & INSIGHTS
// ==========================================

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
// 7. ADMIN AUTHENTICATION
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

// ==========================================
// 8. ONLINE PAYMENT ROUTES (Razorpay)
// ==========================================

app.post("/api/payment/create-order", async (req, res) => {
  try {
    const rawKeyId = process.env.RAZORPAY_KEY_ID || "";
    const rawKeySecret = process.env.RAZORPAY_KEY_SECRET || "";

    const keyId = rawKeyId.trim();
    const keySecret = rawKeySecret.trim();

    if (!keyId || !keySecret || keyId === "rzp_test_placeholder") {
      console.error("❌ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured in server environment!");
      return res.status(500).json({
        error: "Razorpay API keys missing in server environment variables. Please check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on Render.",
      });
    }

    if (!keyId.startsWith("rzp_test_") && !keyId.startsWith("rzp_live_")) {
      console.error("❌ Invalid Key ID format detected:", keyId);
      return res.status(500).json({
        error: "Invalid Razorpay Key ID format. Key ID must start with 'rzp_test_' or 'rzp_live_'.",
      });
    }

    const { amount } = req.body;
    const numericAmount = Number(amount);

    if (!amount || isNaN(numericAmount) || numericAmount < 1) {
      return res.status(400).json({ error: "Invalid payment amount. Minimum order amount is ₹1." });
    }

    const razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const amountInPaise = Math.round(numericAmount * 100);
    const receiptId = `po_rcpt_${Date.now()}`;

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: receiptId,
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    const detailedMessage =
      error?.error?.description ||
      error?.message ||
      "Unable to initiate payment with Razorpay";
    res.status(500).json({ error: detailedMessage });
  }
});

app.post("/api/payment/verify", (req, res) => {
  try {
    const rawKeySecret = process.env.RAZORPAY_KEY_SECRET || "";
    const keySecret = rawKeySecret.trim();

    if (!keySecret) {
      return res.status(500).json({ error: "Server missing RAZORPAY_KEY_SECRET" });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: "Missing required Razorpay parameters" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, error: "Signature verification failed" });
    }
  } catch (err) {
    console.error("Signature verification error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

// ==========================================
// 9. REAL-TIME AI ASSISTANT (Stable Auto-Fallback Gemini Endpoint)
// ==========================================

app.post("/api/ai/assistant", async (req, res) => {
  try {
    const { message, catalog } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const trimmedMsg = message.trim();

    // 1. Order Tracking Lookup (e.g., PO-123456 or 6 digits)
    const trackingMatch = trimmedMsg.match(/PO-?\d{5,7}/i) || trimmedMsg.match(/\b\d{6}\b/);
    if (trackingMatch) {
      let searchId = trackingMatch[0].toUpperCase();
      if (!searchId.startsWith("PO-")) searchId = `PO-${searchId}`;

      return db.query(
        "SELECT tracking_id, customer_name, total_amount, status, dispatch_note FROM orders WHERE UPPER(tracking_id) = ?",
        [searchId],
        (err, results) => {
          if (err || !results || results.length === 0) {
            return res.json({
              success: true,
              reply: `I searched our records, but could not locate tracking ID **${searchId}**. Please check your tracking number from your SMS/WhatsApp confirmation or reach out to our farm desk!`,
              recommendedProductIds: [],
            });
          }

          const order = results[0];
          const reply = `📦 **Order Status: ${order.tracking_id}**\n\n` +
            `• **Customer:** ${order.customer_name}\n` +
            `• **Live Status:** **${order.status}**\n` +
            `• **Total:** ₹${Math.round(Number(order.total_amount))}\n` +
            `• **Dispatch Note:** ${order.dispatch_note || "Harvest consignment verified and in transit."}\n\n` +
            `Track live: https://pure-organics1.vercel.app/#/track?id=${order.tracking_id}`;

          return res.json({
            success: true,
            reply,
            recommendedProductIds: [],
          });
        }
      );
    }

    // 2. Order inquiries missing a Tracking ID
    const lower = trimmedMsg.toLowerCase();
    if (
      lower.includes("where is my order") ||
      lower.includes("order delay") ||
      lower.includes("why is my order delaying") ||
      lower.includes("delivery status") ||
      lower.includes("order status") ||
      lower.includes("track my order") ||
      lower.includes("order details") ||
      lower.includes("delievery status")
    ) {
      return res.json({
        success: true,
        reply: "To check the dispatch progress or reason for any transit delay, please share your **Tracking ID** (e.g., **PO-123456**). I will fetch the live update directly from our warehouse!",
        recommendedProductIds: [],
      });
    }

    // 3. Prepare Catalog Summary
    const catalogSummary = (catalog || [])
      .map((p) => `• ID: ${p.id} | ${p.name} (₹${p.price}) | Category: ${p.category} | Stock: ${p.inStock ? "Yes" : "No"}`)
      .join("\n");

    const systemPrompt = `You are 'Nila', the AI Herbal Sommelier & Nutrition Concierge for 'Pure Organics', a direct-from-farm collective in Tamil Nadu.
Specialties: Traditional cold-pressed chekku oils (vaagai wood sesame, coconut, groundnut) and unpolished heirloom grains (Karuppu Kavuni black rice, Mapillai Samba, Thooyamalli, millets).

Live Store Catalog:
${catalogSummary || "Traditional wood-pressed oils, native heirloom grains, and natural sweeteners."}

Guidelines:
1. Always answer the customer's specific question directly, warmly, and concisely (2 to 4 sentences).
2. If asked about diets, weight loss, or black rice: explain why unpolished Karuppu Kavuni or millets are ideal (low glycemic index, rich in anthocyanin antioxidants and fiber that help insulin control and keep you full).
3. If asked about cooking oils: explain that cold-pressed wood chekku oils retain vital nutrients, antioxidants, and natural aroma without heating or chemical refining.
4. If asked about skin or hair: recommend cold-pressed coconut or sesame oil.
5. Understand English, Tamil, and Tanglish queries naturally.`;

    const geminiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, "");

    // 4. Stable Multi-Model Waterfall: Tries stable production 1.5 flash, then variants
    const modelsToTry = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro"
    ];

    let aiReply = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": geminiKey,
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: trimmedMsg }],
              },
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 350,
            },
          }),
        });

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          aiReply = data.candidates[0].content.parts[0].text;
          console.log(`✅ Gemini generated response successfully using model: ${modelName}`);
          break;
        } else {
          lastError = data.error?.message || `HTTP ${response.status}`;
          console.warn(`⚠️ Model ${modelName} returned: ${lastError}, attempting next model in pool...`);
        }
      } catch (err) {
        lastError = err.message;
        console.warn(`⚠️ Model ${modelName} fetch failed: ${err.message}, attempting next model in pool...`);
      }
    }

    if (!aiReply) {
      return res.json({
        success: true,
        reply: `API Notice: ${lastError}`,
        recommendedProductIds: [],
      });
    }

    // Match recommended products from catalog
    const matchedIds = (catalog || [])
      .filter((p) => p.name && aiReply.toLowerCase().includes(p.name.toLowerCase()))
      .map((p) => p.id);

    return res.json({
      success: true,
      reply: aiReply,
      recommendedProductIds: matchedIds,
    });
  } catch (error) {
    console.error("ASSISTANT ERROR:", error);
    return res.json({
      success: true,
      reply: "Our farm AI sommelier is briefly reconnecting. Please ask again in a moment!",
      recommendedProductIds: [],
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Pure Organics API server running on port ${PORT}`);
});