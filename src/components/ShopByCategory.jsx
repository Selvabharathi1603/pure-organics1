import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { API_BASE_URL as CONFIG_URL } from "../config/api";

const BASE_URL = CONFIG_URL || "http://localhost:5000";

// High-fidelity agricultural imagery corresponding to each category
const HARVEST_CATEGORIES = [
  {
    id: 1,
    category_key: "oils",
    name: "Wood-Pressed Oils",
    tamil: "மரச்செக்கு எண்ணெய்",
    count: "6 Cold Batches",
    // Rustic amber apothecary oil bottle with herbal sprigs on weathered wood
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    target_link: "/shop?cat=oils",
  },
  {
    id: 2,
    category_key: "grains",
    name: "Heirloom Rice & Millets",
    tamil: "பாரம்பரிய தானியங்கள்",
    count: "9 Heritage Grains",
    // Multi-grain ceramic bowls filled with heirloom seeds & ancient unpolished rice
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    target_link: "/shop?cat=grains",
  },
  {
    id: 3,
    category_key: "honey",
    name: "Raw Forest Honey",
    tamil: "இயற்கை மலைத்தேன்",
    count: "Wild Cliff Harvest",
    // Glowing amber honey in a glass pot with natural honeycomb & wild flora
    image:
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=600&q=80",
    target_link: "/shop?cat=honey",
  },
  {
    id: 4,
    category_key: "sweeteners",
    name: "Artisanal Palm Jaggery",
    tamil: "உடன்குடி கருப்பட்டி",
    count: "Iron Pan Boiled",
    // Deep dark artisanal unrefined palm jaggery & unbleached natural sugar blocks
    image:
      "https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=600&q=80",
    target_link: "/shop?cat=sweeteners",
  },
  {
    id: 5,
    category_key: "groundnut",
    name: "Native Peanut Mill",
    tamil: "நாட்டு நிலக்கடலை",
    count: "Sun-Dried Saurashtra",
    // Sun-dried raw red-skin peanuts in rustic shells & hessian weave
    image:
      "https://images.unsplash.com/photo-1567892320421-1c657571ea4c?auto=format&fit=crop&w=600&q=80",
    target_link: "/shop?cat=oils&item=peanut",
  },
];

export default function ShopByCategory() {
  const [categories, setCategories] = useState(HARVEST_CATEGORIES);

  useEffect(() => {
    let isMounted = true;
    const fetchCats = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/categories`);
        const json = await res.json();
        if (
          isMounted &&
          json.success &&
          Array.isArray(json.data) &&
          json.data.length > 0
        ) {
          // Merge dynamic labels while preserving the rich photography
          const merged = HARVEST_CATEGORIES.map((item) => {
            const found = json.data.find(
              (c) => c.category_key === item.category_key,
            );
            return found ? { ...item, ...found, image: item.image } : item;
          });
          setCategories(merged);
        }
      } catch (err) {
        // Fallback remains active
      }
    };
    fetchCats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full bg-white text-[#0D2317] py-14 sm:py-18 border-b border-stone-100 font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-stone-200/80">
          <div className="space-y-1.5 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5EE] text-[#14532D] text-[10px] font-black uppercase tracking-[0.22em] border border-[#CDE5D5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              Direct Farm Harvest
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0D2317] tracking-tight">
              Shop by Department
            </h2>
          </div>

          <Link
            to="/shop"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#166534] hover:text-[#0D2317] transition-colors"
          >
            <span>Explore All Harvests</span>
            <ArrowUpRight
              size={15}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* Full-Bleed Photographic Medallions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-7 sm:gap-10 pt-10 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <Link
              key={cat.id || cat.category_key}
              to={cat.target_link}
              className="group flex flex-col items-center text-center cursor-pointer"
            >
              {/* Outer Glow Halo Ring */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-gradient-to-b from-[#E2EFE6] to-[#CBDDD1] group-hover:from-[#15803D] group-hover:to-[#0D2317] transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:-translate-y-1.5">
                {/* Image Container with Inner Vignette */}
                <div className="w-full h-full rounded-full overflow-hidden relative bg-stone-100 border-2 border-white shadow-inner">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle darkening gradient at the base for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 group-hover:opacity-40 transition-opacity" />
                </div>

                {/* Micro Batch Badge */}
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#0D2317] text-[#86EFAC] text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#225235] shadow-xs whitespace-nowrap">
                  {cat.count || "Pure Harvest"}
                </span>
              </div>

              {/* Department Name & Tamil Subtitle */}
              <div className="mt-5 space-y-0.5">
                <h3 className="font-extrabold text-[#0D2317] text-sm tracking-tight group-hover:text-[#15803D] transition-colors leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[11px] font-serif italic text-[#4A7258] font-medium">
                  {cat.tamil}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
