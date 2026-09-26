import React from "react";
import { Link } from "react-router-dom";
import HeroSection from "../../components/HeroSection";
import ShopByCategory from "../../components/ShopByCategory";
import DietPreferences from "../../components/DietPreference";
import GiftingAndLists from "../../components/GiftingAndLists";
import CustomerTestimonials from "../../components/CustomerTestimonials";
import ProductCard from "../../components/ProductCard";
import MillHeritage from "../../components/MillHeritage";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  FlameKindling,
  Leaf,
  Users,
  Award,
  Layers,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "../../context/storecontext";

export default function Home() {
  const { products } = useStore();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-20 space-y-20 font-sans selection:bg-[#1c3829] selection:text-[#e0b253]">
      {/* 1. HERO SHOWCASE */}
      <HeroSection />

      {/* 2. LIVE FARM EXTRACTION DISPATCH TICKER (Luxury Micro-Ribbon) */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1c3829] via-[#244633] to-[#1c3829] border border-[#e0b253]/30 p-3 sm:p-4 text-white shadow-md overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e0b253] animate-pulse shrink-0" />
          <span className="font-serif italic text-[#e0b253] text-sm">
            Live Farm Collective Pulse:
          </span>
          <span className="text-[#d6e8de] text-[11px] sm:text-xs">
            Vaagai wood-chekku batch #26 crushed today below 42°C • Same-day
            dispatch available
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-[#a5c7b3] shrink-0">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#e0b253]" /> Hand-packed in 24h
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#e0b253]" /> 100% Native
            Seeds
          </span>
        </div>
      </div>

      {/* 3. CATEGORY HUBS */}
      <ShopByCategory />

      <MillHeritage />

      {/* 4. DIET & HEALTH PREFERENCES */}
      <DietPreferences />

      {/* 5. ELEVATED BOTANICAL TRUST PILLARS (Tailored Luxury Vector Emblems) */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#2e7d4d] bg-[#edf5ef] px-3.5 py-1 rounded-full border border-[#cbe1d2] inline-block">
            Our Lineage Standards
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#162a1e]">
            Purity Without Compromise
          </h2>
          <p className="text-xs text-[#5c7365]">
            Every bottle and grain packet honors traditional slow-milling
            principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card 1: Native Seed Purity */}
          <div className="p-8 rounded-3xl bg-white border border-[#e8e2d5] hover:border-[#1c3829] space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#1c3829] text-[#e0b253] flex items-center justify-center border border-[#2e5941] shadow-xs group-hover:scale-105 transition-transform duration-300">
                <Leaf className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#738d81] bg-[#faf7f2] border border-[#e8e2d5] px-2.5 py-1 rounded-full">
                Zero Chemicals
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#162a1e] group-hover:text-[#2e7d4d] transition-colors">
              Indigenous Heritage Seeds
            </h3>
            <p className="text-xs text-[#5c7365] leading-relaxed">
              Harvested exclusively from native rain-fed soils without synthetic
              pesticides, genetic hybrids, or chemical polishing agents.
            </p>
          </div>

          {/* Card 2: Sub-42°C Cold Wood-Chekku Extraction */}
          <div className="p-8 rounded-3xl bg-white border border-[#e8e2d5] hover:border-[#1c3829] space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#1c3829] text-[#e0b253] flex items-center justify-center border border-[#2e5941] shadow-xs group-hover:scale-105 transition-transform duration-300">
                <FlameKindling className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#738d81] bg-[#faf7f2] border border-[#e8e2d5] px-2.5 py-1 rounded-full">
                &lt; 42°C Extraction
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#162a1e] group-hover:text-[#2e7d4d] transition-colors">
              Vaagai Hardwood Chekku
            </h3>
            <p className="text-xs text-[#5c7365] leading-relaxed">
              Crushed gently in traditional wooden mortars below 42°C to protect
              delicate lauric lipids, natural antioxidants, and raw village
              aroma.
            </p>
          </div>

          {/* Card 3: Fair Direct Farmer Collective */}
          <div className="p-8 rounded-3xl bg-white border border-[#e8e2d5] hover:border-[#1c3829] space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#1c3829] text-[#e0b253] flex items-center justify-center border border-[#2e5941] shadow-xs group-hover:scale-105 transition-transform duration-300">
                <Users className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#738d81] bg-[#faf7f2] border border-[#e8e2d5] px-2.5 py-1 rounded-full">
                Direct Lineage
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#162a1e] group-hover:text-[#2e7d4d] transition-colors">
              Fair Farmer Collective
            </h3>
            <p className="text-xs text-[#5c7365] leading-relaxed">
              100% ethical compensation channeled directly back to South Indian
              family farms with zero intermediary markups or wholesale dilution.
            </p>
          </div>
        </div>
      </section>

      {/* 6. ESSENTIAL LISTS & GIFTING BOX */}
      <GiftingAndLists />

      {/* 7. CURATED HARVESTS (Featured Products) */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e8e2d5] pb-5">
          <div>
            <span className="text-[11px] font-bold text-[#2e7d4d] uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#e0b253]" /> Hand-Selected
              Reserve
            </span>
            <h2 className="font-serif text-3xl font-normal text-[#162a1e] mt-1">
              Curated Farm Harvests
            </h2>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1c3829] hover:text-[#2e7d4d] transition-colors"
          >
            <span>Explore Entire Pantry</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. CUSTOMER TESTIMONIALS */}
      <CustomerTestimonials />
    </div>
  );
}
