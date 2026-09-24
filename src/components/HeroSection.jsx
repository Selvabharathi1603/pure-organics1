import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "../context/storecontext";

const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    tag: "100% Native & Chemical-Free",
    title: "Wholesome harvest. Pure nutrition.",
    highlightText: "Pure nutrition.",
    quote:
      "“Zero heat. Zero chemicals. Zero rush. Pure harvest from hands that know the soil.”",
    badge: "Stone-Ground Atta",
    price: "₹349",
    imageUrl:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    tag: "Traditional Vaagai Chekku",
    title: "Cold-pressed oils. Ancient strength.",
    highlightText: "Ancient strength.",
    quote:
      "“Crushed in wooden chekkus below 42°C to lock in native sesamol and unbleached aroma.”",
    badge: "Wood-Pressed Gingelly",
    price: "₹480",
    imageUrl:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    tag: "Ancient Supergrains",
    title: "Unpolished millets. Sustained energy.",
    highlightText: "Sustained energy.",
    quote:
      "“Rich in natural bran and low glycemic index. Reclaimed heirloom grains direct from farm beds.”",
    badge: "Foxtail & Barnyard",
    price: "₹210",
    imageUrl:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    tag: "Grass-Fed Vedic Bilona",
    title: "Golden A2 ghee. Cultured purity.",
    highlightText: "Cultured purity.",
    quote:
      "“Hand-churned from curd using traditional clockwise-anticlockwise bilona wood roasters.”",
    badge: "Native Cow A2 Ghee",
    price: "₹750",
    imageUrl:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function HeroSection() {
  const store = useStore?.() || {};
  const slides =
    store.heroSlides && store.heroSlides.length > 0
      ? store.heroSlides
      : DEFAULT_HERO_SLIDES;

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 500); // 5.5 seconds smooth readable pace
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const slide = slides[current] || slides[0];

  return (
    <section
      className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#f2ece1] via-[#f7f3ec] to-[#e8efe7] border border-[#e2dacf] p-8 sm:p-14 lg:p-16 shadow-[0_20px_50px_rgba(27,59,39,0.06)] transition-all duration-700"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Botanical Sunlight Glow */}
      <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-[480px] h-[480px] bg-[#2e7d4d]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Slide Content */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#cbe1d2] text-[#1b3b27] text-xs font-semibold tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#c58f38]" />
            {slide.tag}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.15] text-[#162a1e] min-h-[70px] sm:min-h-[120px]">
            {slide.title?.replace(slide.highlightText || "", "")}{" "}
            <span className="italic font-serif text-[#2e7d4d] block sm:inline">
              {slide.highlightText}
            </span>
          </h1>

          <p className="text-[#516859] text-sm sm:text-base leading-relaxed max-w-lg font-light min-h-[48px]">
            {slide.quote}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#1b3b27] hover:bg-[#255236] text-white font-bold px-7 py-3.5 rounded-full shadow-[0_6px_20px_rgba(27,59,39,0.22)] hover:shadow-[0_8px_25px_rgba(27,59,39,0.3)] active:scale-95 transition-all duration-300 text-xs uppercase tracking-wider"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 text-[#c58f38]" />
            </Link>
            <Link
              to="/track"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-[#1b3b27] bg-white hover:bg-[#edf5ef] transition-colors border border-[#d2dfd5] text-xs uppercase tracking-wider shadow-xs"
            >
              Track Order
            </Link>
          </div>
        </div>

        {/* Circular Display Image */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-white p-2.5 bg-white shadow-xl">
            <img
              key={slide.id}
              src={slide.imageUrl}
              alt={slide.badge}
              className="w-full h-full object-cover rounded-full transition-all duration-700 hover:scale-105"
            />
            {/* Pill Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border border-[#d7e2da] text-[#162a1e] px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-md flex items-center gap-2">
              <span className="text-[#2e7d4d]">{slide.badge}</span>
              <span className="w-1 h-1 rounded-full bg-[#c58f38]" />
              <span className="text-[#c58f38] font-serif">{slide.price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="mt-8 pt-4 border-t border-[#e2dacf] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrent(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                current === idx
                  ? "w-8 bg-[#1b3b27]"
                  : "w-2.5 bg-[#cfc7ba] hover:bg-[#8e8576]"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
            }
            aria-label="Previous Slide"
            className="p-2 rounded-full bg-white border border-[#dcd4c7] text-[#1b3b27] hover:bg-[#1b3b27] hover:text-white transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
            aria-label="Next Slide"
            className="p-2 rounded-full bg-white border border-[#dcd4c7] text-[#1b3b27] hover:bg-[#1b3b27] hover:text-white transition-all shadow-xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
