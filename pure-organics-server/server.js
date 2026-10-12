const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const crypto = require("crypto");
require("dotenv").config();

let Razorpay;
try {
  Razorpay = require("razorpay");
} catch (e) {
  Razorpay = null;
}

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------------------------------------
// 1. DATABASE CONNECTION & IN-MEMORY FALLBACK POOL
// -------------------------------------------------------------
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "pure_organics",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fallback in-memory state
let memoryProducts = [
  {
    id: 1,
    name: "Wild Raw Forest Honey",
    category: "Groceries",
    price: 340,
    unit: "500g",
    stock_qty: 25,
    max_stock: 50,
    in_stock: 1,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80",
    description: "Unfiltered native forest honey harvested sustainably.",
  },
  {
    id: 2,
    name: "Unpolished Barnyard Millet (Kuthiraivali)",
    category: "Millets & Grains",
    price: 110,
    unit: "1kg",
    stock_qty: 30,
    max_stock: 60,
    in_stock: 1,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80",
    description: "High-fiber heirloom millet with zero chemical polish.",
  },
  {
    id: 3,
    name: "Wood-Pressed Groundnut Oil",
    category: "Cold-Pressed Oils",
    price: 260,
    unit: "1Litre",
    stock_qty: 18,
    max_stock: 50,
    in_stock: 1,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80",
    description: "Crushed slow in Vaagai wood pestles below 38°C.",
  },
  {
    id: 4,
    name: "Organic Country Sugar (Naatu Sakkarai)",
    category: "Groceries",
    price: 90,
    unit: "1kg",
    stock_qty: 40,
    max_stock: 80,
    in_stock: 1,
    image: "https://images.unsplash.com/photo-1610450949065-2f4762cfb37b?auto=format&fit=crop&w=300&q=80",
    description: "Pure sulphur-free unrefined cane brown sugar.",
  },
  {
    id: 5,
    name: "Traditional Foxtail Millet (Thinai)",
    category: "Millets & Grains",
    price: 115,
    unit: "1kg",
    stock_qty: 22,
    max_stock: 50,
    in_stock: 1,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80",
    description: "Naturally grown foxtail millet rich in vitamins and iron.",
  },
  {
    id: 6,
    name: "Pure Virgin Coconut Oil",
    category: "Cold-Pressed Oils",
    price: 310,
    unit: "500 ml",
    stock_qty: 15,
    max_stock: 45,
    in_stock: 1,
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=300&q=80",
    description: "Fresh copra expeller oil with fresh aroma and taste.",
  },
  {
    id: 7,
    name: "Heritage Black Rice (Karuppu Kavuni)",
    category: "Millets & Grains",
    price: 155,
    unit: "1kg",
    stock_qty: 12,
    max_stock: 40,
    in_stock: 1,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80",
    description: "Antioxidant-dense Chettinad Kavuni royal paddy rice.",
  },
  {
    id: 8,
    name: "Wood-Pressed Sesame Oil (Gingelly)",
    category: "Cold-Pressed Oils",
    price: 380,
    unit: "1Litre",
    stock_qty: 20,
    max_stock: 60,
    in_stock: 1,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80",
    description: "Pressed with artisanal palm jaggery in traditional chekku.",
  },
];

let memoryOrders = [
  {
    id: "ORG-176410",
    tracking_id: "ORG-176410",
    customer_name: "Selva",
    customer_phone: "9487091074",
    customer_address: "chennai",
    total_amount: 130,
    subtotal: 130,
    discount_applied: 0,
    payment_method: "Cash on Delivery",
    status: "Placed",
    dispatch_note: "Order received. Packing at mill.",
    items: [],
  },
  {
    id: "ORG-534095",
    tracking_id: "ORG-534095",
    customer_name: "Ajay",
    customer_phone: "7845478215",
    customer_address: "chennai",
    total_amount: 160,
    subtotal: 160,
    discount_applied: 0,
    payment_method: "Cash on Delivery",
    status: "Placed",
    dispatch_note: "Order received. Packing at mill.",
    items: [],
  },
];

