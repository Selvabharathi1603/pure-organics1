import React, { createContext, useContext, useState, useEffect } from "react";
import { initialProducts } from "../data/InitialProduct";

const StoreContext = createContext();

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

// Default configurations for every section
const DEFAULT_ANNOUNCEMENTS = [
  "Up to 30% off on selected harvests + additional 5% off on prepaid orders | Code: PREPAY5",
  "Free doorstep delivery across India on orders above ₹799",
  "Cash on Delivery available on all regional pin codes",
  "Complimentary Farm Sampler Jar with orders above ₹999",
  "Fresh Harvest Batch Live: Stone-ground Flours & Wood-Pressed Gingelly",
];

const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    tag: "100% Native & Chemical-Free",
    title: "Wholesome harvest. Pure nutrition.",
    highlightText: "Pure nutrition.",
    quote:
      "“Zero heat. Zero chemicals. Zero rush. Pure harvest from hands that know the soil.”",
    badge: "Stone-Ground Atta",
    price: "₹349",
    imageUrl:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    tag: "Traditional Vaagai Chekku",
    title: "Cold-pressed oils. Ancient strength.",
    highlightText: "Ancient strength.",
    quote:
      "“Crushed in wooden chekkus below 42°C to lock in native sesamol and unbleached aroma.”",
    badge: "Wood-Pressed Gingelly",
    price: "₹480",
    imageUrl:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80",
  },
];

const DEFAULT_DIET_PREFS = [
  {
    id: 1,
    title: "Gluten-Free & Low GI",
    subtitle: "Unpolished Native Millets",
    tag: "Ancient Grains",
    query: "Millets",
    cardBg: "bg-gradient-to-br from-[#fbf9f4] to-[#f2ede4]",
    borderColor: "border-[#e5dfd2]",
    badgeStyle: "bg-[#c58f38]/15 text-[#825b18] border-[#c58f38]/30",
  },
  {
    id: 2,
    title: "100% Cold Wood-Pressed",
    subtitle: "Vaagai Chekku Native Oils",
    tag: "Zero Refining",
    query: "Oil",
    cardBg: "bg-gradient-to-br from-[#f4f9f5] to-[#e8f3eb]",
    borderColor: "border-[#cfe0d4]",
    badgeStyle: "bg-[#2e7d4d]/15 text-[#1b4d2f] border-[#2e7d4d]/30",
  },
  {
    id: 3,
    title: "Natural Iron & Vitality",
    subtitle: "Palm Jaggery & Raw Comb Honey",
    tag: "Sustained Energy",
    query: "Groceries",
    cardBg: "bg-gradient-to-br from-[#fcf6ee] to-[#f4ebe0]",
    borderColor: "border-[#e7d8c6]",
    badgeStyle: "bg-[#b86d29]/15 text-[#7c4412] border-[#b86d29]/30",
  },
];

const DEFAULT_CATEGORIES = [
  {
    id: "oil",
    name: "Wood-Pressed Oil",
    query: "Oil",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2917/2917633.png",
  },
  {
    id: "ghee",
    name: "Desi Cow Ghee",
    query: "Ghee",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/5346/5346452.png",
  },
  {
    id: "flour",
    name: "Stone-Ground Flour",
    query: "Flour",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014522.png",
  },
  {
    id: "millets",
    name: "Unpolished Millets",
    query: "Millets",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/8982/8982464.png",
  },
];

const DEFAULT_GIFTING_CONFIG = {
  badge: "Pure Heritage Assortment",
  title: "Wholesome Gifting Made Easy",
  description:
    "Curated gift boxes of raw forest honey, cultured A2 ghee, and wood-pressed oils packed in hand-carved pinewood.",
  buttonText: "Explore Gift Sets",
  targetCategory: "Groceries",
};

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    rating: 5,
    name: "SHRADHA RAJENDRRA",
    location: "Chennai",
    product: "Wood-Pressed Sesame Oil",
    review:
      "Hello, I like your products. Wood-pressed sesame oil, Karuppu Kavuni rice, and unpolished millets. I enjoy your original native food... awesome taste... totally healthy food!",
  },
  {
    id: 2,
    rating: 5,
    name: "YUKTI S.",
    location: "Bengaluru",
    product: "Wild Raw Forest Honey",
    review:
      "It is always wonderful ordering from Pure Organics. They have a wonderful collection of raw honey, native millets, and cold-pressed oils. Kudos to the team for keeping the stock always fresh.",
  },
];

const DEFAULT_DISCOUNT_CONFIG = {
  badge: "New Harvest Welcome",
  headline: "Unlock ₹100 off on your first order",
  subtext:
    "Share your birth date to receive seasonal birthday harvest surprises 🌱",
  image:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
};

