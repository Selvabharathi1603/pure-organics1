import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Sun,
  Flame,
} from "lucide-react";
import { useStore } from "../context/storecontext";

const ROUTINE_CONFIG = [
  {
    id: "morning-wellness",
    tabLabel: "Morning Honey & Oils",
    icon: Sun,
    badge: "Daily Routine",
    headline: "Pure Raw Honey & Virgin Coconut Oil",
    description:
      "Start the morning naturally. Unheated raw forest honey and cold-pressed virgin oils for daily health and smooth digestion.",
    routineSchedule:
      "Take 1 spoon of honey in warm water or milk in the morning",
    filterFn: (p) =>
      p.category?.toLowerCase().includes("groceries") ||
      p.name?.toLowerCase().includes("honey") ||
      p.name?.toLowerCase().includes("coconut"),
  },
  {
    id: "daily-cooking",
    tabLabel: "Daily Cooking Oils",
    icon: Flame,
    badge: "Traditional Cooking",
    headline: "Cold Wood-Pressed Groundnut & Sesame Oils",
    description:
      "Crushed in traditional wooden chekkus with zero heat and no chemical refining. Keeps the natural aroma and nutrients intact for daily cooking.",
    routineSchedule:
      "Ideal for daily sambar, rasam, curries, and dosa seasoning",
    filterFn: (p) =>
      p.category?.toLowerCase().includes("oil") ||
      p.name?.toLowerCase().includes("oil"),
  },
  {
    id: "traditional-grains",
    tabLabel: "Millets & Traditional Rice",
    icon: Heart,
    badge: "Wholesome Grains",
    headline: "Unpolished Native Rice & Whole Millets",
    description:
      "Nutritious grains including Karuppu Kavuni rice, Kodo millet, and Barnyard millet. Retains natural bran and fiber for long-lasting energy.",
    routineSchedule: "Cook for lunch or dinner in place of polished white rice",
    filterFn: (p) =>
      p.category?.toLowerCase().includes("grain") ||
      p.category?.toLowerCase().includes("millet") ||
      p.name?.toLowerCase().includes("rice") ||
      p.name?.toLowerCase().includes("millet"),
  },
];

export default function DietPreferences() {
  const { products, addToCart } = useStore();
  const [activeRoutineId, setActiveRoutineId] = useState("morning-wellness");
  const [addedItem, setAddedItem] = useState(null);

  const activeRoutine =
    ROUTINE_CONFIG.find((r) => r.id === activeRoutineId) || ROUTINE_CONFIG[0];

  const filteredProducts = (products || [])
    .filter(activeRoutine.filterFn)
    .slice(0, 2);

  const handleQuickAdd = (product) => {
    addToCart(product);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <section className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5 text-left">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#D97706] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
            Everyday Healthy Habits
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 mt-2 tracking-tight">
            Shop by Daily Use & <span className="text-[#D97706]">Routine</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Choose pure, traditional staples suited for your family's everyday
            kitchen cooking.
          </p>
        </div>

        <Link
          to="/catalog"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-[#D97706] transition-colors self-start md:self-auto"
        >
          <span>View All Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Routine Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ROUTINE_CONFIG.map((routine) => {
          const Icon = routine.icon;
          const isActive = activeRoutineId === routine.id;
          return (
            <button
              key={routine.id}
              onClick={() => setActiveRoutineId(routine.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                  : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-[#D97706]" : "text-stone-500"
                }`}
              />
              <span>{routine.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Routine Showcase Card */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#92400E] bg-amber-100/70 border border-amber-200 px-2.5 py-0.5 rounded-md inline-block">
              {activeRoutine.badge}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {activeRoutine.headline}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl font-normal">
              {activeRoutine.description}
            </p>
          </div>

          <div className="lg:col-span-4 bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0 border border-amber-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-stone-900 block">How to Use</span>
              <span className="text-stone-600 text-[11px] leading-snug block mt-0.5">
                {activeRoutine.routineSchedule}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-stone-200 hover:border-[#D97706] p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 group transition-all shadow-xs"
              >
                <div className="w-full sm:w-28 sm:h-28 aspect-square rounded-lg overflow-hidden bg-stone-100 shrink-0 flex items-center justify-center p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left w-full">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D97706] font-bold block">
                    {product.category || "Farm Staple"}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-stone-900 line-clamp-1">
                    {product.name}
                  </h4>
                  <span className="text-[11px] text-stone-500 block">
                    {product.unit || "500ml / 1kg"}
                  </span>

                  <div className="flex items-center justify-center sm:justify-between gap-3 pt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-stone-900">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      disabled={product.inStock === false}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        addedItem === product.id
                          ? "bg-emerald-700 text-white"
                          : "bg-stone-900 hover:bg-[#D97706] hover:text-stone-950 text-white"
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>
                        {addedItem === product.id ? "Added" : "Add to Bag"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-6 text-xs text-stone-500">
              Loading fresh products from store inventory...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
