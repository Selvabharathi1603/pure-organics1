import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";
import { useStore } from "../context/storecontext";

// Image imports matching the double .png.png file names in your folder
import DP1 from "../assets/image/Dp1.png.png";
import DP2 from "../assets/image/Dp2.png.png";
import DP3 from "../assets/image/Dp3.png.png";

const DIET_PILLARS = [
  {
    step: "01",
    tagline: "TRADITIONAL COLD EXTRACTION",
    title: "FORMULATED FOR DAILY SOUTH INDIAN COOKING",
    summary:
      "Wood-pressed in slow Vaagai pestles under 38°C with zero chemical heat. Retains authentic dense aroma for everyday sambar, rasam, and dosa crisping.",
    schedule: "Daily seasoning, hot tiffin frying",
    align: "left",
    filterFn: (p) =>
      p.category?.toLowerCase().includes("oil") ||
      p.name?.toLowerCase().includes("oil"),
  },
  {
    step: "02",
    tagline: "UNPOLISHED ANCESTRAL HARVESTS",
    title: "LOW GLYCEMIC CARE & SLOW-RELEASE STAPLES",
    summary:
      "Unpolished whole grains releasing sustained energy without blood sugar spikes. Pure dietary fiber harvests naturally rich in iron and zinc.",
    schedule: "Replacement for polished rice at lunch",
    align: "right",
    filterFn: (p) =>
      p.category?.toLowerCase().includes("grain") ||
      p.category?.toLowerCase().includes("millet") ||
      p.name?.toLowerCase().includes("rice") ||
      p.name?.toLowerCase().includes("millet"),
  },
  {
    step: "03",
    tagline: "RAW VASCULAR NUTRITION",
    title: "COLD-DECANTED CARDIO & ESSENTIAL LIPIDS",
    summary:
      "Raw cold extractions loaded with active phytosterols and unheated fatty acids to naturally nourish cellular and cardiac vitality.",
    schedule: "1 spoon raw or gentle low-heat sauteing",
    align: "left",
    filterFn: (p) =>
      p.category?.toLowerCase().includes("groceries") ||
      p.name?.toLowerCase().includes("honey") ||
      p.name?.toLowerCase().includes("coconut"),
  },
];

