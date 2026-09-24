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
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#162a1e]/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white border-l border-[#e8e2d5] shadow-2xl flex flex-col text-[#162a1e]"
            >
              {/* Header */}
              <div className="p-5 border-b border-[#eee8dd] flex items-center justify-between bg-[#faf7f2]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#edf5ef] border border-[#cbe1d2] flex items-center justify-center text-[#1b3b27]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-serif font-bold text-[#162a1e]">
                      Your Harvest Basket
                    </h2>
                    <span className="text-xs text-[#6d8274]">
                      {totalCartItems} {totalCartItems === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="p-1.5 rounded-lg text-[#6d8274] hover:text-[#162a1e] hover:bg-[#eef4ef] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Waiting Nudge (Simulates live notification) */}
              {cart.length > 0 && (
                <div className="px-5 py-2.5 bg-[#edf5ef] border-b border-[#cbe1d2] flex items-center gap-2 text-xs text-[#1b3b27]">
                  <Sparkles className="w-3.5 h-3.5 text-[#c58f38] shrink-0" />
                  <span>
                    Your fresh harvest batch is reserved. Complete checkout
                    before batch sells out!
                  </span>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#f2ece2]">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#faf7f2] border border-[#e8e2d5] flex items-center justify-center text-[#8e9f93]">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#162a1e]">
                        Your basket is empty
                      </p>
                      <p className="text-xs text-[#6d8274] mt-1">
                        Explore raw honey, cold-pressed oils, and ancient
                        millets.
                      </p>
                    </div>
                    <Link
                      to="/shop"
                      onClick={closeCart}
                      className="px-5 py-2.5 bg-[#1b3b27] hover:bg-[#255236] text-white font-bold rounded-xl text-xs transition-all shadow-md"
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
                        className="w-16 h-16 rounded-xl object-cover bg-[#faf7f2] shrink-0 border border-[#e8e2d5]"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[#162a1e] truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#6d8274] mt-0.5 font-mono">
                          {item.unit}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          {/* Stepper Buttons */}
                          <div className="flex items-center gap-1.5 border border-[#dce7df] bg-[#faf7f2] rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-white text-xs font-bold text-[#516859] hover:text-[#162a1e] cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-[#1b3b27]">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-white text-xs font-bold text-[#516859] hover:text-[#162a1e] cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-bold text-[#162a1e] font-serif">
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

              {/* Checkout Actions */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-[#eee8dd] bg-[#faf7f2] space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#516859]">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#162a1e]">
                        ₹{subtotal}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#516859]">
                      <span>Shipping</span>
                      <span className="text-[#2e7d4d] font-semibold">
                        Free Delivery
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#162a1e] pt-2 border-t border-[#e8e2d5]">
                      <span>Total</span>
                      <span className="text-[#1b3b27] font-serif text-base">
                        ₹{subtotal}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/cart"
                    onClick={closeCart}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#1b3b27] hover:bg-[#255236] text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-98"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-3.5 h-3.5 text-[#c58f38]" />
                  </Link>

                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#6d8274]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d4d]" />
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
