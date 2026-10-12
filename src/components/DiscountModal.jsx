import React, { useState, useEffect, useRef } from "react";
import { X, Check, Loader2, ArrowRight } from "lucide-react";
import { useStore } from "../context/storecontext";
import { API_BASE_URL as CONFIG_URL } from "../config/api";

// Assets matching the exact filenames in your explorer
import DM_BG from "../assets/image/DM.jpg";
import GOLD_TEXTURE from "../assets/image/gold texture Scratch.jpeg";

const BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : CONFIG_URL || "https://pure-organics1.onrender.com";

export default function DiscountModal({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}) {
  const store = useStore?.() || {};
  const [internalOpen, setInternalOpen] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [showPhoneStep, setShowPhoneStep] = useState(false);
  const [copied, setCopied] = useState(false);

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    try {
      localStorage.removeItem("hasSeenDiscount");
      localStorage.removeItem("discountModalShown");
      sessionStorage.removeItem("hasSeenDiscount");
      sessionStorage.removeItem("discountModalShown");
    } catch {}

    const timer = setTimeout(() => {
      setInternalOpen(true);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setInternalOpen(false);
    if (externalOnClose) externalOnClose();
  };

  const showModal = internalOpen || Boolean(externalIsOpen);

  // Initialize and paint scratch card canvas
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    const img = new Image();
    img.src = GOLD_TEXTURE;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.font = "bold 13px 'Editorial New', serif";
      ctx.fillStyle = "#2D1D03";
      ctx.textAlign = "center";
      ctx.letterSpacing = "2px";
      ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2 + 5);
    };
    img.onerror = () => {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#D4AF37");
      grad.addColorStop(0.5, "#F3E5AB");
      grad.addColorStop(1, "#AA771C");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "bold 13px 'Editorial New', serif";
      ctx.fillStyle = "#3E2723";
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2 + 5);
    };
  };

  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(initCanvas, 220);

    // Re-adjust canvas dimensions on screen resize / orientation change
    window.addEventListener("resize", initCanvas);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", initCanvas);
    };
  }, [showModal]);

  // Scratch Action Mechanics
  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    checkProgress(ctx, canvas.width, canvas.height);
  };

  const checkProgress = (ctx, w, h) => {
    try {
      const imageData = ctx.getImageData(0, 0, w, h);
      const pixels = imageData.data;
      let transparentPixels = 0;

      for (let i = 3; i < pixels.length; i += 32) {
        if (pixels[i] === 0) transparentPixels++;
      }

      const totalChecked = pixels.length / 32;
      const percent = Math.round((transparentPixels / totalChecked) * 100);
      setScratchProgress(percent);

      if (percent > 35 && !isScratched) {
        setIsScratched(true);
        ctx.clearRect(0, 0, w, h);
      }
    } catch {}
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleTouchStart = (e) => {
    isDrawing.current = true;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDrawing.current) return;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);

    try {
      await fetch(`${BASE_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone,
          coupon_code: "HARVEST15",
        }),
      });
    } catch (err) {
      console.warn("Lead save note:", err);
    } finally {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const copyCoupon = () => {
    navigator.clipboard.writeText("HARVEST15");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6 md:p-8 bg-black/65 backdrop-blur-xs select-none font-editorial overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg md:max-w-4xl bg-[#FBF9F5] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-stone-300 max-h-[92vh] md:max-h-[540px] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 text-stone-700 hover:text-black w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 border border-stone-300 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: BRANDING & SCRATCH CARD (Full width on mobile, 45% on desktop) */}
        <div className="w-full md:w-[45%] p-5 sm:p-7 md:p-8 flex flex-col justify-between text-center relative z-20 bg-[#FBF9F5] order-2 md:order-1 overflow-y-auto">
          {/* Header */}
          <div className="space-y-1 sm:space-y-2 pt-1">
            <span className="font-editorial italic text-xl sm:text-2xl text-stone-900 tracking-wide block">
              Pure Organics
            </span>
            <div className="w-7 h-[1px] bg-stone-300 mx-auto" />
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight leading-tight">
              Try your luck
            </h2>
            <p className="font-editorial text-[11px] sm:text-xs text-stone-600">
              Scratch below to see what you win
            </p>
          </div>

          {/* Scratch Card Frame */}
          <div className="my-3.5 sm:my-5 relative w-full aspect-[2.1/1] max-w-[260px] sm:max-w-[280px] mx-auto rounded-xl sm:rounded-2xl overflow-hidden border border-amber-300/80 shadow-md">
            {/* Prize Revealed Underneath */}
            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-2.5 text-center">
              <span className="font-editorial text-[9px] sm:text-[10px] uppercase tracking-widest text-[#D97706] font-bold">
                CONGRATULATIONS
              </span>
              <div className="font-editorial text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                You've Got 15% Off
              </div>
              <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-stone-800 text-[10px] sm:text-[11px] font-editorial font-bold">
                <span>Code:</span>
                <span className="text-[#D97706]">HARVEST15</span>
              </div>
            </div>

            {/* Interactive Canvas Surface */}
            {!isScratched && (
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                style={{ touchAction: "none" }}
                className="absolute inset-0 w-full h-full cursor-pointer z-10"
              />
            )}
          </div>

          {/* Action Buttons & Form */}
          <div className="space-y-2 pb-1">
            {!showPhoneStep ? (
              <button
                type="button"
                onClick={() => {
                  if (!isScratched) {
                    setIsScratched(true);
                  }
                  setShowPhoneStep(true);
                }}
                className="w-full max-w-[260px] sm:max-w-[280px] mx-auto py-2.5 sm:py-3 px-4 rounded-full bg-[#3B5466] hover:bg-[#2C3F4D] text-white text-[11px] sm:text-xs font-editorial font-bold uppercase tracking-widest transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>CLAIM</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : submitted ? (
              <div className="p-2.5 sm:p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-editorial font-medium flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Code copied & sent to mobile!</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-2 max-w-[260px] sm:max-w-[280px] mx-auto"
              >
                <div className="flex rounded-xl border border-stone-300 focus-within:border-[#D97706] overflow-hidden bg-white shadow-2xs">
                  <span className="inline-flex items-center px-2.5 bg-stone-100 text-stone-700 text-xs font-editorial font-bold border-r border-stone-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="Enter 10-digit mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 sm:py-2 text-xs text-stone-900 bg-transparent focus:outline-none font-editorial"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 px-3 bg-[#3B5466] hover:bg-[#2C3F4D] text-white text-[10px] sm:text-[11px] font-editorial font-bold rounded-lg uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Apply Discount</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={copyCoupon}
                    className="py-2 px-3 bg-stone-200 hover:bg-stone-300 text-stone-800 text-[10px] sm:text-[11px] font-editorial font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </form>
            )}

            <p className="font-editorial text-[9px] sm:text-[10px] text-stone-500">
              *Applies to cold-pressed mara chekku staples & native harvests
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: LIFESTYLE IMAGE (DM.jpg) */}
        <div className="w-full md:w-[55%] h-44 xs:h-52 sm:h-64 md:h-auto min-h-[170px] relative overflow-hidden bg-stone-100 border-b md:border-b-0 md:border-l border-stone-300 order-1 md:order-2">
          <img
            src={DM_BG}
            alt="Organic Dining Lifestyle"
            className="w-full h-full object-cover absolute inset-0"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
