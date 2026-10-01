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
    tag: "Cold-Pressed • Wood Mortar",
    title: "Pure Virgin",
    titleHighlight: "Coconut Oil",
    quote:
      "Extracted gently from fresh coastal coconut milk in native wooden chekkus below 42°C. Packed with unrefined lauric immunity lipids and zero chemicals.",
    unit: "500 ml Glass Jar",
    price: "₹310",
    originalPrice: "₹620",
    rating: "4.9",
    reviews: "1,420+",
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
    tag: "Heritage Detox Grain",
    title: "Heritage Black Rice",
    titleHighlight: "(Karuppu Kavuni)",
    quote:
      "Cherished ancient royal grain rich in natural anthocyanin antioxidants, low glycemic index, and sustained whole-day clean stamina.",
    unit: "1 kg Eco Pack",
    price: "₹195",
    originalPrice: "₹390",
    rating: "4.9",
    reviews: "980+",
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
    tag: "Unrefined Nectar",
    title: "Traditional Palm",
    titleHighlight: "Jaggery (Karupatti)",
    quote:
      "Clarified naturally with organic herbal extracts without calcium carbonate or bleaching agents. Rich in bio-active plant iron and natural calcium.",
    unit: "500g Native Block",
    price: "₹180",
    originalPrice: "₹360",
    rating: "4.9",
    reviews: "2,150+",
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
    tag: "Raw Forest Harvest",
    title: "Wild Raw",
    titleHighlight: "Forest Honey",
    quote:
      "Single-origin raw honey sustainably collected from indigenous deep forest flora. Unheated and unpasteurized, retaining all natural bee pollen.",
    unit: "500g Glass Jar",
    price: "₹340",
    originalPrice: "₹680",
    rating: "5.0",
    reviews: "3,400+",
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
    tag: "Drought-Resilient Grain",
    title: "Traditional Foxtail",
    titleHighlight: "Millet (Thinai)",
    quote:
      "Native golden grains harvested from pesticide-free rain-fed farmland. High in complex carbohydrates, digestible fiber, and essential minerals.",
    unit: "1 kg Pack",
    price: "₹125",
    originalPrice: "₹250",
    rating: "4.8",
    reviews: "820+",
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
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = BESTSELLER_SLIDES[current];

  return (
    <section
      className="relative w-full bg-brand-bg text-brand-dark overflow-hidden border-b border-brand-border py-14 sm:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Content & Actions */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Tag Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-brand-border text-brand-green text-[11px] font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-brand-green" />
              {slide.tag}
            </span>

            <span className="inline-flex items-center bg-brand-cream border border-brand-border text-brand-dark font-bold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
              50% Season Offer
            </span>

            <div className="flex items-center gap-1.5 text-xs text-brand-subtext bg-white border border-brand-border px-3 py-1 rounded-full">
              <div className="flex text-[#D97706]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span className="font-bold text-brand-dark">{slide.rating}</span>
              <span className="text-brand-muted text-[11px]">
                ({slide.reviews})
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-brand-dark leading-[1.08]">
            {slide.title} <br />
            <span className="text-brand-green">{slide.titleHighlight}</span>
          </h1>

          {/* Subtext */}
          <p className="text-brand-subtext text-sm sm:text-base leading-relaxed max-w-xl">
            {slide.quote}
          </p>

          {/* Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {slide.perks.map((perk, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-brand-dark font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Price & Unit */}
          <div className="pt-2 flex items-baseline gap-4">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-dark">
              {slide.price}
            </span>
            <span className="text-lg text-brand-muted line-through">
              {slide.originalPrice}
            </span>
            <span className="text-xs font-semibold text-brand-subtext border border-brand-border bg-white px-3 py-1 rounded-full">
              Net Wt: {slide.unit}
            </span>
          </div>

          {/* Call to Actions */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-brand-dark hover:bg-brand-green text-white text-xs uppercase tracking-widest font-bold transition-colors shadow-sm"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/track"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest text-brand-dark bg-white hover:bg-brand-cream border border-brand-border transition-colors"
            >
              Track Order
            </Link>
          </div>
        </div>

        {/* Right Side: Produce Cutout Canvas[cite: 1] */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 aspect-square flex items-center justify-center">
            {/* Soft Ambient Disc */}
            <div className="absolute inset-0 rounded-full bg-white/70 border border-brand-border" />

            {/* Cutout Image with Drop Shadow[cite: 1] */}
            <div className="relative z-10 w-60 h-60 sm:w-80 sm:h-80 flex items-center justify-center p-4">
              <img
                key={slide.id}
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:scale-105"
              />

              {/* Verified Round Stamp[cite: 1] */}
              <div className="absolute top-2 right-2 bg-brand-dark text-white text-[9px] uppercase font-bold tracking-widest p-2 rounded-full w-16 h-16 flex flex-col items-center justify-center text-center shadow-md border-2 border-white/50">
                <span>100%</span>
                <span>Organic</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 mt-10 flex items-center justify-between">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {BESTSELLER_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                current === idx
                  ? "w-8 bg-brand-dark"
                  : "w-2 bg-brand-border hover:bg-brand-green"
              }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCurrent((prev) =>
                prev === 0 ? BESTSELLER_SLIDES.length - 1 : prev - 1,
              )
            }
            aria-label="Previous"
            className="p-2.5 rounded-full bg-white hover:bg-brand-cream border border-brand-border text-brand-dark transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              setCurrent((prev) => (prev + 1) % BESTSELLER_SLIDES.length)
            }
            aria-label="Next"
            className="p-2.5 rounded-full bg-white hover:bg-brand-cream border border-brand-border text-brand-dark transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
