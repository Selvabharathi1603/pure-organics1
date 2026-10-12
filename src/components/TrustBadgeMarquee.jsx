import React from "react";

// Exact imports from your src/assets/image folder
import img1 from "../assets/image/image_5d75c3.png";
import img2 from "../assets/image/image_5d798a.png";
import img3 from "../assets/image/image_5d7644.png";
import img4 from "../assets/image/image_5d7947.png";
import img5 from "../assets/image/image_5dcbfe.png";
import img6 from "../assets/image/image_5dcfbf.png";
import img7 from "../assets/image/image_5dd09c.png";
import img8 from "../assets/image/image_5dd39c.png";
import img9 from "../assets/image/image_5dd437.png";

export default function TrustBadgeMarquee() {
  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

  // Repeat for continuous seamless loop
  const trackImages = [...images, ...images];

  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] max-w-none bg-[#FAF9F5] border-y border-stone-200/80 py-5 sm:py-7 md:py-8 overflow-hidden select-none">
      {/* Left and Right Edge Gradient Fades for a seamless look */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 md:w-32 bg-gradient-to-r from-[#FAF9F5] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 md:w-32 bg-gradient-to-l from-[#FAF9F5] to-transparent z-10" />

      {/* Marquee Track */}
      <div className="flex w-max items-center gap-8 sm:gap-14 md:gap-20 animate-trust-marquee hover:[animation-play-state:paused]">
        {trackImages.map((src, index) => (
          <div
            key={index}
            className="shrink-0 flex items-center justify-center h-14 w-24 sm:h-20 sm:w-32 md:h-24 md:w-40 px-2 transition-transform duration-300 hover:scale-105"
          >
            <img
              src={src}
              alt="Certification & Trust Badge"
              className="max-h-full max-w-full object-contain pointer-events-none filter drop-shadow-xs opacity-90 hover:opacity-100 transition-opacity"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
