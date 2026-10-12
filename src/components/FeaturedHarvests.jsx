import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard"; // Adjust the import path to match your ProductCard location

export default function FeaturedHarvests({ featuredProducts = [] }) {
  if (!featuredProducts || featuredProducts.length === 0) return null;

  return (
    <section className="space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5 text-left">
        <div>
          <span className="text-xs font-semibold text-[#D97706] uppercase tracking-wider font-mono">
            Fresh Mill Selection
          </span>
          <h2
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            className="text-2xl sm:text-3xl lg:text-4xl font-medium text-stone-900 mt-1"
          >
            Featured Farm Harvests
          </h2>
        </div>
        <Link
          to="/shop"
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-[#D97706] transition-colors"
        >
          <span>Explore All Products</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
