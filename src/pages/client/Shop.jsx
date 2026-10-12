import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  ArrowUpDown,
  X,
  SlidersHorizontal,
  ArrowLeft,
  Check,
  Plus,
  Sparkles,
} from "lucide-react";
import { useStore } from "../../context/storecontext";

const CATEGORY_TABS = [
  { id: "all", name: "All Products", query: "All" },
  { id: "oil", name: "Cold-Pressed Oils", query: "Oil" },
  { id: "ghee", name: "Desi Ghee", query: "Ghee" },
  { id: "rice", name: "Heritage Rice", query: "Rice" },
  { id: "millets", name: "Native Millets", query: "Millets" },
  { id: "breakfast", name: "Honey & Jaggery", query: "Breakfast" },
];

export default function Shop() {
  const { products, addToCart } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("bestseller");
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const handleCategoryChange = (query) => {
    setSelectedCategory(query);
    if (query === "All") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: query });
    }
  };

  const filteredProducts = useMemo(() => {
    let result = (products || []).filter((product) => {
      const name = (product.name || "").toLowerCase();
      const cat = (product.category || "").toLowerCase();
      const desc = (product.description || "").toLowerCase();
      const target = selectedCategory.toLowerCase();

      let matchesCategory = true;
      if (selectedCategory && selectedCategory !== "All") {
        if (target === "oil") {
          matchesCategory = cat.includes("oil") || name.includes("oil");
        } else if (target === "ghee") {
          matchesCategory = cat.includes("ghee") || name.includes("ghee");
        } else if (target === "rice") {
          matchesCategory = cat.includes("rice") || name.includes("rice");
        } else if (target === "millets") {
          matchesCategory =
            cat.includes("millet") ||
            name.includes("millet") ||
            name.includes("varagu") ||
            name.includes("thinai") ||
            name.includes("kavuni");
        } else if (target === "breakfast") {
          matchesCategory =
            name.includes("honey") ||
            name.includes("jaggery") ||
            cat.includes("sweet") ||
            cat.includes("groceries") ||
            cat.includes("breakfast");
        } else {
          matchesCategory = cat.includes(target) || name.includes(target);
        }
      }

      if (!matchesCategory) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesQuery =
          name.includes(q) ||
          cat.includes(q) ||
          desc.includes(q) ||
          (product.unit && product.unit.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      return true;
    });

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "bestseller":
      default:
        result.sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedCategory, searchTerm, sortBy]);

  const handleAddToCart = (product) => {
    if (product.inStock === false) return;
    addToCart(product);
    const prodId = product.id || product._id;
    setAddedId(prodId);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="w-full bg-[#FAF9F5] text-stone-900 select-none min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* festive banner */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#D97706]">
            <Sparkles className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase">
              navratri festive sale · up to 25% off
            </span>
          </div>

          <h1
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            className="text-4xl sm:text-5xl font-medium text-stone-950 tracking-tight"
          >
            festive harvest collection
          </h1>

          <p
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            className="text-sm sm:text-base text-stone-600 italic"
          >
            traditional wood-pressed oils, unpolished rice, raw forest honey,
            and native millets at exclusive navratri prices.
          </p>
        </div>

        {/* filter bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                className="w-full pl-11 pr-10 py-2.5 text-sm rounded-2xl bg-[#FAF9F5] border border-stone-200 text-stone-900 focus:outline-none focus:border-[#D97706]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <ArrowUpDown className="w-4 h-4 text-stone-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                className="w-full md:w-auto px-4 py-2.5 text-sm rounded-2xl bg-[#FAF9F5] border border-stone-200 text-stone-800 focus:outline-none focus:border-[#D97706] cursor-pointer"
              >
                <option value="bestseller">sort: fresh and in stock</option>
                <option value="price-low">price: low to high</option>
                <option value="price-high">price: high to low</option>
                <option value="name">alphabetical: a - z</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start md:justify-center pt-2 border-t border-stone-100">
            {CATEGORY_TABS.map((tab) => {
              const isSelected =
                selectedCategory.toLowerCase() === tab.query.toLowerCase();

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleCategoryChange(tab.query)}
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                      : "bg-[#FAF9F5] text-stone-700 border-stone-200 hover:border-[#D97706] hover:text-stone-950"
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* section header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 text-left">
          <div>
            <div className="flex items-center gap-2.5">
              <h2
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                className="text-2xl sm:text-3xl font-medium text-stone-900"
              >
                {selectedCategory === "All" ? "all harvests" : selectedCategory}
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-[#D97706]">
                navratri festive deals
              </span>
            </div>
            <p
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              className="text-xs text-stone-500 italic mt-0.5"
            >
              showing {filteredProducts.length} items with festive discounts
            </p>
          </div>

          {(selectedCategory !== "All" || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                handleCategoryChange("All");
                setSearchTerm("");
              }}
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#D97706] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> reset filters
            </button>
          )}
        </div>

        {/* lando norris card structure */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
            {filteredProducts.map((product) => {
              const prodId = product.id || product._id;
              const isAdded = addedId === prodId;
              const isOutOfStock = product.inStock === false;
              const mrpPrice =
                Number(product.originalPrice) ||
                Math.round(Number(product.price) * 1.25);

              return (
                <div
                  key={prodId}
                  onClick={() => handleAddToCart(product)}
                  className="group relative flex flex-col justify-between rounded-[32px] bg-[#F7F5F0] border-2 border-stone-200/90 p-5 transition-all duration-300 hover:border-[#D97706] hover:shadow-2xl cursor-pointer text-left"
                >
                  {/* floating hero image viewport without inner box */}
                  <div className="relative aspect-square w-full flex items-center justify-center overflow-hidden py-3">
                    <img
                      src={product.image || "/placeholder-oil.png"}
                      alt={product.name}
                      loading="lazy"
                      className={`max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-110 ${
                        isOutOfStock ? "grayscale opacity-40" : ""
                      }`}
                    />

                    {/* minimal category & sale tags */}
                    <div className="absolute top-1 left-1 flex flex-col gap-1 items-start">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/80 text-stone-700 border border-stone-200">
                        {product.category || "Native"}
                      </span>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-stone-950">
                        sale
                      </span>
                    </div>

                    {isOutOfStock && (
                      <span
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                        className="absolute top-1 right-1 text-xs italic px-2.5 py-0.5 rounded-full bg-stone-900 text-white"
                      >
                        sold out
                      </span>
                    )}
                  </div>

                  {/* minimal bottom strip: title left, strike-out mrp and solid dark price right */}
                  <div className="mt-4 pt-3 flex items-center justify-between gap-2 border-t border-stone-300/60">
                    <div className="min-w-0 pr-2">
                      <h3
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                        className="text-lg font-medium text-stone-950 group-hover:text-[#D97706] transition-colors leading-snug truncate"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                      <p
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                        className="text-xs text-stone-500 italic truncate"
                      >
                        {product.unit || "cold batch"}
                      </p>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2.5">
                      <div className="flex flex-col items-end leading-none">
                        <span className="font-mono text-xs text-stone-400 line-through font-semibold">
                          ₹{mrpPrice}
                        </span>
                        <span
                          style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                          className="text-xl font-bold text-stone-950 mt-1"
                        >
                          ₹{product.price}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={isOutOfStock}
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full border transition-all cursor-pointer ${
                          isOutOfStock
                            ? "border-stone-200 text-stone-300 cursor-not-allowed"
                            : isAdded
                              ? "bg-[#D97706] text-black border-[#D97706]"
                              : "border-stone-400 text-stone-700 group-hover:border-[#D97706] group-hover:text-[#D97706]"
                        }`}
                        title="Add to Cart"
                      >
                        {isAdded ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
            <SlidersHorizontal className="w-10 h-10 text-stone-300 mx-auto" />
            <h3
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              className="text-2xl font-medium text-stone-900"
            >
              no products found
            </h3>
            <p
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              className="text-sm text-stone-600 italic"
            >
              no items matched your current filter
            </p>
            <button
              type="button"
              onClick={() => {
                handleCategoryChange("All");
                setSearchTerm("");
              }}
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              className="px-6 py-2 rounded-full bg-stone-900 hover:bg-[#D97706] hover:text-black text-white text-sm transition-all cursor-pointer shadow-sm"
            >
              reset filters and view all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
