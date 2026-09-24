import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Leaf,
  HeartHandshake,
  Truck,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { useStore } from "../context/storecontext";

export default function Footer() {
  const { footerConfig } = useStore();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const config = footerConfig || {
    headline: "Receive fresh batches, harvest updates & private sales.",
    subtext:
      "Zero spam. Only authentic seasonal harvest notices directly from local farms.",
    philosophy:
      "Preserving traditional farming lineages with slow-milled ancient millets, native cold-pressed oils, and raw forest flora honey delivered directly to your kitchen.",
    badgeText: "Direct from South Indian farming collectives",
    phone: "+91 94882 10344 (Mon - Sat)",
    email: "orders@pureorganics.store",
    address: "Farm Unit, Madurai Highway Collective, Tamil Nadu, India",
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3500);
  };

  return (
    <footer className="relative bg-[#f4f0e6] text-[#516859] pt-20 pb-12 mt-28 border-t border-[#e8e2d5] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Newsletter Card */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-[#2e7d4d]/30 via-[#c58f38]/20 to-[#2e7d4d]/30 shadow-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 border border-[#e8e2d5]">
            <div className="space-y-2 max-w-xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.2em] text-[#2e7d4d] bg-[#edf5ef] px-3 py-1 rounded-full">
                <Sparkles className="w-3 h-3 text-[#c58f38]" /> Seasonal Harvest
                Dispatch
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#162a1e] font-normal leading-tight">
                {config.headline}
              </h3>
              <p className="text-xs text-[#6d8274]">{config.subtext}</p>
            </div>

            {/* Newsletter Input Form */}
            <form
              onSubmit={handleSubscribe}
              className="w-full lg:w-auto flex-1 max-w-md"
            >
              <div className="relative flex items-center bg-[#faf7f2] border border-[#dcd4c7] rounded-full p-1.5 focus-within:border-[#2e7d4d] transition-all shadow-inner">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full pl-5 pr-3 text-xs bg-transparent text-[#162a1e] placeholder-[#8e9f93] focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm hover:brightness-105 cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  {subscribed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3] text-[#c58f38]" />{" "}
                      Joined
                    </>
                  ) : (
                    <>
                      Subscribe{" "}
                      <ArrowRight className="w-3.5 h-3.5 text-[#c58f38]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 4 Feature Value Props */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="bg-white border border-[#e8e2d5] rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#edf5ef] border border-[#cbe1d2] flex items-center justify-center text-[#1b3b27] shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#162a1e] leading-snug">
                100% Native Seeds
              </h5>
              <p className="text-[11px] text-[#738d81] mt-0.5">
                Zero GMO or hybrid grain
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e8e2d5] rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#edf5ef] border border-[#cbe1d2] flex items-center justify-center text-[#1b3b27] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#162a1e] leading-snug">
                Wood Chekku Pressed
              </h5>
              <p className="text-[11px] text-[#738d81] mt-0.5">
                Extracted under 42°C
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e8e2d5] rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#edf5ef] border border-[#cbe1d2] flex items-center justify-center text-[#1b3b27] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#162a1e] leading-snug">
                Doorstep COD
              </h5>
              <p className="text-[11px] text-[#738d81] mt-0.5">
                Inspect items before pay
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e8e2d5] rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#edf5ef] border border-[#cbe1d2] flex items-center justify-center text-[#1b3b27] shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#162a1e] leading-snug">
                Direct Lineage
              </h5>
              <p className="text-[11px] text-[#738d81] mt-0.5">
                Direct farmer collective
              </p>
            </div>
          </div>
        </div>

        {/* Multi-Column Content & Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-4 pb-12 border-b border-[#e2dacf]">
          {/* Column 1: Brand & Philosophy */}
          <div className="md:col-span-4 space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-[#162a1e] group"
            >
              <div className="w-9 h-9 rounded-full bg-[#edf5ef] border border-[#cbe1d2] flex items-center justify-center text-[#1b3b27] shadow-xs group-hover:scale-105 transition-transform duration-300">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#162a1e]">
                Pure
                <span className="italic font-normal text-[#2e7d4d] ml-1 font-serif">
                  Organics
                </span>
              </span>
            </Link>
            <p className="text-xs text-[#5c7365] max-w-sm leading-relaxed">
              {config.philosophy}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#dce7df] text-[11px] text-[#1b3b27]">
              <span className="w-2 h-2 rounded-full bg-[#2e7d4d] animate-pulse" />
              {config.badgeText}
            </div>
          </div>

          {/* Column 2: Quick Navigation (Clean - No Staff Portal Link) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1b3b27]">
              Storefront
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5c7365]">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#1b3b27] hover:translate-x-1 inline-block transition-all duration-200"
                >
                  Home Overview
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-[#1b3b27] hover:translate-x-1 inline-block transition-all duration-200"
                >
                  Organic Catalog
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="hover:text-[#1b3b27] hover:translate-x-1 inline-block transition-all duration-200"
                >
                  Track Delivery
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-[#1b3b27] hover:translate-x-1 inline-block transition-all duration-200"
                >
                  Basket & COD
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Regional Harvest Staples */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1b3b27]">
              Native Staples
            </h4>
            <ul className="space-y-2 text-xs text-[#5c7365]">
              <li>
                <span className="text-[#162a1e] font-semibold">
                  Cold-Pressed:
                </span>{" "}
                Vaagai Wood Sesame, Groundnut & Coconut Oils
              </li>
              <li>
                <span className="text-[#162a1e] font-semibold">Millets:</span>{" "}
                Barnyard, Foxtail, Kodo & Little Millet
              </li>
              <li>
                <span className="text-[#162a1e] font-semibold">
                  Sweeteners:
                </span>{" "}
                Pure Palm Jaggery & Raw Marunthu Thaen
              </li>
              <li>
                <span className="text-[#162a1e] font-semibold">Flours:</span>{" "}
                Stone-Ground Red Rice, Sprouted Ragi & Samba Wheat
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1b3b27]">
              Collective Support
            </h4>
            <div className="space-y-2.5 text-xs text-[#5c7365]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#2e7d4d] shrink-0 mt-0.5" />
                <span>{config.address || "Farm Unit, Tamil Nadu, India"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2e7d4d] shrink-0" />
                <span>{config.phone || "+91 94882 10344"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#2e7d4d] shrink-0" />
                <span>{config.email || "orders@pureorganics.store"}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#2e7d4d] pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Orders dispatched within 24 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#849a8d]">
          <p>
            © 2026 PureOrganics Store Collective. FSSAI & NPOP Certified
            lineage.
          </p>
          <p className="font-serif italic text-[#1b3b27] text-sm">
            Zero heat. Zero chemicals. Zero rush.
          </p>
        </div>
      </div>
    </footer>
  );
}
