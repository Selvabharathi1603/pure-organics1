import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// Grounded, natural mill descriptions — zero AI buzzwords
const CRAFT_STAGES = [
  {
    step: "01",
    name: "Sun Drying in Stone Yards",
    timeframe: "2–3 Days",
    summary:
      "Dry copra, sesame seeds, and groundnuts are laid out under open sunlight on clean stone yards. We never use smoke, sulphur, or hot-air dryers.",
    detail: "100% naturally dried with sunlight only.",
  },
  {
    step: "02",
    name: "Pure Vaagai Marachekku Pressing",
    timeframe: "Slow Wood Grinding",
    summary:
      "Seeds are gently crushed using heavy wooden pestles made from native Vaagai trees. Slow turning keeps the oil completely cold.",
    detail: "Real cold press with zero heat and no machine boilers.",
  },
  {
    step: "03",
    name: "Natural Settling in Tanks",
    timeframe: "4 Days Resting",
    summary:
      "Fresh oil is left undisturbed in clean stainless steel containers. Heavy seed particles settle to the bottom on their own.",
    detail: "No chemical bleaching, no acid wash, and unfiltered.",
  },
  {
    step: "04",
    name: "Direct Glass Bottle Packing",
    timeframe: "Packed Fresh",
    summary:
      "Clean oil is poured straight into strong glass bottles so the natural taste and raw aroma stay fresh until it reaches your kitchen.",
    detail: "Safe glass bottles with zero plastic smell.",
  },
];

export default function MillHeritage() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#D97706] border-y border-[#B45309] py-10 sm:py-14 px-4 sm:px-8 lg:px-14 overflow-hidden select-none m-0">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-black/15 pb-6">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-widest font-extrabold text-black bg-black/10 px-3 py-1 rounded-full inline-block">
              Traditional Farm Mill Method
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black leading-tight">
              Why You Can Trust Us <span className="text-white">Blindly.</span>
            </h2>
            <p className="text-sm sm:text-base text-black/85 font-medium leading-relaxed">
              Factory oils are boiled at extreme heat and treated with harsh
              chemicals. We do it the old-fashioned village way—using seasoned
              Vaagai wood, patient settling, and honest ingredients.
            </p>
          </div>

          <div className="bg-white rounded-xl px-5 py-3 border border-black/10 shrink-0 self-start sm:self-auto text-left shadow-xs">
            <span className="text-sm font-extrabold text-black block">
              Ambasamudram Wood Mill
            </span>
            <span className="text-[11px] font-mono text-stone-600 block mt-0.5">
              Government FSSAI Approved
            </span>
          </div>
        </div>

        {/* 4 Balanced Stage Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CRAFT_STAGES.map((stage, idx) => {
            const isSelected = activeStage === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStage(idx)}
                className={`rounded-2xl p-5 transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border ${
                  isSelected
                    ? "bg-black text-white border-black shadow-lg -translate-y-1"
                    : "bg-white text-stone-900 border-black/10 hover:bg-[#FEF3C7] hover:border-[#F59E0B] shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-[#D97706] text-black"
                          : "bg-black/10 text-black"
                      }`}
                    >
                      STEP {stage.step}
                    </span>
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        isSelected ? "text-[#FCD34D]" : "text-stone-500"
                      }`}
                    >
                      {stage.timeframe}
                    </span>
                  </div>

                  <h3
                    className={`font-bold text-base leading-snug mb-2 ${
                      isSelected ? "text-white" : "text-black"
                    }`}
                  >
                    {stage.name}
                  </h3>

                  <p
                    className={`text-xs sm:text-[13px] leading-relaxed ${
                      isSelected ? "text-stone-300" : "text-stone-700"
                    }`}
                  >
                    {stage.summary}
                  </p>
                </div>

                <div
                  className={`mt-4 pt-3 border-t flex items-center gap-2 text-xs font-semibold ${
                    isSelected
                      ? "border-white/15 text-[#FCD34D]"
                      : "border-black/10 text-black"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{stage.detail}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="pt-4 border-t border-black/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <p className="text-xs sm:text-sm text-black font-semibold">
            Fresh batch prepared every Monday and Thursday in limited 200-liter
            quantities.
          </p>

          <Link
            to="/catalog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-black hover:bg-stone-900 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>View Wood-Pressed Oils</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>
    </section>
  );
}
