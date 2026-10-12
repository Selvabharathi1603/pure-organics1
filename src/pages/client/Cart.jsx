import React, { useState, useEffect } from "react";
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
  CreditCard,
  Banknote,
  Loader2,
  Check,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useStore } from "../../context/storecontext";
import TrackingStepper from "../../components/TrackingStepper";
import PincodeChecker from "../../components/PincodeChecker";

const API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://pure-organics1.onrender.com";

export default function Cart({ isOpen, onClose }) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    placeOrder,
    announcements,
    discountConfig,
    isCodEnabled,
  } = useStore();
  const navigate = useNavigate();

  // Multi-step controller: 1 = Bag/Coupons, 2 = Shipping Address, 3 = Payment & Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [allowWhatsApp, setAllowWhatsApp] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(
    isCodEnabled !== false ? "cod" : "online",
  );
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Automatically fall back to online payment if Super Admin turns off COD
  useEffect(() => {
    if (isCodEnabled === false && paymentMethod === "cod") {
      setPaymentMethod("online");
    }
  }, [isCodEnabled, paymentMethod]);

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

  // Real selling price subtotal
  const subtotal = (cart || []).reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1),
    0,
  );

  // Original Market MRP (15% higher standard market reference)
  const originalMRP = Math.round(subtotal * 1.15);
  const millDirectSavings = Math.max(0, originalMRP - subtotal);

  // Additional Coupon Discount
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      couponDiscount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === "flat") {
      couponDiscount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  // Total negative savings (Standard Mill Savings + Voucher)
  const totalSavings = millDirectSavings + couponDiscount;
  const finalPayable = Math.max(0, subtotal - couponDiscount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");

    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code.");
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
        label: "20% Special Discount",
      },
      HARVEST50: {
        type: "percentage",
        value: 50,
        label: "50% Seasonal Discount",
      },
      NATIVE10: {
        type: "percentage",
        value: 10,
        label: "10% Mill Direct Discount",
      },
    };

    if (announcements?.couponCode) {
      validCodes[announcements.couponCode.toUpperCase()] = {
        type: "percentage",
        value: 10,
        label: "Seasonal Discount",
      };
    }
    if (discountConfig?.couponCode) {
      validCodes[discountConfig.couponCode.toUpperCase()] = {
        type: "flat",
        value: 100,
        label: "₹100 First Order Discount",
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

  const handleProceedToShipping = () => {
    setFormError("");
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProceedToPayment = () => {
    if (
      !customer.name.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim()
    ) {
      setFormError(
        "Please fill in recipient name, phone, and complete delivery address.",
      );
      return;
    }
    setFormError("");
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const launchRazorpayPayment = async () => {
    if (!window.Razorpay) {
      setFormError("Razorpay gateway failed to load. Please refresh the page.");
      return;
    }

    setIsProcessingPayment(true);
    setFormError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalPayable }),
      });

      const orderData = await res.json();
      if (!res.ok)
        throw new Error(
          orderData.error || "Failed to initialize online payment",
        );

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Pure Organics",
        description: "Direct Mill Harvest Order",
        order_id: orderData.orderId,
        prefill: { name: customer.name, contact: customer.phone },
        theme: { color: "#D97706" },
        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              `${API_BASE_URL}/api/payment/verify`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              },
            );

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              completeOrderPlacement(
                "Paid Online (Razorpay)",
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
      originalMRP,
      subtotal,
      discount: totalSavings,
      total: finalPayable,
      couponCode: appliedCoupon?.code || "MILL_HARVEST",
      customer: { ...customer },
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      paymentMethod: paymentLabel,
      paymentRef,
      dispatchNote: "Order received. Packing at mill.",
    };

    const generatedTrackingId = placeOrder({
      ...customer,
      items: [...cart],
      subtotal,
      total_amount: finalPayable,
      discount_applied: totalSavings,
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

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (
      !customer.name.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim()
    ) {
      setFormError("Please fill in recipient details first.");
      setCurrentStep(2);
      return;
    }
    setFormError("");

    if (paymentMethod === "online") {
      launchRazorpayPayment();
    } else {
      completeOrderPlacement("Cash on Delivery (Pay on arrival)");
    }
  };

  const copyTrackingId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  // -------------------------------------------------------------
  // 1. ORDER CONFIRMED VIEW (WITH STRIKETHROUGH EVERYWHERE)
  // -------------------------------------------------------------
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 py-10 px-4 sm:px-6 lg:px-8 font-sans select-none text-left">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-[#D97706] flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#D97706]">
                Order Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Order Placed Successfully
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
                Your items have been scheduled for dispatch. Payment Status:{" "}
                <strong className="text-stone-900">
                  {completedOrder.paymentMethod}
                </strong>
              </p>
            </div>

            <div className="inline-flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-2xl px-6 py-3.5 shadow-inner">
              <div className="text-left">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 block">
                  Your Tracking ID
                </span>
                <span className="font-mono text-lg font-bold text-stone-900 tracking-widest">
                  {completedOrder.trackingId}
                </span>
              </div>

              <button
                type="button"
                onClick={() => copyTrackingId(completedOrder.trackingId)}
                className="ml-2 p-2 rounded-xl bg-white border border-stone-200 text-stone-800 hover:bg-stone-900 hover:text-white transition-all cursor-pointer shadow-xs"
                title="Copy Tracking ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {copied && (
              <p className="text-xs font-semibold text-[#D97706]">
                ✓ Copied to clipboard!
              </p>
            )}
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900">
                  Delivery Status
                </h2>
                <div className="text-xs text-stone-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span>Total Amount:</span>
                  <span className="line-through text-stone-400 font-mono text-xs">
                    ₹
                    {completedOrder.originalMRP ||
                      Math.round(completedOrder.total * 1.15)}
                  </span>
                  <span className="text-stone-900 font-black font-mono text-base">
                    ₹{completedOrder.total}
                  </span>
                  <span className="text-emerald-700 font-bold font-mono text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Saved ₹
                    {completedOrder.discount ||
                      Math.round(completedOrder.total * 0.15)}
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-50 text-[#D97706] border border-amber-200">
                {completedOrder.status}
              </span>
            </div>

            <TrackingStepper currentStatus={completedOrder.status} />

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#D97706] shrink-0" />
              <div className="text-xs text-stone-800">
                <span className="font-bold text-stone-900">
                  Dispatch Note:{" "}
                </span>
                {completedOrder.dispatchNote}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-stone-400">
                Order Items
              </h3>
              <div className="divide-y divide-stone-100">
                {completedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-2.5 flex justify-between items-center text-xs"
                  >
                    <span className="text-stone-900 font-medium">
                      {item.name}{" "}
                      <span className="text-stone-500">
                        ({item.unit}) × {item.qty}
                      </span>
                    </span>
                    <span className="font-mono font-bold text-stone-900">
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Placed Strikethrough Methodology */}
              <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Market MRP Total:</span>
                  <span className="line-through text-stone-400 font-mono">
                    ₹
                    {completedOrder.originalMRP ||
                      Math.round(completedOrder.total * 1.15)}
                  </span>
                </div>

                <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/70 p-2 rounded-xl border border-emerald-200/60">
                  <span>Mill Direct Savings:</span>
                  <span className="font-mono">
                    -₹
                    {completedOrder.discount ||
                      Math.round(completedOrder.total * 0.15)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-stone-100">
                  <span className="text-stone-900">Total Paid:</span>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 line-through font-mono block">
                      ₹
                      {completedOrder.originalMRP ||
                        Math.round(completedOrder.total * 1.15)}
                    </span>
                    <span className="text-lg font-black text-stone-900 font-mono">
                      ₹{completedOrder.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-3">
              <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-stone-400">
                Delivering To
              </h3>
              <div className="text-xs space-y-2 text-stone-800">
                <p>
                  <span className="text-stone-400 font-medium">Name:</span>{" "}
                  <span className="font-semibold">
                    {completedOrder.customer.name}
                  </span>
                </p>
                <p>
                  <span className="text-stone-400 font-medium">Phone:</span>{" "}
                  <span className="font-semibold">
                    {completedOrder.customer.phone}
                  </span>
                </p>
                <p>
                  <span className="text-stone-400 font-medium">Address:</span>{" "}
                  <span className="font-semibold">
                    {completedOrder.customer.address}
                  </span>
                </p>
                <p className="text-[#D97706] font-bold pt-1">
                  Payment: {completedOrder.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/track")}
              className="inline-flex items-center gap-2 px-7 py-3 bg-white border border-stone-200 hover:border-stone-400 text-stone-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-xs transition-all cursor-pointer"
            >
              <Truck className="w-4 h-4 text-[#D97706]" /> Track Order
            </button>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. EMPTY BASKET VIEW
  if (!cart || cart.length === 0) {
    const emptyContent = (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white border border-stone-200 rounded-3xl p-8 text-center space-y-6 shadow-xs font-sans select-none">
          <div className="w-20 h-20 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mx-auto shadow-xs">
            <ShoppingBag className="w-9 h-9" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-extrabold text-stone-900">
              Your Cart is Empty
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
              Add cold-pressed oils, unpolished rice, raw honey, or millets to
              your cart.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="inline-flex items-center gap-2 px-7 py-3 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs transition-all cursor-pointer"
          >
            Browse Products <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );

    if (isOpen !== undefined) {
      if (!isOpen) return null;
      return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between font-sans">
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <h2 className="font-extrabold text-lg text-stone-900">
                Your Cart
              </h2>
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {emptyContent}
          </div>
        </div>
      );
    }

    return emptyContent;
  }

  // -------------------------------------------------------------
  // 3. STEPPED CART CONTENT LAYOUT
  // -------------------------------------------------------------
  const cartContent = (
    <div className="min-h-screen bg-stone-50 text-stone-900 py-8 px-4 sm:px-6 lg:px-8 font-sans select-none text-left">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Checkout &amp; Cart
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Organic staples dispatched directly from native mills.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>
        </div>

        {/* Multi-Step Indicator */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <div className="grid grid-cols-3 gap-2">
            {[
              { step: 1, title: "1. Cart Items", desc: "Review Items" },
              { step: 2, title: "2. Shipping", desc: "Address & Pin" },
              { step: 3, title: "3. Payment", desc: "Confirm Order" },
            ].map((s) => {
              const isActive = currentStep === s.step;
              const isPast = currentStep > s.step;
              return (
                <div
                  key={s.step}
                  onClick={() => {
                    if (isPast) setCurrentStep(s.step);
                  }}
                  className={`flex flex-col sm:flex-row items-center gap-2 p-2 rounded-xl text-center sm:text-left transition-all ${
                    isPast ? "cursor-pointer hover:bg-stone-50" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isActive
                        ? "bg-[#D97706] text-black"
                        : isPast
                          ? "bg-stone-900 text-white"
                          : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      s.step
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold truncate ${
                        isActive
                          ? "text-stone-900"
                          : isPast
                            ? "text-stone-700"
                            : "text-stone-400"
                      }`}
                    >
                      {s.title}
                    </p>
                    <p className="text-[10px] text-stone-400 hidden sm:block truncate">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {formError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-medium">
            {formError}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 1: REVIEW CART ITEMS & COUPONS */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h2 className="text-base font-bold text-stone-900">
                  Selected Items ({totalCartItems})
                </h2>
                <span className="text-xs text-[#D97706] font-bold font-mono uppercase">
                  Mill Fresh
                </span>
              </div>

              <div className="divide-y divide-stone-100">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-contain p-1 bg-stone-50 border border-stone-200 shrink-0"
                        />
                      )}
                      <div>
                        <h3 className="text-sm font-bold text-stone-900 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-stone-400 font-mono mt-0.5">
                          {item.unit}
                        </p>
                        <span className="text-xs font-bold text-stone-900 mt-1 block">
                          ₹{item.price} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="flex items-center gap-2 border border-stone-200 bg-stone-50 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-stone-900 font-mono">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-mono font-bold text-stone-900 min-w-[70px] text-right">
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

              {/* Coupon Box Inline */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#D97706]" />
                  <h3 className="font-bold text-xs text-stone-900">
                    Have a Coupon Code?
                  </h3>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-[#92400E]">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] bg-[#D97706] text-black px-2 py-0.5 rounded-full font-bold">
                          Applied
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        {appliedCoupon.label} (-₹{couponDiscount})
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="p-1 rounded-full hover:bg-white text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
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
                        className="flex-1 px-4 py-2 text-xs rounded-xl bg-white border border-stone-200 text-stone-900 uppercase tracking-wider font-mono placeholder-stone-400 focus:outline-none focus:border-[#D97706]"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95"
                      >
                        Apply
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-xs text-rose-600 pl-1">
                        {couponError}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] text-stone-400 font-mono">
                      <span>Try:</span>
                      <button
                        type="button"
                        onClick={() => setCouponInput("HARVEST10")}
                        className="underline hover:text-stone-900 cursor-pointer"
                      >
                        HARVEST10
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => setCouponInput("BDAY20")}
                        className="underline hover:text-stone-900 cursor-pointer"
                      >
                        BDAY20
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Step 1 Subtotal Breakdown with Strikethrough Methodology */}
              <div className="pt-2 border-t border-stone-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Market MRP Total:</span>
                  <span className="font-mono line-through text-stone-400">
                    ₹{originalMRP}
                  </span>
                </div>

                <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/70 p-2 rounded-xl border border-emerald-200/60">
                  <span>Mill Direct Harvest Discount:</span>
                  <span className="font-mono">-₹{totalSavings}</span>
                </div>

                <div className="flex justify-between items-center text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Estimated Total:</span>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 line-through font-mono block">
                      ₹{originalMRP}
                    </span>
                    <span className="text-lg font-black font-mono text-stone-950">
                      ₹{finalPayable}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleProceedToShipping}
                className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Proceed to Shipping Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 2: SHIPPING DETAILS & PINCODE CHECK */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="text-base font-bold text-stone-900">
                  Recipient &amp; Delivery Address
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Enter delivery location for door parcel handoff.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#D97706] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#D97706] transition-all"
                  />

                  {/* WhatsApp Update Card */}
                  <div
                    onClick={() => setAllowWhatsApp(!allowWhatsApp)}
                    className={`mt-2.5 p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 select-none ${
                      allowWhatsApp
                        ? "bg-amber-50/60 border-amber-200 shadow-2xs"
                        : "bg-stone-50 border-stone-200 opacity-80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-[#D97706]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900 leading-snug">
                          WhatsApp Updates
                        </p>
                        <p className="text-[10px] text-stone-500">
                          Receive tracking link and dispatch notification on
                          WhatsApp
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        allowWhatsApp
                          ? "bg-[#D97706] border-[#D97706] text-black"
                          : "bg-white border-stone-300"
                      }`}
                    >
                      {allowWhatsApp && (
                        <Check className="w-3 h-3 stroke-[3]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Regional Pincode Checker Component */}
                <PincodeChecker />

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Complete Delivery Address *
                  </label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Door number, street name, landmark, town/city, pincode..."
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer({ ...customer, address: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#D97706] transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Bag
              </button>

              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Continue to Payment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 3: PAYMENT METHOD & STRIKETHROUGH BREAKDOWN EVERYWHERE */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="text-base font-bold text-stone-900">
                  Select Payment Option
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Choose payment mode to finalize your direct mill booking.
                </p>
              </div>

              {/* Delivery Destination Summary Review */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between items-center text-stone-500">
                  <span className="font-bold text-stone-900">Deliver To:</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-[#D97706] hover:underline font-bold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <p className="font-bold text-stone-900">
                  {customer.name} ({customer.phone})
                </p>
                <p className="text-stone-600 line-clamp-2">
                  {customer.address}
                </p>
              </div>

              {/* Payment Select Cards: DYNAMIC COD VISIBILITY */}
              <div
                className={`grid gap-3 ${
                  isCodEnabled !== false
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {/* 1. Cash on Delivery (Controlled by Super Admin) */}
                {isCodEnabled !== false && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-2xl border text-xs font-bold text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === "cod"
                        ? "border-[#D97706] bg-amber-50/70 text-stone-950 shadow-xs"
                        : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#D97706]" />
                    <span>Cash on Delivery</span>
                    <span className="text-[10px] text-stone-500 font-normal">
                      Pay securely at your doorstep
                    </span>
                  </button>
                )}

                {/* 2. Instant Online Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`p-4 rounded-2xl border text-xs font-bold text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === "online"
                      ? "border-[#D97706] bg-amber-50/70 text-stone-950 shadow-xs"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#D97706]" />
                  <span>UPI / Cards / NetBanking</span>
                  <span className="text-[10px] text-stone-500 font-normal">
                    Instant verification via Razorpay
                  </span>
                </button>
              </div>

              {/* Optional Notice when COD is Disabled by Super Admin */}
              {isCodEnabled === false && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-stone-700 text-xs">
                  <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>
                    Cash on Delivery is currently paused for fresh batch
                    dispatch. Please pay securely online via UPI or card.
                  </span>
                </div>
              )}

              {/* Total Summary Breakdown with Guaranteed Strikethrough Methodology */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2.5 text-xs">
                {/* MRP Subtotal with Strikethrough */}
                <div className="flex justify-between items-center text-stone-600">
                  <span>Market MRP Subtotal</span>
                  <span className="font-mono font-bold line-through text-stone-400">
                    ₹{originalMRP}
                  </span>
                </div>

                {/* Negative Discount Deduction Row */}
                <div className="flex justify-between items-center text-[#D97706] font-bold bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      Mill Direct Discount{" "}
                      {appliedCoupon ? `(${appliedCoupon.code})` : ""}
                    </span>
                    <span className="text-[10px] bg-[#D97706] text-black px-1.5 py-0.5 rounded-md font-mono">
                      {appliedCoupon ? "OFFER APPLIED" : "DIRECT HARVEST"}
                    </span>
                  </span>
                  <span className="font-mono text-sm tracking-tight text-emerald-700">
                    - ₹{totalSavings}
                  </span>
                </div>

                {/* Delivery Fee */}
                <div className="flex justify-between text-stone-600">
                  <span>Shipping &amp; Packaging</span>
                  <span className="text-[#D97706] font-bold">
                    Free Delivery
                  </span>
                </div>

                {/* Final Payable with Dual-Price Strikethrough */}
                <div className="flex justify-between items-baseline text-stone-900 pt-3 border-t border-stone-200">
                  <div>
                    <span className="text-sm font-black block">
                      {paymentMethod === "online"
                        ? "Payable Online Now"
                        : "Payable on Delivery"}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold">
                      You save ₹{totalSavings} on this native mill harvest!
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-400 line-through font-mono block">
                      ₹{originalMRP}
                    </span>
                    <span className="text-xl font-black font-mono text-stone-950">
                      ₹{finalPayable}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleFinalSubmit} className="space-y-3">
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-4 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isProcessingPayment && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  <span className="flex items-center gap-2">
                    <span>
                      {paymentMethod === "online"
                        ? "Pay Online Now"
                        : "Confirm & Place Order"}
                    </span>
                    <span className="line-through text-stone-400 font-normal">
                      ₹{originalMRP}
                    </span>
                    <span className="font-black text-amber-400">
                      ₹{finalPayable}
                    </span>
                  </span>
                </button>

                <p className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
                  {paymentMethod === "online"
                    ? "Secured 256-bit encrypted checkout via Razorpay"
                    : "No advance payment required • Inspect parcel on arrival"}
                </p>
              </form>
            </div>

            {/* Step 3 Back Button */}
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Shipping Address
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Modal / Drawer Overlay view
  if (isOpen !== undefined) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-2xs flex justify-end animate-in fade-in duration-200 font-sans">
        <div className="w-full max-w-2xl bg-white min-h-screen shadow-2xl p-6 sm:p-8 relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors shadow-2xs cursor-pointer"
            title="Close Cart"
          >
            <X className="w-5 h-5" />
          </button>
          {cartContent}
        </div>
      </div>
    );
  }

  return cartContent;
}
