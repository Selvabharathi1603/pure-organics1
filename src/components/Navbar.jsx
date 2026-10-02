import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ShoppingBag,
  Sprout,
  Menu,
  X,
  User,
  LogOut,
  Package,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { useStore } from "../context/storecontext";
import CustomerAuthModal from "./CustomerAuthModal";

const DEPARTMENTS = [
  {
    id: "oils",
    name: "Wood-Pressed Oils",
    tamil: "மரச்செக்கு எண்ணெய்",
    columns: [
      {
        heading: "Daily Cooking Oils",
        links: [
          {
            name: "Vaagai Wood Gingelly Oil",
            url: "/shop?cat=oils&item=gingelly",
          },
          {
            name: "Cold-Pressed Peanut Oil",
            url: "/shop?cat=oils&item=peanut",
          },
          {
            name: "Raw Virgin Coconut Oil",
            url: "/shop?cat=oils&item=coconut",
          },
        ],
      },
      {
        heading: "Hair & Body Oils",
        links: [
          {
            name: "Traditional Herbal Hair Oil",
            url: "/shop?cat=oils&item=herbal-hair",
          },
          {
            name: "Native Cold-Pressed Castor Oil",
            url: "/shop?cat=oils&item=castor",
          },
        ],
      },
    ],
  },
  {
    id: "grains",
    name: "Heritage Rice & Millets",
    tamil: "பாரம்பரிய தானியங்கள்",
    columns: [
      {
        heading: "Native Rice Varieties",
        links: [
          {
            name: "Karuppu Kavuni Black Rice",
            url: "/shop?cat=grains&item=kavuni",
          },
          {
            name: "Mappillai Samba Red Rice",
            url: "/shop?cat=grains&item=samba",
          },
          {
            name: "Seeraga Samba Aromatic Rice",
            url: "/shop?cat=grains&item=seeraga",
          },
        ],
      },
      {
        heading: "Unpolished Country Millets",
        links: [
          {
            name: "Thinai (Foxtail Millet)",
            url: "/shop?cat=grains&item=thinai",
          },
          {
            name: "Kuthiraivali (Barnyard Millet)",
            url: "/shop?cat=grains&item=kuthiraivali",
          },
          { name: "Varagu (Kodo Millet)", url: "/shop?cat=grains&item=varagu" },
        ],
      },
    ],
  },
  {
    id: "sweeteners",
    name: "Natural Sweeteners",
    tamil: "இயற்கை வெல்லம்",
    columns: [
      {
        heading: "Unrefined Palm Harvest",
        links: [
          {
            name: "Udangudi Palm Jaggery (Karupatti)",
            url: "/shop?cat=sweeteners&item=karupatti",
          },
          {
            name: "Panakarkandu (Palm Sugar Candy)",
            url: "/shop?cat=sweeteners&item=panakarkandu",
          },
        ],
      },
      {
        heading: "Country Cane Jaggery",
        links: [
          {
            name: "Unbleached Country Sugar (Nattu Sakkarai)",
            url: "/shop?cat=sweeteners&item=sakkarai",
          },
          {
            name: "Traditional Cube Jaggery (Achuvellam)",
            url: "/shop?cat=sweeteners&item=achuvellam",
          },
        ],
      },
    ],
  },
  {
    id: "honey",
    name: "Forest Raw Honey",
    tamil: "இயற்கை மலைத்தேன்",
    columns: [
      {
        heading: "Single-Flora & Wild Honeys",
        links: [
          {
            name: "Western Ghats Deep Forest Honey",
            url: "/shop?cat=honey&item=forest-honey",
          },
          {
            name: "Small Bee Dammer Honey (Kombu Then)",
            url: "/shop?cat=honey&item=kombu-then",
          },
          {
            name: "Raw Multi-Floral Rock Honey",
            url: "/shop?cat=honey&item=rock-honey",
          },
        ],
      },
    ],
  },
];

