import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Sparkles, ShoppingBag, Check, ArrowLeft } from "lucide-react";
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

  const filteredProducts = products.filter((product) => {
    if (!selectedCategory || selectedCategory === "All") return true;

    const term = selectedCategory.toLowerCase();
    const name = product.name?.toLowerCase() || "";
    const cat = product.category?.toLowerCase() || "";
    const desc = product.description?.toLowerCase() || "";

    if (term === "oil") return name.includes("oil") || cat.includes("oil");
    if (term === "ghee") return name.includes("ghee") || desc.includes("ghee");
    if (term === "millets") {
      return (
        cat.includes("millet") ||
        name.includes("millet") ||
        name.includes("kuthiraivali") ||
        name.includes("thinai") ||
        name.includes("samai") ||
        name.includes("varagu") ||
        name.includes("ragi") ||
        name.includes("kambu")
      );
    }
    if (term === "rice") return name.includes("rice") || desc.includes("rice");
    if (term === "flour") {
      return (
        name.includes("flour") ||
        name.includes("atta") ||
        desc.includes("flour")
      );
    }
    if (term === "breakfast") {
      return (
        name.includes("aval") ||
        name.includes("flake") ||
        name.includes("sugar") ||
        name.includes("honey") ||
        name.includes("jaggery")
      );
    }
    if (term === "pickles") {
      return (
        name.includes("sundakkai") ||
        name.includes("pickle") ||
        desc.includes("berry")
      );
    }
    if (term === "dryfruits") {
      return (
        name.includes("nut") || name.includes("fruit") || name.includes("seed")
      );
    }

    return name.includes(term) || cat.includes(term);
  });

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

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
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
                  : "bg-white text-[#4d6355] border border-[#e4ded3] hover:border-[#2e7d4d] hover:text-[#1b3b27]"
              }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* 3. Section Title Bar */}
      <div className="flex items-center justify-between border-b border-[#e8e2d5] pb-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#162a1e]">
            {selectedCategory === "All"
              ? "All Products"
              : `Category: ${selectedCategory}`}
          </h2>
          <p className="text-xs text-[#6d8274] mt-0.5">
            Showing {filteredProducts.length} items
          </p>
        </div>

        {selectedCategory !== "All" && (
          <button
            type="button"
            onClick={() => handleCategoryChange("All")}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1b3b27] hover:text-[#2e7d4d] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Show All Products
          </button>
        )}
      </div>

      {/* 4. Products Grid */}
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
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#162a1e] border border-[#dce7df] flex items-center gap-1">
                  <span className="text-[#c58f38]">★</span> {product.rating}
                </span>
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
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
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
                        Add
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
          <p className="text-sm text-[#5c7365]">
            No harvest items currently listed under "{selectedCategory}".
          </p>
          <button
            type="button"
            onClick={() => handleCategoryChange("All")}
            className="px-6 py-2.5 rounded-xl bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
}
