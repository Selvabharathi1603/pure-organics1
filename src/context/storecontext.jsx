import React, { createContext, useContext, useState, useEffect } from "react";
import { initialProducts } from "../data/InitialProduct";

const StoreContext = createContext();

// Production Render backend URL fallback
const PRODUCTION_API_URL = "https://pure-organics1.onrender.com";

// Dynamic API Base: prioritizes VITE_API_URL, then production Render fallback, then localhost
const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? PRODUCTION_API_URL
    : "http://localhost:5000");

const cleanApiUrl = rawApiUrl.endsWith("/")
  ? rawApiUrl.slice(0, -1)
  : rawApiUrl;
const API_BASE = cleanApiUrl.endsWith("/api")
  ? cleanApiUrl
  : `${cleanApiUrl}/api`;

export const ADMIN_USERS = [
  {
    id: "u-1",
    name: "Farm Founder & Owner",
    username: "owner",
    password: "owner123",
    role: "SUPER_ADMIN",
    badge: "Tier 1: Super Admin (Owner)",
  },
  {
    id: "u-2",
    name: "Site Operations Admin",
    username: "admin",
    password: "site123",
    role: "ADMIN",
    badge: "Tier 2: Storefront Admin",
  },
  {
    id: "u-3",
    name: "Inventory Manager",
    username: "manager",
    password: "farm123",
    role: "STORE_MANAGER",
    badge: "Tier 3: Store Manager",
  },
  {
    id: "u-4",
    name: "Logistics Desk",
    username: "dispatch",
    password: "pack123",
    role: "DISPATCH",
    badge: "Tier 4: Dispatch Logistics",
  },
];

const DEFAULT_ANNOUNCEMENTS = {
  bannerText: "FLAT 50% OFF ON OUR PURE ORGANIC BESTSELLERS",
  badgeText: "Harvest Special",
  couponCode: "HARVEST50",
  countdownHours: "08",
  countdownMinutes: "42",
  countdownSeconds: "19",
  tickerMessages: [
    "Free Express Shipping on Orders Above ₹499",
    "100% Native Wood-Pressed • Zero Chemicals",
    "Use Coupon: HARVEST50 for Instant 50% Off",
    "Direct Single-Origin Farm Harvests",
  ],
};

const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    tag: "BESTSELLER #1 • COLD-PRESSED",
    title: "Pure Virgin",
    titleHighlight: "Coconut Oil",
    quote:
      "Extracted gently from fresh coastal copra below 42°C in native wooden chekkus. Rich in natural lauric lipids.",
    unit: "500 ml Glass Jar",
    price: "₹310",
    originalPrice: "₹620",
    rating: "4.9",
    reviews: "1,420+",
    imageUrl:
      "https://media.istockphoto.com/id/1484936410/photo/bottle-of-coconut-cooking-oil-and-fruit-on-white-background.jpg?s=612x612&w=0&k=20&c=ATsKubzVwWMQXwVkb93qrXatLac7HFJTIx8f1ng216w=",
    perks: [
      "Zero Sulphur Treated",
      "Rich in Lauric Immunity Acids",
      "Raw Cold Extracted",
    ],
  },
  {
    id: 2,
    tag: "BESTSELLER #2 • HERITAGE DETOX GRAIN",
    title: "Heritage Black Rice",
    titleHighlight: "(Karuppu Kavuni)",
    quote:
      "Ancient royal heirloom rice loaded with natural anthocyanin antioxidants and low glycemic sustained stamina.",
    unit: "1 kg Eco Pack",
    price: "₹195",
    originalPrice: "₹390",
    rating: "4.9",
    reviews: "980+",
    imageUrl:
      "https://media.istockphoto.com/id/1434453597/photo/close-up-of-black-rice-in-the-field.jpg?s=612x612&w=0&k=20&c=D6LdUQKJGL4AxLEcmpQvUBPn-qXuRajxZj1corlFP6k=",
    perks: [
      "Antioxidant Superfood",
      "100% Whole Bran Intact",
      "Zero Synthetic Inputs",
    ],
  },
  {
    id: 3,
    tag: "BESTSELLER #3 • UNREFINED NECTAR",
    title: "Traditional Palm",
    titleHighlight: "Jaggery (Karupatti)",
    quote:
      "Clarified naturally with organic herbal extracts without chemical bleaching agents. Rich in bio-active iron.",
    unit: "500g Native Block",
    price: "₹180",
    originalPrice: "₹360",
    rating: "4.9",
    reviews: "2,150+",
    imageUrl:
      "https://media.istockphoto.com/id/2191030648/photo/gula-jawa-or-javanese-sugar-or-red-sugar-or-palm-sugar-in-half-ball-shape-inside-white-bowl.jpg?s=612x612&w=0&k=20&c=stdu8cUEfGy90ay70Ki8oLjtiKEzkESZtnk9ih-rXD8=",
    perks: [
      "Zero White Cane Sugar",
      "Rich Natural Iron Source",
      "Low GI Natural Sweetener",
    ],
  },
  {
    id: 4,
    tag: "BESTSELLER #4 • RAW FOREST HARVEST",
    title: "Wild Raw",
    titleHighlight: "Forest Honey",
    quote:
      "Single-origin raw honey sustainably collected from indigenous deep forest flora. Unheated and unpasteurized.",
    unit: "500g Heavy Glass Jar",
    price: "₹340",
    originalPrice: "₹680",
    rating: "5.0",
    reviews: "3,400+",
    imageUrl:
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=1000&auto=format&fit=crop&q=60",
    perks: [
      "Pollen Rich & Unheated",
      "Zero High-Fructose Syrup",
      "Ethical Forest Foraged",
    ],
  },
  {
    id: 5,
    tag: "BESTSELLER #5 • DROUGHT-RESILIENT GRAIN",
    title: "Traditional Foxtail",
    titleHighlight: "Millet (Thinai)",
    quote:
      "Native golden grains harvested from pesticide-free rain-fed farmland. High in complex carbohydrates and fiber.",
    unit: "1 kg Pack",
    price: "₹125",
    originalPrice: "₹250",
    rating: "4.8",
    reviews: "820+",
    imageUrl:
      "https://images.unsplash.com/photo-1783042909392-0b8d8683e0a2?w=1000&auto=format&fit=crop&q=60",
    perks: [
      "Prebiotic Gut Fiber",
      "Zero Machine Polish",
      "Diabetic-Friendly Staple",
    ],
  },
];

