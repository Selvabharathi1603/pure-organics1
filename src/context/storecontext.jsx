import React, { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

const API_BASE_URL = "https://pure-organics1.onrender.com";

export const StoreProvider = ({ children }) => {
  // Authentication State
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem("pure_admin_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cart Drawer State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Catalog & Inventory States
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("pure_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [orders, setOrders] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);

  // Storefront CMS Configurations
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const cached = localStorage.getItem("cms_announcement");
      return cached
        ? JSON.parse(cached)
        : {
            bannerText: "FLAT 50% OFF ON OUR PURE ORGANIC BESTSELLERS",
            badgeText: "Harvest Special",
            couponCode: "HARVEST50",
            tickerMessages: [
              "🌿 Vaagai Wood-Pressed Sesame & Coconut Oils Freshly Milled",
              "🌾 Heritage Karuppu Kavuni & Mapillai Samba Rice in Stock",
              "🚚 Free Farm-Direct Delivery Across Tamil Nadu & Bengaluru",
            ],
          };
    } catch {
      return null;
    }
  });

  const [heroSlides, setHeroSlides] = useState(() => {
    try {
      const cached = localStorage.getItem("cms_hero_slides");
      return cached
        ? JSON.parse(cached)
        : [
            {
              id: 1,
              tag: "BESTSELLER #1 • COLD-PRESSED",
              title: "Vaagai Wood-Pressed",
              titleHighlight: "Sesame Oil",
              quote:
                "Milled in traditional vaagai wood mortars to retain rich polyphenols & aroma.",
              badge: "Pure Chekku Extraction",
              price: "₹380",
              originalPrice: "₹450",
              unit: "1 Litre Glass Bottle",
              imageUrl:
                "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80",
            },
          ];
    } catch {
      return [];
    }
  });

  const [healthGoals, setHealthGoals] = useState(() => {
    try {
      const cached = localStorage.getItem("cms_health_goals");
      return cached
        ? JSON.parse(cached)
        : {
            heading: "Targeted Wellness from Native Soil",
            subheading:
              "Curated unpolished grains and cold-pressed oils aligned to your dietary vitality.",
          };
    } catch {
      return null;
    }
  });

  const [giftingConfig, setGiftingConfig] = useState(() => {
    try {
      const cached = localStorage.getItem("cms_gifting_banner");
      return cached
        ? JSON.parse(cached)
        : {
            badge: "Heritage Farm Box",
            title: "Curated Native Harvest Gift Hampers",
            description:
              "Gift natural wellness with stone-ground spices, raw honey, and wood-pressed staples.",
          };
    } catch {
      return null;
    }
  });

  const [testimonials, setTestimonials] = useState({
    reviews: [
      {
        id: 1,
        name: "Senthil Kumar",
        city: "Chennai",
        rating: 5,
        comment:
          "The Vaagai cold-pressed sesame oil aroma is authentic—reminiscent of village chekku oils.",
      },
    ],
  });

  const [discountConfig, setDiscountConfig] = useState(() => {
    try {
      const cached = localStorage.getItem("cms_discount_modal");
      return cached
        ? JSON.parse(cached)
        : {
            title: "Unlock ₹100 Welcome Harvest Voucher",
            subtitle:
              "Pure chemical-free farm staples delivered fresh to your doorstep.",
            couponCode: "HARVEST10",
          };
    } catch {
      return null;
    }
  });

  const [footerConfig, setFooterConfig] = useState(() => {
    try {
      const cached = localStorage.getItem("cms_footer");
      return cached
        ? JSON.parse(cached)
        : {
            farmTagline:
              "Nurturing regional native biodiversity and fair prices for local farm collectives.",
            contactPhone: "+91 98765 43210",
            contactEmail: "care@pureorganics.in",
          };
    } catch {
      return null;
    }
  });

  // LocalStorage Cart Sync
  useEffect(() => {
    localStorage.setItem("pure_cart", JSON.stringify(cart));
  }, [cart]);

  // Initial Fetching
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.warn("Product catalog fetch warning:", err.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.warn("Orders fetch warning:", err.message);
    }
  };

  const fetchCMS = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cms/homepage`);
      if (res.ok) {
        const data = await res.json();
        if (data.announcement) {
          setAnnouncements(data.announcement);
          localStorage.setItem(
            "cms_announcement",
            JSON.stringify(data.announcement),
          );
        }
        if (data.hero_slides) {
          setHeroSlides(data.hero_slides);
          localStorage.setItem(
            "cms_hero_slides",
            JSON.stringify(data.hero_slides),
          );
        }
        if (data.health_goals) {
          setHealthGoals(data.health_goals);
          localStorage.setItem(
            "cms_health_goals",
            JSON.stringify(data.health_goals),
          );
        }
        if (data.gifting_banner) {
          setGiftingConfig(data.gifting_banner);
          localStorage.setItem(
            "cms_gifting_banner",
            JSON.stringify(data.gifting_banner),
          );
        }
        if (data.testimonials) setTestimonials(data.testimonials);
        if (data.discount_modal) {
          setDiscountConfig(data.discount_modal);
          localStorage.setItem(
            "cms_discount_modal",
            JSON.stringify(data.discount_modal),
          );
        }
        if (data.footer) {
          setFooterConfig(data.footer);
          localStorage.setItem("cms_footer", JSON.stringify(data.footer));
        }
      }
    } catch (err) {
      console.warn("CMS fetch warning:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCMS();
  }, []);

  // Authentication
  const loginAdmin = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Invalid credentials provided.",
        };
      }

      setCurrentAdmin(data.user);
      localStorage.setItem("pure_admin_user", JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      console.error("Admin Authentication Error:", err);
      throw err;
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem("pure_admin_user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("pure_organics_admin");
    setCurrentAdmin(null);
  };

  // Cart Handlers
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: (item.qty || 1) + 1 } : item,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, change) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = (item.qty || 1) + change;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("pure_cart");
  };

  const placeOrder = (orderDetails) => {
    const trackingId = "PO-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      tracking_id: trackingId,
      customer_name: orderDetails.name,
      customer_phone: orderDetails.phone,
      customer_address: orderDetails.address,
      total_amount: orderDetails.total_amount,
      dispatch_note: "Order verified at farm collective. Awaiting packaging.",
    };

    fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    })
      .then((res) => res.json())
      .then(() => {
        fetchOrders();
        clearCart();
      })
      .catch((err) => console.error("Order dispatch save error:", err));

    return trackingId;
  };

  const updateOrderStatus = async (trackingId, status, note) => {
    setOrders((prev) =>
      prev.map((o) =>
        (o.trackingId || o.tracking_id) === trackingId
          ? { ...o, status, dispatchNote: note, dispatch_note: note }
          : o,
      ),
    );

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/orders/${trackingId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, dispatch_note: note }),
        },
      );
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error("Order status update error:", err);
    }
  };

  const saveCMSSection = async (sectionKey, content) => {
    if (sectionKey === "announcement") setAnnouncements(content);
    if (sectionKey === "hero_slides") setHeroSlides(content);
    if (sectionKey === "health_goals") setHealthGoals(content);
    if (sectionKey === "gifting_banner") setGiftingConfig(content);
    if (sectionKey === "discount_modal") setDiscountConfig(content);
    if (sectionKey === "footer") setFooterConfig(content);

    try {
      localStorage.setItem(`cms_${sectionKey}`, JSON.stringify(content));
    } catch (e) {
      console.warn("Storage quota warning:", e);
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/cms/homepage/${sectionKey}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(content),
        },
      );

      if (res.ok) {
        fetchCMS();
        return true;
      }
      return true;
    } catch (err) {
      console.error("CMS section update error:", err);
      return true;
    }
  };

  const addProduct = async (productData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error("Add product error:", err);
    }
  };

  const toggleStockStatus = async (id) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, inStock: !p.inStock, in_stock: !p.in_stock } : p,
      ),
    );

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ in_stock: !target.in_stock }),
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error("Toggle stock error:", err);
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  const sendStockAlert = (productName, message) => {
    setStockAlerts((prev) => [
      ...prev,
      {
        id: Date.now(),
        productName,
        message,
        sender: currentAdmin?.name || "Inventory Desk",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const dismissAlert = (id) => {
    setStockAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <StoreContext.Provider
      value={{
        currentAdmin,
        loginAdmin,
        logoutAdmin,
        products,
        cart,
        orders,
        stockAlerts,
        announcements,
        heroSlides,
        healthGoals,
        giftingConfig,
        testimonials,
        discountConfig,
        footerConfig,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        updateOrderStatus,
        saveCMSSection,
        addProduct,
        toggleStockStatus,
        deleteProduct,
        sendStockAlert,
        dismissAlert,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
