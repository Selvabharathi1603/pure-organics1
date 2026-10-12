const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const crypto = require("crypto");
const axios = require("axios");
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
// 1. FAST2SMS DIRECT INLINE DISPATCH HELPER WITH DEV SIMULATION
// -------------------------------------------------------------
async function sendOtpSms(mobileNumber, otpCode) {
  const apiKey = (process.env.FAST2SMS_API_KEY || "").trim();
  const cleanNumber = String(mobileNumber).replace(/\D/g, "").slice(-10);

  if (cleanNumber.length !== 10) {
    return {
      success: false,
      message: "Please enter a valid 10-digit mobile number",
    };
  }

  if (!apiKey) {
    console.warn(`[DEV SIMULATION] No Fast2SMS API key set. Local test OTP for ${cleanNumber}: ${otpCode}`);
    return { success: true, simulated: true, otp: otpCode };
  }

  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "otp",
        variables_values: String(otpCode),
        numbers: cleanNumber,
      },
      {
        headers: {
          authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.return === true) {
      return { success: true, data: response.data };
    }

    console.warn(`[DEV SIMULATION] Fast2SMS dispatch notice for ${cleanNumber}. Terminal Test OTP: ${otpCode}`);
    return { success: true, simulated: true, otp: otpCode };
  } catch (error) {
    console.log("\n========================================");
    console.log(`[TEST OTP SIMULATION FOR +91 ${cleanNumber}]: ${otpCode}`);
    console.log("========================================\n");

    return {
      success: true,
      simulated: true,
      message: "OTP generated",
    };
  }
}

// -------------------------------------------------------------
// 2. DATABASE CONNECTION & IN-MEMORY FALLBACK POOL
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

