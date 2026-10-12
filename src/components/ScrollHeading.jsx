import React, { useEffect, useRef, useState } from "react";

export default function ScrollHeading({
  tagline,
  title,
  subtitle,
  align = "center",
  className = "",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Multi-trigger IntersectionObserver: Replays every time on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px", // Triggers naturally as you scroll in/out
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isLeft = align === "left";

  return (
    <div
      ref={containerRef}
      className={`select-none font-sans overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0"
          : "opacity-0 -translate-x-12 translate-y-3"
      } ${
        isLeft
          ? "flex flex-col items-start text-left"
          : "flex flex-col items-center text-center mx-auto"
      } ${className}`}
    >
      {/* Tagline Pill */}
      {tagline && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#D97706] mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
            {tagline}
          </span>
        </div>
      )}

      {/* Main Heading */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-1.5 text-xs sm:text-sm text-stone-600 max-w-xl font-normal leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Expanding Amber Accent Line */}
      <div
        className={`h-0.5 bg-[#D97706] rounded-full mt-3 transition-all duration-700 delay-150 ${
          isVisible ? "w-14 opacity-100" : "w-0 opacity-0"
        }`}
      />
    </div>
  );
}
