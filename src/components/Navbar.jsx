import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Sprout, Menu, X } from "lucide-react";
import { useStore } from "../context/storecontext";

export default function Navbar() {
  const { cart, openCart } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartItems = cart.reduce(
    (total, item) => total + (item.qty || 1),
    0,
  );

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-[#1b3b27] text-[#ffffff] shadow-sm"
        : "text-[#4d6355] hover:text-[#1b3b27] hover:bg-[#eef4ef]"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `px-4 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-full text-center transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-[#1b3b27] text-white shadow-sm"
        : "text-[#4d6355] hover:text-[#1b3b27] hover:bg-[#eef4ef]"
    }`;

  return (
    <div className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all">
      <header className="backdrop-blur-md bg-white/90 border border-[#e4ded3] shadow-[0_10px_30px_rgba(27,59,39,0.06)] rounded-full px-5 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#edf5ef] border border-[#cbe1d2] flex items-center justify-center text-[#1b3b27] group-hover:bg-[#1b3b27] group-hover:text-white transition-all duration-300 shadow-sm">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl tracking-tight text-[#162a1e] font-bold leading-none">
              Pure
              <span className="italic font-normal text-[#2e7d4d] ml-1">
                Organics
              </span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#849a8d] font-semibold mt-0.5 font-mono">
              Native Harvest
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f4f1ea] p-1 rounded-full border border-[#e5dfd3]">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            Catalog
          </NavLink>
          <NavLink to="/track" className={navLinkClass}>
            Track Order
          </NavLink>
        </nav>

        {/* Actions: Cart + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openCart}
            className="group relative inline-flex items-center gap-2.5 bg-[#1b3b27] hover:bg-[#245236] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-[0_4px_14px_rgba(27,59,39,0.2)] hover:shadow-[0_6px_20px_rgba(27,59,39,0.28)] transition-all duration-300 cursor-pointer active:scale-95"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#f4e3b2] transition-transform group-hover:-translate-y-0.5" />
            <span className="tracking-wide uppercase text-[11px]">Bag</span>
            <span className="bg-[#c58f38] text-[#162a1e] text-[10px] px-2 py-0.5 rounded-full font-bold font-mono">
              {totalCartItems}
            </span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-full border border-[#e4ded3] bg-[#f4f1ea] text-[#1b3b27] hover:bg-[#edf5ef] transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Nav Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-2 p-2 bg-white/95 backdrop-blur-md rounded-2xl border border-[#e4ded3] shadow-[0_12px_30px_rgba(27,59,39,0.12)] flex flex-col gap-1 transition-all duration-200">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Catalog
          </NavLink>
          <NavLink
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Track Order
          </NavLink>
        </nav>
      )}
    </div>
  );
}
