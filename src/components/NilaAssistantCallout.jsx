import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import nilaImg from "../assets/image/NILA.png";

const SUGGESTED_QUERIES = [
  "Which oil for daily cooking?",
  "Karuppu Kavuni benefits",
  "Cold-press vs regular oils",
];

export default function NilaAssistantCallout() {
  const handleOpenNilaChat = () => {
    // 1. Dispatch custom event for Nila Assistant
    window.dispatchEvent(new CustomEvent("open-nila-chat"));

    // 2. Fallback to trigger chat trigger button if mounted
    const chatBtn =
      document.querySelector('[aria-label="Open Chat"]') ||
      document.querySelector("#nila-chat-trigger") ||
      document.querySelector(".nila-chat-btn");

    if (chatBtn) {
      chatBtn.click();
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 select-none font-sans">
      <div className="relative rounded-3xl bg-gradient-to-br from-[#231C16] via-[#1A1613] to-[#120F0D] text-stone-100 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-[#D97706]/20">
        {/* Ambient Warm Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#D97706]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-28 w-96 h-96 rounded-full bg-amber-900/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
          {/* ================= LEFT: TEXT & QUESTIONS ================= */}
          <div className="space-y-4 max-w-xl text-center lg:text-left w-full">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#D97706] bg-[#D97706]/10 px-3.5 py-1 rounded-full border border-[#D97706]/25">
              <MessageCircle className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Ask Nila • Product Assistant</span>
            </div>

            <h3
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-stone-100 tracking-tight leading-tight"
            >
              Unsure which native staple suits your family?
            </h3>

            <p className="text-xs sm:text-sm md:text-base text-stone-300 leading-relaxed font-normal">
              Ask Nila for guidance on picking the right cooking oils, preparing
              Karuppu Kavuni rice, or understanding our cold-press process.
            </p>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
              {SUGGESTED_QUERIES.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={handleOpenNilaChat}
                  className="text-[11px] sm:text-xs font-medium px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-stone-300 hover:border-[#D97706]/50 hover:text-amber-200 hover:bg-white/10 active:scale-95 transition-all cursor-pointer text-left"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* ================= RIGHT: BIG NILA CHARACTER + ACTION BUTTONS ================= */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 w-full lg:w-auto shrink-0 mt-4 lg:mt-0">
            {/* BIG NILA CHARACTER */}
            <div className="relative flex items-center justify-center shrink-0">
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
                <img
                  src={nilaImg}
                  alt="Nila Assistant"
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] transform transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Online Indicator Badge */}
              <span className="absolute bottom-2 right-4 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#1A1613]" />
              </span>
            </div>

            {/* Buttons Stack */}
            <div className="flex flex-col gap-3 w-full sm:w-48 md:w-52 shrink-0">
              <button
                type="button"
                onClick={handleOpenNilaChat}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#D97706] hover:bg-[#B45309] text-stone-950 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>Chat With Nila</span>
              </button>

              <Link
                to="/shop"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-stone-200 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer text-center"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
