import React, { useState } from "react";
import { Check, Copy, X } from "lucide-react";

export default function AnnouncementBar() {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText("HARVEST10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tickerItems = [
    { title: "Mara Chekku", note: "Traditional Wood Pestle Extraction" },
    {
      title: "Complimentary Delivery",
      note: "On all Tamil Nadu orders over ₹499",
    },
    {
      title: "Direct Single-Estate",
      note: "Thanjavur & Tirunelveli Farmlands",
    },
    { title: "Zero Adulteration", note: "100% Unrefined & Chemical-Free" },
    { title: "Small Batch Crushed", note: "Dispatched within 48 Hours" },
  ];

  return (
    <header className="w-full select-none z-50 relative border-b border-black">
      {/* ================= 1. LUXURY EDITORIAL TOP BAR ================= */}
      <div className="w-full bg-[#0a0a0a] text-white py-2 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          {/* Left: Origin Statement */}
          <div className="hidden md:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-stone-300">
              Native Harvest · Autumn 2026 Batch
            </span>
          </div>

          {/* Center: Editorial Hook */}
          <div className="flex-1 text-center">
            <p className="text-[11px] sm:text-xs tracking-[0.18em] uppercase text-stone-200">
              Cold-pressed farm staples{" "}
              <span className="font-serif italic lowercase tracking-normal text-amber-300 text-sm font-normal">
                delivered
              </span>{" "}
              fresh to your pantry
            </p>
          </div>

          {/* Right: Coupon Copy Pill & Dismiss Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="group inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white text-black hover:bg-amber-400 transition-all active:scale-95 cursor-pointer shadow-xs"
              title="Click to copy promo code"
            >
              <span className="text-[9px] font-black tracking-[0.2em] uppercase font-mono">
                {copied ? "COPIED" : "HARVEST10"}
              </span>
              {copied ? (
                <Check size={11} className="stroke-[3] text-black" />
              ) : (
                <Copy
                  size={11}
                  className="text-stone-500 group-hover:text-black transition-colors"
                />
              )}
            </button>

            <button
              onClick={() => setVisible(false)}
              className="text-stone-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Announcement"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= 2. SEAMLESS WHITE TICKER WITH EDGE FADES ================= */}
      <div className="relative w-full bg-white text-black py-2.5 overflow-hidden border-b border-stone-200">
        {/* Soft Left & Right Fade Masks for a High-End Look */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />

        <style>{`
          @keyframes editorial-ticker {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .ticker-strip {
            display: flex;
            width: max-content;
            animation: editorial-ticker 26s linear infinite;
          }
          .ticker-strip:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="ticker-strip items-center">
          {[1, 2].map((loop) => (
            <div
              key={loop}
              className="flex items-center space-x-12 sm:space-x-16 pr-12 sm:pr-16 shrink-0"
            >
              {tickerItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] font-extrabold text-black">
                    {item.title}
                  </span>
                  <span className="text-[11px] sm:text-xs font-serif italic text-stone-500 tracking-normal font-normal">
                    — {item.note}
                  </span>
                  <span className="text-stone-300 font-serif text-xs select-none pl-4">
                    ✦
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
