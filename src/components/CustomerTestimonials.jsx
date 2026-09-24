import React from "react";
import { Star, Quote } from "lucide-react";
import { useStore } from "../context/storecontext";

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    rating: 5,
    review:
      "Hello, I like your products. Wood-pressed sesame oil, Karuppu Kavuni rice, and unpolished millets. I enjoy your original native food... awesome taste... totally healthy food!",
    name: "SHRADHA RAJENDRRA",
    location: "Chennai",
    product: "Wood-Pressed Sesame Oil",
  },
  {
    id: 2,
    rating: 5,
    review:
      "It is always wonderful ordering from Pure Organics. They have a wonderful collection of raw honey, native millets, and cold-pressed oils. Kudos to the team for keeping the stock always fresh.",
    name: "YUKTI S.",
    location: "Bengaluru",
    product: "Wild Raw Forest Honey",
  },
  {
    id: 3,
    rating: 5,
    review:
      "I absolutely loved this buy! The A2 Desi Ghee aroma takes me straight back to village cooking. You made my daily tea and breakfast ritual wholesome without guilt.",
    name: "RIDHIMA G.",
    location: "Coimbatore",
    product: "A2 Desi Cow Ghee",
  },
  {
    id: 4,
    rating: 5,
    review:
      "Quality at optimum level! I loved the unpolished barnyard millet and palm jaggery. Neither too heavy nor flavourless! Every single grain tastes earthy and genuine.",
    name: "ANBAJAGANE R.",
    location: "Madurai",
    product: "Barnyard Millet & Karupatti",
  },
  {
    id: 5,
    rating: 5,
    review:
      "The wood-pressed groundnut oil has that traditional nutty aroma my grandmother used to talk about. Zero foam, zero smell of chemicals. Will keep reordering every month!",
    name: "PRIYA DHARSHINI",
    location: "Trichy",
    product: "Wood-Pressed Groundnut Oil",
  },
  {
    id: 6,
    rating: 5,
    review:
      "Packaging was eco-friendly and delivery was fast with Cash on Delivery. Finding authentic unpolished Kodo millet and sundakkai vathal online this good is rare.",
    name: "KARTHIK VELAN",
    location: "Salem",
    product: "Kodo Millet & Sun-Dried Sundakkai",
  },
];

export default function CustomerTestimonials() {
  const store = useStore?.() || {};
  const activeTestimonials =
    store.testimonials && store.testimonials.length > 0
      ? store.testimonials
      : DEFAULT_TESTIMONIALS;

  const loopList = [
    ...activeTestimonials,
    ...activeTestimonials,
    ...activeTestimonials,
  ];

  return (
    <section className="py-14 sm:py-20 border-t border-[#e8e2d5] relative overflow-hidden bg-gradient-to-b from-transparent via-[#f5f0e6]/50 to-transparent">
      <style>{`
        @keyframes scrollMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: scrollMarquee 30s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center space-y-2">
        <span className="text-[10px] sm:text-[11px] font-bold text-[#2e7d4d] uppercase tracking-[0.28em] block">
          Generational Trust
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#162a1e] tracking-tight">
          Customer{" "}
          <span className="text-[#2e7d4d] italic font-serif">Testimonials</span>
        </h2>
        <p className="text-xs text-[#5c7365] max-w-md mx-auto">
          Honest words from families sustained by our unpolished native
          harvests.
        </p>
      </div>

      {/* Left/Right Edge Fades */}
      <div className="pointer-events-none absolute left-0 top-24 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-[#faf7f2] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-24 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-[#faf7f2] to-transparent z-10" />

      {/* Marquee Track */}
      <div className="w-full overflow-hidden flex cursor-grab active:cursor-grabbing">
        <div className="marquee-track gap-6 py-2">
          {loopList.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-[320px] sm:w-[380px] bg-white border border-[#e8e2d5] hover:border-[#2e7d4d] rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md shrink-0 transition-all duration-300"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#c58f38] text-[#c58f38]"
                  />
                ))}
              </div>

              {/* Review Text */}
              <div className="space-y-3 flex-1">
                <p className="text-xs sm:text-[13px] text-[#4d6355] leading-relaxed line-clamp-4">
                  "{item.review}"
                </p>
                <span className="inline-block text-[10px] font-mono text-[#1b3b27] bg-[#edf5ef] px-2.5 py-1 rounded-md border border-[#cbe1d2]">
                  Verified: {item.product}
                </span>
              </div>

              {/* Author Info */}
              <div className="pt-3 border-t border-[#f0eae0] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#162a1e]">
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-[#738d81] font-medium block">
                    {item.location}
                  </span>
                </div>
                <Quote className="w-5 h-5 text-[#dce7df]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
