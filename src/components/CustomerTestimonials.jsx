import React from "react";
import { Star } from "lucide-react";
import { useStore } from "../context/storecontext";

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    rating: 5,
    headline: "Pure authentic village quality",
    review:
      "Good quality sesame oil and Karuppu Kavuni rice. Taste and smell are very authentic just like what we get in our village.",
    name: "SHRADHA RAJENDRRA",
    location: "Chennai",
    product: "Wood-Pressed Sesame Oil",
  },
  {
    id: 2,
    rating: 5,
    headline: "Arrived securely packed and pure",
    review:
      "Ordered raw honey and groundnut oil. Both arrived securely packed without any leakage. The honey taste is pure and not sugary.",
    name: "YUKTI S.",
    location: "Bengaluru",
    product: "Wild Raw Honey",
  },
  {
    id: 3,
    rating: 5,
    headline: "A wonderful homemade aroma",
    review:
      "The cow ghee has great homemade aroma and good grainy texture. Perfect for giving with hot rice and dosas for kids.",
    name: "RIDHIMA G.",
    location: "Coimbatore",
    product: "Desi Cow Ghee",
  },
  {
    id: 4,
    rating: 5,
    headline: "Clean grains with no stones",
    review:
      "Regularly buying unpolished barnyard millet and palm jaggery from here. Clean grains without stones or dust. Highly recommended.",
    name: "ANBAJAGANE R.",
    location: "Madurai",
    product: "Barnyard Millet & Karupatti",
  },
  {
    id: 5,
    rating: 5,
    headline: "Far better than refined packet oils",
    review:
      "Traditional aroma while cooking with this groundnut oil. Doesn't smoke quickly and food tastes much better compared to packet refined oils.",
    name: "PRIYA DHARSHINI",
    location: "Trichy",
    product: "Wood-Pressed Groundnut Oil",
  },
  {
    id: 6,
    rating: 5,
    headline: "Prompt delivery and great quality",
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
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#FAF9F5] border-y border-stone-200 py-16 sm:py-20 overflow-hidden select-none m-0 font-sans">
      <style>{`
        @keyframes scrollMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .testimonial-marquee-track {
          display: flex;
          width: max-content;
          animation: scrollMarquee 50s linear infinite;
        }
        .testimonial-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Main Section Headline using standard system typography */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mb-10 sm:mb-14 text-left">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-normal text-stone-900 tracking-tight leading-tight">
          What People Are Saying
        </h2>
      </div>

      {/* Edge gradient masks */}
      <div className="pointer-events-none absolute left-0 top-36 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#FAF9F5] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-36 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#FAF9F5] to-transparent z-10" />

      {/* Looping Marquee Track */}
      <div className="w-full overflow-hidden flex">
        <div className="testimonial-marquee-track gap-10 sm:gap-14 lg:gap-16 py-2 px-6">
          {loopList.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-[310px] sm:w-[380px] md:w-[420px] shrink-0 text-left flex flex-col justify-between space-y-3 cursor-grab active:cursor-grabbing"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1.5">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 sm:w-6 sm:h-6 fill-[#D97706] text-[#D97706]"
                  />
                ))}
              </div>

              {/* Headline */}
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-stone-950 tracking-tight leading-snug">
                {item.headline || "Authentic quality & taste"}
              </h3>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal italic">
                "{item.review}"
              </p>

              {/* Footer Meta */}
              <div className="pt-2 text-[10px] sm:text-[11px] font-mono tracking-widest text-stone-500 uppercase">
                {item.name}, {item.location} – {item.product}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
