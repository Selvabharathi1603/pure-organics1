import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { API_BASE_URL as CONFIG_URL } from "../config/api";

const BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : CONFIG_URL || "https://pure-organics1.onrender.com";

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
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Multi-trigger observer: Replays whenever scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchCats = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/categories`);
        if (!res.ok) return;

        const json = await res.json();
        const incomingData = Array.isArray(json)
          ? json
          : json?.data && Array.isArray(json.data)
            ? json.data
            : null;

        if (isMounted && incomingData && incomingData.length > 0) {
          const merged = EXACT_MATCH_CATEGORIES.map((item) => {
            const found = incomingData.find(
              (c) =>
                c.category_key === item.category_key ||
                c.id === item.category_key ||
                c.id === item.id,
            );
            return found
              ? {
                  ...item,
                  name: found.name || item.name,
                  count: found.batch_count || found.count || item.count,
                  image: found.image || item.image,
                }
              : item;
          });
          setCategories(merged);
        }
      } catch (err) {
        // Fallback gracefully to default catalog
      }
    };
    fetchCats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] max-w-none bg-[#FAF9F5] text-stone-900 pt-8 pb-16 border-b border-stone-200 select-none font-sans overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Replaying Scroll Heading */}
        <div
          className={`flex flex-col items-center text-center mb-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible
              ? "opacity-100 translate-x-0 translate-y-0"
              : "opacity-0 -translate-x-12 translate-y-3"
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#D97706] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              Direct Farm Harvest
            </span>
          </div>

          <h2
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            className="text-2xl sm:text-3xl lg:text-4xl font-medium text-stone-900 tracking-tight"
          >
            Shop by{" "}
            <span className="text-[#D97706] italic font-normal">
              Department
            </span>
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-md font-normal px-2">
            Cold-pressed single origin oils, unpolished native millets, and
            unrefined sweeteners.
          </p>

          <div
            className={`h-0.5 bg-[#D97706] rounded-full mt-3 transition-all duration-700 delay-150 ${
              isVisible ? "w-14 opacity-100" : "w-0 opacity-0"
            }`}
          />
        </div>

        {/* View All Link */}
        <div className="flex justify-end pb-3">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#D97706] transition-colors"
          >
            <span>Explore All Harvests</span>
            <ArrowUpRight
              size={15}
              className="text-[#D97706] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* Responsive Staggered Circular Department Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 pt-2 max-w-6xl mx-auto justify-items-center">
          {categories.map((cat, idx) => {
            const delays = [
              "delay-75",
              "delay-100",
              "delay-150",
              "delay-200",
              "delay-300",
            ];

            return (
              <Link
                key={cat.id || cat.category_key}
                to={cat.target_link}
                className={`group flex flex-col items-center text-center cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full max-w-[160px] ${
                  delays[idx % delays.length]
                } ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1 bg-white border-2 border-stone-200 group-hover:border-[#D97706] shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1.5 shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-stone-100">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent group-hover:opacity-30 transition-opacity" />
                  </div>

                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-stone-900 text-[#D97706] text-[8px] sm:text-[9px] font-mono font-bold px-2 sm:px-2.5 py-0.5 rounded-full border border-stone-700 shadow-xs whitespace-nowrap group-hover:bg-[#D97706] group-hover:text-stone-950 transition-colors">
                    {cat.count}
                  </span>
                </div>

                <div className="mt-4 sm:mt-5 space-y-0.5 px-1">
                  <h3
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    className="font-medium text-stone-900 text-sm sm:text-base md:text-lg tracking-tight group-hover:text-[#D97706] transition-colors leading-tight line-clamp-2"
                  >
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 group-hover:text-stone-800 transition-colors font-medium">
                    {cat.tamil}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