const DEFAULT_HEALTH_GOALS = {
  heading: "Shop by Health & Wellness Goals",
  subheading:
    "Targeted native nutrition prepared without synthetic processing.",
  cards: [
    {
      title: "Diabetic Wellness",
      desc: "Low-GI Ancient Millets & Karuppu Kavuni",
      icon: "HeartPulse",
    },
    {
      title: "Pure Cold-Pressed Oils",
      desc: "Wood-Pressed Sesame, Groundnut & Coconut",
      icon: "Droplet",
    },
    {
      title: "Traditional Immunity",
      desc: "Lakadong High-Curcumin Turmeric & Honey",
      icon: "ShieldCheck",
    },
    {
      title: "Natural Sweeteners",
      desc: "Palm Jaggery & Naatu Sakkarai",
      icon: "Sparkles",
    },
  ],
};

const DEFAULT_GIFTING_CONFIG = {
  badge: "FARM GIFT BOXES",
  title: "Curated Pure Harvest Hampers",
  description:
    "Send unadulterated cold-pressed oils, native honey, and traditional sweets packed in eco-friendly boxes.",
  buttonText: "Explore Gift Boxes",
  buttonLink: "/shop",
  imageUrl:
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80",
};

const DEFAULT_TESTIMONIALS = {
  heading: "Loved by Conscious Families Across India",
  reviews: [
    {
      id: 1,
      name: "Meera Ramanathan",
      city: "Chennai",
      rating: 5,
      comment:
        "The Wood-Pressed Sesame Oil reminds me of village chekku aroma. You can clearly feel the difference in daily cooking.",
    },
    {
      id: 2,
      name: "Karthik Subramanian",
      city: "Bengaluru",
      rating: 5,
      comment:
        "Switching to Karuppu Kavuni rice and foxtail millet helped stabilize our family sugar levels naturally.",
    },
    {
      id: 3,
      name: "Ananya Venkatesh",
      city: "Coimbatore",
      rating: 5,
      comment:
        "The raw forest honey and palm jaggery are staple items in our kitchen now. Transparent sourcing and fast delivery.",
    },
  ],
};

const DEFAULT_DISCOUNT_CONFIG = {
  enabled: true,
  badge: "New Harvest Welcome",
  headline: "Unlock ₹100 off on your first order",
  subtext:
    "Share your birth date to receive seasonal birthday harvest surprises 🌱",
  image:
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=80",
  couponCode: "HARVEST10",
  buttonText: "Claim Harvest Discount",
};

