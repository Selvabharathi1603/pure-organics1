import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Asset imports
import img1 from "../assets/image/img1.jpeg"; // Stage 04: Glass Bottles
import img2 from "../assets/image/img2.jpeg"; // Stage 03: Settling Tanks
import img3 from "../assets/image/img3.jpeg"; // Stage 01: Sun Drying
import img4 from "../assets/image/img4.png"; // Stage 02: Wood Press

const CRAFT_STAGES = [
  {
    step: "01",
    title: "Sun Drying",
    tag: "Native Harvest",
    image: img3,
    // Outer-left card rests lower
    archClass: "translate-y-4 sm:translate-y-8 md:translate-y-12",
  },
  {
    step: "02",
    title: "Vaagai Press",
    tag: "Sub-38°C Cold",
    image: img4,
    // Mid-left card arches higher
    archClass: "-translate-y-2 sm:-translate-y-4 md:-translate-y-4",
  },
  {
    step: "03",
    title: "Settling Tanks",
    tag: "4 Days Rest",
    image: img2,
    // Mid-right card arches higher
    archClass: "-translate-y-2 sm:-translate-y-4 md:-translate-y-4",
  },
  {
    step: "04",
    title: "Glass Bottling",
    tag: "Fresh Batch",
    image: img1,
    // Outer-right card rests lower
    archClass: "translate-y-4 sm:translate-y-8 md:translate-y-12",
  },
];

export default function MillHeritage() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#FAF9F5] border-y border-stone-200 pt-16 sm:pt-24 md:pt-28 pb-16 sm:pb-24 md:pb-28 overflow-hidden select-none font-sans"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. STATIONARY 4-CARD CANOPY ARCH */}
        <div className="w-full flex justify-center pb-8 sm:pb-12 md:pb-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6 lg:gap-7 w-full max-w-5xl items-center justify-items-center">
            {CRAFT_STAGES.map((card, idx) => (
              <div
                key={idx}
                className={`relative w-full max-w-[240px] h-64 sm:h-80 md:h-92 lg:h-[400px] rounded-[1.8rem] sm:rounded-[2.4rem] md:rounded-[2.8rem] overflow-hidden shadow-lg border border-stone-200/90 bg-stone-100 group transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-2xl cursor-pointer ${card.archClass}`}
              >
                {/* 100% Full Visibility Image */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Bottom Contrast Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />

                {/* Floating Craft Stage Label */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 text-left text-white flex flex-col justify-end gap-1">
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold block">
                      Stage {card.step}
                    </span>
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono text-stone-200 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
                      {card.tag}
                    </span>
                  </div>

                  <h3
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white tracking-tight leading-snug"
                  >
                    {card.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. CENTERED HEADLINE & EXPLORE BUTTON */}
        <div
          className={`max-w-2xl mx-auto text-center flex flex-col items-center px-4 mt-2 sm:mt-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-95"
          }`}
        >
          <h2
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-stone-950 tracking-tight leading-[1.15]"
          >
            Explore Our Mill{" "}
            <span className="text-[#D97706] italic font-normal">Heritage.</span>
          </h2>

          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-stone-600 max-w-sm sm:max-w-md font-normal leading-relaxed">
            Every harvest begins with traditional stone sun-drying and ends with
            cold Vaagai wood pressing below 38°C.
          </p>

          <div className="mt-6 sm:mt-8">
            <Link
              to="/shop?cat=oils"
              className="relative inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-stone-900 hover:bg-[#D97706] text-white hover:text-stone-950 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-amber-500/25 cursor-pointer ring-4 ring-amber-500/10 hover:ring-amber-500/25"
            >
              <span>Explore Mara Chekku Oils</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover:text-stone-950" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
