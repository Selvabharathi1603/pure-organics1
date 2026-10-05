import React from "react";
import { Link } from "react-router-dom";
import HeroSection from "../../components/HeroSection";
import TrustBadgeMarquee from "../../components/TrustBadgeMarquee";
import ShopByCategory from "../../components/ShopByCategory";
import DietPreferences from "../../components/DietPreference";
import GiftingAndLists from "../../components/GiftingAndLists";
import CustomerTestimonials from "../../components/CustomerTestimonials";
import ProductCard from "../../components/ProductCard";
import MillHeritage from "../../components/MillHeritage";
import {
  ArrowRight,
  Flame,
  ShieldCheck,
  Users,
  MessageCircle,
} from "lucide-react";
import { useStore } from "../../context/storecontext";

export default function Home() {
  const { products } = useStore();
  const featuredProducts = (products || []).slice(0, 3);

  return (
    <div className="w-full bg-white text-stone-900 font-sans selection:bg-[#D97706] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-20 space-y-14 sm:space-y-20">
        {/* 1. HERO SHOWCASE */}
        <HeroSection />

        {/* 2. TRUST BADGE MARQUEE */}
        <TrustBadgeMarquee />

        {/* 3. CATEGORY HUBS */}
        <ShopByCategory />

        {/* 4. HERITAGE & MILL STORY */}
        <MillHeritage />

        {/* 5. DIET & DAILY HEALTH PREFERENCES */}
        <DietPreferences />

        {/* 6. OUR MILL QUALITY STANDARDS */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#D97706] bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200 inline-block">
              Our Quality Promise
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Purity Without <span className="text-[#D97706]">Compromise.</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Every bottle of oil and grain packet is freshly prepared following
              clean, honest village mill methods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Standard 1: Native Seed Purity */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-stone-200 hover:border-[#D97706] space-y-5 shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between text-left">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center border border-amber-200 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                    <ShieldCheck className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-700 bg-stone-100 border border-stone-200 px-3 py-1 rounded-full font-bold">
                    Zero Chemicals
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#D97706] transition-colors">
                  Native Heritage Seeds
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Harvested directly from local rain-fed soils without synthetic
                  sprays, chemical fertilizers, or artificial seed polishing.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-stone-700">
                <span>12+ Seed Varieties Preserved</span>
                <span className="text-[#D97706] font-bold">100% Native</span>
              </div>
            </div>

            {/* Standard 2: Traditional Vaagai Chekku */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-stone-200 hover:border-[#D97706] space-y-5 shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between text-left">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center border border-amber-200 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                    <Flame className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#92400E] bg-amber-100/70 border border-amber-200 px-3 py-1 rounded-full font-bold">
                    Cold Pressed
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#D97706] transition-colors">
                  Vaagai Wood Chekku
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Gently crushed in native Vaagai wooden pestles with zero
                  machine boilers, preserving the genuine natural taste and
                  thick aroma.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-stone-700">
                <span>Zero Factory Heat</span>
                <span className="text-[#D97706] font-bold">
                  Unrefined Yield
                </span>
              </div>
            </div>

            {/* Standard 3: Direct Farmer Sourcing */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-stone-200 hover:border-[#D97706] space-y-5 shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between text-left">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center border border-amber-200 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                    <Users className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-700 bg-stone-100 border border-stone-200 px-3 py-1 rounded-full font-bold">
                    Direct Sourcing
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#D97706] transition-colors">
                  Direct from Village Farmers
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Sourced straight from grower families across Tirunelveli and
                  Thanjavur districts with fair payments and zero broker
                  markups.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-stone-700">
                <span>Fair Grower Payments</span>
                <span className="text-[#D97706] font-bold">Zero Middlemen</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. ESSENTIAL LISTS & GIFTING BOX */}
        <GiftingAndLists />

        {/* 8. FEATURED HARVESTS */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5 text-left">
            <div>
              <span className="text-[11px] font-mono font-bold text-[#D97706] uppercase tracking-widest">
                Fresh Mill Selection
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                Featured Farm Harvests
              </h2>
            </div>
            <Link
              to="/catalog"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-[#D97706] transition-colors"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 9. NILA ASSISTANT CALLOUT */}
        <div className="rounded-3xl bg-[#141815] text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-lg text-left border border-white/10">
          <div className="space-y-3 max-w-xl z-10">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#D97706] bg-white/10 px-3.5 py-1 rounded-full border border-white/15">
              <MessageCircle className="w-3.5 h-3.5" />
              Ask Nila • Product Assistant
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Unsure which native staple suits your family?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              Ask Nila for guidance on picking the right cooking oils, preparing
              Karuppu Kavuni rice, or understanding our cold-press process.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "Which oil for daily cooking?",
                "Karuppu Kavuni benefits",
                "Cold-press vs regular oils",
              ].map((chip, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-stone-300"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                const chatBtn = document.querySelector(
                  '[aria-label="Open Chat"]',
                );
                if (chatBtn) chatBtn.click();
              }}
              className="w-full sm:w-auto text-center px-6 py-3.5 rounded-full bg-[#D97706] hover:bg-[#B45309] text-black text-xs font-extrabold uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              Chat With Nila
            </button>
            <Link
              to="/catalog"
              className="w-full sm:w-auto text-center px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Browse Catalog
            </Link>
          </div>
        </div>

        {/* 10. CUSTOMER TESTIMONIALS */}
        <CustomerTestimonials />
      </div>
    </div>
  );
}
