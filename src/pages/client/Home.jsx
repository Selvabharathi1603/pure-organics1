import React from "react";
import { Link } from "react-router-dom";
import HeroSection from "../../components/HeroSection";
import ShopByCategory from "../../components/ShopByCategory";
import DietPreferences from "../../components/DietPreference";
import GiftingAndLists from "../../components/GiftingAndLists";
import CustomerTestimonials from "../../components/CustomerTestimonials";
import { ArrowRight, ShieldCheck, HeartHandshake, Compass } from "lucide-react";
import { useStore } from "../../context/storecontext";
import ProductCard from "../../components/ProductCard";

export default function Home() {
  const { products } = useStore();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 space-y-16">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. CATEGORY HUBS */}
      <ShopByCategory />

      {/* 3. DIET & HEALTH PREFERENCES */}
      <DietPreferences />

      {/* 4. TRUST PILLARS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-white border border-[#e8e2d5] space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#edf5ef] border border-[#cbe1d2] text-[#2e7d4d] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#162a1e]">
            Zero Synthetic Pesticides
          </h3>
          <p className="text-xs text-[#5c7365] leading-relaxed">
            Every grain is grown naturally on native soils without chemical
            enhancers or pesticides.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#e8e2d5] space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#edf5ef] border border-[#cbe1d2] text-[#2e7d4d] flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#162a1e]">
            Cold Wood-Pressed
          </h3>
          <p className="text-xs text-[#5c7365] leading-relaxed">
            Crushed in traditional wooden chekkus below 45°C to preserve aroma
            and original nutrients.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#e8e2d5] space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#edf5ef] border border-[#cbe1d2] text-[#2e7d4d] flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#162a1e]">
            Fair Farmer Collective
          </h3>
          <p className="text-xs text-[#5c7365] leading-relaxed">
            100% direct remuneration back to regional farm producers with zero
            intermediary cuts.
          </p>
        </div>
      </section>

      {/* 5. ESSENTIAL LISTS & GIFTING BOX */}
      <GiftingAndLists />

      {/* 6. CURATED HARVESTS */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e8e2d5] pb-5">
          <div>
            <span className="text-[11px] font-bold text-[#2e7d4d] uppercase tracking-widest">
              Selected Essentials
            </span>
            <h2 className="font-serif text-3xl font-normal text-[#162a1e] mt-1">
              Curated Farm Harvests
            </h2>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1b3b27] hover:text-[#2e7d4d] transition-colors"
          >
            View Full Catalog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <CustomerTestimonials />
    </div>
  );
}
