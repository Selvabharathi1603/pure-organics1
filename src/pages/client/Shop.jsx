import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShoppingBag,
  Check,
  ArrowLeft,
  Search,
  ArrowUpDown,
  X,
  SlidersHorizontal,
  Star,
  AlertCircle,
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
    <div className="w-full bg-white text-stone-900 font-sans select-none min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-amber-50 text-[#D97706] border border-amber-200">
            Direct Farm Dispatch
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            Our Store <span className="text-[#D97706]">Catalog.</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            Cold-pressed oils, unpolished native rice, raw wild honey, and whole
            millets.
          </p>
        </div>

        {/* Search, Sort, and Category Bar */}
        <div className="bg-stone-50 p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products (e.g., Sesame Oil, Kavuni Rice, Honey)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3 text-xs sm:text-sm rounded-2xl bg-white border border-stone-200 text-stone-900 focus:outline-none focus:border-[#D97706] transition-all"
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

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <ArrowUpDown className="w-4 h-4 text-stone-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-auto px-4 py-3 text-xs sm:text-sm rounded-2xl bg-white border border-stone-200 font-bold text-stone-800 focus:outline-none focus:border-[#D97706] cursor-pointer"
              >
                <option value="bestseller">Sort by: Fresh & In Stock</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Alphabetical (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start md:justify-center pt-2 border-t border-stone-200">
            {CATEGORY_TABS.map((tab) => {
              const isSelected =
                selectedCategory.toLowerCase() === tab.query.toLowerCase();

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleCategoryChange(tab.query)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                      : "bg-white text-stone-700 border-stone-200 hover:border-[#D97706] hover:text-stone-950"
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Info Bar */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </h2>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Showing {filteredProducts.length} items available
            </p>
          </div>

          {(selectedCategory !== "All" || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                handleCategoryChange("All");
                setSearchTerm("");
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#D97706] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const prodId = product.id || product._id;
              const isAdded = addedId === prodId;
              const isOutOfStock = product.inStock === false;

              return (
                <div
                  key={prodId}
                  className="group bg-white rounded-2xl border border-stone-200 hover:border-[#D97706] transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md text-left p-4"
                >
                  {/* Image Frame */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-100 flex items-center justify-center">
                    <img
                      src={product.image || "/placeholder-oil.png"}
                      alt={product.name}
                      loading="lazy"
                      className={`w-full h-full object-contain p-2 transition-transform duration-300 ${
                        isOutOfStock
                          ? "grayscale opacity-50"
                          : "group-hover:scale-105"
                      }`}
                    />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/95 text-stone-900 border border-stone-200 shadow-2xs">
                      {product.category || "Native"}
                    </span>

                    {isOutOfStock ? (
                      <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-900 text-white shadow-xs">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="absolute top-2.5 right-2.5 text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-stone-900 border border-stone-200 flex items-center gap-1 shadow-2xs">
                        <Star className="w-3 h-3 fill-[#D97706] text-[#D97706]" />
                        {product.rating || "4.9"}
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="pt-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-bold text-[#D97706] uppercase tracking-wider block">
                        {product.unit || "Standard Pack"}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 leading-snug line-clamp-1 group-hover:text-[#D97706] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {product.description ||
                          "Freshly pressed and packed directly at the mill."}
                      </p>
                    </div>

                    {/* Price and Cart Button */}
                    <div className="pt-2 border-t border-stone-100 space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">
                            Price
                          </span>
                          <span className="text-lg font-black text-stone-900">
                            ₹{product.price}
                          </span>
                        </div>
                        {product.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        disabled={isOutOfStock}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                          isOutOfStock
                            ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                            : isAdded
                              ? "bg-[#D97706] text-black font-extrabold shadow-xs"
                              : "bg-stone-900 hover:bg-[#D97706] text-white hover:text-black shadow-xs"
                        }`}
                      >
                        {isOutOfStock ? (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Out of Stock</span>
                          </>
                        ) : isAdded ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-stone-50 border border-stone-200 rounded-3xl p-12 text-center space-y-4 shadow-xs">
            <SlidersHorizontal className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900">
              No Products Found
            </h3>
            <p className="text-sm text-stone-600">
              No items matched your current filter "
              {searchTerm || selectedCategory}".
            </p>
            <button
              type="button"
              onClick={() => {
                handleCategoryChange("All");
                setSearchTerm("");
              }}
              className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-[#D97706] hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
            >
              Reset Filters & View All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
