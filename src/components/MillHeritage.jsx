import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sun,
  ShieldCheck,
  ArrowRight,
  Award,
  Sparkles,
  Droplet,
  Compass,
} from "lucide-react";

const CRAFT_STAGES = [
  {
    step: "01",
    name: "Sun-Cured Botanical Harvest",
    timeframe: "48–72h Solar Drying",
    summary:
      "Native sulphur-free copra, black sesame, and drought-hardy groundnuts are cured on open stone yards under natural coastal sunlight.",
    detail: "Zero synthetic kiln drying or sulfur bleaching fumes.",
  },
  {
    step: "02",
    name: "Sub-42°C Vaagai Hardwood Crushing",
    timeframe: "14–16 RPM Slow Torque",
    summary:
      "Heavy mortar and pestles carved from native Albizia Lebbek timber gently express oil without conductive heat transfer.",
    detail: "Living enzymes, raw tocopherols & plant lipids stay intact.",
  },
  {
    step: "03",
    name: "Natural Gravity Sediment Clarification",
    timeframe: "5-Day Stainless Vat Rest",
    summary:
      "Freshly pressed oils rest undisturbed in food-grade steel vats. Natural earth gravity settles dense botanical fibers without industrial centrifuge forces.",
    detail: "Never bleached with acid clay or stripped of fragrance.",
  },
  {
    step: "04",
    name: "UV-Shielded Amber Glass Bottling",
    timeframe: "Sealed Within 24h",
    summary:
      "Bottled strictly in pharmaceutical-grade amber glassware to protect delicate polyphenols from light-induced oxidation.",
    detail: "100% microplastic-free from mill to pantry.",
  },
];

