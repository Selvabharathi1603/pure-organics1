import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useStore } from "../context/storecontext";

export default function CartDrawer() {
  const { isCartOpen, closeCart, cart, updateQuantity, removeFromCart } =
    useStore();

  const totalCartItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeCart();
    };
    if (isCartOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, closeCart]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white border-l border-brand-border shadow-xl flex flex-col text-brand-dark"
            >
              {/* Header */}
              <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-bg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white border border-brand-border flex items-center justify-center text-brand-dark">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-brand-dark">
                      Your Harvest Bag
                    </h2>
                    <span className="text-xs text-brand-subtext">
                      {totalCartItems} {totalCartItems === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="p-1.5 rounded-full text-brand-subtext hover:text-brand-dark hover:bg-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nudge Banner */}
              {cart.length > 0 && (
                <div className="px-5 py-2.5 bg-brand-cream border-b border-brand-border flex items-center gap-2 text-xs text-brand-dark">
                  <Sparkles className="w-3.5 h-3.5 text-brand-green shrink-0" />
                  <span>Your fresh harvest items are reserved in bag.</span>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-brand-border">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center text-brand-muted">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-dark">
                        Your bag is empty
                      </p>
                      <p className="text-xs text-brand-subtext mt-1">
                        Explore raw honey, cold-pressed oils, and ancient
                        millets.
                      </p>
                    </div>
                    <Link
                      to="/shop"
                      onClick={closeCart}
                      className="px-6 py-2.5 bg-brand-dark hover:bg-brand-green text-white font-bold rounded-full text-xs transition-colors shadow-sm"
                    >
                      Explore Catalog
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 flex gap-3.5 first:pt-0 last:pb-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-contain bg-brand-bg shrink-0 border border-brand-border p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-brand-dark truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-brand-muted mt-0.5">
                          {item.unit}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          {/* Stepper Buttons */}
                          <div className="flex items-center gap-1.5 border border-brand-border bg-brand-bg rounded-full p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white text-xs font-bold text-brand-dark cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-brand-dark">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white text-xs font-bold text-brand-dark cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-bold text-brand-dark">
                              ₹{item.price * item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Bar */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-brand-border bg-brand-cream space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-brand-subtext">
                      <span>Subtotal</span>
                      <span className="font-semibold text-brand-dark">
                        ₹{subtotal}
                      </span>
                    </div>
                    <div className="flex justify-between text-brand-subtext">
                      <span>Shipping</span>
                      <span className="text-brand-green font-semibold">
                        Free Delivery
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-brand-dark pt-2 border-t border-brand-border">
                      <span>Total</span>
                      <span className="text-brand-dark text-base">
                        ₹{subtotal}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/cart"
                    onClick={closeCart}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-brand-dark hover:bg-brand-green text-white font-bold rounded-full text-xs shadow-sm transition-colors"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-brand-subtext">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                    Cash on Delivery available across India
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
