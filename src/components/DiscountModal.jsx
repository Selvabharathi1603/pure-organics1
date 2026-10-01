import React, { useState, useEffect } from "react";
import { useStore } from "../context/storecontext";
import { API_BASE_URL } from "../config/api";

const BACKUP_HARVEST_IMAGE =
  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=80";

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

  const badge = cms.badge?.trim() ? cms.badge : "New Harvest Welcome";
  const headline = cms.headline?.trim()
    ? cms.headline
    : "Unlock ₹100 off on your first order";
  const subtext = cms.subtext?.trim()
    ? cms.subtext
    : "Share your birth date to receive seasonal birthday harvest surprises 🌱";
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
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
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
      }, 1500);
    } catch (error) {
      console.error("Lead submission error:", error);
      alert("Could not save details. Please verify your backend is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-xs font-sans"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-brand-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-30 text-brand-dark hover:text-black text-sm font-bold w-8 h-8 rounded-full bg-white border border-brand-border flex items-center justify-center transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Left Side: Photo */}
        <div className="w-full md:w-1/2 bg-brand-bg min-h-[200px] md:min-h-[340px] relative overflow-hidden flex items-center justify-center">
          <img
            src={displayImage}
            alt="Organic Harvest Offer"
            onError={() => setDisplayImage(BACKUP_HARVEST_IMAGE)}
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center text-center md:text-left bg-white">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <span className="text-3xl">🌱</span>
              <h3 className="text-base font-bold text-brand-dark">
                Welcome to the Family!
              </h3>
              <p className="text-xs text-brand-subtext">
                Use code <strong>HARVEST10</strong> at checkout.
              </p>
            </div>
          ) : (
            <>
              <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest block mb-1">
                {badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-dark leading-tight">
                {headline}
              </h2>
              <p className="text-xs text-brand-subtext mt-1">{subtext}</p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <div>
                  <label
                    htmlFor="dob"
                    className="block text-left text-[11px] font-medium text-brand-dark mb-1"
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
                    className="w-full px-3 py-2 text-xs border border-brand-border rounded-lg focus:outline-none focus:border-brand-dark text-brand-dark bg-brand-bg"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-left text-[11px] font-medium text-brand-dark mb-1"
                  >
                    Phone Number
                  </label>
                  <div className="flex rounded-lg border border-brand-border focus-within:border-brand-dark overflow-hidden bg-brand-bg">
                    <span className="inline-flex items-center px-3 bg-white text-brand-dark text-xs font-medium border-r border-brand-border">
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
                      className="w-full px-3 py-2 text-xs focus:outline-none text-brand-dark bg-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-brand-dark hover:bg-brand-green text-white text-xs font-bold rounded-full tracking-wider uppercase transition-colors shadow-sm cursor-pointer disabled:opacity-60 mt-2"
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
