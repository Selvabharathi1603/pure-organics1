import React, { useState } from "react";
import { ShoppingBag, Check, Star, AlertCircle } from "lucide-react";
import { useStore } from "../context/storecontext";

export default function ProductCard({ product }) {
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);

  // Safety fallback so the UI never crashes or renders blank
  if (!product) return null;

  const isOutOfStock = product.inStock === false;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl p-4 border border-stone-200 hover:border-[#D97706] shadow-xs hover:shadow-md transition-all duration-200 font-sans text-left">
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-100 flex items-center justify-center">
        <img
          src={product.image || "/placeholder-oil.png"}
          alt={product.name || "Pantry Item"}
          loading="lazy"
          className={`w-full h-full object-contain p-3 transition-transform duration-300 ${
            isOutOfStock ? "grayscale opacity-50" : "group-hover:scale-105"
          }`}
        />

        {/* Category Badge */}
        {product.category && (
          <span className="absolute top-2.5 left-2.5 bg-white/95 text-stone-900 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-stone-200 shadow-2xs">
            {product.category}
          </span>
        )}

        {/* Out of Stock Label */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-2xs flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-stone-900 text-white font-bold text-xs uppercase tracking-wider shadow-md">
              Out of Stock
            </span>
          </div>
        )}

        {/* Customer Rating */}
        {product.rating && !isOutOfStock && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/95 text-stone-900 text-[11px] font-bold px-2 py-0.5 rounded-md border border-stone-200 shadow-2xs">
            <Star className="w-3 h-3 text-[#D97706] fill-[#D97706]" />
            <span>{product.rating}</span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="pt-3.5 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-[#D97706] uppercase tracking-wider block">
            {product.unit || "Pack"}
          </span>
          <h3 className="text-base font-bold text-stone-900 leading-snug line-clamp-1 group-hover:text-[#D97706] transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {product.description || "Freshly packed direct from the mill."}
          </p>
        </div>

        {/* Price & Add to Cart Button */}
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

          {/* Full-Width Action Button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAdd}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              isOutOfStock
                ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                : added
                  ? "bg-[#D97706] text-black shadow-xs font-extrabold"
                  : "bg-stone-900 hover:bg-[#D97706] text-white hover:text-black shadow-xs"
            }`}
          >
            {isOutOfStock ? (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Out of Stock</span>
              </>
            ) : added ? (
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
}
