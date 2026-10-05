import React from "react";
import { Star, Quote } from "lucide-react";
import { useStore } from "../context/storecontext";

// Simple, natural everyday customer reviews without promotional buzzwords
const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    rating: 5,
    review:
      "Good quality sesame oil and Karuppu Kavuni rice. Taste and smell are very authentic just like what we get in our village.",
    name: "SHRADHA RAJENDRRA",
    location: "Chennai",
    product: "Wood-Pressed Sesame Oil",
  },
  {
    id: 2,
    rating: 5,
    review:
      "Ordered raw honey and groundnut oil. Both arrived securely packed without any leakage. The honey taste is pure and not sugary.",
    name: "YUKTI S.",
    location: "Bengaluru",
    product: "Wild Raw Honey",
  },
  {
    id: 3,
    rating: 5,
    review:
      "The cow ghee has great homemade aroma and good grainy texture. Perfect for giving with hot rice and dosas for kids.",
    name: "RIDHIMA G.",
    location: "Coimbatore",
    product: "Desi Cow Ghee",
  },
  {
    id: 4,
    rating: 5,
    review:
      "Regularly buying unpolished barnyard millet and palm jaggery from here. Clean grains without stones or dust. Highly recommended.",
    name: "ANBAJAGANE R.",
    location: "Madurai",
    product: "Barnyard Millet & Karupatti",
  },
  {
    id: 5,
    rating: 5,
    review:
      "Traditional aroma while cooking with this groundnut oil. Doesn't smoke quickly and food tastes much better compared to packet refined oils.",
    name: "PRIYA DHARSHINI",
    location: "Trichy",
    product: "Wood-Pressed Groundnut Oil",
  },
  {
    id: 6,
    rating: 5,
    review:
      "Fast delivery to Salem and cash on delivery option was very convenient. Good quality Kodo millet.",
    name: "KARTHIK VELAN",
    location: "Salem",
    product: "Kodo Millet",
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
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white border-y border-stone-200 py-10 sm:py-14 overflow-hidden select-none m-0 font-sans">
      <style>{`
        @keyframes scrollMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        /* Slowed down from 34s to 65s for comfortable reading */
        .testimonial-marquee-track {
          display: flex;
          width: max-content;
          animation: scrollMarquee 65s linear infinite;
        }
        .testimonial-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8 text-center space-y-2">
        <span className="text-[11px] font-mono font-bold text-[#D97706] uppercase tracking-wider bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
          Customer Feedback
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          What Our Customers <span className="text-[#D97706]">Say.</span>
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          Honest reviews from families using our cold-pressed oils and native
          food staples.
        </p>
      </div>

      {/* Side Edge Fades */}
      <div className="pointer-events-none absolute left-0 top-24 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-24 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-white to-transparent z-10" />

      {/* Marquee Track */}
      <div className="w-full overflow-hidden flex">
        <div className="testimonial-marquee-track gap-4 sm:gap-6 py-2">
          {loopList.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-[280px] sm:w-[330px] md:w-[360px] bg-white border border-stone-200 hover:border-[#D97706] rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shrink-0 shadow-xs hover:shadow-md transition-all duration-200"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#D97706] text-[#D97706]"
                  />
                ))}
              </div>

              {/* Review Text */}
              <div className="space-y-3 flex-1 text-left">
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                  "{item.review}"
                </p>
                <div>
                  <span className="inline-block text-[10px] font-mono font-bold text-[#92400E] bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                    Product: {item.product}
                  </span>
                </div>
              </div>

              {/* Customer Name & City */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-left">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    {item.location}
                  </span>
                </div>
                <Quote className="w-4 h-4 text-stone-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
