import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Activity,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Sun,
} from "lucide-react";
import { useStore } from "../context/storecontext";

// Map routine themes dynamically to categories existing in your database
const ROUTINE_CONFIG = [
  {
    id: "gut-detox",
    tabLabel: "Morning Detox & Gut",
    icon: Sun,
    badge: "Daily Vitality",
    headline: "Pure Digestion & Bioactive Enzyme Support",
    description:
      "Start your morning with unpasteurized raw honey and extra virgin oils to soothe the stomach lining, stimulate healthy bile flow, and fuel beneficial gut flora.",
    routineSchedule: "Consume 1 tsp raw at sunrise on an empty stomach",
    // Matches products where category is 'Groceries' or name contains 'Honey' or 'Coconut'
    filterFn: (p) =>
      p.category?.toLowerCase().includes("groceries") ||
      p.name?.toLowerCase().includes("honey") ||
      p.name?.toLowerCase().includes("coconut"),
  },
  {
    id: "heart-health",
    tabLabel: "Heart & Low-Cholesterol",
    icon: Heart,
    badge: "Lipid Balance",
    headline: "Natural Sesame Lignans & Zero Trans-Fats",
    description:
      "Naturally cold-pressed in native wooden chekkus without chemical extraction or bleaching. Preserves native sesamol antioxidants that help maintain healthy lipid profiles.",
    routineSchedule: "Primary cooking & tempering medium for everyday meals",
    // Matches cold-pressed oils from your database
    filterFn: (p) =>
      p.category?.toLowerCase().includes("oil") ||
      p.name?.toLowerCase().includes("oil"),
  },
  {
    id: "diabetic-balance",
    tabLabel: "Low-GI & Sustained Energy",
    icon: Activity,
    badge: "Metabolic Steady",
    headline: "Ancient Bran Fibers & Royal Anthocyanins",
    description:
      "Unpolished ancient grains that break down slowly into the bloodstream, eliminating post-meal sugar spikes and offering sustained stamina throughout the working day.",
    routineSchedule: "Replace polished white rice at lunch 3–4 days a week",
    // Matches millets, grains, and heritage rice from your database
    filterFn: (p) =>
      p.category?.toLowerCase().includes("grain") ||
      p.category?.toLowerCase().includes("millet") ||
      p.name?.toLowerCase().includes("rice") ||
      p.name?.toLowerCase().includes("millet"),
  },
];

export default function DietPreferences() {
  const { products, addToCart } = useStore();
  const [activeRoutineId, setActiveRoutineId] = useState("gut-detox");
  const [addedItem, setAddedItem] = useState(null);

  const activeRoutine =
    ROUTINE_CONFIG.find((r) => r.id === activeRoutineId) || ROUTINE_CONFIG[0];

  // Dynamically filter real products fetched from your MySQL backend
  const filteredProducts = (products || [])
    .filter(activeRoutine.filterFn)
    .slice(0, 2);

  const handleQuickAdd = (product) => {
    addToCart(product);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5ded1] pb-5">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#2e7d4d] bg-[#edf5ef] border border-[#cbe1d2] px-3 py-1 rounded-full inline-block">
            Intentional Nutrition
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#162a1e] mt-2">
            Shop by Daily Health Routine
          </h2>
          <p className="text-xs text-[#5c7365] mt-1 max-w-xl">
            Choose whole-food staples mapped directly to your family's wellness
            objectives.
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1b3b27] hover:text-[#2e7d4d] transition-colors self-start md:self-auto"
        >
          <span>Explore All Harvests</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Routine Category Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ROUTINE_CONFIG.map((routine) => {
          const Icon = routine.icon;
          const isActive = activeRoutineId === routine.id;
          return (
            <button
              key={routine.id}
              onClick={() => setActiveRoutineId(routine.id)}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[#1b3b27] text-white shadow-md border border-[#2b533a]"
                  : "bg-white text-[#516859] border border-[#ded5c7] hover:bg-[#faf7f2] hover:border-[#1b3b27]"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-[#e0b253]" : "text-[#879f90]"
                }`}
              />
              <span>{routine.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Active Routine Showcase Canvas */}
      <div className="bg-white rounded-3xl border border-[#ded5c7] shadow-[0_6px_30px_rgba(22,42,30,0.04)] p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Banner Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8a5b20] bg-[#fdf5e8] border border-[#f5deba] px-2.5 py-0.5 rounded-full">
                {activeRoutine.badge}
              </span>
              <span className="text-[11px] text-[#6d8274] font-medium">
                • Verified Native Lineage
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#162a1e]">
              {activeRoutine.headline}
            </h3>
            <p className="text-xs sm:text-sm text-[#5c7365] leading-relaxed max-w-2xl">
              {activeRoutine.description}
            </p>
          </div>

          <div className="lg:col-span-4 bg-[#faf7f2] border border-[#e8e2d5] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b3b27] text-[#e0b253] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-[#162a1e] block">
                Recommended Usage
              </span>
              <span className="text-[#6d8274] text-[11px] leading-tight block">
                {activeRoutine.routineSchedule}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Products Grid (From Database) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#faf7f2] rounded-2xl border border-[#e8e2d5] hover:border-[#1b3b27] p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 transition-all duration-300 group"
              >
                {/* Product Thumbnail */}
                <div className="w-full sm:w-28 sm:h-28 aspect-square rounded-xl overflow-hidden bg-white border border-[#ded5c7] shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Information */}
                <div className="flex-1 space-y-1.5 text-center sm:text-left w-full">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#2e7d4d] font-bold block">
                    ✦ {product.category || "Native Harvest"}
                  </span>
                  <h4 className="font-serif font-bold text-base text-[#162a1e] group-hover:text-[#2e7d4d] transition-colors line-clamp-1">
                    {product.name}
                  </h4>
                  <span className="text-[11px] text-[#6d8274] block font-mono">
                    {product.unit || "Standard Unit"}
                  </span>

                  <div className="flex items-center justify-center sm:justify-between gap-3 pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-xl font-bold text-[#1b3b27]">
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
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-2xs ${
                        addedItem === product.id
                          ? "bg-emerald-700 text-white"
                          : "bg-[#1b3b27] hover:bg-[#255236] text-white"
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#e0b253]" />
                      <span>
                        {addedItem === product.id ? "Added!" : "Add to Bag"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-6 text-xs text-[#6d8274]">
              Harvest products are loading from the pantry...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