db.query(
  `CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(150) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    pincode VARCHAR(10) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) console.warn("Customers table init notice:", err.message);
  }
);

db.query(
  `CREATE TABLE IF NOT EXISTS customer_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_phone (phone)
  )`,
  (err) => {
    if (err) console.warn("Customer OTPs table init notice:", err.message);
  }
);

// -------------------------------------------------------------
// 3. RAZORPAY PAYMENT GATEWAY
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

    return res.json({ success: true, message: "Simulated signature verified" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 4. CUSTOMER MOBILE OTP AUTHENTICATION & PROFILE
// -------------------------------------------------------------

// 1. Request OTP
app.post("/api/auth/send-otp", (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone number is required" });
  }

  const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);

  if (cleanPhone.length !== 10) {
    return res.status(400).json({ success: false, message: "Enter a valid 10-digit mobile number" });
  }

  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

  db.query("DELETE FROM customer_otps WHERE phone = ?", [cleanPhone], (delErr) => {
    if (delErr) console.warn("OTP cleanup notice:", delErr.message);

    db.query(
      "INSERT INTO customer_otps (phone, otp_code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))",
      [cleanPhone, otpCode],
      async (insErr) => {
        if (insErr) {
          console.error("OTP insert error:", insErr);
          return res.status(500).json({ success: false, message: "Failed to store OTP" });
        }

        const smsResult = await sendOtpSms(cleanPhone, otpCode);

        if (!smsResult.success) {
          return res.status(500).json({
            success: false,
            message: smsResult.message || "Failed to dispatch SMS",
          });
        }

        return res.json({
          success: true,
          message: "OTP sent successfully to your mobile number",
        });
      }
    );
  });
});

// 2. Verify OTP and Fetch/Create Profile
app.post("/api/auth/verify-otp", (req, res) => {
  const { phone, otp, full_name } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: "Phone and OTP are required" });
  }

  const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);
  const cleanOtp = String(otp).trim();
  const userName = full_name ? String(full_name).trim() : "";

  console.log(`[Verify Attempt] Phone: ${cleanPhone}, Code: ${cleanOtp}, Name: ${userName}`);

  // Fetch the latest OTP generated within the last 15 minutes
  db.query(
    "SELECT * FROM customer_otps WHERE phone = ? ORDER BY id DESC LIMIT 1",
    [cleanPhone],
    (otpErr, otpRows) => {
      if (otpErr) {
        console.error("[DB Error fetching OTP]:", otpErr);
        return res.status(500).json({ success: false, message: "Database query error" });
      }

      if (!otpRows || otpRows.length === 0) {
        console.warn(`[OTP Check] No OTP found on record for ${cleanPhone}`);
        return res.status(400).json({ success: false, message: "No OTP requested for this number" });
      }

      const record = otpRows[0];
      const expiryTime = new Date(record.expires_at).getTime();
      const currentTime = new Date().getTime();

      // Check OTP match
      if (String(record.otp_code).trim() !== cleanOtp) {
        console.warn(`[OTP Check Mismatch] Entered: ${cleanOtp}, Expected: ${record.otp_code}`);
        return res.status(400).json({ success: false, message: "Invalid OTP code" });
      }

      // Check 10-minute expiry window safely in JavaScript
      if (currentTime > expiryTime && expiryTime > 0) {
        console.warn(`[OTP Expired] Generated at: ${record.created_at}`);
        return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
      }

      // Clean up used OTP
      db.query("DELETE FROM customer_otps WHERE phone = ?", [cleanPhone]);

      // Check or create customer in MySQL customers table
      db.query(
        "SELECT id, phone, full_name, address, city, pincode FROM customers WHERE phone = ?",
        [cleanPhone],
        (custErr, custRows) => {
          if (!custErr && custRows && custRows.length > 0) {
            const existing = custRows[0];
            if (userName && (!existing.full_name || existing.full_name.trim() === "")) {
              db.query("UPDATE customers SET full_name = ? WHERE phone = ?", [userName, cleanPhone]);
              existing.full_name = userName;
            }

            console.log(`[Verify Success] Existing Customer Logged In: ${cleanPhone} (${existing.full_name})`);
            return res.json({
              success: true,
              message: "Phone verified successfully",
              customer: existing,
            });
          }

          // Insert new customer
          db.query(
            "INSERT INTO customers (phone, full_name) VALUES (?, ?)",
            [cleanPhone, userName],
            (insErr, insRes) => {
              if (insErr) console.warn("[Customer Insert Notice]:", insErr.message);

              const newCustomer = {
                id: insRes ? insRes.insertId : Date.now(),
                phone: cleanPhone,
                full_name: userName,
                address: "",
                city: "",
                pincode: "",
              };

              console.log(`[Verify Success] New Customer Created: ${cleanPhone} (${userName})`);
              return res.json({
                success: true,
                message: "Phone verified successfully",
                customer: newCustomer,
              });
            }
          );
        }
      );
    }
  );
});

// 3. Update Customer Profile on Checkout
app.post("/api/customers/update-profile", (req, res) => {
  const { phone, full_name, address, city, pincode } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: "Phone is required" });

  const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);

  db.query(
    `UPDATE customers 
     SET full_name = COALESCE(NULLIF(?, ''), full_name), 
         address = COALESCE(NULLIF(?, ''), address),
         city = COALESCE(NULLIF(?, ''), city),
         pincode = COALESCE(NULLIF(?, ''), pincode)
     WHERE phone = ?`,
    [full_name, address, city, pincode, cleanPhone],
    (err) => {
      if (err) {
        console.warn("Profile update warning:", err.message);
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true });
    }
  );
});

// -------------------------------------------------------------
// 5. PRODUCTS & STOREFRONT ROUTES (CATEGORIES & HERO)
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

// Categories list for ShopByCategory
app.get("/api/categories", (req, res) => {
  const categories = [
    {
      id: 1,
      category_key: "oils",
      name: "Wood-Pressed Oils",
      tamil: "மரச்செக்கு எண்ணெய்",
      batch_count: "6 Cold Batches",
      image: "https://media.istockphoto.com/id/1395867248/photo/rosemary-essential-oil-or-infusion-on-an-old-wooden-table.jpg?s=612x612&w=0&k=20&c=-QggcpSyV91hemES4cCqmHfdnkFNW4kmgP89IVEGeg8=",
    },
    {
      id: 2,
      category_key: "grains",
      name: "Heirloom Rice & Millets",
      tamil: "பாரம்பரிய தானியங்கள்",
      batch_count: "9 Heritage Grains",
      image: "https://media.istockphoto.com/id/671580278/photo/varieties-of-grains-seeds-and-raw-quino.jpg?s=612x612&w=0&k=20&c=ATTVKd0ls6JoL4AvGZ-K6bs_q8rlkJDEyzOLu0d2vrA=",
    },
    {
      id: 3,
      category_key: "honey",
      name: "Raw Forest Honey",
      tamil: "இயற்கை மலைத்தேன்",
      batch_count: "Wild Cliff Harvest",
      image: "https://media.istockphoto.com/id/598241944/photo/honey-in-jar-and-bunch-of-dry-lavender.jpg?s=612x612&w=0&k=20&c=gVg1BaJ78uniQbpfdFiYvMzim98gREdx-5c4ENBp2tE=",
    },
    {
      id: 4,
      category_key: "sweeteners",
      name: "Artisanal Palm Jaggery",
      tamil: "உடன்குடி கருப்பட்டி",
      batch_count: "Iron Pan Boiled",
      image: "https://media.istockphoto.com/id/869266164/photo/jaggery-sugar-and-cane.jpg?s=2048x2048&w=is&k=20&c=Xa-DIQ73T41G4JDIBWhI-1-gkrpXct1I7FkehubDMUQ=",
    },
    {
      id: 5,
      category_key: "pickle",
      name: "Native Farm Preserves",
      tamil: "பாரம்பரிய பண்ணை ஊறல்",
      batch_count: "Authentic Taste",
      image: "https://media.istockphoto.com/id/1338316600/photo/image-glass-jar-of-green-mango-chutney-recipe-with-hessian-lid-pickle-with-chopped-raw-mango.jpg?s=2048x2048&w=is&k=20&c=2EGNmLNNt2zC0utGXglHoaTog--981l9Wxatly2DuYw=",
    },
  ];

  res.json({ success: true, data: categories });
});

// Bestsellers list for HeroSection
app.get("/api/hero/bestsellers", (req, res) => {
  const heroProducts = [
    {
      id: 1,
      short_name: "Karupatti",
      badge: "Udangudi Native",
      title: "Artisanal Palm Jaggery",
      tamil: "உடன்குடி பனங்கருப்பட்டி",
      description: "Clarified Palmyra palm sap slow-boiled in iron cauldrons with organic herbal extract. Natural unbleached blocks with raw iron and zero cane sugar.",
      price: 180,
      mrp: 240,
      unit: "500g Native Block",
      rating: 4.9,
      reviews: "2.1k",
      stock: 19,
      image_url: "https://media.istockphoto.com/id/2152257228/photo/traditional-market-stall-items-with-palm-sugar-in-a-woven-basket-surrounded-by-garlic-dried.webp?a=1&b=1&s=612x612&w=0&k=20&c=itwYeL006O_v0LdMec0j2f5_7HET13vTi2_nGgdBOdA=",
    },
    {
      id: 2,
      short_name: "Peanut Oil",
      badge: "Cold Crushed",
      title: "Mara Chekku Peanut Oil",
      tamil: "மரச்செக்கு கடலை எண்ணெய்",
      description: "Wood-pressed exclusively from native sun-dried red-skin peanuts. Settled naturally in sunlight without synthetic degumming or solvent extraction.",
      price: 290,
      mrp: 380,
      unit: "1 Litre Glass Bottle",
      rating: 4.8,
      reviews: "1.4k",
      stock: 9,
      image_url: "https://media.istockphoto.com/id/1072412008/photo/peanuts-in-wooden-bowl-with-peanut-oil.webp?a=1&b=1&s=612x612&w=0&k=20&c=xEfipOm3guxSkT164-uPm_3CVj-rcWtCNhnjsYIB4KE=",
    },
    {
      id: 3,
      short_name: "Black Rice",
      badge: "Ancient Chola Grain",
      title: "Karuppu Kavuni Black Rice",
      tamil: "நாட்டு கருப்பு கவுனி அரிசி",
      description: "Traditional antioxidant-rich heirloom paddy grown without chemical sprays. Completely unpolished bran intact with low glycemic response.",
      price: 190,
      mrp: 260,
      unit: "1 Kg Cloth Bag",
      rating: 4.9,
      reviews: "920",
      stock: 7,
      image_url: "https://images.unsplash.com/photo-1623691307892-d6de6dfb2a8a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxhY2slMjByaWNlfGVufDB8fDB8fHww",
    },
    {
      id: 4,
      short_name: "Gingelly Oil",
      badge: "Vaagai Chekku",
      title: "Wood-Pressed Gingelly Oil",
      tamil: "பாரம்பரிய வாகை மரச்செக்கு நல்லெண்ணெய்",
      description: "Native country sesame crushed raw with palm jaggery in traditional wooden mortars below 38°C. Zero paraffin, zero palm oil blending.",
      price: 360,
      mrp: 440,
      unit: "1 Litre Glass Bottle",
      rating: 4.9,
      reviews: "1.8k",
      stock: 12,
      image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      short_name: "Forest Honey",
      badge: "Western Ghats",
      title: "Raw Wild Forest Honey",
      tamil: "சுத்தமான மலைத்தேன்",
      description: "Collected directly from wild forest hives in Western Ghats. Raw, unfiltered, unheated, and loaded with natural bee pollen.",
      price: 340,
      mrp: 460,
      unit: "500g Jar",
      rating: 5.0,
      reviews: "3.1k",
      stock: 16,
      image_url: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80",
    },
  ];

  res.json({ success: true, data: heroProducts });
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
// 6. ORDERS & LOGISTICS ROUTES
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
// 7. ADMIN AUTH & USER ROLES
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
// 8. STOREFRONT CMS PERSISTENCE
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
// 9. HEALTH CHECK & PORT LISTENER
// -------------------------------------------------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Pure Organics] Server running on port ${PORT}`);
});