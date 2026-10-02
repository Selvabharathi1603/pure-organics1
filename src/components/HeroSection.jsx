import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Check,
  Sparkles,
  Star,
  ArrowRight,
  Flame,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { API_BASE_URL as CONFIG_URL } from "../config/api";

const BASE_URL = CONFIG_URL || "http://localhost:5000";

const HERO_BG_IMAGE =
  "https://t3.ftcdn.net/jpg/02/71/72/06/360_F_271720694_xeOnMuwr2oiP9PG7yn8cKet1upl76QOu.jpg";

const DEFAULT_HERO_PRODUCTS = [
  {
    id: 1,
    short_name: "Karupatti",
    badge: "Udangudi Native",
    title: "Artisanal Palm Jaggery",
    tamil: "உடன்குடி பனங்கருப்பட்டி",
    description:
      "Clarified Palmyra palm sap slow-boiled in iron cauldrons with organic herbal extract. Natural unbleached blocks with raw iron and zero cane sugar.",
    price: 180,
    mrp: 240,
    unit: "500g Native Block",
    rating: 4.9,
    reviews: "2.1k",
    stock: 19,
    image_url:
      "https://media.istockphoto.com/id/2152257228/photo/traditional-market-stall-items-with-palm-sugar-in-a-woven-basket-surrounded-by-garlic-dried.webp?a=1&b=1&s=612x612&w=0&k=20&c=itwYeL006O_v0LdMec0j2f5_7HET13vTi2_nGgdBOdA=",
  },
  {
    id: 2,
    short_name: "Peanut Oil",
    badge: "Cold Crushed",
    title: "Mara Chekku Peanut Oil",
    tamil: "மரச்செக்கு கடலை எண்ணெய்",
    description:
      "Wood-pressed exclusively from native sun-dried red-skin peanuts. Settled naturally in sunlight without synthetic degumming or solvent extraction.",
    price: 290,
    mrp: 380,
    unit: "1 Litre Glass Bottle",
    rating: 4.8,
    reviews: "1.4k",
    stock: 9,
    image_url:
      "https://media.istockphoto.com/id/1072412008/photo/peanuts-in-wooden-bowl-with-peanut-oil.webp?a=1&b=1&s=612x612&w=0&k=20&c=xEfipOm3guxSkT164-uPm_3CVj-rcWtCNhnjsYIB4KE=",
  },
  {
    id: 3,
    short_name: "Black Rice",
    badge: "Ancient Chola Grain",
    title: "Karuppu Kavuni Black Rice",
    tamil: "நாட்டு கருப்பு கவுனி அரிசி",
    description:
      "Traditional antioxidant-rich heirloom paddy grown without chemical sprays. Completely unpolished bran intact with low glycemic response.",
    price: 190,
    mrp: 260,
    unit: "1 Kg Cloth Bag",
    rating: 4.9,
    reviews: "920",
    stock: 7,
    image_url:
      "https://images.unsplash.com/photo-1623691307892-d6de6dfb2a8a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxhY2slMjByaWNlfGVufDB8fDB8fHww",
  },
  {
    id: 4,
    short_name: "Gingelly Oil",
    badge: "Vaagai Chekku",
    title: "Wood-Pressed Gingelly Oil",
    tamil: "பாரம்பரிய வாகை மரச்செக்கு நல்லெண்ணெய்",
    description:
      "Native country sesame crushed raw with palm jaggery in traditional wooden mortars below 38°C. Zero paraffin, zero palm oil blending.",
    price: 360,
    mrp: 440,
    unit: "1 Litre Glass Bottle",
    rating: 4.9,
    reviews: "1.8k",
    stock: 12,
    image_url:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    short_name: "Forest Honey",
    badge: "Western Ghats",
    title: "Raw Wild Forest Honey",
    tamil: "சுத்தமான மலைத்தேன்",
    description:
      "Collected directly from wild forest hives in Western Ghats. Raw, unfiltered, unheated, and loaded with natural bee pollen.",
    price: 340,
    mrp: 460,
    unit: "500g Jar",
    rating: 5.0,
    reviews: "3.1k",
    stock: 16,
    image_url:
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80",
  },
];

