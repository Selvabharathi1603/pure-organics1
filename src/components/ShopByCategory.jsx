import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/storecontext";

const DEFAULT_CATEGORIES = [
  {
    id: "oil",
    name: "Wood-Pressed Oil",
    query: "Oil",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2917/2917633.png",
  },
  {
    id: "ghee",
    name: "Desi Cow Ghee",
    query: "Ghee",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/5346/5346452.png",
  },
  {
    id: "flour",
    name: "Stone-Ground Flour",
    query: "Flour",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3014/3014522.png",
  },
  {
    id: "millets",
    name: "Unpolished Millets",
    query: "Millets",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/8982/8982464.png",
  },
  {
    id: "rice",
    name: "Heritage Rice",
    query: "Rice",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3174/3174880.png",
  },
  {
    id: "breakfast",
    name: "Wholesome Breakfast",
    query: "Breakfast",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3050/3050158.png",
  },
  {
    id: "pickles",
    name: "Farmstead Pickles",
    query: "Pickles",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2224/2224260.png",
  },
  {
    id: "dryfruits",
    name: "Sun-Dried Nuts",
    query: "Dry Fruits",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/5312/5312891.png",
  },
];

export default function ShopByCategory() {
  const store = useStore?.() || {};
  const categories =
    store.categories && store.categories.length > 0
      ? store.categories
      : DEFAULT_CATEGORIES;

  return (
    <section className="py-6">
      <div className="text-center mb-10 space-y-1.5">
        <span className="text-[11px] font-bold text-[#2e7d4d] uppercase tracking-[0.25em] bg-[#edf5ef] px-3.5 py-1 rounded-full border border-[#d2e5d7]">
          Farm Harvest Hubs
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#162a1e] pt-1">
          Shop by{" "}
          <span className="italic font-serif text-[#2e7d4d]">
            Harvest Category
          </span>
        </h2>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${encodeURIComponent(cat.query)}`}
            className="group relative flex flex-col items-center justify-center p-6 sm:p-7 rounded-3xl bg-white border border-[#e8e2d5] hover:border-[#2e7d4d] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(46,125,77,0.12)] transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer"
          >
            {/* Soft Sprout Hover Aura */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#edf5ef]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Icon Container */}
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#faf7f2] border border-[#e4ded3] group-hover:bg-[#edf5ef] group-hover:border-[#c2deca] flex items-center justify-center p-4 mb-4 transition-all duration-300 shadow-inner">
              <img
                src={cat.iconUrl}
                alt={cat.name}
                className="w-full h-full object-contain filter hue-rotate-[90deg] saturate-[140%] brightness-90 group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <span className="font-serif text-sm sm:text-base font-semibold text-[#162a1e] group-hover:text-[#1b3b27] tracking-wide text-center transition-colors">
              {cat.name}
            </span>
            <span className="text-[10px] text-[#6d8274] group-hover:text-[#2e7d4d] tracking-wider uppercase mt-1 transition-colors font-mono">
              Explore →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
