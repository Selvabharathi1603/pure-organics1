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
    <section className="py-16 border-t border-brand-border relative overflow-hidden bg-brand-bg">
      <style>{`
        @keyframes scrollMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: scrollMarquee 32s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center space-y-2">
        <span className="text-[11px] font-bold text-brand-green uppercase tracking-[0.25em] block">
          Generational Trust
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
          Customer Stories
        </h2>
        <p className="text-xs sm:text-sm text-brand-subtext max-w-md mx-auto">
          Honest words from families sustained by our unpolished native
          harvests.
        </p>
      </div>

      {/* Edge Fades */}
      <div className="pointer-events-none absolute left-0 top-24 bottom-0 w-24 bg-gradient-to-r from-brand-bg to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-24 bottom-0 w-24 bg-gradient-to-l from-brand-bg to-transparent z-10" />

      {/* Cards Marquee */}
      <div className="w-full overflow-hidden flex cursor-grab active:cursor-grabbing">
        <div className="marquee-track gap-6 py-2">
          {loopList.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-[320px] sm:w-[360px] bg-white border border-brand-border rounded-2xl p-6 flex flex-col justify-between space-y-4 shrink-0 shadow-xs"
            >
              {/* Rating */}
              <div className="flex items-center gap-1">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#D97706] text-[#D97706]"
                  />
                ))}
              </div>

              {/* Review */}
              <div className="space-y-3 flex-1">
                <p className="text-xs sm:text-sm text-brand-dark leading-relaxed line-clamp-4">
                  "{item.review}"
                </p>
                <span className="inline-block text-[10px] font-medium text-brand-green bg-brand-bg px-2.5 py-0.5 rounded-full border border-brand-border">
                  Verified: {item.product}
                </span>
              </div>

              {/* Author */}
              <div className="pt-3 border-t border-brand-border flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-brand-muted font-medium block">
                    {item.location}
                  </span>
                </div>
                <Quote className="w-5 h-5 text-brand-border" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
