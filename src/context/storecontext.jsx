import React, { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // 1. Cart State (synchronized with localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("pure_organics_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // 2. Products State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // 3. Announcements & CMS Configuration State
  const [announcements, setAnnouncements] = useState({
    topBarNotice:
      "Seasonal Harvest Notice: Direct farm delivery across Tamil Nadu & Bangalore 🌾",
    couponCode: "HARVEST10",
  });

  const [discountConfig, setDiscountConfig] = useState({
    couponCode: "HARVEST10",
    discountAmount: 100,
  });

  // Sync Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("pure_organics_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Could not cache cart:", e);
    }
  }, [cart]);

  // Fetch Products from TiDB Backend
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(
        "https://pure-organics1.onrender.com/api/products",
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch Homepage CMS Settings
  const fetchCMS = async () => {
    try {
      const res = await fetch(
        "https://pure-organics1.onrender.com/api/cms/homepage",
      );
      const data = await res.json();
      if (data.discount_modal) {
        setDiscountConfig((prev) => ({
          ...prev,
          couponCode: data.discount_modal.coupon_code || "HARVEST10",
        }));
      }
    } catch (err) {
      console.warn("CMS fetch skipped:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCMS();
  }, []);

  // Cart Operations
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: (item.qty || 1) + 1 } : item,
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const updateQuantity = (productId, change) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const nextQty = (item.qty || 1) + change;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("pure_organics_cart");
  };

  // Place Order & Persist Complete Snapshot to TiDB Cloud
  const placeOrder = (orderPayload) => {
    // Generate unique readable tracking reference
    const trackingId = "PO-" + Math.floor(100000 + Math.random() * 900000);

    const snapshotItems =
      orderPayload.items && orderPayload.items.length > 0
        ? orderPayload.items
        : [...cart];

    const subtotalCalc = snapshotItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1),
      0,
    );

    const fullOrder = {
      tracking_id: trackingId,
      customer_name: orderPayload.name || orderPayload.customer_name || "",
      customer_phone: orderPayload.phone || orderPayload.customer_phone || "",
      customer_address:
        orderPayload.address || orderPayload.customer_address || "",
      total_amount: Number(orderPayload.total_amount) || 0,
      subtotal: Number(orderPayload.subtotal) || subtotalCalc,
      discount:
        Number(orderPayload.discount_applied || orderPayload.discount) || 0,
      coupon_code: orderPayload.coupon_code || null,
      payment_method: orderPayload.payment_method || "Cash on Delivery",
      payment_ref: orderPayload.payment_ref || null,
      dispatch_note: "Order verified at farm collective. Awaiting packaging.",
      items: snapshotItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        unit: item.unit,
        qty: item.qty || 1,
      })),
    };

    // Asynchronously send to backend
    fetch("https://pure-organics1.onrender.com/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullOrder),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Order & Invoice saved to TiDB Cloud:", data);
      })
      .catch((err) => {
        console.error("❌ Failed to save order snapshot to backend:", err);
      });

    // Clear cart immediately upon placement
    clearCart();

    return trackingId;
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        products,
        loadingProducts,
        fetchProducts,
        announcements,
        setAnnouncements,
        discountConfig,
        setDiscountConfig,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