export default function DietPreferences() {
  const { products, addToCart } = useStore();
  const [addedItem, setAddedItem] = useState(null);

  const handleQuickAdd = (product) => {
    addToCart(product);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1400);
  };

  return (
    <section className="relative w-screen -ml-[50vw] left-1/2 right-1/2 m-0 p-0 bg-[#EFE9DD] text-stone-900 pt-28 sm:pt-32 pb-16 sm:pb-24 border-y border-stone-300/80 overflow-x-clip select-none font-editorial">
      {/* =========================================================================
          SCREEN-EDGE BOTANICALS (PINNED DIRECTLY TO BROWSER FRAME BORDERS)
         ========================================================================= */}

      {/* 01: Flush Right Browser Edge */}
      <div className="absolute right-0 top-[20%] translate-x-[20%] pointer-events-none z-10 select-none">
        <img
          src={DP1}
          alt="South Indian Harvest"
          className="w-28 xs:w-36 sm:w-48 md:w-60 lg:w-72 xl:w-80 h-auto object-contain opacity-95 drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
          loading="lazy"
        />
      </div>

      {/* 02: Flush Left Browser Edge */}
      <div className="absolute left-0 top-[50%] -translate-x-[20%] pointer-events-none z-10 select-none">
        <img
          src={DP2}
          alt="Ancestral Grains"
          className="w-32 xs:w-40 sm:w-52 md:w-64 lg:w-76 xl:w-88 h-auto object-contain opacity-100 drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
          loading="lazy"
        />
      </div>

      {/* 03: Flush Right Browser Edge */}
      <div className="absolute right-0 top-[80%] translate-x-[20%] pointer-events-none z-10 select-none">
        <img
          src={DP3}
          alt="Fresh Botanical Foliage"
          className="w-32 xs:w-40 sm:w-52 md:w-64 lg:w-76 xl:w-88 h-auto object-contain opacity-100 drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
          loading="lazy"
        />
      </div>

      {/* =========================================================================
          MAIN EDITORIAL CANVAS
         ========================================================================= */}
      <div className="relative w-full max-w-5xl mx-auto px-6 sm:px-12 md:px-16 z-20">
        {/* SECTION HEADER: CLEARS FLOATING NAVBAR */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#D97706] mb-2 block">
            Healthy Inside, Happy Outside
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
            Shop by Diet &{" "}
            <span className="text-[#D97706] italic">Lifestyle Concern</span>
          </h2>
          <p className="font-editorial italic mt-2 text-xs sm:text-sm text-stone-600 max-w-md sm:max-w-lg mx-auto leading-relaxed">
            Every harvest is crushed fresh in traditional Vaagai wooden pestles,
            delivering honest native staples directly to your kitchen.
          </p>
        </div>

        {/* 3 BALANCED STAGGERED PILLARS (01 LEFT, 02 RIGHT, 03 LEFT) */}
        <div className="space-y-12 sm:space-y-16 md:space-y-20">
          {DIET_PILLARS.map((pillar) => {
            const isRight = pillar.align === "right";
            const categoryProducts = (products || [])
              .filter(pillar.filterFn)
              .slice(0, 2);

            return (
              <div
                key={pillar.step}
                className={`w-full flex ${
                  isRight
                    ? "sm:justify-end sm:text-right text-left"
                    : "sm:justify-start text-left"
                }`}
              >
                {/* Content Block */}
                <div className="w-full sm:max-w-md lg:max-w-lg space-y-2.5">
                  {/* Big Number */}
                  <div className="font-editorial text-6xl sm:text-7xl lg:text-8xl font-light text-[#D97706] leading-none select-none">
                    {pillar.step}
                  </div>

                  {/* Headline */}
                  <div className="font-editorial text-xs sm:text-sm md:text-base font-bold tracking-wide text-stone-900 uppercase">
                    {pillar.title}
                  </div>

                  {/* Narrative Body */}
                  <p className="font-editorial text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                    {pillar.summary}
                  </p>

                  {/* Usage Tag */}
                  <div
                    className={`pt-0.5 flex ${
                      isRight ? "sm:justify-end justify-start" : "justify-start"
                    }`}
                  >
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-stone-700 bg-stone-300/50 px-3 py-1 rounded-full font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                      <span>{pillar.schedule}</span>
                    </div>
                  </div>

                  {/* Horizontal Side-by-Side Micro Products */}
                  {categoryProducts.length > 0 && (
                    <div
                      className={`pt-2 flex flex-col sm:flex-row flex-wrap gap-2.5 ${
                        isRight
                          ? "sm:justify-end justify-start"
                          : "justify-start"
                      }`}
                    >
                      {categoryProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white/95 border border-stone-300/80 rounded-xl p-2 sm:p-2.5 flex items-center justify-between sm:justify-start gap-2.5 shadow-2xs hover:shadow-xs transition-shadow w-full sm:w-auto min-w-[200px]"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-stone-100/70 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain"
                                loading="lazy"
                              />
                            </div>
                            <div className="text-left min-w-[85px] max-w-[120px]">
                              <h4 className="font-editorial font-bold text-xs text-stone-900 truncate">
                                {product.name}
                              </h4>
                              <span className="font-mono text-[10px] sm:text-[11px] font-bold text-stone-700 block">
                                ₹{product.price}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleQuickAdd(product)}
                            disabled={product.inStock === false}
                            className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider font-sans transition-all cursor-pointer shrink-0 ${
                              addedItem === product.id
                                ? "bg-emerald-700 text-white"
                                : "bg-stone-900 hover:bg-[#D97706] text-white hover:text-stone-950"
                            }`}
                          >
                            {addedItem === product.id ? "Added" : "Add"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Shop Direct Link */}
                  <div
                    className={`pt-1 ${
                      isRight ? "sm:text-right text-left" : "text-left"
                    }`}
                  >
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-1.5 font-editorial font-bold text-xs uppercase tracking-wider text-stone-900 hover:text-[#D97706] transition-colors group cursor-pointer"
                    >
                      <span>Explore Staples</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CTA BUTTON */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-stone-900 hover:bg-[#D97706] text-white hover:text-stone-950 text-xs font-bold uppercase tracking-wider font-sans transition-all shadow-2xs hover:shadow-sm cursor-pointer"
          >
            <span>Explore All Cold-Pressed Staples</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