export default function Navbar() {
  const { cart, openCart } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);

  // Mega Menu states
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [activeDept, setActiveDept] = useState(DEPARTMENTS[0]);
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);

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

  return (
    <>
      <div className="sticky top-2 sm:top-4 z-40 px-2 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all font-sans">
        {/* Floating Capsule Header */}
        <header className="backdrop-blur-md bg-white/95 border border-stone-200 shadow-md rounded-full px-3 py-2 sm:px-6 sm:py-2.5 flex items-center justify-between gap-2 relative">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => {
              setMobileMenuOpen(false);
              setCatalogOpen(false);
            }}
            className="flex items-center gap-2.5 group cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-all shrink-0 shadow-xs">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-black tracking-tight text-stone-900 leading-none">
                PURE<span className="text-amber-600">ORGANICS</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-stone-400 font-extrabold mt-0.5 font-mono">
                Native Harvest
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1 rounded-full border border-stone-200/80">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 text-xs uppercase tracking-[0.16em] font-bold rounded-full transition-all cursor-pointer ${
                  isActive
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`
              }
            >
              Home
            </NavLink>

            {/* Catalog Mega-Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setCatalogOpen(true)}
              onMouseLeave={() => setCatalogOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCatalogOpen((prev) => !prev)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.16em] font-bold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  catalogOpen
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-700 hover:text-stone-900 hover:bg-stone-200/60"
                }`}
              >
                <span>Catalog</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    catalogOpen ? "rotate-180 text-amber-400" : "text-stone-500"
                  }`}
                />
              </button>

              {/* Mega-Menu Dropdown Wrapper with Invisible Hover Bridge */}
              {catalogOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50">
                  <div className="w-[680px] lg:w-[760px] bg-white border border-stone-200 rounded-3xl shadow-2xl p-6 text-left">
                    <div className="grid grid-cols-12 gap-6">
                      {/* Left: Department List */}
                      <div className="col-span-5 border-r border-stone-100 pr-3 space-y-1">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400 px-3 pb-2">
                          Categories
                        </p>

                        {DEPARTMENTS.map((dept) => {
                          const isSelected = activeDept.id === dept.id;
                          return (
                            <button
                              key={dept.id}
                              type="button"
                              onMouseEnter={() => setActiveDept(dept)}
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-stone-900 text-white font-bold shadow-xs"
                                  : "hover:bg-stone-100 text-stone-700"
                              }`}
                            >
                              <div>
                                <p className="text-xs leading-tight">
                                  {dept.name}
                                </p>
                                <p
                                  className={`text-[10px] mt-0.5 ${isSelected ? "text-stone-300" : "text-stone-400"}`}
                                >
                                  {dept.tamil}
                                </p>
                              </div>
                              <ArrowRight
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSelected ? "text-amber-400" : "opacity-0"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>

                      {/* Right: Subcategory Details */}
                      <div className="col-span-7 pl-2">
                        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                          <div>
                            <span className="text-xs font-bold text-stone-900">
                              {activeDept.name}
                            </span>
                            <span className="text-xs text-stone-400 ml-2">
                              ({activeDept.tamil})
                            </span>
                          </div>

                          <Link
                            to={`/shop?cat=${activeDept.id}`}
                            onClick={() => setCatalogOpen(false)}
                            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                          >
                            <span>View All</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          {activeDept.columns.map((col, idx) => (
                            <div key={idx} className="space-y-2">
                              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-stone-900 border-l-2 border-stone-900 pl-2">
                                {col.heading}
                              </h4>
                              <ul className="space-y-1.5 pl-2">
                                {col.links.map((link, lIdx) => (
                                  <li key={lIdx}>
                                    <Link
                                      to={link.url}
                                      onClick={() => setCatalogOpen(false)}
                                      className="text-xs text-stone-600 hover:text-stone-950 font-medium block leading-snug hover:underline"
                                    >
                                      {link.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* Footer Guarantee */}
                        <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                          <span>Traditional Mara Chekku · Chemical-Free</span>
                          <span className="font-semibold text-stone-700">
                            Lab Tested
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/track"
              className={({ isActive }) =>
                `px-4 py-2 text-xs uppercase tracking-[0.16em] font-bold rounded-full transition-all cursor-pointer ${
                  isActive
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`
              }
            >
              Track Order
            </NavLink>
          </nav>

          {/* Right Action Icons: Customer Account + Shopping Bag + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Customer Account Trigger */}
            <div className="relative">
              {customer ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setCustomerDropdownOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-900 text-xs font-bold px-3 py-1.5 sm:py-2 rounded-full transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-stone-900" />
                    <span className="max-w-[80px] sm:max-w-[120px] truncate">
                      {customer.firstName || "Account"}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {customerDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1 text-xs text-left">
                      <div className="px-3 py-2 border-b border-stone-100">
                        <p className="font-bold text-stone-900 truncate">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate font-mono">
                          +91 {customer.phone}
                        </p>
                      </div>

                      <Link
                        to="/track"
                        onClick={() => setCustomerDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-700 hover:text-stone-950 hover:bg-stone-50 transition-colors font-medium"
                      >
                        <Package className="w-3.5 h-3.5 text-stone-900" />
                        <span>My Consignments</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors w-full text-left font-medium cursor-pointer"
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
                  className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-900 text-xs font-bold px-3.5 py-1.5 sm:py-2 rounded-full transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-stone-900" />
                  <span className="hidden sm:inline uppercase text-[10px] tracking-widest font-extrabold">
                    Sign In
                  </span>
                </button>
              )}
            </div>

            {/* Shopping Bag Button with Amber Counter Pill */}
            <button
              type="button"
              onClick={openCart}
              className="inline-flex items-center gap-2 bg-stone-950 hover:bg-black text-white text-xs font-bold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md transition-all cursor-pointer active:scale-95 border border-stone-800"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span className="tracking-widest uppercase text-[10px] font-mono hidden xs:inline">
                Bag
              </span>
              <span className="bg-amber-400 text-stone-950 text-[10px] px-1.5 py-0.2 rounded-full font-black font-mono">
                {totalCartItems}
              </span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-1.5 rounded-full border border-stone-200 bg-stone-100 text-stone-900 hover:bg-stone-200 transition-all cursor-pointer"
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

        {/* Mobile Dropdown Nav Menu with Accordion */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-2 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl flex flex-col gap-2 text-left">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 text-xs uppercase tracking-widest font-bold rounded-xl text-stone-900 hover:bg-stone-100"
            >
              Home
            </NavLink>

            {/* Mobile Catalog Accordion */}
            <div className="border border-stone-100 rounded-xl p-2 bg-stone-50/50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 py-1">
                Shop By Harvest
              </p>
              {DEPARTMENTS.map((dept) => (
                <div key={dept.id} className="py-1">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpandedCat(
                        mobileExpandedCat === dept.id ? null : dept.id,
                      )
                    }
                    className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold text-stone-800"
                  >
                    <span>{dept.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        mobileExpandedCat === dept.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileExpandedCat === dept.id && (
                    <div className="pl-4 pr-2 py-2 space-y-2 border-t border-stone-200/60 mt-1">
                      {dept.columns
                        .flatMap((c) => c.links)
                        .map((link, lIdx) => (
                          <Link
                            key={lIdx}
                            to={link.url}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-xs text-stone-600 hover:text-stone-900 py-0.5"
                          >
                            • {link.name}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <NavLink
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 text-xs uppercase tracking-widest font-bold rounded-xl text-stone-900 hover:bg-stone-100"
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
