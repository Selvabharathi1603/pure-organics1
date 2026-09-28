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
  Tag,
  X,
  Sparkles,
  CreditCard,
  Banknote,
  Loader2,
  Check,
} from "lucide-react";
import { useStore } from "../../context/storecontext";
import TrackingStepper from "../../components/TrackingStepper";
import PincodeChecker from "../../components/PincodeChecker";

export default function Cart({ isOpen, onClose }) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    placeOrder,
    announcements,
    discountConfig,
  } = useStore();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [allowWhatsApp, setAllowWhatsApp] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const [completedOrder, setCompletedOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState("");

  const totalCartItems = (cart || []).reduce(
    (sum, item) => sum + (item.qty || 1),
    0,
  );
  const subtotal = (cart || []).reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0,
  );

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === "flat") {
      discountAmount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  const finalPayable = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");

    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a voucher code.");
      return;
    }

    const validCodes = {
      HARVEST10: {
        type: "percentage",
        value: 10,
        label: "10% Welcome Discount",
      },
      BDAY20: {
        type: "percentage",
        value: 20,
        label: "20% Birthday Harvest Special",
      },
      HARVEST50: {
        type: "percentage",
        value: 50,
        label: "50% Seasonal Harvest Fest",
      },
      NATIVE10: {
        type: "percentage",
        value: 10,
        label: "10% Farm Direct Discount",
      },
    };

    if (announcements?.couponCode) {
      validCodes[announcements.couponCode.toUpperCase()] = {
        type: "percentage",
        value: 10,
        label: "Seasonal Harvest Promo",
      };
    }
    if (discountConfig?.couponCode) {
      validCodes[discountConfig.couponCode.toUpperCase()] = {
        type: "flat",
        value: 100,
        label: "₹100 First Order Welcome Bonus",
      };
    }

    if (validCodes[code]) {
      setAppliedCoupon({ code, ...validCodes[code] });
      setCouponInput("");
      setCouponError("");
    } else {
      setCouponError("Invalid or expired coupon code. Try HARVEST10 or BDAY20");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const launchRazorpayPayment = async () => {
    if (!window.Razorpay) {
      setFormError("Razorpay SDK failed to load. Please refresh the page.");
      return;
    }

    setIsProcessingPayment(true);
    setFormError("");

    try {
      const res = await fetch(
        "https://pure-organics1.onrender.com/api/payment/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: finalPayable }),
        },
      );

      const orderData = await res.json();
      if (!res.ok)
        throw new Error(orderData.error || "Failed to initialize payment");

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Pure Organics",
        description: "Direct Farm Harvest Payment",
        order_id: orderData.orderId,
        prefill: { name: customer.name, contact: customer.phone },
        theme: { color: "#1b3b27" },
        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              "https://pure-organics1.onrender.com/api/payment/verify",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              },
            );

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              completeOrderPlacement(
                "Paid Online via UPI/Card (Razorpay)",
                response.razorpay_payment_id,
              );
            } else {
              setFormError("Payment verification failed on the server.");
            }
          } catch (err) {
            setFormError("Error verifying payment signature: " + err.message);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      setFormError(err.message || "Failed to initiate online checkout.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const completeOrderPlacement = (paymentLabel, paymentRef = null) => {
    const snapshot = {
      items: [...cart],
      subtotal,
      discount: discountAmount,
      total: finalPayable,
      couponCode: appliedCoupon?.code || null,
      customer: { ...customer },
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      paymentMethod: paymentLabel,
      paymentRef,
      dispatchNote: "Order verified at farm collective. Awaiting packaging.",
    };

    const generatedTrackingId = placeOrder({
      ...customer,
      items: [...cart],
      subtotal,
      total_amount: finalPayable,
      discount_applied: discountAmount,
      coupon_code: appliedCoupon?.code || null,
      payment_method: paymentLabel,
      payment_ref: paymentRef,
    });

    setCompletedOrder({
      ...snapshot,
      trackingId: generatedTrackingId,
      status: "Placed",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

    if (paymentMethod === "online") {
      launchRazorpayPayment();
    } else {
      completeOrderPlacement("Cash on Delivery (Pay upon arrival)");
    }
  };

  const copyTrackingId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close helper
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  // 1. ORDER CONFIRMED VIEW
  if (completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
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
              Your harvest package has been recorded. Payment Status:{" "}
              <strong>{completedOrder.paymentMethod}</strong>
            </p>
          </div>

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

        <div className="bg-white border border-[#e8e2d5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#eee8dd] pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#162a1e]">
                Delivery Status
              </h2>
              <p className="text-xs text-[#6d8274]">
                Total Amount:{" "}
                <span className="text-[#1b3b27] font-bold">
                  ₹{completedOrder.total}
                </span>
                {completedOrder.discount > 0 && (
                  <span className="text-emerald-700 ml-2 font-semibold">
                    (Coupon {completedOrder.couponCode} applied: -₹
                    {completedOrder.discount})
                  </span>
                )}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#edf5ef] text-[#2e7d4d] border border-[#cbe1d2]">
              {completedOrder.status}
            </span>
          </div>

          <TrackingStepper currentStatus={completedOrder.status} />

          <div className="p-4 rounded-2xl bg-[#edf5ef] border border-[#cbe1d2] flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#2e7d4d]" />
            <div className="text-xs text-[#162a1e]">
              <span className="font-bold text-[#1b3b27]">
                Initial Dispatch Note:{" "}
              </span>
              {completedOrder.dispatchNote}
            </div>
          </div>
        </div>

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

            <div className="space-y-1.5 pt-2 border-t border-[#eee8dd] text-xs">
              <div className="flex justify-between text-[#6d8274]">
                <span>Items Subtotal:</span>
                <span>₹{completedOrder.subtotal}</span>
              </div>
              {completedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Harvest Voucher ({completedOrder.couponCode}):</span>
                  <span>-₹{completedOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-bold pt-1 border-t border-[#f2ece2]">
                <span className="text-[#162a1e]">Total:</span>
                <span className="font-serif text-lg text-[#1b3b27]">
                  ₹{completedOrder.total}
                </span>
              </div>
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
                Mode: {completedOrder.paymentMethod}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Real-Time Tracking & Continue Shopping */}
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
  if (!cart || cart.length === 0) {
    const emptyContent = (
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
        <button
          onClick={handleClose}
          className="inline-flex items-center gap-2 px-7 py-3 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer"
        >
          Explore Catalog <ArrowRight className="w-4 h-4 text-[#c58f38]" />
        </button>
      </div>
    );

    if (isOpen !== undefined) {
      if (!isOpen) return null;
      return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-[#faf7f2] h-full shadow-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="font-serif font-bold text-lg">Shopping Basket</h2>
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>
            {emptyContent}
          </div>
        </div>
      );
    }

    return emptyContent;
  }

  // 3. CART CONTENT LAYOUT
  const cartContent = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar with Close / Back trigger */}
      <div className="flex items-center justify-between gap-4 border-b border-[#e8e2d5] pb-5">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#162a1e]">
            Shopping Basket
          </h1>
          <p className="text-xs text-[#5c7365] mt-1">
            Review selections, apply harvest vouchers, and complete your order.
          </p>
        </div>
        <button
          onClick={handleClose}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#edf5ef] border border-[#dcd4c7] rounded-xl text-xs font-semibold text-[#1b3b27] transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </button>
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
            <span className="text-[#6d8274]">Items Total:</span>
            <span className="font-serif text-xl font-bold text-[#162a1e]">
              ₹{subtotal}
            </span>
          </div>
        </div>

        {/* Right: Checkout & Payment Section */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl border border-[#e8e2d5] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#e0b253]" />
              <h3 className="font-serif font-bold text-sm text-[#162a1e]">
                Have a Harvest Coupon Code?
              </h3>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3.5 bg-[#edf5ef] border border-[#cbe1d2] rounded-2xl">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2e7d4d]" />
                    <span className="font-mono font-bold text-xs text-[#1b3b27]">
                      {appliedCoupon.code}
                    </span>
                    <span className="text-[10px] bg-[#2e7d4d] text-white px-2 py-0.5 rounded-full font-bold">
                      Applied
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5c7365]">
                    {appliedCoupon.label} (-₹{discountAmount})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="p-1.5 rounded-full hover:bg-white text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. HARVEST10, BDAY20"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-[#faf7f2] border border-[#dcd4c7] text-[#162a1e] uppercase tracking-wider font-mono placeholder-[#8e9f93] focus:outline-none focus:border-[#2e7d4d]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <p className="text-xs text-rose-600 pl-1">{couponError}</p>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] text-[#738d81]">
                  <span>Try:</span>
                  <button
                    type="button"
                    onClick={() => setCouponInput("HARVEST10")}
                    className="underline hover:text-[#1b3b27] font-mono cursor-pointer"
                  >
                    HARVEST10
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setCouponInput("BDAY20")}
                    className="underline hover:text-[#1b3b27] font-mono cursor-pointer"
                  >
                    BDAY20
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Delivery & Payment Selection Box */}
          <div className="bg-white rounded-3xl border border-[#e8e2d5] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#eee8dd] pb-4">
              <h2 className="font-serif text-lg font-bold text-[#162a1e]">
                Delivery & Payment
              </h2>
              <p className="text-xs text-[#6d8274] mt-0.5">
                Choose online UPI/card payment or cash on delivery.
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

                {/* Modernized WhatsApp Opt-in Card */}
                <div
                  onClick={() => setAllowWhatsApp(!allowWhatsApp)}
                  className={`mt-3 p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 select-none ${
                    allowWhatsApp
                      ? "bg-gradient-to-r from-emerald-50/90 to-teal-50/50 border-emerald-300/80 shadow-xs"
                      : "bg-[#faf7f2]/60 border-[#e5dfd3] opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#162a1e] leading-snug">
                        WhatsApp Live Updates
                      </p>
                      <p className="text-[10px] text-[#5c7365]">
                        Real-time tracking link & invoice receipt sent to this
                        number
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                      allowWhatsApp
                        ? "bg-[#25D366] border-[#25D366] text-white shadow-2xs"
                        : "bg-white border-stone-300"
                    }`}
                  >
                    {allowWhatsApp && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>

              <PincodeChecker />

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

              {/* Payment Method Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold text-[#516859]">
                  Select Payment Option *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-3 rounded-2xl border text-xs font-semibold text-center cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                      paymentMethod === "cod"
                        ? "border-[#1b3b27] bg-[#edf5ef] text-[#1b3b27] shadow-xs"
                        : "border-[#e8e2d5] bg-white text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-[#2e7d4d]" />
                    <span>Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={`p-3 rounded-2xl border text-xs font-semibold text-center cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                      paymentMethod === "online"
                        ? "border-[#1b3b27] bg-[#edf5ef] text-[#1b3b27] shadow-xs"
                        : "border-[#e8e2d5] bg-white text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#2e7d4d]" />
                    <span>Pay Online (UPI / Card)</span>
                  </button>
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#e8e2d5] space-y-2 text-xs">
                <div className="flex justify-between text-[#516859]">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-[#162a1e]">
                    ₹{subtotal}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#2e7d4d] font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Voucher ({appliedCoupon?.code}
                      )
                    </span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#516859]">
                  <span>Shipping</span>
                  <span className="text-[#2e7d4d] font-semibold">
                    Free Delivery
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#162a1e] pt-2 border-t border-[#e8e2d5]">
                  <span>
                    {paymentMethod === "online"
                      ? "Total Payable Now"
                      : "Payable on Delivery"}
                  </span>
                  <span className="text-[#1b3b27] font-serif text-base">
                    ₹{finalPayable}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-3.5 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isProcessingPayment && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <span>
                  {paymentMethod === "online"
                    ? `Pay ₹${finalPayable} Online Now`
                    : `Confirm & Place Order (₹${finalPayable})`}
                </span>
              </button>

              <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#738d81] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d4d]" />
                {paymentMethod === "online"
                  ? "Secured 256-bit encrypted checkout via Razorpay"
                  : "No advance payment needed • Inspect items on arrival"}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  // If used as a Modal/Drawer Overlay (from clicking Add to Cart in Shop)
  if (isOpen !== undefined) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
        <div className="w-full max-w-2xl bg-[#faf7f2] min-h-screen shadow-2xl p-6 sm:p-8 relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white hover:bg-stone-200 text-stone-700 transition-colors shadow-sm cursor-pointer"
            title="Close Cart"
          >
            <X className="w-5 h-5" />
          </button>
          {cartContent}
        </div>
      </div>
    );
  }

  // Normal standalone page view
  return cartContent;
}
