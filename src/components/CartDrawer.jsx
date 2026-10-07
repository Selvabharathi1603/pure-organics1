import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "../context/storecontext";

export default function CartDrawer() {
  const { isCartOpen, closeCart, cart, updateQuantity, removeFromCart } =
    useStore();

  const totalCartItems = (cart || []).reduce(
    (sum, item) => sum + (item.qty || 1),
    0,
  );

  // Subtotal (Actual selling price)
  const subtotal = (cart || []).reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1),
    0,
  );

  // Original MRP calculation
  const totalMRP = (cart || []).reduce((sum, item) => {
    const original = item.originalPrice
      ? Number(item.originalPrice)
      : Number(item.price) + 60;
    return sum + original * (item.qty || 1);
  }, 0);

  const totalSaved = Math.max(0, totalMRP - subtotal);
  const deliveryCharge = subtotal >= 499 ? 0 : 50;
  const finalTotal = subtotal + deliveryCharge;

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
        <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white border-l border-stone-300 shadow-2xl flex flex-col"
            >
              {/* 1. TOP HEADER (BLACK) */}
              <div className="p-4 sm:p-5 bg-black border-b border-white/10 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D97706] flex items-center justify-center text-black">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white">
                      Your Shopping Cart
                    </h2>
                    <span className="text-xs text-stone-400 font-medium">
                      {totalCartItems} {totalCartItems === 1 ? "item" : "items"}{" "}
                      added
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close Cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Delivery Bar */}
              {cart.length > 0 && (
                <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs text-stone-800 shrink-0">
                  {subtotal >= 499 ? (
                    <div className="flex items-center gap-1.5 text-stone-900 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-[#D97706]" />
                      <span>Free home delivery unlocked!</span>
                    </div>
                  ) : (
                    <span>
                      Add items worth{" "}
                      <strong className="text-[#D97706]">
                        ₹{499 - subtotal}
                      </strong>{" "}
                      more for Free Delivery
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-stone-500 font-bold">
                    Min ₹499
                  </span>
                </div>
              )}

              {/* 2. MIDDLE ITEMS LIST (PURE WHITE) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-white divide-y divide-stone-100 space-y-3">
                {!cart || cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-stone-900">
                        Your cart is empty
                      </p>
                      <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                        Add cold-pressed oils, unpolished grains, or native
                        honey to your order.
                      </p>
                    </div>
                    <Link
                      to="/catalog"
                      onClick={closeCart}
                      className="px-6 py-2.5 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => {
                    const originalPrice = item.originalPrice
                      ? Number(item.originalPrice)
                      : Number(item.price) + 60;
                    const discount = originalPrice - Number(item.price);

                    return (
                      <div
                        key={item.id}
                        className="pt-3 first:pt-0 flex gap-3.5 items-center text-left"
                      >
                        {/* Image Thumbnail */}
                        <div className="w-16 h-16 rounded-xl bg-stone-50 border border-stone-200 shrink-0 p-1 flex items-center justify-center">
                          <img
                            src={item.image || "/placeholder-oil.png"}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-mono text-[#D97706] font-bold">
                              {item.unit || "Pack"}
                            </span>
                            {discount > 0 && (
                              <span className="text-[10px] text-stone-400 line-through">
                                ₹{originalPrice}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2.5">
                            {/* Quantity Stepper */}
                            <div className="flex items-center gap-1 border border-stone-200 bg-stone-50 rounded-lg p-0.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white text-xs font-bold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-5 text-center text-xs font-bold text-stone-900 font-mono">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white text-xs font-bold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            {/* Item Total Price & Delete */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs sm:text-sm font-black text-stone-900 font-mono">
                                ₹{(Number(item.price) || 0) * (item.qty || 1)}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* 3. CALCULATION & CHECKOUT (ALONE BLACK) */}
              {cart && cart.length > 0 && (
                <div className="p-4 sm:p-5 bg-[#141816] border-t border-white/10 space-y-3.5 text-white pb-24 sm:pb-6 shrink-0">
                  {/* Detailed Math Breakdown */}
                  <div className="space-y-1.5 text-xs text-left">
                    <div className="flex justify-between text-stone-400">
                      <span>Total MRP</span>
                      <span className="text-stone-400 line-through font-mono">
                        ₹{totalMRP}
                      </span>
                    </div>

                    {totalSaved > 0 && (
                      <div className="flex justify-between text-[#F59E0B] font-semibold">
                        <span>Batch Discount Saved</span>
                        <span className="font-mono">-₹{totalSaved}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-stone-400">
                      <span>Subtotal</span>
                      <span className="text-white font-bold font-mono">
                        ₹{subtotal}
                      </span>
                    </div>

                    <div className="flex justify-between text-stone-400">
                      <span>Delivery Fee</span>
                      {deliveryCharge === 0 ? (
                        <span className="text-[#F59E0B] font-bold">
                          FREE{" "}
                          <span className="line-through text-stone-500 font-normal ml-1">
                            ₹50
                          </span>
                        </span>
                      ) : (
                        <span className="text-white font-bold font-mono">
                          ₹50
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between text-sm font-bold text-white pt-2.5 border-t border-white/10">
                      <span>Final Payable</span>
                      <span className="text-lg font-black text-[#F59E0B] font-mono">
                        ₹{finalTotal}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    to="/cart"
                    onClick={closeCart}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#D97706] hover:bg-[#B45309] text-black font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer active:scale-[0.99]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </Link>

                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Cash on Delivery available on your order
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
