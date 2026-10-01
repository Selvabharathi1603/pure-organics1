import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Activity,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Sun,
} from "lucide-react";
import { useStore } from "../context/storecontext";

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

  const filteredProducts = (products || [])
    .filter(activeRoutine.filterFn)
    .slice(0, 2);

  const handleQuickAdd = (product) => {
    addToCart(product);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <section className="space-y-8 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-border pb-5">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-green bg-white border border-brand-border px-3 py-1 rounded-full inline-block">
            Intentional Nutrition
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark mt-2 tracking-tight">
            Shop by Daily Health Routine
          </h2>
          <p className="text-xs sm:text-sm text-brand-subtext mt-1">
            Choose whole-food staples mapped directly to your family's wellness
            objectives.
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark hover:text-brand-green transition-colors"
        >
          <span>Explore All Harvests</span>
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
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-brand-dark text-white"
                  : "bg-white text-brand-subtext border border-brand-border hover:border-brand-dark"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-[#F7D070]" : "text-brand-green"}`}
              />
              <span>{routine.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Routine Showcase Bento Card */}
      <div className="bg-brand-cream rounded-2xl border border-brand-border p-6 sm:p-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark bg-white border border-brand-border px-2.5 py-0.5 rounded-full inline-block">
              {activeRoutine.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
              {activeRoutine.headline}
            </h3>
            <p className="text-xs sm:text-sm text-brand-subtext leading-relaxed max-w-2xl">
              {activeRoutine.description}
            </p>
          </div>

          <div className="lg:col-span-4 bg-white border border-brand-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-bg text-brand-green flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-brand-dark block">
                Recommended Usage
              </span>
              <span className="text-brand-subtext text-[11px] leading-tight block">
                {activeRoutine.routineSchedule}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-brand-border p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 group"
              >
                <div className="w-full sm:w-28 sm:h-28 aspect-square rounded-lg overflow-hidden bg-brand-bg shrink-0 flex items-center justify-center p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left w-full">
                  <span className="text-[10px] uppercase tracking-wider text-brand-green font-bold block">
                    {product.category || "Native Harvest"}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-brand-dark line-clamp-1">
                    {product.name}
                  </h4>
                  <span className="text-[11px] text-brand-muted block">
                    {product.unit || "Standard Unit"}
                  </span>

                  <div className="flex items-center justify-center sm:justify-between gap-3 pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-brand-dark">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-brand-muted line-through">
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
                          ? "bg-brand-green text-white"
                          : "bg-brand-dark hover:bg-brand-green text-white"
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
            <div className="col-span-2 text-center py-6 text-xs text-brand-muted">
              Harvest products are loading from the pantry...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
