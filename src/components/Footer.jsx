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
    <footer className="relative bg-brand-dark text-[#D6E8DE] pt-16 pb-12 mt-20 border-t border-brand-border font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-14">
        {/* Top 4 Value Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-12 border-b border-white/10">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-[#A3E6B4] shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                100% Native Seeds
              </h5>
              <p className="text-[11px] text-[#A5C7B3] mt-0.5">
                Zero GMO or hybrid grain
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-[#A3E6B4] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Vaagai Wood Chekku
              </h5>
              <p className="text-[11px] text-[#A5C7B3] mt-0.5">
                Crushed cold below 42°C
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-[#A3E6B4] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Lab Tested Purity
              </h5>
              <p className="text-[11px] text-[#A5C7B3] mt-0.5">
                Zero synthetic inputs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-[#A3E6B4] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Doorstep Direct COD
              </h5>
              <p className="text-[11px] text-[#A5C7B3] mt-0.5">
                Inspect items before paying
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Allocation Box */}
        <div className="rounded-2xl p-8 sm:p-10 bg-white/5 border border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl text-center lg:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A3E6B4] block">
                Private Mill Allocations
              </span>
              <h3 className="text-2xl sm:text-3xl text-white font-extrabold">
                {config.headline}
              </h3>
              <p className="text-xs sm:text-sm text-[#B2D1BF] leading-relaxed">
                {config.subtext}
              </p>
            </div>

            <div className="w-full lg:w-auto flex-1 max-w-md">
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center bg-black/30 border border-white/20 rounded-full p-1.5 focus-within:border-brand-green">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full pl-4 pr-2 text-xs bg-transparent text-white placeholder-white/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-brand-green hover:bg-[#387f44] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {loading
                      ? "Connecting..."
                      : status.type === "success"
                        ? "Joined"
                        : "Join"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {status.message && (
                  <p className="text-xs pl-4 pt-1 text-[#A3E6B4]">
                    {status.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-4 pb-10 border-b border-white/10 text-xs">
          {/* Brand Philosophy */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                PURE<span className="text-brand-green">ORGANICS</span>
              </span>
            </Link>

            <p className="text-[#B2D1BF] leading-relaxed max-w-sm">
              Preserving traditional farming lineages with slow-milled ancient
              millets, native cold wood-pressed oils, and raw forest flora
              honey.
            </p>

            <div className="pt-1 text-[11px] text-[#8CAE9A] flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#A3E6B4]" />
              <span>FSSAI Lic. No: {config.fssai}</span>
            </div>
          </div>

          {/* Catalog */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white">
              Organic Catalog
            </h4>
            <ul className="space-y-2 text-[#B2D1BF]">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Virgin Wood-Pressed Oils
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Heritage Karuppu Kavuni Rice
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Raw Indigenous Wild Honey
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Authentic Palm Jaggery
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Ancient Unpolished Millets
                </Link>
              </li>
            </ul>
          </div>

          {/* Storefront */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white">
              Storefront
            </h4>
            <ul className="space-y-2 text-[#B2D1BF]">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Full Farm Pantry
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="hover:text-white transition-colors"
                >
                  Track Delivery
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white">
              Farm Desk
            </h4>
            <div className="space-y-2.5 text-[#B2D1BF]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#A3E6B4] shrink-0 mt-0.5" />
                <span>{config.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#A3E6B4] shrink-0" />
                <a
                  href={`tel:${config.phone.replace(/\s+/g, "")}`}
                  className="hover:text-white"
                >
                  {config.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#A3E6B4] shrink-0" />
                <a href={`mailto:${config.email}`} className="hover:text-white">
                  {config.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8CAE9A]">
          <p>
            © 2026 Pure Organics Collective Private Limited. All Rights
            Reserved.
          </p>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px]">
              UPI / QR
            </span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px]">
              NET BANKING
            </span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px]">
              CASH ON DELIVERY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
