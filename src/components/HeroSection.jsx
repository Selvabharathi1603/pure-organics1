import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const BESTSELLER_SLIDES = [
  {
    id: 1,
    tag: "BESTSELLER #1 • COLD-PRESSED",
    title: "Pure Virgin",
    titleHighlight: "Coconut Oil",
    quote:
      "Extracted gently from fresh coastal coconut milk in native wooden chekkus below 42°C. Packed with unrefined lauric immunity lipids and zero chemicals.",
    unit: "500 ml Glass Jar",
    price: "₹310",
    originalPrice: "₹620",
    rating: "4.9",
    reviews: "1,420+",
    accentGlow: "from-[#dcfce7]/70 to-[#fef3c7]/60",
    imageUrl:
      "https://media.istockphoto.com/id/1484936410/photo/bottle-of-coconut-cooking-oil-and-fruit-on-white-background.jpg?s=612x612&w=0&k=20&c=ATsKubzVwWMQXwVkb93qrXatLac7HFJTIx8f1ng216w=",
    perks: [
      "Zero Sulphur Treated",
      "Rich in Lauric Fatty Acids",
      "Raw Cold Extracted",
    ],
  },
  {
    id: 2,
    tag: "BESTSELLER #2 • HERITAGE DETOX GRAIN",
    title: "Heritage Black Rice",
    titleHighlight: "(Karuppu Kavuni)",
    quote:
      "Cherished ancient royal grain rich in natural anthocyanin antioxidants, low glycemic index, and sustained whole-day clean stamina.",
    unit: "1 kg Eco Pack",
    price: "₹195",
    originalPrice: "₹390",
    rating: "4.9",
    reviews: "980+",
    accentGlow: "from-[#ede9fe]/70 to-[#dcfce7]/60",
    imageUrl:
      "https://media.istockphoto.com/id/1434453597/photo/close-up-of-black-rice-in-the-field.jpg?s=612x612&w=0&k=20&c=D6LdUQKJGL4AxLEcmpQvUBPn-qXuRajxZj1corlFP6k=",
    perks: [
      "Antioxidant Superfood",
      "100% Whole Bran Intact",
      "Zero Synthetic Fertilizers",
    ],
  },
  {
    id: 3,
    tag: "BESTSELLER #3 • UNREFINED NECTAR",
    title: "Traditional Palm",
    titleHighlight: "Jaggery (Karupatti)",
    quote:
      "Clarified naturally with organic herbal extracts without calcium carbonate or bleaching agents. Rich in bio-active plant iron and natural calcium.",
    unit: "500g Native Block",
    price: "₹180",
    originalPrice: "₹360",
    rating: "4.9",
    reviews: "2,150+",
    accentGlow: "from-[#fef3c7]/70 to-[#dcfce7]/60",
    imageUrl:
      "https://media.istockphoto.com/id/2191030648/photo/gula-jawa-or-javanese-sugar-or-red-sugar-or-palm-sugar-in-half-ball-shape-inside-white-bowl.jpg?s=612x612&w=0&k=20&c=stdu8cUEfGy90ay70Ki8oLjtiKEzkESZtnk9ih-rXD8=",
    perks: [
      "Zero White Cane Sugar",
      "Rich Natural Iron Source",
      "Low GI Natural Sweetener",
    ],
  },
  {
    id: 4,
    tag: "BESTSELLER #4 • RAW FOREST HARVEST",
    title: "Wild Raw",
    titleHighlight: "Forest Honey",
    quote:
      "Single-origin raw honey sustainably collected from indigenous deep forest flora. Unheated and unpasteurized, retaining all natural bee pollen.",
    unit: "500g Glass Jar",
    price: "₹340",
    originalPrice: "₹680",
    rating: "5.0",
    reviews: "3,400+",
    accentGlow: "from-[#fed7aa]/60 to-[#fef3c7]/60",
    imageUrl:
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=1000&auto=format&fit=crop&q=60",
    perks: [
      "Pollen Rich & Unheated",
      "Zero High-Fructose Syrup",
      "Ethical Forest Foraged",
    ],
  },
  {
    id: 5,
    tag: "BESTSELLER #5 • DROUGHT-RESILIENT GRAIN",
    title: "Traditional Foxtail",
    titleHighlight: "Millet (Thinai)",
    quote:
      "Native golden grains harvested from pesticide-free rain-fed farmland. High in complex carbohydrates, digestible fiber, and essential minerals.",
    unit: "1 kg Pack",
    price: "₹125",
    originalPrice: "₹250",
    rating: "4.8",
    reviews: "820+",
    accentGlow: "from-[#dcfce7]/70 to-[#ecfdf5]/60",
    imageUrl:
      "https://images.unsplash.com/photo-1783042909392-0b8d8683e0a2?w=1000&auto=format&fit=crop&q=60",
    perks: [
      "Prebiotic Gut Fiber",
      "Zero Machine Polish",
      "Diabetic-Friendly Staple",
    ],
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BESTSELLER_SLIDES.length);
    }, 500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = BESTSELLER_SLIDES[current];

  return (
    /* Edge-to-edge warm organic linen canvas with high contrast */
    <section
      className="relative w-screen left-1/2 -translate-x-1/2 bg-[#faf7f2] text-[#1c3323] overflow-hidden min-h-[580px] lg:min-h-[630px] flex items-center select-none border-b border-[#e6decb]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Warm Ambient Botanical Aura - Soft Natural Sunlight */}
      <div
        className={`absolute top-0 right-0 w-[55vw] h-full bg-gradient-to-bl ${slide.accentGlow} blur-[120px] pointer-events-none transition-all duration-1000 opacity-70`}
      />
      <div className="absolute -bottom-24 -left-20 w-[420px] h-[420px] bg-[#eef7ee] rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle organic linen grain */}
      <div className="absolute inset-0 bg-[radial-gradient(#1b3b270a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Main Content Layout */}
      <div className="relative w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center z-10">
        {/* Left Side: Product Editorial Pitch */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Badges: Crisp Dark Green & Gold */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#cfe2d2] text-[#1b3b27] text-[11px] font-bold tracking-widest uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
              {slide.tag}
            </span>

            <span className="inline-flex items-center gap-1 bg-[#b45309] text-white font-black text-xs px-3.5 py-1 rounded-full shadow-sm tracking-wider uppercase">
              FLAT 50% OFF
            </span>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#2e5a36] bg-white border border-[#cfe2d2] px-3 py-1 rounded-full shadow-xs">
              <div className="flex text-[#f59e0b]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span className="font-bold text-[#1b3b27]">{slide.rating}</span>
              <span className="text-[#64748b] text-[11px]">
                ({slide.reviews})
              </span>
            </div>
          </div>

          {/* Headline: Deep Forest Green with Rich Organic Green Highlight */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.12] text-[#14281b]">
            {slide.title}{" "}
            <span className="block font-medium italic text-[#2e7d4d]">
              {slide.titleHighlight}
            </span>
          </h1>

          {/* Description: Deep Charcoal/Slate for 100% Readability */}
          <p className="text-[#3f5144] text-sm sm:text-base leading-relaxed max-w-xl font-normal">
            {slide.quote}
          </p>

          {/* Perks with Crisp Green Ticks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {slide.perks.map((perk, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-[#23422a] font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 text-[#2e7d4d] shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Price & Unit Details */}
          <div className="pt-2 flex items-baseline gap-4">
            <span className="text-4xl sm:text-5xl font-black text-[#1b3b27] tracking-tight font-serif">
              {slide.price}
            </span>
            <span className="text-xl sm:text-2xl text-[#94a3b8] line-through font-serif">
              {slide.originalPrice}
            </span>
            <span className="text-xs font-bold text-[#2e5a36] border border-[#cfe2d2] bg-white px-3 py-1 rounded-md shadow-xs">
              Net Wt: {slide.unit}
            </span>
          </div>

          {/* CTA Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 font-extrabold px-8 py-4 rounded-full bg-[#1b3b27] hover:bg-[#255236] text-white shadow-[0_8px_20px_rgba(27,59,39,0.25)] hover:shadow-[0_12px_28px_rgba(27,59,39,0.35)] active:scale-95 transition-all duration-300 text-xs uppercase tracking-widest cursor-pointer"
            >
              Claim 50% Off Harvest
              <ArrowRight className="w-4 h-4 stroke-[2.5] text-[#fbbf24]" />
            </Link>

            <Link
              to="/track"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-bold text-xs uppercase tracking-widest text-[#1b3b27] bg-white hover:bg-[#f4faf4] border border-[#cfe2d2] transition-all duration-300 shadow-xs"
            >
              Order Tracking
            </Link>
          </div>
        </div>

        {/* Right Side: Clean White Showcase Frame with Depth */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-72 h-72 sm:w-88 sm:h-88 lg:w-[420px] lg:h-[420px] flex items-center justify-center">
            {/* Soft Ambient Rings */}
            <div className="absolute inset-0 rounded-full border border-[#d8e8d8] animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-dashed border-[#b8dab8] animate-[spin_40s_linear_infinite_reverse]" />
            <div className="absolute inset-6 rounded-full bg-[#f1f7f1] shadow-inner" />

            {/* Crisp Pure White Photo Container */}
            <div className="relative z-10 w-64 h-64 sm:w-76 sm:h-76 lg:w-84 lg:h-84 rounded-full p-3 bg-white border border-[#cfe2d2] shadow-[0_20px_45px_rgba(27,59,39,0.12)] group overflow-hidden">
              <img
                key={slide.id}
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover rounded-full transition-transform duration-700 group-hover:scale-105"
              />

              {/* Verified Pill */}
              <div className="absolute top-4 right-4 bg-[#1b3b27] text-[#fbbf24] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                100% Certified Native
              </div>
            </div>

            {/* Bottom Floating Price Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 bg-white border border-[#cfe2d2] px-6 py-2.5 rounded-full shadow-xl flex items-center gap-3 whitespace-nowrap">
              <span className="text-[#1b3b27] font-bold text-xs uppercase tracking-wider">
                {slide.titleHighlight}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
              <span className="text-[#1b3b27] font-black text-sm">
                {slide.price}
              </span>
              <span className="bg-[#fef3c7] text-[#b45309] text-[10px] px-2 py-0.5 rounded font-black border border-[#fde68a] uppercase">
                Save 50%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Slider Navigation Controls */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-20 w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 flex items-center justify-between pointer-events-none">
        {/* Crisp Forest Green Dot Indicators */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {BESTSELLER_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Jump to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                current === idx
                  ? "w-10 bg-[#1b3b27]"
                  : "w-3 bg-[#cfe2d2] hover:bg-[#a3c9a8]"
              }`}
            />
          ))}
        </div>

        {/* Clean Pill Arrow Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() =>
              setCurrent((prev) =>
                prev === 0 ? BESTSELLER_SLIDES.length - 1 : prev - 1,
              )
            }
            aria-label="Previous slide"
            className="p-3 rounded-full bg-white hover:bg-[#eef5ee] border border-[#cfe2d2] text-[#1b3b27] transition-all active:scale-90 cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              setCurrent((prev) => (prev + 1) % BESTSELLER_SLIDES.length)
            }
            aria-label="Next slide"
            className="p-3 rounded-full bg-white hover:bg-[#eef5ee] border border-[#cfe2d2] text-[#1b3b27] transition-all active:scale-90 cursor-pointer shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
