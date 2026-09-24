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
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left 8 Cols: Clean White Lists */}
      <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 bg-white border border-[#e8e2d5] rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        {/* Column 1: Featured Staples */}
        <div className="space-y-5">
          <h3 className="font-serif text-lg font-bold text-[#162a1e] border-b border-[#eee8dd] pb-3">
            Featured Farm Staples
          </h3>
          <div className="space-y-4">
            {featured.map((p) => (
              <Link
                key={p.id}
                to="/shop"
                className="flex items-center gap-4 group cursor-pointer"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 rounded-xl object-cover bg-[#faf7f2] border border-[#e5dfd2] group-hover:border-[#2e7d4d] transition-colors shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-[#162a1e] truncate group-hover:text-[#2e7d4d] transition-colors">
                    {p.name}
                  </h4>
                  <span className="text-[11px] text-[#6d8274] block">
                    {p.unit}
                  </span>
                  <span className="text-xs font-bold font-serif text-[#1b3b27]">
                    ₹{p.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Column 2: Seasonal Specials */}
        <div className="space-y-5">
          <h3 className="font-serif text-lg font-bold text-[#162a1e] border-b border-[#eee8dd] pb-3">
            Seasonal Farm Specials
          </h3>
          <div className="space-y-4">
            {onSale.map((p) => (
              <Link
                key={p.id}
                to="/shop"
                className="flex items-center gap-4 group cursor-pointer"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 rounded-xl object-cover bg-[#faf7f2] border border-[#e5dfd2] group-hover:border-[#2e7d4d] transition-colors shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-[#162a1e] truncate group-hover:text-[#2e7d4d] transition-colors">
                    {p.name}
                  </h4>
                  <span className="text-[11px] text-[#6d8274] block">
                    {p.unit}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-serif text-[#1b3b27]">
                      ₹{p.price}
                    </span>
                    <span className="text-[10px] text-[#8e9f93] line-through">
                      ₹{Number(p.price) + 40}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right 4 Cols: Botanical Green Gifting Card (Controlled by Admin) */}
      <div className="lg:col-span-4 rounded-3xl bg-gradient-to-b from-[#1b3b27] to-[#12291b] border border-[#1b3b27] p-8 flex flex-col justify-between text-center relative overflow-hidden shadow-lg text-white">
        <div className="space-y-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#c58f38] text-[#162a1e] mx-auto flex items-center justify-center shadow-md">
            <Gift className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#f4e3b2] block">
            {config.badge}
          </span>
          <h3 className="font-serif text-2xl font-normal text-white">
            {config.title}
          </h3>
          <p className="text-xs text-[#cfddd4] leading-relaxed">
            {config.description}
          </p>
        </div>

        <div className="pt-6 relative z-10">
          <Link
            to={`/shop?category=${encodeURIComponent(config.targetCategory || "Groceries")}`}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#c58f38] hover:bg-[#d8a44d] text-[#162a1e] text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
          >
            {config.buttonText} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
