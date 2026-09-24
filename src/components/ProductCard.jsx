import React, { useState } from "react";
import { Plus, Check, Star, AlertCircle } from "lucide-react";
import { useStore } from "../context/storecontext";

export default function ProductCard({ product }) {
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.inStock === false;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl p-3.5 border border-[#e8e2d5] hover:border-[#2e7d4d] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(46,125,77,0.12)] transition-all duration-300">
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#faf7f2]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isOutOfStock ? "grayscale opacity-60" : "group-hover:scale-105"
          }`}
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#1b3b27] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-[#dce7df] shadow-xs">
          {product.category}
        </span>

        {/* Out of Stock Overlay Ribbon */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#162a1e]/40 flex items-center justify-center">
            <span className="px-3.5 py-1.5 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Rating */}
        {product.rating && !isOutOfStock && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-md text-[#162a1e] text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[#dce7df] shadow-xs">
            <Star className="w-3 h-3 text-[#c58f38] fill-[#c58f38]" />
            <span>{product.rating}</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <span className="text-[11px] font-semibold text-[#2e7d4d] tracking-wider uppercase font-mono">
            {product.unit}
          </span>
          <h3 className="font-serif text-lg font-bold text-[#162a1e] leading-snug mt-0.5 line-clamp-1 group-hover:text-[#2e7d4d] transition-colors">
            {product.name}
          </h3>
          <p className="mt-1.5 text-xs text-[#526659] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Cart Button */}
        <div className="mt-5 pt-3 border-t border-[#f0eae0] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#829688] block">
              Price
            </span>
            <span className="text-xl font-bold text-[#162a1e] tracking-tight font-serif">
              ₹{product.price}
            </span>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAdd}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm active:scale-90 cursor-pointer ${
              isOutOfStock
                ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                : added
                  ? "bg-[#2e7d4d] text-white rotate-0 shadow-[0_0_12px_rgba(46,125,77,0.4)]"
                  : "bg-[#edf5ef] hover:bg-[#1b3b27] text-[#1b3b27] hover:text-white hover:rotate-90 border border-[#cbe1d2] hover:border-[#1b3b27]"
            }`}
            aria-label={isOutOfStock ? "Out of stock" : "Add to bag"}
          >
            {isOutOfStock ? (
              <AlertCircle className="w-4 h-4" />
            ) : added ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
