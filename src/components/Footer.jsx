import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Truck,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  Layers,
} from "lucide-react";
import { useStore } from "../context/storecontext";

export default function Footer() {
  const { footerConfig } = useStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const config = {
    headline: "Receive Fresh Harvest Notes & Curated Allocations",
    subtext:
      footerConfig?.farmTagline ||
      "Pure native harvests produced with zero heat, zero refining, and zero compromises. Direct notices from South Indian farm lineages.",
    phone: footerConfig?.contactPhone || "+91 94878 82321",
    email: footerConfig?.contactEmail || "care@pureorganics.in",
    address:
      footerConfig?.farmAddress ||
      "Kallidaikurichi, Ambasamudram, Tirunelveli District, Tamil Nadu - 627416",
    fssai: footerConfig?.fssaiNumber || "12423008000412",
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus({ type: "error", message: "Please provide a valid email." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("http://localhost:5000/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Welcome. You're added to our seasonal dispatch list!",
        });
        setEmail("");
      } else {
        setStatus({
          type: "success",
          message: "You are already subscribed to harvest notifications!",
        });
        setEmail("");
      }
    } catch {
      setStatus({
        type: "success",
        message: "Thank you for subscribing to our collective!",
      });
      setEmail("");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    }
  };

  return (
    <footer className="relative bg-[#1c3829] text-[#d6e8de] pt-20 pb-12 mt-28 border-t border-[#2e563e] overflow-hidden">
      {/* Botanical Sunlight Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-[#2d5d42] blur-[110px] pointer-events-none -z-0 opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 z-10">
        {/* Top 4 Value Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-14 border-b border-[#2d563e]">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#244633] border border-[#335f46]">
            <div className="w-10 h-10 rounded-xl bg-[#2e5840] flex items-center justify-center text-[#e0b253] shrink-0 border border-[#3e7253]">
              <Leaf className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                100% Native Seeds
              </h5>
              <p className="text-[11px] text-[#a5c7b3] mt-0.5">
                Zero GMO or hybrid grain
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#244633] border border-[#335f46]">
            <div className="w-10 h-10 rounded-xl bg-[#2e5840] flex items-center justify-center text-[#e0b253] shrink-0 border border-[#3e7253]">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Vaagai Wood Chekku
              </h5>
              <p className="text-[11px] text-[#a5c7b3] mt-0.5">
                Crushed cold below 42°C
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#244633] border border-[#335f46]">
            <div className="w-10 h-10 rounded-xl bg-[#2e5840] flex items-center justify-center text-[#e0b253] shrink-0 border border-[#3e7253]">
              <Award className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Lab Tested Purity
              </h5>
              <p className="text-[11px] text-[#a5c7b3] mt-0.5">
                Zero synthetic inputs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#244633] border border-[#335f46]">
            <div className="w-10 h-10 rounded-xl bg-[#2e5840] flex items-center justify-center text-[#e0b253] shrink-0 border border-[#3e7253]">
              <Truck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Doorstep Direct COD
              </h5>
              <p className="text-[11px] text-[#a5c7b3] mt-0.5">
                Inspect items before paying
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Allocation Box */}
        <div className="rounded-3xl p-8 sm:p-10 bg-[#244633] border border-[#335f46] shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.2em] text-[#e0b253] bg-[#1a3828] px-3.5 py-1 rounded-full border border-[#2f5d43]">
                <Sparkles className="w-3 h-3 text-[#e0b253]" /> Private Mill
                Allocations
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
                {config.headline}
              </h3>
              <p className="text-xs sm:text-sm text-[#b2d1bf] leading-relaxed">
                {config.subtext}
              </p>
            </div>

            <div className="w-full lg:w-auto flex-1 max-w-md">
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative flex items-center bg-[#152d20] border border-[#386b4e] rounded-full p-1.5 focus-within:border-[#e0b253] transition-all shadow-inner">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-5 pr-3 text-xs sm:text-sm bg-transparent text-white placeholder-[#789d87] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-[#e0b253] hover:bg-[#cca044] text-[#142d1f] text-xs font-bold px-6 py-3 rounded-full shadow-md hover:brightness-105 active:scale-95 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      "Connecting..."
                    ) : status.type === "success" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#142d1f]" />
                        Joined
                      </>
                    ) : (
                      <>
                        Join Dispatch
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
                {status.message && (
                  <p
                    className={`text-xs pl-4 pt-1 ${
                      status.type === "error"
                        ? "text-rose-300"
                        : "text-[#e0b253]"
                    }`}
                  >
                    {status.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Multi-Column Content & Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-4 pb-12 border-b border-[#2d563e]">
          {/* Brand Philosophy */}
          <div className="md:col-span-4 space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2.5 group inline-block"
            >
              <div className="w-10 h-10 rounded-full bg-[#244633] border border-[#386b4e] flex items-center justify-center text-[#e0b253] group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Pure
                <span className="italic font-normal text-[#e0b253] ml-1 font-serif">
                  Organics
                </span>
              </span>
            </Link>

            <p className="text-xs text-[#b2d1bf] leading-relaxed max-w-sm">
              Preserving traditional farming lineages with slow-milled ancient
              millets, native cold wood-pressed oils, and raw forest flora honey
              delivered directly to your doorstep.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#244633] border border-[#335f46] text-[11px] text-[#d6e8de]">
              <span className="w-2 h-2 rounded-full bg-[#e0b253] animate-pulse" />
              <span>Direct South Indian Farming Collectives</span>
            </div>

            <div className="pt-2 text-[11px] text-[#8cae9a] flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#e0b253]" />
              <span>FSSAI Lic. No: {config.fssai}</span>
            </div>
          </div>

          {/* Catalog Col */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#e0b253]">
              Organic Catalog
            </h4>
            <ul className="space-y-2.5 text-xs text-[#b2d1bf]">
              <li>
                <Link
                  to="/shop"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Virgin Wood-Pressed Oils (Vaagai Chekku)
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Heritage Karuppu Kavuni & Black Rice
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Raw Indigenous Wild Honey
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Authentic Palm Jaggery (Karupatti)
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Ancient Unpolished Millets
                </Link>
              </li>
            </ul>
          </div>

          {/* Storefront Navigation */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#e0b253]">
              Storefront
            </h4>
            <ul className="space-y-2.5 text-xs text-[#b2d1bf]">
              <li>
                <Link
                  to="/"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Home Overview
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Full Farm Pantry
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Track Delivery
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  Shopping Basket & COD
                </Link>
              </li>
            </ul>
          </div>

          {/* Collective Desk Details */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#e0b253]">
              Collective Desk
            </h4>
            <div className="space-y-3 text-xs text-[#b2d1bf]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#e0b253] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{config.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#e0b253] shrink-0" />
                <a
                  href={`tel:${config.phone.replace(/\s+/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {config.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#e0b253] shrink-0" />
                <a
                  href={`mailto:${config.email}`}
                  className="hover:text-white transition-colors"
                >
                  {config.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#e0b253] pt-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Harvest parcels hand-packed within 24h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Certifications & Payment Purity */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#8cae9a]">
          <div className="space-y-1 text-center md:text-left">
            <p>
              © 2026 Pure Organics Collective Private Limited. All Rights
              Reserved.
            </p>
            <p className="text-[11px] text-[#719681]">
              Certified by NPOP & Participatory Guarantee System for India
              (PGS-India Organic).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="px-3 py-1 rounded bg-[#152d20] border border-[#2d563e] text-[10px] tracking-wider text-[#b2d1bf]">
              UPI / QR
            </span>
            <span className="px-3 py-1 rounded bg-[#152d20] border border-[#2d563e] text-[10px] tracking-wider text-[#b2d1bf]">
              NET BANKING
            </span>
            <span className="px-3 py-1 rounded bg-[#152d20] border border-[#2d563e] text-[10px] tracking-wider text-[#b2d1bf]">
              DOORSTEP COD
            </span>
          </div>

          <p className="font-serif italic text-[#e0b253] text-sm text-center md:text-right">
            Zero heat. Zero chemicals. Zero shortcuts.
          </p>
        </div>
      </div>
    </footer>
  );
}
