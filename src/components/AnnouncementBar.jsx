import React, { useState } from "react";
import { Check, Copy, X, Sparkles } from "lucide-react";

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
    <header className="w-full select-none z-50 relative border-b border-stone-200/80 font-sans">
      {/* ================= 1. REFINED EDITORIAL TOP BAR (Deep Espresso) ================= */}
      <div className="relative w-full bg-gradient-to-r from-[#171310] via-[#1E1914] to-[#171310] text-stone-200 py-2 sm:py-2.5 px-3 sm:px-6 md:px-8 border-b border-[#D97706]/20 overflow-hidden">
        {/* Subtle Ambient Amber Glow */}
        <div className="pointer-events-none absolute -top-8 left-1/3 w-96 h-10 bg-[#D97706]/15 blur-2xl" />

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          {/* Left: Origin Statement */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase font-bold text-amber-200/90">
              Native Harvest · Autumn 2026 Batch
            </span>
          </div>

          {/* Center: Editorial Hook */}
          <div className="flex-1 text-center">
            <p className="text-[11px] sm:text-xs tracking-[0.16em] uppercase text-stone-200 font-medium">
              Cold-pressed farm staples{" "}
              <span
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                className="italic lowercase tracking-normal text-amber-300 text-sm sm:text-base font-normal px-0.5"
              >
                delivered
              </span>{" "}
              fresh to your pantry
            </p>
          </div>

          {/* Right: Coupon Copy Pill & Dismiss Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handleCopy}
              className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97706] text-stone-950 hover:bg-[#b45309] hover:text-white transition-all active:scale-95 cursor-pointer shadow-xs"
              title="Click to copy promo code"
            >
              <span className="text-[9px] font-black tracking-[0.18em] uppercase font-mono">
                {copied ? "COPIED" : "HARVEST10"}
              </span>
              {copied ? (
                <Check size={11} className="stroke-[3]" />
              ) : (
                <Copy
                  size={11}
                  className="text-stone-900 group-hover:text-white transition-colors"
                />
              )}
            </button>

            <button
              onClick={() => setVisible(false)}
              className="text-stone-400 hover:text-white transition-colors cursor-pointer p-0.5"
              aria-label="Close Announcement"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= 2. SEAMLESS WARM LINEN TICKER WITH EDGE FADES ================= */}
      <div className="relative w-full bg-[#FAF9F5] text-stone-800 py-2.5 overflow-hidden">
        {/* Soft Left & Right Fade Masks for Smooth In/Out Appearance */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[#FAF9F5] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[#FAF9F5] to-transparent z-10" />

        <style>{`
          @keyframes editorial-ticker {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .ticker-strip {
            display: flex;
            width: max-content;
            animation: editorial-ticker 28s linear infinite;
          }
          .ticker-strip:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="ticker-strip items-center">
          {[1, 2].map((loop) => (
            <div
              key={loop}
              className="flex items-center space-x-10 sm:space-x-14 pr-10 sm:pr-14 shrink-0"
            >
              {tickerItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-extrabold text-stone-900">
                    {item.title}
                  </span>
                  <span
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    className="text-xs sm:text-sm italic text-stone-600 tracking-normal font-normal"
                  >
                    — {item.note}
                  </span>
                  <span className="text-[#D97706]/70 font-serif text-xs select-none pl-3">
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
