import React, { useState } from "react";
import { useStore } from "../context/storecontext";

export default function DiscountModal({ isOpen, onClose }) {
  const store = useStore?.() || {};
  const discountConfig = store.discountConfig || {
    badge: "New Harvest Welcome",
    headline: "Unlock ₹100 off on your first order",
    subtext:
      "Share your birth date to receive seasonal birthday harvest surprises 🌱",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
  };

  const [formData, setFormData] = useState({
    dob: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct call to your server.js POST /api/leads endpoint
      const response = await fetch("http://localhost:5000/api/leads", {
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
      // Close modal after showing success message
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Lead submission error:", error);
      alert("Could not save details. Please make sure the server is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#162a1e]/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#e8e2d5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 text-stone-400 hover:text-stone-800 text-lg font-bold p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Left Side: Editorial Image */}
        <div className="w-full md:w-1/2 bg-[#faf7f2] min-h-[220px] md:min-h-full flex items-center justify-center overflow-hidden">
          <img
            src={discountConfig.image}
            alt="Organic Harvest Offer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center text-center md:text-left">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <span className="text-3xl">🌱</span>
              <h3 className="font-serif text-lg font-bold text-[#1b3b27]">
                Welcome to the Family!
              </h3>
              <p className="text-xs text-[#5c7365]">
                Use code <strong>HARVEST10</strong> at checkout.
              </p>
            </div>
          ) : (
            <>
              <span className="text-[10px] font-bold text-[#2e7d4d] uppercase tracking-widest block mb-1">
                {discountConfig.badge}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#162a1e] leading-tight">
                {discountConfig.headline}
              </h2>
              <p className="text-xs text-[#5c7365] mt-2">
                {discountConfig.subtext}
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <div>
                  <label
                    htmlFor="dob"
                    className="block text-left text-[11px] font-medium text-stone-600 mb-1"
                  >
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 text-xs border border-[#dcd4c7] rounded-xl focus:outline-none focus:border-[#2e7d4d] text-stone-700 bg-[#faf7f2]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-left text-[11px] font-medium text-stone-600 mb-1"
                  >
                    Phone Number
                  </label>
                  <div className="flex rounded-xl border border-[#dcd4c7] focus-within:border-[#2e7d4d] overflow-hidden bg-[#faf7f2]">
                    <span className="inline-flex items-center px-3 bg-[#eee8dd] text-stone-600 text-xs font-medium border-r border-[#dcd4c7]">
                      IN +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      placeholder="Enter 10-digit Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-xs focus:outline-none text-stone-800 bg-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-colors shadow-md cursor-pointer disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Claim Harvest Discount"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
