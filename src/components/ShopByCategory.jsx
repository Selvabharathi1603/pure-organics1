import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { API_BASE_URL as CONFIG_URL } from "../config/api";

const BASE_URL = CONFIG_URL || "http://localhost:5000";

const EXACT_MATCH_CATEGORIES = [
  {
    id: 1,
    category_key: "oils",
    name: "Wood-Pressed Oils",
    tamil: "மரச்செக்கு எண்ணெய்",
    count: "6 Cold Batches",
    image:
      "https://media.istockphoto.com/id/1395867248/photo/rosemary-essential-oil-or-infusion-on-an-old-wooden-table.jpg?s=612x612&w=0&k=20&c=-QggcpSyV91hemES4cCqmHfdnkFNW4kmgP89IVEGeg8=",
    target_link: "/shop?cat=oils",
  },
  {
    id: 2,
    category_key: "grains",
    name: "Heirloom Rice & Millets",
    tamil: "பாரம்பரிய தானியங்கள்",
    count: "9 Heritage Grains",
    image:
      "https://media.istockphoto.com/id/671580278/photo/varieties-of-grains-seeds-and-raw-quino.jpg?s=612x612&w=0&k=20&c=ATTVKd0ls6JoL4AvGZ-K6bs_q8rlkJDEyzOLu0d2vrA=",
    target_link: "/shop?cat=grains",
  },
  {
    id: 3,
    category_key: "honey",
    name: "Raw Forest Honey",
    tamil: "இயற்கை மலைத்தேன்",
    count: "Wild Cliff Harvest",
    image:
      "https://media.istockphoto.com/id/598241944/photo/honey-in-jar-and-bunch-of-dry-lavender.jpg?s=612x612&w=0&k=20&c=gVg1BaJ78uniQbpfdFiYvMzim98gREdx-5c4ENBp2tE=",
    target_link: "/shop?cat=honey",
  },
  {
    id: 4,
    category_key: "sweeteners",
    name: "Artisanal Palm Jaggery",
    tamil: "உடன்குடி கருப்பட்டி",
    count: "Iron Pan Boiled",
    image:
      "https://media.istockphoto.com/id/869266164/photo/jaggery-sugar-and-cane.jpg?s=2048x2048&w=is&k=20&c=Xa-DIQ73T41G4JDIBWhI-1-gkrpXct1I7FkehubDMUQ=",
    target_link: "/shop?cat=sweeteners",
  },
  {
    id: 5,
    category_key: "pickle",
    name: "Native Farm Preserves",
    tamil: "பாரம்பரிய பண்ணை ஊறல்",
    count: "Authentic Taste",
    image:
      "https://media.istockphoto.com/id/1338316600/photo/image-glass-jar-of-green-mango-chutney-recipe-with-hessian-lid-pickle-with-chopped-raw-mango.jpg?s=2048x2048&w=is&k=20&c=2EGNmLNNt2zC0utGXglHoaTog--981l9Wxatly2DuYw=",
    target_link: "/shop?cat=preserves",
  },
];

export default function ShopByCategory() {
  const [categories, setCategories] = useState(EXACT_MATCH_CATEGORIES);

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
          const merged = EXACT_MATCH_CATEGORIES.map((item) => {
            const found = json.data.find(
              (c) => c.category_key === item.category_key,
            );
            return found
              ? {
                  ...item,
                  name: found.name || item.name,
                  count: found.batch_count || item.count,
                }
              : item;
          });
          setCategories(merged);
        }
      } catch (err) {
        // Safe fallback maintains verified imagery
      }
    };
    fetchCats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full bg-white text-[#18181b] pt-6 pb-24 border-b border-stone-100 font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Styled with Navbar PureOrganics Amber & Carbon */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200/80">
          <div className="space-y-1.5 text-left">
            {/* Pill matched to PureOrganics badge accent */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef3c7]/60 text-[#b45309] text-[10px] font-black uppercase tracking-[0.22em] border border-[#fde68a]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-pulse" />
              Direct Farm Harvest
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#18181b] tracking-tight">
              Shop by <span className="text-[#d97706]">Department</span>
            </h2>
          </div>

          <Link
            to="/shop"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#18181b] hover:text-[#d97706] transition-colors"
          >
            <span>Explore All Harvests</span>
            <ArrowUpRight
              size={15}
              className="text-[#d97706] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* Circular Department Medallions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 pt-10 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <Link
              key={cat.id || cat.category_key}
              to={cat.target_link}
              className="group flex flex-col items-center text-center cursor-pointer"
            >
              {/* Outer Circular Frame: PureOrganics Charcoal Rim + Amber Glow on Hover */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-white border-[3px] border-white ring-2 ring-stone-200 group-hover:ring-[#d97706] shadow-[0_6px_20px_rgba(24,24,27,0.06)] group-hover:shadow-[0_12px_28px_rgba(217,119,6,0.25)] transition-all duration-300 group-hover:-translate-y-1.5">
                {/* Full-Bleed Inner Image */}
                <div className="w-full h-full rounded-full overflow-hidden relative bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  {/* Subtle Dark Vignette with warm undertone */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent group-hover:opacity-40 transition-opacity" />
                </div>

                {/* Batch Tag: Navbar PureOrganics Black Capsule + Amber Text */}
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#18181b] text-[#fbbf24] text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#d97706]/40 shadow-sm whitespace-nowrap group-hover:bg-[#d97706] group-hover:text-[#18181b] group-hover:border-[#b45309] transition-colors">
                  {cat.count}
                </span>
              </div>

              {/* Department Name & Tamil Subtitle */}
              <div className="mt-5 space-y-0.5">
                <h3 className="font-extrabold text-[#18181b] text-sm tracking-tight group-hover:text-[#d97706] transition-colors leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[11px] font-serif italic text-stone-500 group-hover:text-[#18181b] transition-colors">
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
