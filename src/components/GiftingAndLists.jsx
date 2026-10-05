import React from "react";
import { Link } from "react-router-dom";
import { Gift, ArrowRight } from "lucide-react";
import { useStore } from "../context/storecontext";

const VALUE_COMBOS = [
  {
    id: "combo-1",
    name: "Pure Chekku Trio (1L x 3)",
    items: "Groundnut Oil + Sesame Oil + Coconut Oil",
    price: 940,
    originalPrice: 1040,
    badge: "Best Seller",
  },
  {
    id: "combo-2",
    name: "Village Sweetener Box",
    items: "Pure Wild Forest Honey (500g) + Palm Jaggery (1kg)",
    price: 620,
    originalPrice: 700,
    badge: "Save ₹80",
  },
  {
    id: "combo-3",
    name: "Traditional Millet & Rice Pack",
    items: "Karuppu Kavuni Rice (1kg) + Kodo Millet (1kg)",
    price: 360,
    originalPrice: 410,
    badge: "Healthy Choice",
  },
];

export default function GiftingAndLists() {
  const { products } = useStore();
  const featured = (products || []).slice(0, 3);
  const onSale = (products || []).slice(3, 6);

  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#141815] border-y border-white/10 py-10 sm:py-14 px-4 sm:px-8 lg:px-14 overflow-hidden select-none m-0 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-5 text-left">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D97706] bg-[#D97706]/15 border border-[#D97706]/30 px-3 py-1 rounded-full inline-block">
              Kitchen Essentials & Sets
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Pantry Bundles &{" "}
              <span className="text-[#D97706]">Daily Staples</span>
            </h2>
          </div>
          <Link
            to="/catalog"
            className="text-xs font-bold uppercase tracking-wider text-stone-300 hover:text-[#D97706] transition-colors self-start sm:self-auto"
          >
            Explore All Items →
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Top Selling & Weekly Discounts */}
          <div className="lg:col-span-8 bg-[#1C221E] border border-white/10 rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* List 1 */}
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Top Selling Essentials
                  </h3>
                  <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase">
                    Daily Fresh
                  </span>
                </div>

                <div className="space-y-3">
                  {featured.map((p) => (
                    <Link
                      key={p.id}
                      to="/catalog"
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-[#262E29] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-[#D97706] transition-colors">
                          {p.name}
                        </h4>
                        <span className="text-[11px] text-stone-400 block mt-0.5">
                          {p.unit || "Standard Pack"}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white mt-1 block">
                          ₹{p.price}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* List 2 */}
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Weekly Batch Offers
                  </h3>
                  <span className="text-[10px] font-mono text-[#F59E0B] font-bold uppercase">
                    Direct Savings
                  </span>
                </div>

                <div className="space-y-3">
                  {onSale.map((p) => (
                    <Link
                      key={p.id}
                      to="/catalog"
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-[#262E29] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-[#D97706] transition-colors">
                          {p.name}
                        </h4>
                        <span className="text-[11px] text-stone-400 block mt-0.5">
                          {p.unit || "Standard Pack"}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs sm:text-sm font-bold text-white">
                            ₹{p.price}
                          </span>
                          <span className="text-[11px] text-stone-400 line-through">
                            ₹{Number(p.price) + 40}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-400 text-left">
              <span>
                Free doorstep shipping across Tamil Nadu on orders above ₹799
              </span>
              <span className="text-[#D97706] font-semibold">
                Cash On Delivery Available
              </span>
            </div>
          </div>

          {/* Right Column: Value Combos */}
          <div className="lg:col-span-4 rounded-2xl bg-[#1C221E] border border-white/10 p-5 sm:p-6 flex flex-col justify-between text-left shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97706]/15 border border-[#D97706]/30 text-[#F59E0B] text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Gift className="w-3.5 h-3.5" />
                  Family Kitchen Combos
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  Save on Sets
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Value Combo Packs
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Buy routine cooking pairs together and save directly on
                  packaging costs.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {VALUE_COMBOS.map((combo) => (
                  <div
                    key={combo.id}
                    className="bg-[#242C27] border border-white/10 hover:border-[#D97706]/60 rounded-xl p-3 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h5 className="text-xs font-bold text-white">
                        {combo.name}
                      </h5>
                      <span className="text-[9px] font-mono font-bold bg-[#D97706] text-black px-1.5 py-0.5 rounded">
                        {combo.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-snug line-clamp-1 mb-2">
                      {combo.items}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          ₹{combo.price}
                        </span>
                        <span className="text-[10px] text-stone-400 line-through">
                          ₹{combo.originalPrice}
                        </span>
                      </div>
                      <Link
                        to="/catalog"
                        className="text-[11px] font-bold text-[#F59E0B] hover:underline"
                      >
                        Order Pack →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-white/10">
              <Link
                to="/catalog"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#D97706] hover:bg-[#B45309] text-black text-xs font-extrabold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>View All Combo Packs</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