const DEFAULT_FOOTER_CONFIG = {
  farmTagline:
    "Pure native harvests produced with zero heat, zero refining, and zero compromises.",
  contactPhone: "+91 94878 82321",
  contactEmail: "care@pureorganics.in",
  farmAddress:
    "Kallidaikurichi, Ambasamudram, Tirunelveli District, Tamil Nadu - 627416",
  fssaiNumber: "12423008000412",
};

export const StoreProvider = ({ children }) => {
  // Core Storefront State
  const [products, setProducts] = useState(
    initialProducts.map((p) => ({ ...p, inStock: true })),
  );
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [leads, setLeads] = useState([]);
  const [analytics, setAnalytics] = useState({
    orders: { totalOrders: 0, totalRevenue: 0 },
    products: { totalProducts: 0, inStockCount: 0, outOfStockCount: 0 },
  });
  const [stockAlerts, setStockAlerts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Admin Session State
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_admin_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // CMS Section States
  const [announcements, setAnnouncements] = useState(DEFAULT_ANNOUNCEMENTS);
  const [heroSlides, setHeroSlides] = useState(DEFAULT_HERO_SLIDES);
  const [healthGoals, setHealthGoals] = useState(DEFAULT_HEALTH_GOALS);
  const [giftingConfig, setGiftingConfig] = useState(DEFAULT_GIFTING_CONFIG);
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [discountConfig, setDiscountConfig] = useState(DEFAULT_DISCOUNT_CONFIG);
  const [footerConfig, setFooterConfig] = useState(DEFAULT_FOOTER_CONFIG);

  // 1. Fetch Products from MySQL
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((p) => ({
            ...p,
            id: p.id,
            price: Number(p.price),
            inStock: Boolean(p.in_stock),
          }));
          setProducts(formatted);
        }
      }
    } catch (err) {
      console.warn("Backend not reached for products:", err);
    }
  };

  // 2. Fetch Orders from MySQL
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted = data.map((o) => ({
            trackingId: o.tracking_id,
            customer: {
              name: o.customer_name,
              phone: o.customer_phone,
              address: o.customer_address,
            },
            total: Number(o.total_amount),
            status: o.status,
            dispatchNote: o.dispatch_note,
            date: new Date(o.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          }));
          setOrders(formatted);
        }
      }
    } catch (err) {
      console.warn("Backend not reached for orders:", err);
    }
  };

  // 3. Fetch Leads (Discount Modal submissions) from MySQL
  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API_BASE}/leads`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLeads(data);
        }
      }
    } catch (err) {
      console.warn("Backend not reached for leads:", err);
    }
  };

  // 4. Fetch Analytics from MySQL
  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/analytics`);
      if (res.ok) {
        const data = await res.json();
        if (data.orders && data.products) {
          setAnalytics(data);
        }
      }
    } catch (err) {
      console.warn("Backend not reached for analytics:", err);
    }
  };

  // 5. Fetch Full Homepage CMS from MySQL
  const fetchHomepageCMS = async () => {
    try {
      const res = await fetch(`${API_BASE}/cms/homepage`);
      if (res.ok) {
        const data = await res.json();
        if (data.announcement) setAnnouncements(data.announcement);
        if (data.hero_slides) setHeroSlides(data.hero_slides);
        if (data.health_goals) setHealthGoals(data.health_goals);
        if (data.gifting_banner) setGiftingConfig(data.gifting_banner);
        if (data.testimonials) setTestimonials(data.testimonials);
        if (data.discount_modal) setDiscountConfig(data.discount_modal);
        if (data.footer) setFooterConfig(data.footer);
      }
    } catch (err) {
      console.warn("Backend not reached for CMS configurations:", err);
    }
  };

  // Initial Load of all backend data
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchLeads();
    fetchAnalytics();
    fetchHomepageCMS();
  }, []);

  // Save admin login session locally
  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem(
        "organic_admin_session",
        JSON.stringify(currentAdmin),
      );
    } else {
      localStorage.removeItem("organic_admin_session");
    }
  }, [currentAdmin]);

  // Master CMS Update Function: Updates state and persists to MySQL
  const saveCMSSection = async (sectionKey, newContent) => {
    switch (sectionKey) {
      case "announcement":
        setAnnouncements(newContent);
        break;
      case "hero_slides":
        setHeroSlides(newContent);
        break;
      case "health_goals":
        setHealthGoals(newContent);
        break;
      case "gifting_banner":
        setGiftingConfig(newContent);
        break;
      case "testimonials":
        setTestimonials(newContent);
        break;
      case "discount_modal":
        setDiscountConfig(newContent);
        break;
      case "footer":
        setFooterConfig(newContent);
        break;
      default:
        break;
    }

    try {
      const res = await fetch(`${API_BASE}/cms/homepage/${sectionKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent),
      });
      return res.ok;
    } catch (err) {
      console.error(`Failed to save section '${sectionKey}' to MySQL:`, err);
      return false;
    }
  };

  // Add Lead Function: Called by DiscountModal
  const addLead = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone,
          dob: formData.dob || null,
          coupon_code: discountConfig.couponCode || "HARVEST10",
        }),
      });
      if (res.ok) {
        await fetchLeads();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to add lead:", err);
      return false;
    }
  };

  // Auth Handlers
  const loginAdmin = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentAdmin(data.user);
        return { success: true };
      }
    } catch {
      // Offline fallback
    }

    const foundUser = ADMIN_USERS.find(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password === password,
    );

    if (foundUser) {
      setCurrentAdmin({
        id: foundUser.id,
        name: foundUser.name,
        username: foundUser.username,
        role: foundUser.role,
        badge: foundUser.badge,
      });
      return { success: true };
    }
    return { success: false, message: "Invalid username or password" };
  };

  const logoutAdmin = () => setCurrentAdmin(null);

  // Cart Handlers
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product) => {
    if (product.inStock === false) {
      alert("This item is currently out of stock!");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.qty + delta;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  const clearCart = () => setCart([]);

  // Place Order: Saves to MySQL and refreshes analytics
  const placeOrder = async (customerDetails) => {
    const trackingId = "ORG-" + Math.floor(100000 + Math.random() * 900000);
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );

    const orderPayload = {
      tracking_id: trackingId,
      customer_name: customerDetails.name,
      customer_phone: customerDetails.phone,
      customer_address: customerDetails.address,
      total_amount: totalAmount,
      dispatch_note:
        "Order verified at farm collective. Awaiting packaging queue.",
    };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        await fetchOrders();
        await fetchAnalytics();
      }
    } catch (err) {
      console.warn("Backend order write failed:", err);
    }

    const newOrder = {
      trackingId,
      items: [...cart],
      total: totalAmount,
      customer: customerDetails,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: "Placed",
      dispatchNote:
        "Order verified at farm collective. Awaiting packaging queue.",
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return trackingId;
  };

  // Inventory & Product Handlers
  const addProduct = async (newProduct) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        await fetchProducts();
        await fetchAnalytics();
      }
    } catch (err) {
      console.warn("Backend add product failed:", err);
    }
  };

  const toggleStockStatus = async (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const newStock = !product.inStock;

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: newStock } : p)),
    );

    try {
      await fetch(`${API_BASE}/products/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ in_stock: newStock }),
      });
      await fetchAnalytics();
    } catch (err) {
      console.warn("Backend stock toggle failed:", err);
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
      await fetchAnalytics();
    } catch (err) {
      console.warn("Backend delete product failed:", err);
    }
  };

  const sendStockAlert = (productName, message) => {
    const newAlert = {
      id: "alert-" + Date.now(),
      productName,
      message,
      sender: currentAdmin?.name || "Store Manager",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setStockAlerts((prev) => [newAlert, ...prev]);
  };

  const dismissAlert = (alertId) => {
    setStockAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const updateOrderStatus = async (
    trackingId,
    newStatus,
    dispatchNote = "",
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.trackingId === trackingId
          ? {
              ...order,
              status: newStatus,
              dispatchNote: dispatchNote || order.dispatchNote,
            }
          : order,
      ),
    );

    try {
      await fetch(`${API_BASE}/orders/${trackingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          dispatch_note: dispatchNote,
        }),
      });
    } catch (err) {
      console.warn("Backend order update failed:", err);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        leads,
        analytics,
        stockAlerts,
        currentAdmin,
        isCartOpen,
        announcements,
        heroSlides,
        healthGoals,
        giftingConfig,
        testimonials,
        discountConfig,
        footerConfig,
        saveCMSSection,
        fetchProducts,
        fetchOrders,
        fetchLeads,
        fetchAnalytics,
        fetchHomepageCMS,
        addLead,
        loginAdmin,
        logoutAdmin,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        addProduct,
        toggleStockStatus,
        deleteProduct,
        sendStockAlert,
        dismissAlert,
        updateOrderStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
