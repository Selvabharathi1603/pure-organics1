import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ShoppingBag,
  Sprout,
  Menu,
  X,
  User,
  LogOut,
  Package,
} from "lucide-react";
import { useStore } from "../context/storecontext";
import CustomerAuthModal from "./CustomerAuthModal";

export default function Navbar() {
  const { cart, openCart } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);

  // Sync customer state from localStorage
  const [customer, setCustomer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("customer_info")) || null;
    } catch {
      return null;
    }
  });

  const totalCartItems = cart.reduce(
    (total, item) => total + (item.qty || 1),
    0,
  );

  const handleLogout = () => {
    localStorage.removeItem("customer_info");
    localStorage.removeItem("customer_token");
    setCustomer(null);
    setCustomerDropdownOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-brand-dark text-white shadow-xs"
        : "text-brand-subtext hover:text-brand-dark hover:bg-brand-bg"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `px-4 py-3 text-xs uppercase tracking-widest font-semibold rounded-xl text-center transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-brand-dark text-white shadow-xs"
        : "text-brand-subtext hover:text-brand-dark hover:bg-brand-bg"
    }`;

  return (
    <>
      <div className="sticky top-2 sm:top-4 z-40 px-2 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all font-sans">
        <header className="backdrop-blur-md bg-white/95 border border-brand-border shadow-xs rounded-full px-3 py-2 sm:px-5 sm:py-2.5 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 group cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-all shrink-0">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-brand-dark leading-none">
                PURE<span className="text-brand-green">ORGANICS</span>
              </span>
              <span className="text-[8px] uppercase tracking-widest text-brand-muted font-bold mt-0.5">
                Native Harvest
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-brand-cream p-1 rounded-full border border-brand-border">
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

          {/* Actions: Account + Cart + Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Customer Account Trigger */}
            <div className="relative">
              {customer ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setCustomerDropdownOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 bg-brand-bg hover:bg-brand-cream border border-brand-border text-brand-dark text-xs font-bold px-3 py-1.5 sm:py-2 rounded-full transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-brand-green" />
                    <span className="max-w-[80px] sm:max-w-[120px] truncate">
                      {customer.firstName || "Account"}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {customerDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-brand-border rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1 text-xs">
                      <div className="px-3 py-2 border-b border-brand-border">
                        <p className="font-bold text-brand-dark truncate">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-[11px] text-brand-muted truncate">
                          +91 {customer.phone}
                        </p>
                      </div>

                      <Link
                        to="/track"
                        onClick={() => setCustomerDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand-subtext hover:text-brand-dark hover:bg-brand-bg transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-brand-green" />
                        <span>My Orders</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors w-full text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-brand-bg hover:bg-brand-cream border border-brand-border text-brand-dark text-xs font-bold px-3 py-1.5 sm:py-2 rounded-full transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-brand-dark" />
                  <span className="hidden sm:inline uppercase text-[10px] tracking-wider">
                    Sign In
                  </span>
                </button>
              )}
            </div>

            {/* Shopping Bag Button */}
            <button
              type="button"
              onClick={openCart}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-brand-dark hover:bg-brand-green text-white text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-xs transition-all cursor-pointer active:scale-95"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#F7D070]" />
              <span className="tracking-wide uppercase text-[10px] hidden xs:inline">
                Bag
              </span>
              <span className="bg-white text-brand-dark text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {totalCartItems}
              </span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-1.5 rounded-full border border-brand-border bg-brand-cream text-brand-dark hover:bg-brand-bg transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Nav Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-2 p-2 bg-white/95 backdrop-blur-md rounded-2xl border border-brand-border shadow-md flex flex-col gap-1">
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

      {/* Customer Login / Register OTP Modal */}
      <CustomerAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(newCustomer) => {
          setCustomer(newCustomer);
          setIsAuthOpen(false);
        }}
      />
    </>
  );
}