let memoryCMS = {
  hero_slides: [
    {
      mode: "photo",
      title: "Real Wood-Pressed Oils",
      titleHighlight: "& Native Grains",
      subtext: "Crushed slowly in Vaagai wood mortars below 38°C with zero chemical solvents.",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-farm-field-4248-large.mp4",
    },
  ],
  announcement: {
    bannerText: "Direct Cold-Pressed Harvests Dispatched Daily",
    badgeText: "Single-Estate Harvest",
    originText: "Thanjavur & Tirunelveli",
    couponCode: "HARVEST10",
    freeShippingThreshold: 499,
  },
  health_goals: {
    heading: "Wholesome Nutrition from Native Crops",
    subheading: "Unpolished rice and slow wood-pressed oils packed for daily kitchen use.",
  },
  gifting_banner: {
    title: "Traditional Harvest Hampers",
    description: "Natural sweeteners, whole grains, and cold-pressed staples.",
  },
  footer: {
    phone: "+91 94878 82321",
    email: "care@pureorganics.in",
    address: "Kallidaikurichi, Ambasamudram, Tirunelveli, Tamil Nadu - 627416",
    fssai: "12423008000412",
  },
  cod_setting: {
    isCodEnabled: true,
  },
};

let memoryAdminUsers = [
  { id: 1, name: "Store Owner", username: "owner", password: "owner123", role: "SUPER_ADMIN" },
  { id: 2, name: "Site Administrator", username: "admin", password: "site123", role: "ADMIN" },
  { id: 3, name: "Farm Manager", username: "manager", password: "farm123", role: "STORE_MANAGER" },
  { id: 4, name: "Dispatch Manager", username: "dispatch", password: "pack123", role: "DISPATCH" },
];

// Auto-create database tables on start
db.query(
  `CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_id VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount_applied DECIMAL(10, 2) DEFAULT 0.00,
    coupon_code VARCHAR(50) DEFAULT NULL,
    payment_method VARCHAR(100) NOT NULL DEFAULT 'Cash on Delivery',
    payment_ref VARCHAR(100) DEFAULT NULL,
    status ENUM('Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Placed',
    dispatch_note TEXT,
    items JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) console.warn("Orders table init notice:", err.message);
  }
);

db.query(
  `CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(100) NOT NULL,
    stock_qty INT NOT NULL DEFAULT 30,
    max_stock INT NOT NULL DEFAULT 60,
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    image TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) console.warn("Products table init notice:", err.message);
  }
);

db.query(
  `CREATE TABLE IF NOT EXISTS cms_content (
    section_name VARCHAR(100) PRIMARY KEY,
    content_data JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) console.warn("CMS content table init notice:", err.message);
  }
);

// -------------------------------------------------------------
// 2. RAZORPAY PAYMENT GATEWAY
// -------------------------------------------------------------
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "mock_secret_key";

let razorpayInstance = null;
if (Razorpay && process.env.RAZORPAY_KEY_ID) {
  razorpayInstance = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
}

// Create Razorpay Order
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const amountInPaise = Math.round(Number(amount) * 100);

    if (!amountInPaise || amountInPaise <= 0) {
      return res.status(400).json({ error: "Invalid payment amount" });
    }

    if (razorpayInstance) {
      const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      };
      const order = await razorpayInstance.orders.create(options);
      return res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: razorpayKeyId,
      });
    }

    // Fallback simulation mode
    return res.json({
      orderId: `order_mock_${Date.now()}`,
      amount: amountInPaise,
      currency: "INR",
      keyId: razorpayKeyId,
    });
  } catch (err) {
    console.error("Payment Order Creation Error:", err);
    res.status(500).json({ error: err.message || "Failed to initialize payment" });
  }
});

// Verify Payment Signature
app.post("/api/payment/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, error: "Missing verification payload" });
    }

    if (razorpayInstance && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", razorpayKeySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature === razorpay_signature) {
        return res.json({ success: true, message: "Payment verified successfully" });
      } else {
        return res.status(400).json({ success: false, error: "Signature mismatch" });
      }
    }

    // Development auto-verify fallback
    return res.json({ success: true, message: "Simulated signature verified" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 3. PRODUCTS ROUTES
// -------------------------------------------------------------
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products ORDER BY id ASC", (err, rows) => {
    if (err || !rows || rows.length === 0) {
      return res.json(memoryProducts);
    }
    const formatted = rows.map((p) => ({
      ...p,
      inStock: p.in_stock === 1 || p.in_stock === true,
    }));
    res.json(formatted);
  });
});

app.post("/api/products", (req, res) => {
  const p = req.body;
  const newProduct = {
    id: p.id || Date.now(),
    name: p.name || "Mill Product",
    category: p.category || "General",
    price: Number(p.price) || 0,
    unit: p.unit || "1 Litre Glass Bottle",
    stock_qty: Number(p.stock_qty) || 30,
    max_stock: Number(p.max_stock) || 60,
    in_stock: p.inStock !== false ? 1 : 0,
    image: p.image || "",
    description: p.description || "",
  };

  memoryProducts.unshift(newProduct);

  db.query(
    `INSERT INTO products (name, category, price, unit, stock_qty, max_stock, in_stock, image, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newProduct.name,
      newProduct.category,
      newProduct.price,
      newProduct.unit,
      newProduct.stock_qty,
      newProduct.max_stock,
      newProduct.in_stock,
      newProduct.image,
      newProduct.description,
    ],
    (err) => {
      if (err) console.warn("DB product insert fallback:", err.message);
      res.status(201).json({ success: true, product: newProduct });
    }
  );
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const p = req.body;

  memoryProducts = memoryProducts.map((item) =>
    item.id == id ? { ...item, ...p } : item
  );

  db.query(
    `UPDATE products 
     SET name = ?, category = ?, price = ?, unit = ?, stock_qty = ?, max_stock = ?, in_stock = ?
     WHERE id = ?`,
    [
      p.name,
      p.category,
      Number(p.price),
      p.unit,
      Number(p.stock_qty),
      Number(p.max_stock),
      p.inStock !== false ? 1 : 0,
      id,
    ],
    (err) => {
      if (err) console.warn("DB product update fallback:", err.message);
      res.json({ success: true });
    }
  );
});

