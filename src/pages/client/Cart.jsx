import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Compass,
  MapPin,
  Truck,
} from "lucide-react";
import { useStore } from "../../context/storecontext";
import TrackingStepper from "../../components/TrackingStepper";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, placeOrder } = useStore();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [completedOrder, setCompletedOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState("");

  const totalCartItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0,
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !customer.name.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim()
    ) {
      setFormError("Please fill out all delivery details.");
      return;
    }

    setFormError("");

    const snapshot = {
      items: [...cart],
      total: totalAmount,
      customer: { ...customer },
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      dispatchNote: "Order verified at farm collective. Awaiting packaging.",
    };

    const generatedTrackingId = placeOrder(customer);

    setCompletedOrder({
      ...snapshot,
      trackingId: generatedTrackingId,
      status: "Placed",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyTrackingId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. ORDER CONFIRMED VIEW
  if (completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
        {/* Success Banner */}
        <div className="bg-white border border-[#cbe1d2] rounded-3xl p-6 sm:p-10 shadow-[0_10px_30px_rgba(46,125,77,0.08)] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#edf5ef] border border-[#cbe1d2] text-[#2e7d4d] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#2e7d4d]">
              Order Placed Successfully
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#162a1e]">
              Thank You for Supporting Native Harvests
            </h1>
            <p className="text-xs sm:text-sm text-[#5c7365] max-w-lg mx-auto">
              Your harvest package has been recorded. Pay via Cash on Delivery
              when the parcel arrives at your doorstep.
            </p>
          </div>

          {/* Tracking ID Badge */}
          <div className="inline-flex items-center gap-3 bg-[#faf7f2] border border-[#e4ded3] rounded-2xl px-6 py-3.5 shadow-inner">
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider text-[#738d81] block">
                Your Tracking ID
              </span>
              <span className="font-mono text-lg font-bold text-[#1b3b27] tracking-widest">
                {completedOrder.trackingId}
              </span>
            </div>

            <button
              type="button"
              onClick={() => copyTrackingId(completedOrder.trackingId)}
              className="ml-2 p-2 rounded-xl bg-white border border-[#d7dfd9] text-[#1b3b27] hover:bg-[#1b3b27] hover:text-white transition-all cursor-pointer shadow-xs"
              title="Copy Tracking ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {copied && (
            <p className="text-xs font-semibold text-[#2e7d4d]">
              ✓ Copied to clipboard!
            </p>
          )}
        </div>

        {/* Live Delivery Status Stepper */}
        <div className="bg-white border border-[#e8e2d5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#eee8dd] pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#162a1e]">
                Delivery Status
              </h2>
              <p className="text-xs text-[#6d8274]">
                Cash on Delivery:{" "}
                <span className="text-[#1b3b27] font-bold">
                  ₹{completedOrder.total}
                </span>
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#edf5ef] text-[#2e7d4d] border border-[#cbe1d2]">
              {completedOrder.status}
            </span>
          </div>

          <TrackingStepper currentStatus={completedOrder.status} />

          {/* Initial Dispatch Checkpoint Note */}
          <div className="p-4 rounded-2xl bg-[#edf5ef] border border-[#cbe1d2] flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#2e7d4d] shrink-0" />
            <div className="text-xs text-[#162a1e]">
              <span className="font-bold text-[#1b3b27]">
                Initial Dispatch Note:{" "}
              </span>
              {completedOrder.dispatchNote}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#e8e2d5] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#1b3b27]">
              Harvest Items
            </h3>
            <div className="divide-y divide-[#f2ece2]">
              {completedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="py-2.5 flex justify-between items-center text-xs"
                >
                  <span className="text-[#162a1e]">
                    {item.name}{" "}
                    <span className="text-[#738d81]">
                      ({item.unit}) × {item.qty}
                    </span>
                  </span>
                  <span className="font-mono font-bold text-[#162a1e]">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-[#eee8dd] flex justify-between items-center text-sm font-bold">
              <span className="text-[#6d8274]">Total Amount:</span>
              <span className="font-serif text-lg text-[#1b3b27]">
                ₹{completedOrder.total}
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#e8e2d5] rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#1b3b27]">
              Delivering To
            </h3>
            <div className="text-xs space-y-2 text-[#162a1e]">
              <p>
                <span className="text-[#738d81]">Name:</span>{" "}
                {completedOrder.customer.name}
              </p>
              <p>
                <span className="text-[#738d81]">Phone:</span>{" "}
                {completedOrder.customer.phone}
              </p>
              <p>
                <span className="text-[#738d81]">Address:</span>{" "}
                {completedOrder.customer.address}
              </p>
              <p className="text-[#2e7d4d] font-semibold pt-1">
                Payment Method: Cash on Delivery
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate("/track")}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border border-[#d2dfd5] hover:bg-[#edf5ef] text-[#1b3b27] text-xs font-bold uppercase tracking-wider rounded-full shadow-xs transition-all cursor-pointer"
          >
            <Truck className="w-4 h-4 text-[#2e7d4d]" /> Track In Real Time
          </button>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#c58f38]" /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // 2. EMPTY BASKET VIEW
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-white border border-[#e8e2d5] flex items-center justify-center text-[#2e7d4d] mx-auto shadow-sm">
          <ShoppingBag className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-[#162a1e]">
            Your Basket is Empty
          </h2>
          <p className="text-xs text-[#5c7365]">
            Explore our unpolished millets, pure forest honey, and wood-pressed
            oils.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-7 py-3 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all"
        >
          Explore Catalog <ArrowRight className="w-4 h-4 text-[#c58f38]" />
        </Link>
      </div>
    );
  }

  // 3. CART + DELIVERY FORM VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e2d5] pb-5">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#162a1e]">
            Shopping Basket
          </h1>
          <p className="text-xs text-[#5c7365] mt-1">
            Review selections and enter address details for Cash on Delivery.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1b3b27] hover:text-[#2e7d4d] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e8e2d5] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#eee8dd] pb-4">
            <h2 className="font-serif text-lg font-bold text-[#162a1e]">
              Selected Harvest ({totalCartItems})
            </h2>
            <span className="text-xs text-[#2e7d4d] font-semibold">
              100% Native & Fresh
            </span>
          </div>

          <div className="divide-y divide-[#f2ece2]">
            {cart.map((item) => (
              <div
                key={item.id}
                className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover bg-[#faf7f2] border border-[#e8e2d5] shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#162a1e] leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#738d81] mt-0.5">{item.unit}</p>
                    <span className="text-xs font-bold text-[#1b3b27] mt-1 block">
                      ₹{item.price} each
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="flex items-center gap-2 border border-[#dce7df] bg-[#faf7f2] rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-xs font-bold text-[#516859] hover:text-[#162a1e] transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#1b3b27]">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-xs font-bold text-[#516859] hover:text-[#162a1e] transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm font-serif font-bold text-[#162a1e] min-w-[70px] text-right">
                    ₹{item.price * item.qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#eee8dd] flex justify-between items-center text-sm">
            <span className="text-[#6d8274]">Subtotal:</span>
            <span className="font-serif text-xl font-bold text-[#162a1e]">
              ₹{totalAmount}
            </span>
          </div>
        </div>

        {/* Right: Checkout Details Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#e8e2d5] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#eee8dd] pb-4">
            <h2 className="font-serif text-lg font-bold text-[#162a1e]">
              Delivery Details
            </h2>
            <p className="text-xs text-[#6d8274] mt-0.5">
              Cash on Delivery (Pay upon arrival)
            </p>
          </div>

          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#516859] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Enter recipient full name"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#faf7f2] border border-[#dcd4c7] text-[#162a1e] placeholder-[#8e9f93] focus:outline-none focus:border-[#2e7d4d] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#516859] mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#faf7f2] border border-[#dcd4c7] text-[#162a1e] placeholder-[#8e9f93] focus:outline-none focus:border-[#2e7d4d] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#516859] mb-1.5">
                Delivery Address *
              </label>
              <textarea
                required
                rows="3"
                placeholder="Door no, street name, landmark, pincode..."
                value={customer.address}
                onChange={(e) =>
                  setCustomer({ ...customer, address: e.target.value })
                }
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#faf7f2] border border-[#dcd4c7] text-[#162a1e] placeholder-[#8e9f93] focus:outline-none focus:border-[#2e7d4d] transition-all resize-none"
              />
            </div>

            <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e8e2d5] space-y-2 text-xs">
              <div className="flex justify-between text-[#516859]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#162a1e]">
                  ₹{totalAmount}
                </span>
              </div>
              <div className="flex justify-between text-[#516859]">
                <span>Shipping</span>
                <span className="text-[#2e7d4d] font-semibold">
                  Free Delivery
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#162a1e] pt-2 border-t border-[#e8e2d5]">
                <span>Payable on Delivery</span>
                <span className="text-[#1b3b27] font-serif text-base">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
            >
              Confirm & Place Order (₹{totalAmount})
            </button>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#738d81] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d4d]" />
              No advance payment needed • Inspect items on arrival
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
