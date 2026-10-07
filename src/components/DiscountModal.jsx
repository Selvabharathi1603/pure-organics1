import React, { useState, useEffect } from "react";
import { X, Tag, Check, ArrowRight, Loader2 } from "lucide-react";
import { useStore } from "../context/storecontext";
import { API_BASE_URL as CONFIG_URL } from "../config/api";

const BACKUP_HARVEST_IMAGE =
  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=80";

const BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : CONFIG_URL || "https://pure-organics1.onrender.com";

export default function DiscountModal({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}) {
  const store = useStore?.() || {};
  const cms = store.discountConfig || store.cmsData?.discount_modal || {};

  const [internalOpen, setInternalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.removeItem("hasSeenDiscount");
      localStorage.removeItem("discountModalShown");
      sessionStorage.removeItem("hasSeenDiscount");
      sessionStorage.removeItem("discountModalShown");
    } catch {}

    const timer = setTimeout(() => {
      setInternalOpen(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const badge = cms.badge?.trim() ? cms.badge : "First Order Discount";
  const headline = cms.headline?.trim()
    ? cms.headline
    : "Get ₹100 Off Your First Order";
  const subtext = cms.subtext?.trim()
    ? cms.subtext
    : "Enter your phone number to receive your instant welcome discount code.";
  const rawImage =
    cms.image && cms.image.trim() !== "" ? cms.image : BACKUP_HARVEST_IMAGE;

  const [displayImage, setDisplayImage] = useState(rawImage);
  const [formData, setFormData] = useState({
    dob: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    setInternalOpen(false);
    if (externalOnClose) externalOnClose();
  };

  const showModal = internalOpen || Boolean(externalIsOpen);
  if (!showModal) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
          dob: formData.dob || null,
          coupon_code: "HARVEST10",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save lead");
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        handleClose();
      }, 1800);
    } catch (error) {
      console.warn("Lead save note:", error);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        handleClose();
      }, 1800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans select-none text-stone-900"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 z-30 text-stone-500 hover:text-stone-950 text-xs font-bold w-8 h-8 rounded-full bg-white/95 border border-stone-200 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 bg-stone-100 min-h-[180px] md:min-h-[360px] relative overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-stone-200">
          <img
            src={displayImage}
            alt="Welcome Offer"
            onError={() => setDisplayImage(BACKUP_HARVEST_IMAGE)}
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center text-center md:text-left bg-white">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-[#D97706] flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Discount Code Unlocked!
              </h3>
              <p className="text-xs text-stone-600">
                Use code{" "}
                <span className="font-bold text-[#D97706] px-2 py-0.5 bg-amber-50 rounded border border-amber-200">
                  HARVEST10
                </span>{" "}
                at checkout.
              </p>
            </div>
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#D97706] uppercase tracking-wider block mb-1">
                <Tag className="w-3.5 h-3.5" />
                {badge}
              </span>

              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                {headline}
              </h2>

              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                {subtext}
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <div className="text-left">
                  <label
                    htmlFor="phone"
                    className="block text-xs font-bold text-stone-700 mb-1"
                  >
                    Mobile Number *
                  </label>
                  <div className="flex rounded-xl border border-stone-200 focus-within:border-[#D97706] overflow-hidden bg-stone-50">
                    <span className="inline-flex items-center px-3 bg-stone-100 text-stone-700 text-xs font-bold border-r border-stone-200">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 text-xs text-stone-900 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="text-left">
                  <label
                    htmlFor="dob"
                    className="block text-xs font-bold text-stone-700 mb-1"
                  >
                    Date of Birth (Optional)
                  </label>
                  <input
                    id="dob"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#D97706] text-stone-900 bg-stone-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-all shadow-xs cursor-pointer disabled:opacity-60 mt-2 flex items-center justify-center gap-2 active:scale-98"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Applying...</span>
                    </>
                  ) : (
                    <>
                      <span>Claim ₹100 Discount</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