export default function HeroSection({ onAddToCart }) {
  const [products, setProducts] = useState(DEFAULT_HERO_PRODUCTS);
  const [index, setIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Keep latest products length in ref to avoid stale closures
  const lengthRef = useRef(products.length);
  useEffect(() => {
    lengthRef.current = products.length;
  }, [products.length]);

  // 1. Fetch backend items
  useEffect(() => {
    let isMounted = true;
    const fetchHeroProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/hero/bestsellers`);
        const json = await res.json();
        if (
          isMounted &&
          json.success &&
          Array.isArray(json.data) &&
          json.data.length > 0
        ) {
          setProducts(json.data);
        }
      } catch (err) {
        // Fallback default array stays active
      }
    };
    fetchHeroProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Guaranteed Auto-Slide Interval (every 3.5 seconds)
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % (lengthRef.current || 1));
    }, 3500);

    return () => clearInterval(timer);
  }, [isHovered]);

  const active = products[index] || DEFAULT_HERO_PRODUCTS[0];

  const handleNext = () => setIndex((prev) => (prev + 1) % products.length);
  const handlePrev = () =>
    setIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));

  const handleAdd = () => {
    setAdded(true);
    if (onAddToCart) onAddToCart(active);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden bg-stone-950 text-white select-none font-sans">
      {/* 1. BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG_IMAGE}
          alt="Tamil Nadu Rice Field Harvest"
          className="w-full h-full object-cover object-center scale-102 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/35" />
      </div>

      {/* 2. INNER FOREGROUND GRID */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ================= LEFT COLUMN: FARM CONTENT ================= */}
          <div className="lg:col-span-7 space-y-4 text-left">
            {/* Direct Farm Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-white/20 text-white text-xs font-semibold tracking-wide backdrop-blur-md shadow-md">
              <Sparkles size={13} className="text-amber-400" />
              <span>Direct From Tirunelveli & Thanjavur Farmlands</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] drop-shadow-md">
              Real Mara Chekku Oils <br />
              <span className="text-amber-400 drop-shadow-md">
                & Heirloom Grains.
              </span>
            </h1>

            {/* Description */}
            <p className="text-stone-100 text-sm sm:text-base leading-relaxed max-w-xl font-normal drop-shadow-sm min-h-[3.8rem]">
              {active.description}
            </p>

            {/* 3 Quality Badges */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <span className="text-xs font-bold text-white bg-black/60 border border-white/20 px-3.5 py-1.5 rounded-xl backdrop-blur-md shadow-sm">
                ✓ Zero Palm Oil Blending
              </span>
              <span className="text-xs font-bold text-white bg-black/60 border border-white/20 px-3.5 py-1.5 rounded-xl backdrop-blur-md shadow-sm">
                ✓ Cold-Milled Below 38°C
              </span>
              <span className="text-xs font-bold text-white bg-black/60 border border-white/20 px-3.5 py-1.5 rounded-xl backdrop-blur-md shadow-sm">
                ✓ Lab Purity Certificate
              </span>
            </div>

            {/* Order Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <a
                href="#shop"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-98 cursor-pointer"
              >
                <span>Shop Fresh Mill</span>
                <ArrowRight size={15} />
              </a>

              <Link
                to="/track"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black/50 hover:bg-black/70 border border-white/30 text-white font-bold text-xs backdrop-blur-md transition-all shadow-sm"
              >
                <span>Track Order</span>
              </Link>

              {/* Verified Feedback */}
              <div className="flex items-center gap-1.5 text-xs text-stone-200 ml-1 bg-black/50 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
                <span className="font-extrabold text-white">
                  {active.rating}
                </span>
                <span className="text-stone-300 text-[11px]">
                  ({active.reviews})
                </span>
              </div>
            </div>

            {/* 5-Item Quick Switcher Pills */}
            <div className="pt-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
              {products.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setIndex(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap backdrop-blur-sm ${
                    index === i
                      ? "bg-amber-400 text-stone-950 font-bold shadow-md scale-102"
                      : "bg-black/45 hover:bg-black/70 text-stone-200 border border-white/15"
                  }`}
                >
                  {p.short_name}
                </button>
              ))}
            </div>
          </div>

          {/* ================= RIGHT: CIRCLE SPOTLIGHT (Hover pauses only here) ================= */}
          <div
            className="lg:col-span-5 flex flex-col items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative flex flex-col items-center">
              {/* LARGE CIRCLE CONTAINER */}
              <div
                onClick={handleNext}
                title="Click for next item"
                className="relative w-76 h-76 sm:w-92 sm:h-92 rounded-full p-2 bg-gradient-to-tr from-amber-400/60 via-white/40 to-amber-400/30 shadow-2xl backdrop-blur-md flex items-center justify-center cursor-pointer group"
              >
                {/* Product Photo Circle */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-inner bg-black">
                  <img
                    key={active.id}
                    src={active.image_url}
                    alt={active.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />
                </div>

                {/* Floating Stock Badge Sitting on Top Center */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-stone-950/95 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xl border border-white/30 whitespace-nowrap z-20">
                  <Flame size={13} className="text-amber-400" />
                  <span>Only {active.stock} left in batch</span>
                </div>

                {/* Left Arrow Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Previous product"
                  className="absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-stone-900 shadow-xl flex items-center justify-center hover:bg-amber-400 transition-colors z-30 cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Next product"
                  className="absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-stone-900 shadow-xl flex items-center justify-center hover:bg-amber-400 transition-colors z-30 cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Product Meta Section */}
              <div className="mt-4 text-center max-w-sm flex flex-col items-center">
                {/* Tamil Name */}
                <div className="inline-flex items-center px-4 py-1 rounded-full bg-white text-stone-950 text-xs sm:text-sm font-extrabold shadow-lg mb-2 border border-stone-200">
                  {active.tamil}
                </div>

                {/* English Title */}
                <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md leading-snug">
                  {active.title}
                </h3>

                {/* Pricing & Units */}
                <div className="mt-2 flex items-center justify-center gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 drop-shadow-xs">
                    ₹{active.price}
                  </span>
                  <span className="text-xs line-through text-stone-300 font-medium">
                    ₹{active.mrp}
                  </span>
                  <span className="text-[10px] font-extrabold text-stone-950 bg-amber-400 px-2.5 py-0.5 rounded-full shadow-xs">
                    Save ₹{active.mrp - active.price}
                  </span>
                  <span className="text-[11px] text-stone-200 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20 backdrop-blur-xs">
                    {active.unit}
                  </span>
                </div>

                {/* Order Button */}
                <div className="mt-3.5 flex justify-center w-full">
                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`w-full sm:w-72 py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
                      added
                        ? "bg-emerald-500 text-stone-950 scale-102"
                        : "bg-white hover:bg-amber-400 text-stone-950 active:scale-98"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check size={16} className="stroke-[3]" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={15} />
                        <span>Claim Batch · ₹{active.price}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center justify-center gap-1.5 mt-3.5">
                  {products.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        index === i
                          ? "w-6 bg-amber-400"
                          : "w-1.5 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
