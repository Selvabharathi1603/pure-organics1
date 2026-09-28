import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, signOut } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

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

  // 2. Drawer & Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // 3. Customer Authentication State (Firebase)
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "Patron",
          email: user.email || "",
          phone: user.phoneNumber || "",
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logoutCustomer = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // 4. Products State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // 5. Announcements & CMS Configuration State
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

  // Fetch Products from Backend
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

  // Place Order: matches clean TiDB schema (tracking_id, customer_name, customer_phone, customer_address, total_amount, dispatch_note)
  const placeOrder = (orderPayload) => {
    const trackingId = "PO-" + Math.floor(100000 + Math.random() * 900000);

    const orderRecord = {
      tracking_id: trackingId,
      customer_name: orderPayload.name || orderPayload.customer_name || "",
      customer_phone: orderPayload.phone || orderPayload.customer_phone || "",
      customer_address:
        orderPayload.address || orderPayload.customer_address || "",
      total_amount: Number(orderPayload.total_amount) || 0,
      dispatch_note: "Order verified at farm collective. Awaiting packaging.",
    };

    fetch("https://pure-organics1.onrender.com/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderRecord),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Order saved to TiDB Cloud:", data);
      })
      .catch((err) => {
        console.error("❌ Failed to save order to backend:", err);
      });

    clearCart();
    return trackingId;
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        isAuthOpen,
        setIsAuthOpen,
        currentUser,
        logoutCustomer,
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
