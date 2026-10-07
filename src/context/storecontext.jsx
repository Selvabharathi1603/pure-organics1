import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const StoreContext = createContext();

const API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
      (typeof process !== "undefined" && process?.env?.REACT_APP_API_URL) ||
      "https://pure-organics1.onrender.com";

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Wild Raw Forest Honey",
    category: "Groceries",
    price: 340,
    unit: "500g",
    stock_qty: 25,
    max_stock: 50,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80",
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
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80",
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
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80",
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
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1610450949065-2f4762cfb37b?auto=format&fit=crop&w=300&q=80",
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
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80",
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
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=300&q=80",
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
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80",
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
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80",
    description: "Pressed with artisanal palm jaggery in traditional chekku.",
  },
];

const INITIAL_ORDERS = [
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
  {
    id: "ORG-438437",
    tracking_id: "ORG-438437",
    customer_name: "Selva",
    customer_phone: "9487091074",
    customer_address: "chennai",
    total_amount: 210,
    subtotal: 210,
    discount_applied: 0,
    payment_method: "Cash on Delivery",
    status: "Placed",
    dispatch_note: "Order received. Packing at mill.",
    items: [],
  },
  {
    id: "ORG-560768",
    tracking_id: "ORG-560768",
    customer_name: "Abirami",
    customer_phone: "7845748215",
    customer_address: "thanjavur",
    total_amount: 240,
    subtotal: 240,
    discount_applied: 0,
    payment_method: "Cash on Delivery",
    status: "Placed",
    dispatch_note: "Order received. Packing at mill.",
    items: [],
  },
  {
    id: "ORG-336649",
    tracking_id: "ORG-336649",
    customer_name: "Bharathi",
    customer_phone: "7845748215",
    customer_address: "coimbatore",
    total_amount: 110,
    subtotal: 110,
    discount_applied: 0,
    payment_method: "Cash on Delivery",
    status: "Placed",
    dispatch_note: "Order received. Packing at mill.",
    items: [],
  },
  {
    id: "ORG-567245",
    tracking_id: "ORG-567245",
    customer_name: "Harinisri",
    customer_phone: "9489885252",
    customer_address: "guduvacherry",
    total_amount: 1700,
    subtotal: 1700,
    discount_applied: 0,
    payment_method: "Cash on Delivery",
    status: "Placed",
    dispatch_note: "Order received. Packing at mill.",
    items: [],
  },
];

