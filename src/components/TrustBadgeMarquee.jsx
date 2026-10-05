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
  const trackImages = [...images, ...images, ...images, ...images];

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white border-y border-stone-200 py-6 sm:py-8 overflow-hidden select-none m-0 p-0 block">
      <div className="flex w-max animate-trust-marquee items-center gap-14 sm:gap-20">
        {trackImages.map((src, index) => (
          <div
            key={index}
            className="shrink-0 flex items-center justify-center h-24 w-32 sm:h-32 sm:w-44 md:h-36 md:w-48"
          >
            <img
              src={src}
              alt="Trust Badge"
              className="w-full h-full object-contain pointer-events-none filter drop-shadow-xs"
              loading="eager"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
