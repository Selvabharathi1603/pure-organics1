import React, { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

// Automatically detects if running locally or deployed on Render/Vercel
const API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
      (typeof process !== "undefined" && process?.env?.REACT_APP_API_URL) ||
      "https://pure-organics1.onrender.com";

export const StoreProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem("pure_admin_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Pure Database State - No hardcoded item overrides
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

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

  const [footerConfig] = useState({
    farmTagline:
      "Pure traditional harvests produced with zero heat and zero chemicals.",
    contactPhone: "+91 94878 82321",
    contactEmail: "care@pureorganics.in",
    farmAddress:
      "Kallidaikurichi, Ambasamudram, Tirunelveli District, Tamil Nadu - 627416",
    fssaiNumber: "12423008000412",
  });

  useEffect(() => {
    localStorage.setItem("pure_cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch pure database items from TiDB
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      console.log(
        `[Pure Organics] Fetching catalog from: ${API_BASE_URL}/api/products`,
      );
      const res = await fetch(`${API_BASE_URL}/api/products`);

      if (res.ok) {
        const data = await res.json();
        console.log(
          `[Pure Organics] Successfully loaded ${data.length} products from database:`,
          data,
        );

        if (Array.isArray(data) && data.length > 0) {
          // Normalize database columns for clean UI rendering
          const normalized = data.map((p) => ({
            ...p,
            id: p.id || p._id,
            name: p.name || p.title || "Farm Product",
            category: p.category || "General",
            // Handles both `image` and `image_url` column names from MySQL/TiDB
            image: p.image || p.image_url || p.img || "/placeholder-oil.png",
            unit: p.unit || p.quantity || "Standard Pack",
            price: Number(p.price) || 0,
            originalPrice: p.originalPrice || p.original_price || null,
            // Handles both boolean and 1/0 integer columns from SQL
            inStock:
              p.in_stock === 1 ||
              p.in_stock === true ||
              p.inStock === true ||
              p.inStock === undefined,
            description: p.description || p.desc || "Pure native harvest.",
            rating: p.rating || "4.9",
          }));
          setProducts(normalized);
        }
      } else {
        console.error(
          "[Pure Organics] API response error:",
          res.status,
          res.statusText,
        );
      }
    } catch (err) {
      console.error(
        "[Pure Organics] Database connection / network error:",
        err.message,
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  return (
    <StoreContext.Provider
      value={{
        currentAdmin,
        products,
        loadingProducts,
        cart,
        orders,
        stockAlerts,
        footerConfig,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchProducts,
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