export const StoreProvider = ({ children }) => {
  // 1. ADMIN AUTHENTICATION
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem("pure_admin_user");
      return saved
        ? JSON.parse(saved)
        : { name: "Store Owner", username: "owner", role: "SUPER_ADMIN" };
    } catch {
      return { name: "Store Owner", username: "owner", role: "SUPER_ADMIN" };
    }
  });

  const loginAdmin = async (username, password) => {
    const cleanUser = (username || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    const ACCOUNTS = {
      owner: {
        pass: "owner123",
        user: { name: "Store Owner", username: "owner", role: "SUPER_ADMIN" },
      },
      admin: {
        pass: "site123",
        user: { name: "Site Administrator", username: "admin", role: "ADMIN" },
      },
      manager: {
        pass: "farm123",
        user: {
          name: "Farm Manager",
          username: "manager",
          role: "STORE_MANAGER",
        },
      },
      dispatch: {
        pass: "pack123",
        user: {
          name: "Dispatch Manager",
          username: "dispatch",
          role: "DISPATCH",
        },
      },
    };

    const account = ACCOUNTS[cleanUser];

    if (account && account.pass === cleanPass) {
      setCurrentAdmin(account.user);
      localStorage.setItem("pure_admin_user", JSON.stringify(account.user));
      return { success: true };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUser, password: cleanPass }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success || data.user) {
          const userObj = data.user || {
            name: cleanUser,
            username: cleanUser,
            role: "SUPER_ADMIN",
          };
          setCurrentAdmin(userObj);
          localStorage.setItem("pure_admin_user", JSON.stringify(userObj));
          return { success: true };
        }
      }
    } catch (err) {}

    return { success: false, message: "Invalid username or password." };
  };

  const logoutAdmin = () => {
    setCurrentAdmin(null);
    localStorage.removeItem("pure_admin_user");
  };

  // 2. CART DRAWER & PERSISTENCE
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("pure_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("pure_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (!product) return;
    const prodId = product.id || product._id;
    setCart((prev) => {
      const existing = prev.find((item) => (item.id || item._id) === prodId);
      if (existing) {
        return prev.map((item) =>
          (item.id || item._id) === prodId
            ? { ...item, qty: (item.qty || 1) + 1 }
            : item,
        );
      }
      return [...prev, { ...product, id: prodId, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, change) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if ((item.id || item._id) === id) {
            const nextQty = (item.qty || 1) + change;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => (item.id || item._id) !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("pure_cart");
  };

  // 3. PRODUCTS CATALOG
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("pure_products");
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });
  const [loadingProducts, setLoadingProducts] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map((p) => ({
            ...p,
            id: p.id || p._id,
            name: p.name || p.title || "Mill Product",
            category: p.category || "Cold-Pressed Oils",
            image: p.image || p.image_url || p.img || "",
            unit: p.unit || p.quantity || "1 Litre Glass Bottle",
            price: Number(p.price) || 0,
            stock_qty: p.stock_qty !== undefined ? Number(p.stock_qty) : 25,
            max_stock: p.max_stock ? Number(p.max_stock) : 60,
            inStock:
              p.in_stock === 1 ||
              p.in_stock === true ||
              p.inStock === true ||
              p.inStock === undefined,
            description: p.description || p.desc || "Pure native harvest.",
          }));
          setProducts(normalized);
          localStorage.setItem("pure_products", JSON.stringify(normalized));
        }
      }
    } catch (err) {
      console.warn(
        "[Pure Organics] Fetching products error, keeping local fallback:",
        err.message,
      );
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData) => {
    const newProd = {
      ...productData,
      id: productData.id || Date.now(),
      inStock: productData.inStock !== false,
    };
    setProducts((prev) => [newProd, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProd),
      });
      fetchProducts();
      return true;
    } catch (err) {
      console.error("Failed to add product to backend:", err);
      return true;
    }
  };

  const updateProduct = async (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)),
    );

    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      fetchProducts();
      return true;
    } catch (err) {
      console.error("Failed to update product:", err);
      return true;
    }
  };

  const updateProductQuantity = async (id, delta) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              stock_qty: Math.max(0, (p.stock_qty || 0) + delta),
              inStock: (p.stock_qty || 0) + delta > 0,
            }
          : p,
      ),
    );

    try {
      await fetch(`${API_BASE_URL}/api/products/${id}/quantity`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ added_qty: delta }),
      });
    } catch (e) {}
  };

  const toggleStockStatus = async (id) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const nextStatus = !prod.inStock;

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: nextStatus } : p)),
    );

    try {
      await fetch(`${API_BASE_URL}/api/products/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ in_stock: nextStatus }),
      });
    } catch (err) {
      console.error("Stock status update error:", err);
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  // 4. ORDERS & TRACKING
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("pure_orders");
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map((o) => ({
            ...o,
            id: o.id || o.tracking_id,
            tracking_id: o.tracking_id || o.id,
            customer_name: o.customer_name || o.customer?.name || "Customer",
            customer_phone:
              o.customer_phone || o.customer?.phone || "9487091074",
            customer_address:
              o.customer_address || o.customer?.address || "Tamil Nadu",
            total_amount: Number(o.total_amount || o.total || 0),
            subtotal: Number(o.subtotal || o.total_amount || 0),
            discount_applied: Number(o.discount_applied || 0),
            payment_method: o.payment_method || "Cash on Delivery",
            status: o.status || "Placed",
            dispatch_note:
              o.dispatch_note || "Order received. Packing at mill.",
            items:
              typeof o.items === "string" ? JSON.parse(o.items) : o.items || [],
          }));
          setOrders(normalized);
          localStorage.setItem("pure_orders", JSON.stringify(normalized));
        }
      }
    } catch (err) {
      console.warn(
        "[Pure Organics] Orders fetch warning, maintaining local state:",
        err.message,
      );
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const placeOrder = (orderData) => {
    const trackingId = `ORG-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      id: trackingId,
      tracking_id: trackingId,
      customer_name: orderData.name,
      customer_phone: orderData.phone,
      customer_address: orderData.address,
      items: orderData.items || [...cart],
      subtotal: Number(orderData.subtotal || orderData.total_amount),
      total_amount: Number(orderData.total_amount),
      discount_applied: Number(orderData.discount_applied || 0),
      coupon_code: orderData.coupon_code || null,
      payment_method: orderData.payment_method || "Cash on Delivery",
      payment_ref: orderData.payment_ref || null,
      status: "Placed",
      dispatch_note: "Order received. Packing at mill.",
      created_at: new Date().toISOString(),
    };

    // Update orders immediately
    setOrders((prev) => [newOrder, ...prev]);

    // Live decrement inventory stock on client
    setProducts((prev) =>
      prev.map((prod) => {
        const itemInOrder = (orderData.items || cart).find(
          (c) => c.id === prod.id,
        );
        if (itemInOrder) {
          const nextQty = Math.max(
            0,
            (prod.stock_qty || 25) - (itemInOrder.qty || 1),
          );
          return { ...prod, stock_qty: nextQty, inStock: nextQty > 0 };
        }
        return prod;
      }),
    );

    clearCart();

    // Persist to backend
    fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    })
      .then(() => fetchOrders())
      .catch((err) => console.warn("Backend order sync failed:", err));

    return trackingId;
  };

  const updateOrderStatus = async (trackingId, status, dispatchNote = "") => {
    setOrders((prev) =>
      prev.map((o) =>
        (o.tracking_id || o.id) === trackingId
          ? { ...o, status, dispatch_note: dispatchNote }
          : o,
      ),
    );

    try {
      await fetch(`${API_BASE_URL}/api/orders/${trackingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, dispatch_note: dispatchNote }),
      });
      fetchOrders();
    } catch (err) {
      console.warn("Order status update backend warning:", err);
    }
  };

  // 5. CMS CONFIGURATIONS & PERSISTENCE
  const [heroSlides, setHeroSlides] = useState([
    {
      mode: "photo",
      title: "Real Wood-Pressed Oils",
      titleHighlight: "& Native Grains",
      subtext:
        "Crushed slowly in Vaagai wood mortars below 38°C with zero chemical solvents.",
      image:
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
      videoUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-farm-field-4248-large.mp4",
    },
  ]);

  const [announcements, setAnnouncements] = useState({
    bannerText: "Direct Cold-Pressed Harvests Dispatched Daily",
    badgeText: "Direct Mill",
    couponCode: "HARVEST10",
  });

  const [healthGoals, setHealthGoals] = useState({
    heading: "Wholesome Nutrition from Native Crops",
    subheading:
      "Unpolished rice and slow wood-pressed oils packed for daily kitchen use.",
  });

  const [giftingConfig, setGiftingConfig] = useState({
    title: "Traditional Harvest Hampers",
    description: "Natural sweeteners, whole grains, and cold-pressed staples.",
  });

  const [footerConfig, setFooterConfig] = useState({
    phone: "+91 94878 82321",
    email: "care@pureorganics.in",
    address: "Kallidaikurichi, Ambasamudram, Tirunelveli, Tamil Nadu - 627416",
    fssai: "12423008000412",
  });

  const [discountConfig, setDiscountConfig] = useState({
    couponCode: "HARVEST10",
    discountPercent: 10,
  });

  const saveCMSSection = async (sectionName, data) => {
    if (sectionName === "hero_slides")
      setHeroSlides(Array.isArray(data) ? data : [data]);
    if (sectionName === "announcement") setAnnouncements(data);
    if (sectionName === "health_goals") setHealthGoals(data);
    if (sectionName === "gifting_banner") setGiftingConfig(data);
    if (sectionName === "footer") setFooterConfig(data);

    try {
      await fetch(`${API_BASE_URL}/api/cms/${sectionName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return true;
    } catch (err) {
      console.warn("CMS persistence warning:", err);
      return true;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        currentAdmin,
        setCurrentAdmin,
        loginAdmin,
        logoutAdmin,
        products,
        loadingProducts,
        fetchProducts,
        addProduct,
        updateProduct,
        updateProductQuantity,
        toggleStockStatus,
        deleteProduct,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        orders,
        fetchOrders,
        placeOrder,
        updateOrderStatus,
        heroSlides,
        announcements,
        healthGoals,
        giftingConfig,
        footerConfig,
        discountConfig,
        saveCMSSection,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
