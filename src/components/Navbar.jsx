import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  Package,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { useStore } from "../context/storecontext";
import PhoneAuthModal from "./PhoneAuthModal";

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
  const { cart, openCart, customerSession, isPhoneVerified, logoutCustomer } =
    useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);

  // Mega Menu states
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [activeDept, setActiveDept] = useState(DEPARTMENTS[0]);
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);

  const totalCartItems = cart.reduce(
    (total, item) => total + (item.qty || 1),
    0,
  );

  const handleLogout = () => {
    logoutCustomer();
    setCustomerDropdownOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white border-b border-stone-200">
        <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-10 py-3 sm:py-3.5 flex items-center justify-between relative max-w-7xl mx-auto">
          {/* =========================================================================
              LEFT ZONE: NAVIGATION LINKS (DESKTOP) & HAMBURGER (MOBILE)
             ========================================================================= */}
          <div className="flex items-center gap-4 sm:gap-6 flex-1 justify-start">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-1.5 rounded-lg text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              )}
            </button>

            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `text-xs lg:text-[13px] font-black uppercase tracking-wider transition-colors ${
                    isActive
                      ? "text-[#D97706]"
                      : "text-stone-900 hover:text-[#D97706]"
                  }`
                }
              >
                Shop
              </NavLink>

              {/* Catalog Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCatalogOpen(true)}
                onMouseLeave={() => setCatalogOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setCatalogOpen((prev) => !prev)}
                  className={`text-xs lg:text-[13px] font-black uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer py-1 ${
                    catalogOpen
                      ? "text-[#D97706]"
                      : "text-stone-900 hover:text-[#D97706]"
                  }`}
                >
                  <span>Catalog</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      catalogOpen
                        ? "rotate-180 text-[#D97706]"
                        : "text-stone-600"
                    }`}
                  />
                </button>

                {catalogOpen && (
                  <div className="absolute left-0 top-full pt-3 z-50">
                    <div className="w-[660px] lg:w-[740px] bg-white border border-stone-200 rounded-2xl shadow-2xl p-6 text-left">
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-5 border-r border-stone-200 pr-3 space-y-1">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400 px-3 pb-2 font-mono">
                            Harvest Categories
                          </p>

                          {DEPARTMENTS.map((dept) => {
                            const isSelected = activeDept.id === dept.id;
                            return (
                              <button
                                key={dept.id}
                                type="button"
                                onMouseEnter={() => setActiveDept(dept)}
                                className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                                  isSelected
                                    ? "bg-stone-900 text-white font-bold"
                                    : "hover:bg-stone-100 text-stone-800"
                                }`}
                              >
                                <div>
                                  <p className="text-xs leading-tight font-medium">
                                    {dept.name}
                                  </p>
                                  <p
                                    className={`text-[10px] mt-0.5 ${
                                      isSelected
                                        ? "text-stone-300"
                                        : "text-stone-400"
                                    }`}
                                  >
                                    {dept.tamil}
                                  </p>
                                </div>
                                <ArrowRight
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isSelected ? "text-[#D97706]" : "opacity-0"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>

                        <div className="col-span-7 pl-2">
                          <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
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
                              className="text-xs font-bold text-[#D97706] hover:text-amber-700 flex items-center gap-1"
                            >
                              <span>View All</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            {activeDept.columns.map((col, idx) => (
                              <div key={idx} className="space-y-2">
                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900 border-l-2 border-[#D97706] pl-2">
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

                          <div className="mt-6 pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                            <span>Traditional Mara Chekku · Chemical-Free</span>
                            <span className="font-semibold text-stone-900">
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
                  `text-xs lg:text-[13px] font-black uppercase tracking-wider transition-colors ${
                    isActive
                      ? "text-[#D97706]"
                      : "text-stone-900 hover:text-[#D97706]"
                  }`
                }
              >
                Track Order
              </NavLink>
            </div>
          </div>

          {/* =========================================================================
              CENTER ZONE: SCRIPT BRAND TITLE
             ========================================================================= */}
          <div className="flex-1 flex justify-center text-center px-2">
            <Link
              to="/"
              onClick={() => {
                setMobileMenuOpen(false);
                setCatalogOpen(false);
              }}
              className="flex flex-col items-center justify-center group cursor-pointer"
              aria-label="Pure Organics - Return to Home"
            >
              <span className="kosterina-font text-2xl xs:text-3xl sm:text-4xl lg:text-[42px] text-stone-950 font-normal leading-none group-hover:text-[#D97706] transition-colors select-none tracking-normal">
                Pure Organics
              </span>
              <span className="text-[7.5px] sm:text-[9px] font-mono uppercase tracking-[0.25em] text-[#D97706] font-bold leading-tight mt-0.5">
                Native Harvest
              </span>
            </Link>
          </div>

          {/* =========================================================================
              RIGHT ZONE: USER PROFILE & CART BAG
             ========================================================================= */}
          <div className="flex items-center gap-3 xs:gap-4 sm:gap-6 flex-1 justify-end">
            <div className="relative">
              {isPhoneVerified && customerSession ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setCustomerDropdownOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 text-stone-900 text-xs font-black uppercase tracking-wider hover:text-[#D97706] transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-stone-900" />
                    <span className="max-w-[70px] xs:max-w-[90px] sm:max-w-[110px] truncate">
                      {customerSession.full_name || customerSession.phone}
                    </span>
                  </button>

                  {customerDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-52 bg-white border border-stone-200 rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1 text-xs text-left">
                      <div className="px-3 py-2 border-b border-stone-200">
                        <p className="font-bold text-stone-900 truncate">
                          {customerSession.full_name || "Verified Customer"}
                        </p>
                        <p className="text-[11px] text-stone-500 font-mono truncate">
                          +91 {customerSession.phone}
                        </p>
                      </div>

                      <Link
                        to="/track"
                        onClick={() => setCustomerDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-700 hover:text-stone-950 hover:bg-stone-50 transition-colors font-medium"
                      >
                        <Package className="w-3.5 h-3.5 text-stone-900" />
                        <span>My Orders</span>
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
                  className="inline-flex items-center gap-1.5 text-stone-900 hover:text-[#D97706] transition-colors cursor-pointer p-1"
                  title="Sign In with Mobile OTP"
                >
                  <User className="w-5 h-5 stroke-[2]" />
                  <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">
                    Sign In
                  </span>
                </button>
              )}
            </div>

            <Link
              to="/track"
              className="hidden sm:inline-flex items-center gap-1.5 text-stone-700 hover:text-[#D97706] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              title="Track Consignments"
            >
              <Package className="w-4 h-4 text-stone-900" />
              <span>Orders</span>
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="inline-flex items-center gap-1.5 text-stone-900 hover:text-[#D97706] transition-colors cursor-pointer"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
              <span className="font-black text-xs sm:text-[13px] leading-none">
                {totalCartItems}
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            MOBILE ACCORDION DRAWER (< 768px)
           ========================================================================= */}
        {mobileMenuOpen && (
          <div className="md:hidden p-4 bg-white border-t border-stone-200 shadow-xl flex flex-col gap-2 text-left">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-black uppercase tracking-wider text-stone-900 hover:bg-stone-50 rounded"
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-black uppercase tracking-wider text-stone-900 hover:bg-stone-50 rounded"
            >
              Shop All
            </NavLink>

            <div className="border border-stone-200 rounded p-2 bg-stone-50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 py-1 font-mono">
                Harvest Catalog
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
                    className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold text-stone-900"
                  >
                    <span>{dept.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        mobileExpandedCat === dept.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileExpandedCat === dept.id && (
                    <div className="pl-4 pr-2 py-2 space-y-2 border-t border-stone-200 mt-1">
                      {dept.columns
                        .flatMap((c) => c.links)
                        .map((link, lIdx) => (
                          <Link
                            key={lIdx}
                            to={link.url}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-xs text-stone-600 hover:text-stone-950 py-0.5"
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
              className="px-3 py-2 text-xs font-black uppercase tracking-wider text-stone-900 hover:bg-stone-50 rounded"
            >
              Track Order
            </NavLink>
          </div>
        )}
      </nav>

      <PhoneAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
}
