import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Truck,
  Award,
  Phone,
  Mail,
  MapPin,
  Layers,
} from "lucide-react";
import { useStore } from "../context/storecontext";

export default function Footer() {
  const { footerConfig } = useStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const config = {
    headline: "Get Offers & Fresh Harvest Updates",
    subtext:
      footerConfig?.farmTagline ||
      "Direct from our mill in Ambasamudram. Subscribe for weekly batch updates and festival discounts.",
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
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
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
          message: "Thank you for subscribing!",
        });
        setEmail("");
      } else {
        setStatus({
          type: "success",
          message: "You are already subscribed.",
        });
        setEmail("");
      }
    } catch {
      setStatus({
        type: "success",
        message: "Thank you for subscribing!",
      });
      setEmail("");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    }
  };

  return (
    <footer className="relative bg-[#0B0D0C] text-stone-300 pt-14 pb-12 mt-16 border-t border-white/10 font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top 4 Value Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-10 border-b border-white/10">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#F59E0B] shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h5
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                className="text-sm sm:text-base font-medium text-white tracking-wide"
              >
                Traditional Seeds
              </h5>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Non-hybrid native crops
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#F59E0B] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h5
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                className="text-sm sm:text-base font-medium text-white tracking-wide"
              >
                Vaagai Marachekku
              </h5>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Cold-pressed without heat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#F59E0B] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h5
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                className="text-sm sm:text-base font-medium text-white tracking-wide"
              >
                100% Pure & Unrefined
              </h5>
              <p className="text-[11px] text-stone-400 mt-0.5">
                No chemical bleaching
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#F59E0B] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h5
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                className="text-sm sm:text-base font-medium text-white tracking-wide"
              >
                Fast Door Delivery
              </h5>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Cash on delivery available
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Box */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white/5 border border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl text-center lg:text-left">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#F59E0B] block">
                Stay Updated
              </span>
              <h3
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                className="text-2xl sm:text-3xl text-white font-medium tracking-tight"
              >
                {config.headline}
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                {config.subtext}
              </p>
            </div>

            <div className="w-full lg:w-auto flex-1 max-w-md">
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center bg-black/50 border border-white/15 rounded-full p-1.5 focus-within:border-[#D97706] transition-colors">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-4 pr-2 text-xs bg-transparent text-white placeholder-stone-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 bg-[#D97706] hover:bg-[#B45309] text-black text-xs font-extrabold px-5 py-2.5 rounded-full transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Subscribe"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {status.message && (
                  <p className="text-xs pl-4 pt-1 text-[#FCD34D]">
                    {status.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Navigation Links & Store Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2 pb-8 border-b border-white/10 text-xs">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-3.5 text-left">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D97706]/15 border border-[#D97706]/40 flex items-center justify-center text-[#F59E0B]">
                <Sprout className="w-4 h-4" />
              </div>
              <span
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                className="text-xl sm:text-2xl font-medium tracking-tight text-white"
              >
                Pure <span className="text-[#D97706] italic">Organics</span>
              </span>
            </Link>

            <p className="text-stone-400 leading-relaxed max-w-sm text-xs">
              Natural cold-pressed cooking oils, unpolished rice, raw honey, and
              traditional millets sourced directly from local farmers in Tamil
              Nadu.
            </p>

            <div className="pt-1 text-[11px] font-mono text-stone-400 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>FSSAI License: {config.fssai}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h4
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              className="text-sm font-medium text-white tracking-wide"
            >
              Shop by Category
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link
                  to="/catalog?category=oils"
                  className="hover:text-white transition-colors"
                >
                  Cold-Pressed Groundnut Oil
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=oils"
                  className="hover:text-white transition-colors"
                >
                  Pure Sesame / Gingelly Oil
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=oils"
                  className="hover:text-white transition-colors"
                >
                  Virgin Coconut Oil
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=grains"
                  className="hover:text-white transition-colors"
                >
                  Traditional Rice Varieties
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=sweeteners"
                  className="hover:text-white transition-colors"
                >
                  Natural Palm Jaggery & Honey
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3 text-left">
            <h4
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              className="text-sm font-medium text-white tracking-wide"
            >
              Quick Links
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="hover:text-white transition-colors"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  View Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h4
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              className="text-sm font-medium text-white tracking-wide"
            >
              Customer Support
            </h4>
            <div className="space-y-2.5 text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <span>{config.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <a
                  href={`tel:${config.phone.replace(/\s+/g, "")}`}
                  className="hover:text-white transition-colors font-mono"
                >
                  {config.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <a
                  href={`mailto:${config.email}`}
                  className="hover:text-white transition-colors"
                >
                  {config.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© 2026 Pure Organics. All rights reserved.</p>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">
              UPI
            </span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">
              CARDS / NET BANKING
            </span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">
              CASH ON DELIVERY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