// Batch Reload Quantity (+10 / +25)
app.patch("/api/products/:id/quantity", (req, res) => {
  const { id } = req.params;
  const { added_qty } = req.body;
  const added = Number(added_qty) || 0;

  memoryProducts = memoryProducts.map((item) =>
    item.id == id
      ? {
          ...item,
          stock_qty: (item.stock_qty || 0) + added,
          in_stock: (item.stock_qty || 0) + added > 0 ? 1 : 0,
        }
      : item
  );

  db.query(
    "UPDATE products SET stock_qty = stock_qty + ?, in_stock = IF(stock_qty + ? > 0, 1, 0) WHERE id = ?",
    [added, added, id],
    (err) => {
      if (err) console.warn("DB quantity update fallback:", err.message);
      res.json({ success: true });
    }
  );
});

// Toggle In-Stock Status
app.patch("/api/products/:id/stock", (req, res) => {
  const { id } = req.params;
  const { in_stock } = req.body;
  const val = in_stock ? 1 : 0;

  memoryProducts = memoryProducts.map((item) =>
    item.id == id ? { ...item, in_stock: val, inStock: !!in_stock } : item
  );

  db.query("UPDATE products SET in_stock = ? WHERE id = ?", [val, id], (err) => {
    if (err) console.warn("DB stock status fallback:", err.message);
    res.json({ success: true });
  });
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  memoryProducts = memoryProducts.filter((p) => p.id != id);

  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) console.warn("DB product delete fallback:", err.message);
    res.json({ success: true });
  });
});

// -------------------------------------------------------------
// 4. ORDERS & LOGISTICS ROUTES
// -------------------------------------------------------------
app.get("/api/orders", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY created_at DESC", (err, rows) => {
    if (err || !rows || rows.length === 0) {
      return res.json(memoryOrders);
    }
    const formatted = rows.map((r) => ({
      ...r,
      items: typeof r.items === "string" ? JSON.parse(r.items) : r.items || [],
    }));
    res.json(formatted);
  });
});