export default function MillHeritage() {
  const [activeStage, setActiveStage] = useState(1);

  return (
    <section className="relative w-full rounded-[2.5rem] bg-[#eef6f0] border border-[#cbe3d0] overflow-hidden p-6 sm:p-10 lg:p-14 text-[#162a1e] shadow-[0_8px_30px_rgba(27,59,39,0.05)]">
      {/* Soft Ambient Light Glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#d9edd9] rounded-full blur-[100px] pointer-events-none opacity-80" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#f9eed7]/50 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 space-y-10">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#c8decb] pb-8">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#b8dabf] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c58f38] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] font-bold text-[#1b3b27]">
                Single-Estate Extraction Standard
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-[#162a1e] leading-[1.1]">
              Wood, Time & Gravity.{" "}
              <span className="block font-normal italic text-[#2e7d4d]">
                Nothing More.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-[#46604e] leading-relaxed max-w-xl font-normal">
              Commercial refined oils are heat-stripped at 200°C and
              solvent-extracted with hexane. At our riverbed facility, we
              preserve living nutrition using cold Vaagai wood friction and
              patient sunlight settling.
            </p>
          </div>

          {/* Quick Estate Badge */}
          <div className="bg-white/90 border border-[#bedac2] rounded-3xl p-5 flex items-center gap-4 shrink-0 shadow-xs self-start lg:self-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#edf5ef] border border-[#a8d3b2] text-[#1b3b27] flex items-center justify-center shadow-2xs">
              <Award className="w-6 h-6 stroke-[2.2] text-[#2e7d4d]" />
            </div>
            <div className="text-left text-xs">
              <span className="font-serif font-bold text-sm text-[#162a1e] block">
                Ambasamudram Estate
              </span>
              <span className="text-[11px] font-mono text-[#52745a] block mt-0.5">
                Central FSSAI Reg. 12423008000412
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Light Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
          {/* Left Feature Card: Light Sage Glassmorphism Telemetry */}
          <div className="lg:col-span-5 bg-white/95 rounded-3xl p-7 sm:p-8 flex flex-col justify-between border border-[#bedac2] shadow-sm relative overflow-hidden text-left">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#e1eee3] pb-4">
                <span className="text-[10px] uppercase font-mono tracking-[0.22em] text-[#8a5b20] bg-[#fbf5e8] border border-[#ebd8b7] px-2.5 py-0.5 rounded-full font-bold">
                  Mill Telemetry • Batch #24
                </span>
                <span className="text-[10px] font-mono font-bold text-[#2e7d4d] bg-[#eef7f0] border border-[#c5e4cd] px-2.5 py-0.5 rounded-full">
                  ● Certified Sub-42°C
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-[#55765f] uppercase tracking-wider font-mono font-semibold">
                  Current Cold Mortar Temperature
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-5xl sm:text-6xl font-normal text-[#162a1e] tracking-tight">
                    38.4°
                  </span>
                  <span className="text-2xl font-serif text-[#2e7d4d]">C</span>
                  <span className="text-[10px] font-mono text-emerald-800 ml-2 bg-[#dcfce7] border border-[#bbf7d0] px-2 py-0.5 rounded font-bold">
                    PRESERVES ENZYMES
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e5efe7]">
                <div className="p-3.5 rounded-2xl bg-[#f4faf5] border border-[#d6ecda]">
                  <span className="text-[9px] uppercase tracking-wider text-[#63846e] font-mono font-bold block">
                    Rotational Pace
                  </span>
                  <p className="font-serif text-2xl font-bold text-[#162a1e] mt-0.5">
                    14 RPM
                  </p>
                  <span className="text-[10px] text-[#4f6f57] block mt-0.5">
                    Zero friction heat
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f4faf5] border border-[#d6ecda]">
                  <span className="text-[9px] uppercase tracking-wider text-[#63846e] font-mono font-bold block">
                    Mortar Timber
                  </span>
                  <p className="font-serif text-2xl font-bold text-[#162a1e] mt-0.5">
                    Vaagai Wood
                  </p>
                  <span className="text-[10px] text-[#4f6f57] block mt-0.5">
                    Albizia Lebbek
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Guarantee Banner */}
            <div className="pt-6">
              <div className="bg-[#edf6f0] rounded-2xl p-4 border border-[#c5e1cb] flex items-center gap-3">
                <Droplet className="w-5 h-5 text-[#2e7d4d] shrink-0" />
                <span className="text-xs text-[#284832] font-serif italic">
                  "Zero chemical gumming, zero hexane solvents, and zero acid
                  bleaching clay."
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Light Process Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
            {CRAFT_STAGES.map((stage, idx) => {
              const isSelected = activeStage === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStage(idx)}
                  className={`rounded-2xl p-5 border transition-all duration-300 text-left cursor-pointer ${
                    isSelected
                      ? "bg-white border-[#2e7d4d] shadow-sm -translate-y-0.5"
                      : "bg-white/80 border-[#cbe1d0] hover:bg-white hover:border-[#a3caa9]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isSelected
                            ? "bg-[#1b3b27] text-white"
                            : "bg-[#edf5ef] text-[#2e7d4d] border border-[#cbe1d2]"
                        }`}
                      >
                        STAGE {stage.step}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#162a1e]">
                        {stage.name}
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-[#8a5b20] font-semibold">
                      {stage.timeframe}
                    </span>
                  </div>

                  <p className="text-xs text-[#486350] mt-2 leading-relaxed">
                    {stage.summary}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-[#edf4ee] flex items-center gap-2 text-[11px] font-semibold text-[#1b3b27]">
                    <span className="text-[#c58f38]">✦</span>
                    <span>{stage.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-6 border-t border-[#c8decb] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-[#3d5945]">
            <Sparkles className="w-4 h-4 text-[#c58f38]" />
            <span>
              Milled exclusively in limited batches under 200 Litres twice
              weekly.
            </span>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#1b3b27] hover:bg-[#285739] text-white text-xs font-bold uppercase tracking-[0.16em] transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <span>Explore Wood-Chekku Harvest</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#fbbf24]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
