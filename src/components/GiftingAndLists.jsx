import React from "react";
import { Link } from "react-router-dom";
import { Gift, ArrowRight } from "lucide-react";
import { useStore } from "../context/storecontext";

export default function GiftingAndLists() {
  const { products, giftingConfig } = useStore();
  const featured = (products || []).slice(0, 3);
  const onSale = (products || []).slice(3, 6);

  const config = giftingConfig || {
    badge: "Pure Heritage Assortment",
    title: "Wholesome Gifting Made Easy",
    description:
      "Curated gift boxes of raw forest honey, cultured A2 ghee, and wood-pressed oils packed in hand-carved pinewood.",
    buttonText: "Explore Gift Sets",
    targetCategory: "Groceries",
  };

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left 8 Cols: Dual Product Lists */}
      <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 bg-white border border-brand-border rounded-2xl p-6 sm:p-8">
        {/* Column 1 */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-brand-dark border-b border-brand-border pb-3">
            Featured Farm Staples
          </h3>
          <div className="space-y-4">
            {featured.map((p) => (
              <Link
                key={p.id}
                to="/shop"
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-xl bg-brand-bg border border-brand-border overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-brand-dark truncate group-hover:text-brand-green transition-colors">
                    {p.name}
                  </h4>
                  <span className="text-[11px] text-brand-muted block">
                    {p.unit}
                  </span>
                  <span className="text-xs font-bold text-brand-dark">
                    ₹{p.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-brand-dark border-b border-brand-border pb-3">
            Seasonal Farm Specials
          </h3>
          <div className="space-y-4">
            {onSale.map((p) => (
              <Link
                key={p.id}
                to="/shop"
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-xl bg-brand-bg border border-brand-border overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-brand-dark truncate group-hover:text-brand-green transition-colors">
                    {p.name}
                  </h4>
                  <span className="text-[11px] text-brand-muted block">
                    {p.unit}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-dark">
                      ₹{p.price}
                    </span>
                    <span className="text-[10px] text-brand-muted line-through">
                      ₹{Number(p.price) + 40}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right 4 Cols: Gifting Card */}
      <div className="lg:col-span-4 rounded-2xl bg-brand-cream border border-brand-border p-8 flex flex-col justify-between text-center relative overflow-hidden">
        <div className="space-y-3 relative z-10">
          <div className="w-12 h-12 rounded-full bg-white border border-brand-border text-brand-green mx-auto flex items-center justify-center shadow-xs">
            <Gift className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-green block">
            {config.badge}
          </span>
          <h3 className="text-2xl font-bold text-brand-dark">{config.title}</h3>
          <p className="text-xs text-brand-subtext leading-relaxed">
            {config.description}
          </p>
        </div>

        <div className="pt-6 relative z-10">
          <Link
            to={`/shop?category=${encodeURIComponent(config.targetCategory || "Groceries")}`}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-brand-dark hover:bg-brand-green text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            {config.buttonText} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
