import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Sparkles,
  ShoppingBag,
  Check,
  ArrowLeft,
  Search,
  ArrowUpDown,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useStore } from "../../context/storecontext";

const CATEGORY_TABS = [
  { id: "all", name: "All Harvests", query: "All" },
  { id: "oil", name: "Organic Oil", query: "Oil" },
  { id: "ghee", name: "Organic Ghee", query: "Ghee" },
  { id: "flour", name: "Organic Flour", query: "Flour" },
  { id: "millets", name: "Organic Millets", query: "Millets" },
  { id: "rice", name: "Organic Rice", query: "Rice" },
  { id: "breakfast", name: "Organic Breakfast", query: "Breakfast" },
  { id: "pickles", name: "Organic Pickles", query: "Pickles" },
  { id: "dryfruits", name: "Organic Dry Fruits", query: "Dry Fruits" },
];

export default function Shop() {
  const { products, addToCart } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("bestseller"); // bestseller | price-low | price-high | name
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Log searches and category filter usage to MySQL backend with 800ms debounce
  useEffect(() => {
    if (!searchTerm.trim() && selectedCategory === "All") return;

    const timer = setTimeout(() => {
      fetch("http://localhost:5000/api/analytics/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query_term: searchTerm.trim(),
          filter_category: selectedCategory,
        }),
      }).catch((err) => console.warn("Search analytics logger error:", err));
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  const handleCategoryChange = (query) => {
    setSelectedCategory(query);
    if (query === "All") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: query });
    }
  };

  // Combined Search, Category Filter, and Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const term = selectedCategory.toLowerCase();
      const name = product.name?.toLowerCase() || "";
      const cat = product.category?.toLowerCase() || "";
      const desc = product.description?.toLowerCase() || "";

      // 1. Category Matching (Preserved exact lineage filters)
      let matchesCategory = true;
      if (selectedCategory && selectedCategory !== "All") {
        if (term === "oil")
          matchesCategory = name.includes("oil") || cat.includes("oil");
        else if (term === "ghee")
          matchesCategory = name.includes("ghee") || desc.includes("ghee");
        else if (term === "millets") {
          matchesCategory =
            cat.includes("millet") ||
            name.includes("millet") ||
            name.includes("kuthiraivali") ||
            name.includes("thinai") ||
            name.includes("samai") ||
            name.includes("varagu") ||
            name.includes("ragi") ||
            name.includes("kambu");
        } else if (term === "rice")
          matchesCategory = name.includes("rice") || desc.includes("rice");
        else if (term === "flour") {
          matchesCategory =
            name.includes("flour") ||
            name.includes("atta") ||
            desc.includes("flour");
        } else if (term === "breakfast") {
          matchesCategory =
            name.includes("aval") ||
            name.includes("flake") ||
            name.includes("sugar") ||
            name.includes("honey") ||
            name.includes("jaggery");
        } else if (term === "pickles") {
          matchesCategory =
            name.includes("sundakkai") ||
            name.includes("pickle") ||
            desc.includes("berry");
        } else if (term === "dryfruits") {
          matchesCategory =
            name.includes("nut") ||
            name.includes("fruit") ||
            name.includes("seed");
        } else {
          matchesCategory = name.includes(term) || cat.includes(term);
        }
      }

      if (!matchesCategory) return false;

      // 2. Keyword Search Query Matching
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

    // 3. Sorting Execution
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
        // Shows in-stock items first, followed by default store ID order
        result.sort(
          (a, b) =>
            (b.inStock !== false ? 1 : 0) - (a.inStock !== false ? 1 : 0),
        );
        break;
    }

    return result;
  }, [products, selectedCategory, searchTerm, sortBy]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-[#edf5ef] text-[#2e7d4d] border border-[#cbe1d2]">
          <Sparkles className="w-3 h-3 text-[#c58f38]" /> Pure Harvest Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#162a1e]">
          Our Organic Harvests
        </h1>
        <p className="text-xs sm:text-sm text-[#5c7365]">
          Unpolished native grains, wood-pressed oils, and traditional farm
          staples.
        </p>
      </div>

      {/* 2. Control Hub: Live Search Bar & Sort Dropdown */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e8e2d5] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by harvest name, oil, or crop (e.g., Vaagai, Karuppu Kavuni, Honey)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-xs sm:text-sm rounded-2xl bg-[#faf7f2] border border-[#dcd4c7] text-[#162a1e] focus:outline-none focus:border-[#1b3b27] transition-all"
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

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <ArrowUpDown className="w-4 h-4 text-[#1b3b27]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto px-4 py-3 text-xs sm:text-sm rounded-2xl bg-[#faf7f2] border border-[#dcd4c7] font-semibold text-[#1b3b27] focus:outline-none focus:border-[#1b3b27] cursor-pointer"
            >
              <option value="bestseller">Sort by: Fresh & Bestsellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>

        {/* 3. Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start md:justify-center pt-1 border-t border-[#f2ece2]">
          {CATEGORY_TABS.map((tab) => {
            const isSelected =
              selectedCategory.toLowerCase() === tab.query.toLowerCase();

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleCategoryChange(tab.query)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#1b3b27] text-white shadow-sm scale-105"
                    : "bg-[#faf7f2] text-[#4d6355] border border-[#e4ded3] hover:border-[#2e7d4d] hover:text-[#1b3b27]"
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Section Title Bar */}
      <div className="flex items-center justify-between border-b border-[#e8e2d5] pb-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#162a1e]">
            {selectedCategory === "All"
              ? "All Products"
              : `Category: ${selectedCategory}`}
          </h2>
          <p className="text-xs text-[#6d8274] mt-0.5">
            Showing {filteredProducts.length} items
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {(selectedCategory !== "All" || searchTerm) && (
          <button
            type="button"
            onClick={() => {
              handleCategoryChange("All");
              setSearchTerm("");
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1b3b27] hover:text-[#2e7d4d] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>

      {/* 5. Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl border border-[#e8e2d5] hover:border-[#2e7d4d] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg"
            >
              {/* Product Image */}
              <div className="relative aspect-4/3 overflow-hidden bg-[#faf7f2]">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#1b3b27] border border-[#dce7df]">
                  {product.category}
                </span>
                {product.inStock === false ? (
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-600 text-white shadow-xs">
                    Out of Stock
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#162a1e] border border-[#dce7df] flex items-center gap-1">
                    <span className="text-[#c58f38]">★</span>{" "}
                    {product.rating || "4.9"}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-serif text-base font-bold text-[#162a1e] leading-snug group-hover:text-[#2e7d4d] transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-[11px] font-mono text-[#6d8274] block">
                    {product.unit}
                  </span>
                  <p className="text-xs text-[#526659] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price and Cart Action */}
                <div className="pt-3 border-t border-[#f0eae0] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#829688] block">
                      Price
                    </span>
                    <span className="font-serif text-lg font-bold text-[#162a1e]">
                      ₹{product.price}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.inStock === false}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      addedId === product.id
                        ? "bg-[#2e7d4d] text-white"
                        : "bg-[#1b3b27] hover:bg-[#255236] text-white shadow-sm"
                    }`}
                  >
                    {addedId === product.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-[#f4e3b2]" />{" "}
                        {product.inStock === false ? "Sold Out" : "Add"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#e8e2d5] rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <SlidersHorizontal className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#162a1e]">
            No Harvest Items Found
          </h3>
          <p className="text-sm text-[#5c7365]">
            No products matched your search "{searchTerm || selectedCategory}".
          </p>
          <button
            type="button"
            onClick={() => {
              handleCategoryChange("All");
              setSearchTerm("");
            }}
            className="px-6 py-2.5 rounded-xl bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            Reset Filters & View All
          </button>
        </div>
      )}
    </div>
  );
}