const DEFAULT_FOOTER_CONFIG = {
  headline: "Receive fresh batches, harvest updates & private sales.",
  subtext:
    "Zero spam. Only authentic seasonal harvest notices directly from local farms.",
  philosophy:
    "Preserving traditional farming lineages with slow-milled ancient millets, native cold-pressed oils, and raw forest flora honey delivered directly to your kitchen.",
  badgeText: "Direct from South Indian farming collectives",
  phone: "+91 94882 10344 (Mon - Sat)",
  email: "orders@pureorganics.store",
  address: "Farm Unit, Madurai Highway Collective, Tamil Nadu, India",
};

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_products");
      return saved
        ? JSON.parse(saved)
        : initialProducts.map((p) => ({ ...p, inStock: true }));
    } catch {
      return initialProducts.map((p) => ({ ...p, inStock: true }));
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_orders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [stockAlerts, setStockAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_stock_alerts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentAdmin, setCurrentAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_admin_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Section 1: Announcements
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_announcements");
      return saved ? JSON.parse(saved) : DEFAULT_ANNOUNCEMENTS;
    } catch {
      return DEFAULT_ANNOUNCEMENTS;
    }
  });

  // Section 2: Hero Slides
  const [heroSlides, setHeroSlides] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_hero_slides");
      return saved ? JSON.parse(saved) : DEFAULT_HERO_SLIDES;
    } catch {
      return DEFAULT_HERO_SLIDES;
    }
  });

  // Section 3: Health Goals / Diet Preferences
  const [dietPreferences, setDietPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_diet_prefs");
      return saved ? JSON.parse(saved) : DEFAULT_DIET_PREFS;
    } catch {
      return DEFAULT_DIET_PREFS;
    }
  });

  // Section 4: Categories
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_categories");
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  // Section 5: Gifting Banner
  const [giftingConfig, setGiftingConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_gifting_config");
      return saved ? JSON.parse(saved) : DEFAULT_GIFTING_CONFIG;
    } catch {
      return DEFAULT_GIFTING_CONFIG;
    }
  });

  // Section 6: Customer Testimonials
  const [testimonials, setTestimonials] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_testimonials");
      return saved ? JSON.parse(saved) : DEFAULT_TESTIMONIALS;
    } catch {
      return DEFAULT_TESTIMONIALS;
    }
  });

  // Section 7: Discount Modal
  const [discountConfig, setDiscountConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_discount_config");
      return saved ? JSON.parse(saved) : DEFAULT_DISCOUNT_CONFIG;
    } catch {
      return DEFAULT_DISCOUNT_CONFIG;
    }
  });

  // Section 8: Footer
  const [footerConfig, setFooterConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_footer_config");
      return saved ? JSON.parse(saved) : DEFAULT_FOOTER_CONFIG;
    } catch {
      return DEFAULT_FOOTER_CONFIG;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("organic_products", JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem("organic_cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("organic_orders", JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem("organic_stock_alerts", JSON.stringify(stockAlerts));
  }, [stockAlerts]);
  useEffect(() => {
    localStorage.setItem(
      "organic_announcements",
      JSON.stringify(announcements),
    );
  }, [announcements]);
  useEffect(() => {
    localStorage.setItem("organic_hero_slides", JSON.stringify(heroSlides));
  }, [heroSlides]);
  useEffect(() => {
    localStorage.setItem("organic_diet_prefs", JSON.stringify(dietPreferences));
  }, [dietPreferences]);
  useEffect(() => {
    localStorage.setItem("organic_categories", JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem(
      "organic_gifting_config",
      JSON.stringify(giftingConfig),
    );
  }, [giftingConfig]);
  useEffect(() => {
    localStorage.setItem("organic_testimonials", JSON.stringify(testimonials));
  }, [testimonials]);
  useEffect(() => {
    localStorage.setItem(
      "organic_discount_config",
      JSON.stringify(discountConfig),
    );
  }, [discountConfig]);
  useEffect(() => {
    localStorage.setItem("organic_footer_config", JSON.stringify(footerConfig));
  }, [footerConfig]);

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

  const loginAdmin = (username, password) => {
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

  const placeOrder = (customerDetails) => {
    const trackingId = "ORG-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      trackingId,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
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

  // Inventory Handlers
  const addProduct = (newProduct) => {
    setProducts((prev) => [
      { ...newProduct, id: "org-" + Date.now(), inStock: true },
      ...prev,
    ]);
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
    );
  };

  const toggleStockStatus = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p)),
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
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

  const updateOrderStatus = (trackingId, newStatus, dispatchNote = "") => {
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
  };

  // All 8 Section Updaters for Admin & Super Admin
  const updateAnnouncements = (newList) => setAnnouncements(newList);
  const updateHeroSlides = (newSlides) => setHeroSlides(newSlides);
  const updateDietPreferences = (newPrefs) => setDietPreferences(newPrefs);
  const updateCategories = (newCats) => setCategories(newCats);
  const updateGiftingConfig = (newConfig) => setGiftingConfig(newConfig);
  const updateTestimonials = (newList) => setTestimonials(newList);
  const updateDiscountConfig = (newConfig) => setDiscountConfig(newConfig);
  const updateFooterConfig = (newConfig) => setFooterConfig(newConfig);

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        stockAlerts,
        currentAdmin,
        announcements,
        heroSlides,
        dietPreferences,
        categories,
        giftingConfig,
        testimonials,
        discountConfig,
        footerConfig,
        loginAdmin,
        logoutAdmin,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        addProduct,
        updateProduct,
        toggleStockStatus,
        deleteProduct,
        sendStockAlert,
        dismissAlert,
        updateOrderStatus,
        updateAnnouncements,
        updateHeroSlides,
        updateDietPreferences,
        updateCategories,
        updateGiftingConfig,
        updateTestimonials,
        updateDiscountConfig,
        updateFooterConfig,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
