import React, { useState } from "react";
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
  Clock,
  CheckCircle2,
  MapPin,
  AlertCircle,
  TrendingUp,
  HeartHandshake,
  Bot,
  Zap,
} from "lucide-react";
import { useStore } from "../../context/storecontext";

export default function Home() {
  const { products } = useStore();
  const featuredProducts = (products || []).slice(0, 3);

  // Modern 2026 Pre-Checkout Serviceability State
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [checkingPin, setCheckingPin] = useState(false);

  const checkPincode = async (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) return;
    setCheckingPin(true);
    setPincodeStatus(null);

    try {
      const apiUrl =
        process.env.REACT_APP_API_URL || "https://pure-organics1.onrender.com";
      const res = await fetch(`${apiUrl}/api/pincodes/check/${pincode}`);
      const data = await res.json();
      setPincodeStatus(data);
    } catch (err) {
      setPincodeStatus({
        serviceable: false,
        message: "Network lookup failed. Please try again.",
      });
    } finally {
      setCheckingPin(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-24 space-y-16 sm:space-y-24 font-sans selection:bg-[#1c3829] selection:text-[#e0b253]">
      {/* 1. HERO SHOWCASE */}
      <HeroSection />

      {/* 2. 2026 BENTO DISPATCH & SERVICEABILITY DUAL-BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Live Mill Dispatch Pulse */}
        <div className="lg:col-span-7 rounded-3xl bg-[#1c3829] border border-[#e0b253]/30 p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#2e5941]/30 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 z-10">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e0b253] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e0b253]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif italic text-[#e0b253] text-sm">
                  Live Farm Collective Pulse
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#2e5941] text-[#e0b253] text-[10px] font-mono uppercase tracking-wider">
                  Real-time
                </span>
              </div>
              <p className="text-[#d6e8de] text-[11px] sm:text-xs mt-0.5">
                Vaagai wood-chekku batch crushed below 42°C in Tirunelveli •
                Direct farm gate dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-[#a5c7b3] shrink-0 z-10 border-t sm:border-t-0 sm:border-l border-[#2e5941] pt-2 sm:pt-0 sm:pl-4">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#e0b253]" /> Milled in 24h
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#e0b253]" /> Raw & Pure
            </span>
          </div>
        </div>

        {/* Right: Instant Postal Serviceability Check */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-[#e8e2d5] p-3.5 sm:p-4 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#2e7d4d] flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#e0b253]" /> Check Delivery
              Viability
            </span>
            <span className="text-[10px] text-[#738d81] font-mono">
              TN & All-India
            </span>
          </div>
          <form onSubmit={checkPincode} className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#738d81]" />
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit Pincode"
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#faf7f2] border border-[#e8e2d5] rounded-2xl focus:outline-none focus:border-[#1c3829] text-[#162a1e] placeholder:text-[#889d91] transition font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={checkingPin || pincode.length !== 6}
              className="px-5 py-2 bg-[#1c3829] hover:bg-[#2e5941] disabled:opacity-50 text-[#e0b253] text-xs font-bold rounded-2xl transition duration-150 shrink-0 shadow-xs"
            >
              {checkingPin ? "Verifying..." : "Check"}
            </button>
          </form>

          {/* Serviceability Result Feedback */}
          {pincodeStatus && (
            <div
              className={`mt-2.5 p-2 rounded-xl text-[11px] flex items-center gap-2 ${
                pincodeStatus.serviceable
                  ? "bg-[#edf5ef] text-[#162a1e] border border-[#cbe1d2]"
                  : "bg-rose-50 text-rose-900 border border-rose-200"
              }`}
            >
              {pincodeStatus.serviceable ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#2e7d4d] shrink-0" />
                  <span className="truncate">
                    Serviceable for <strong>{pincodeStatus.district}</strong>:{" "}
                    {pincodeStatus.deliveryDays}d delivery •{" "}
                    {pincodeStatus.codAvailable ? "COD Available" : "Prepaid"}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="truncate">
                    {pincodeStatus.message ||
                      "Pincode currently outside delivery network."}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. CATEGORY HUBS */}
      <ShopByCategory />

      {/* 4. HERITAGE & MILL STORY */}
      <MillHeritage />

      {/* 5. DIET & HEALTH PREFERENCES */}
      <DietPreferences />

      {/* 6. 2026 ELEVATED BENTO TRUST PILLARS */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#2e7d4d] bg-[#edf5ef] px-3.5 py-1 rounded-full border border-[#cbe1d2] inline-block">
            Our Lineage Standards
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#162a1e]">
            Purity Without Compromise
          </h2>
          <p className="text-xs text-[#5c7365]">
            Every bottle and heirloom grain packet honors slow-milling
            extraction principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Bento Card 1: Native Seed Purity */}
          <div className="p-8 rounded-3xl bg-white border border-[#e8e2d5] hover:border-[#1c3829] space-y-5 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#1c3829] text-[#e0b253] flex items-center justify-center border border-[#2e5941] shadow-xs group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#2e7d4d] bg-[#edf5ef] border border-[#cbe1d2] px-3 py-1 rounded-full font-bold">
                  Zero Chemicals
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#162a1e] group-hover:text-[#2e7d4d] transition-colors">
                Indigenous Heritage Seeds
              </h3>
              <p className="text-xs text-[#5c7365] leading-relaxed">
                Harvested exclusively from native rain-fed soils without
                synthetic pesticides, genetic hybrid clones, or chemical talc
                polishing.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e8e2d5]/60 flex items-center justify-between text-[11px] font-semibold text-[#1c3829]">
              <span>12+ Seed Varieties Preserved</span>
              <span className="text-[#e0b253] font-bold">100% Native</span>
            </div>
          </div>

          {/* Bento Card 2: Sub-42°C Cold Wood-Chekku Extraction */}
          <div className="p-8 rounded-3xl bg-white border border-[#e8e2d5] hover:border-[#1c3829] space-y-5 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#1c3829] text-[#e0b253] flex items-center justify-center border border-[#2e5941] shadow-xs group-hover:scale-110 transition-transform duration-300">
                  <FlameKindling className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#b45309] bg-[#fef3c7] border border-[#fde68a] px-3 py-1 rounded-full font-bold">
                  &lt; 42°C Extraction
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#162a1e] group-hover:text-[#2e7d4d] transition-colors">
                Vaagai Hardwood Chekku
              </h3>
              <p className="text-xs text-[#5c7365] leading-relaxed">
                Crushed gently in traditional wooden mortars below 42°C to
                safeguard delicate lauric lipids, natural polyphenol
                antioxidants, and authentic village aroma.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e8e2d5]/60 flex items-center justify-between text-[11px] font-semibold text-[#1c3829]">
              <span>Zero Heat Degumming</span>
              <span className="text-[#e0b253] font-bold">Cold Pressed</span>
            </div>
          </div>

          {/* Bento Card 3: Fair Direct Farmer Collective */}
          <div className="p-8 rounded-3xl bg-white border border-[#e8e2d5] hover:border-[#1c3829] space-y-5 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#1c3829] text-[#e0b253] flex items-center justify-center border border-[#2e5941] shadow-xs group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1c3829] bg-[#faf7f2] border border-[#e8e2d5] px-3 py-1 rounded-full font-bold">
                  Direct Lineage
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#162a1e] group-hover:text-[#2e7d4d] transition-colors">
                Fair Farmer Collective
              </h3>
              <p className="text-xs text-[#5c7365] leading-relaxed">
                100% ethical compensation channeled directly to South Indian
                grower families with zero broker margins or wholesale inventory
                dilution.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e8e2d5]/60 flex items-center justify-between text-[11px] font-semibold text-[#1c3829]">
              <span>Direct Farm-Gate Compensation</span>
              <span className="text-[#e0b253] font-bold">Zero Middlemen</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ESSENTIAL LISTS & GIFTING BOX */}
      <GiftingAndLists />

      {/* 8. CURATED HARVESTS (Featured Products) */}
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

      {/* 9. 2026 AI SOMMELIER INTERACTIVE CALLOUT (Organic Light Theme) */}
      <div className="rounded-3xl bg-[#faf7f2] border border-[#e8e2d5] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xs">
        <div className="space-y-3 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2e7d4d] bg-[#edf5ef] px-3.5 py-1 rounded-full border border-[#cbe1d2]">
            <Bot className="w-3.5 h-3.5 text-[#e0b253]" />
            Ask 'Nila' • 24/7 AI Herbal Sommelier
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#162a1e]">
            Unsure which native staple suits your family?
          </h3>
          <p className="text-xs text-[#5c7365] leading-relaxed">
            Consult Nila for instant nutritional guidance on managing diabetic
            diets with Karuppu Kavuni, selecting high smoke-point oils for
            Indian kitchens, or tracing batch extraction temperatures.
          </p>
          {/* Interactive Topic Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              "Which oil for daily cooking?",
              "Karuppu Kavuni benefits?",
              "Low-GI grains",
            ].map((chip, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white border border-[#e8e2d5] text-[#1c3829] shadow-2xs"
              >
                ✨ {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full md:w-auto shrink-0">
          <Link
            to="/shop"
            className="w-full sm:w-auto text-center px-6 py-3 rounded-2xl bg-[#1c3829] hover:bg-[#2e5941] text-[#e0b253] text-xs font-bold uppercase tracking-wider transition shadow-sm"
          >
            Explore Complete Pantry
          </Link>
        </div>
      </div>

      {/* 10. CUSTOMER TESTIMONIALS */}
      <CustomerTestimonials />
    </div>
  );
}