app.post("/api/orders", (req, res) => {
  const body = req.body;
  const tracking_id =
    body.tracking_id || `ORG-${Math.floor(100000 + Math.random() * 900000)}`;

  const orderItems = Array.isArray(body.items)
    ? body.items
    : typeof body.items === "string"
    ? JSON.parse(body.items || "[]")
    : [];

  const newOrder = {
    id: tracking_id,
    tracking_id,
    customer_name: body.customer_name || body.name || "Customer",
    customer_phone: body.customer_phone || body.phone || "9487091074",
    customer_address: body.customer_address || body.address || "Tamil Nadu",
    total_amount: Number(body.total_amount || 0),
    subtotal: Number(body.subtotal || body.total_amount || 0),
    discount_applied: Number(body.discount_applied || 0),
    coupon_code: body.coupon_code || null,
    payment_method: body.payment_method || "Cash on Delivery",
    payment_ref: body.payment_ref || null,
    status: body.status || "Placed",
    dispatch_note: body.dispatch_note || "Order received. Packing at mill.",
    items: orderItems,
    created_at: new Date().toISOString(),
  };

  memoryOrders.unshift(newOrder);

  // Decrement in-memory stock immediately
  orderItems.forEach((orderItem) => {
    memoryProducts = memoryProducts.map((p) => {
      if (p.id == orderItem.id) {
        const remaining = Math.max(0, (p.stock_qty || 25) - (orderItem.qty || 1));
        return { ...p, stock_qty: remaining, in_stock: remaining > 0 ? 1 : 0 };
      }
      return p;
    });
  });

  const query = `
    INSERT INTO orders 
    (tracking_id, customer_name, customer_phone, customer_address, total_amount, subtotal, discount_applied, coupon_code, payment_method, payment_ref, status, dispatch_note, items) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      newOrder.tracking_id,
      newOrder.customer_name,
      newOrder.customer_phone,
      newOrder.customer_address,
      newOrder.total_amount,
      newOrder.subtotal,
      newOrder.discount_applied,
      newOrder.coupon_code,
      newOrder.payment_method,
      newOrder.payment_ref,
      newOrder.status,
      newOrder.dispatch_note,
      JSON.stringify(newOrder.items),
    ],
    (err) => {
      if (err) console.warn("DB order insert fallback:", err.message);

      // Decrement database stock for purchased units
      orderItems.forEach((item) => {
        db.query(
          "UPDATE products SET stock_qty = GREATEST(0, stock_qty - ?), in_stock = IF(stock_qty - ? > 0, 1, 0) WHERE id = ?",
          [item.qty || 1, item.qty || 1, item.id]
        );
      });

      res.status(201).json({ success: true, tracking_id });
    }
  );
});

// Update Order Status & Docket
app.patch("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, dispatch_note } = req.body;

  memoryOrders = memoryOrders.map((o) =>
    o.tracking_id === id || o.id == id
      ? { ...o, status, dispatch_note: dispatch_note || o.dispatch_note }
      : o
  );

  db.query(
    "UPDATE orders SET status = ?, dispatch_note = ? WHERE tracking_id = ? OR id = ?",
    [status, dispatch_note, id, id],
    (err) => {
      if (err) console.warn("DB status update fallback:", err.message);
      res.json({ success: true });
    }
  );
});

// -------------------------------------------------------------
// 5. ADMIN AUTH & USER ROLES
// -------------------------------------------------------------
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const cleanUser = (username || "").trim().toLowerCase();
  const cleanPass = (password || "").trim();

  const user = memoryAdminUsers.find(
    (u) => u.username.toLowerCase() === cleanUser && u.password === cleanPass
  );

  if (user) {
    return res.json({
      success: true,
      user: { name: user.name, username: user.username, role: user.role },
    });
  }

  res.status(401).json({ success: false, message: "Invalid username or password" });
});

app.get("/api/admin/users", (req, res) => {
  res.json(memoryAdminUsers);
});

app.post("/api/admin/users", (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
  memoryAdminUsers.push(newUser);
  res.status(201).json({ success: true, user: newUser });
});

app.put("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  memoryAdminUsers = memoryAdminUsers.map((u) =>
    u.id == id ? { ...u, ...req.body } : u
  );
  res.json({ success: true });
});

app.delete("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  memoryAdminUsers = memoryAdminUsers.filter((u) => u.id != id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// 6. STOREFRONT CMS PERSISTENCE (Synced with MySQL)
// -------------------------------------------------------------
app.get("/api/cms/all", (req, res) => {
  db.query("SELECT section_name, content_data FROM cms_content", (err, rows) => {
    if (err || !rows || rows.length === 0) {
      return res.json(memoryCMS);
    }

    const aggregated = { ...memoryCMS };
    rows.forEach((row) => {
      try {
        aggregated[row.section_name] =
          typeof row.content_data === "string"
            ? JSON.parse(row.content_data)
            : row.content_data;
      } catch (e) {
        aggregated[row.section_name] = row.content_data;
      }
    });

    res.json(aggregated);
  });
});

app.get("/api/cms/:section", (req, res) => {
  const { section } = req.params;

  db.query(
    "SELECT content_data FROM cms_content WHERE section_name = ?",
    [section],
    (err, rows) => {
      if (!err && rows && rows.length > 0) {
        const val = rows[0].content_data;
        return res.json(typeof val === "string" ? JSON.parse(val) : val);
      }
      res.json(memoryCMS[section] || {});
    }
  );
});

app.post("/api/cms/:section", (req, res) => {
  const { section } = req.params;
  const payload = req.body;

  memoryCMS[section] = payload;

  const jsonPayload = JSON.stringify(payload);
  db.query(
    `INSERT INTO cms_content (section_name, content_data) 
     VALUES (?, ?) 
     ON DUPLICATE KEY UPDATE content_data = VALUES(content_data)`,
    [section, jsonPayload],
    (err) => {
      if (err) console.warn("CMS DB sync warning:", err.message);
      res.json({ success: true, section, data: payload });
    }
  );
});

// -------------------------------------------------------------
// 7. HEALTH CHECK & PORT LISTENER
// -------------------------------------------------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Pure Organics] Server running on port ${PORT}`);
});