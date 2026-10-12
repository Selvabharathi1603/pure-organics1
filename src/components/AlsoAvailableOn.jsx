import React from "react";

export default function AlsoAvailableOn() {
  const partners = [
    {
      name: "Blinkit",
      render: () => (
        <span className="font-extrabold text-2xl tracking-tight text-stone-800 flex items-center">
          blink<span className="text-[#D97706]">it</span>
        </span>
      ),
    },
    {
      name: "Zepto",
      render: () => (
        <span className="font-black text-2xl tracking-tighter text-stone-800 lowercase">
          zepto
        </span>
      ),
    },
    {
      name: "Instamart",
      render: () => (
        <span className="font-bold text-xl tracking-tight text-stone-800 flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] inline-block" />
          instamart
        </span>
      ),
    },
    {
      name: "Amazon",
      render: () => (
        <span className="font-black text-2xl tracking-tight text-stone-800 lowercase flex items-baseline">
          amazon
          <span className="text-[#D97706] text-xs font-bold ml-0.5">now</span>
        </span>
      ),
    },
    {
      name: "BigBasket",
      render: () => (
        <span className="font-bold text-xl tracking-tight text-stone-800 flex items-center">
          <span className="w-5 h-5 rounded-md bg-stone-800 text-white text-[11px] font-black flex items-center justify-center mr-1">
            bb
          </span>
          bigbasket
        </span>
      ),
    },
    {
      name: "DMart Ready",
      render: () => (
        <span className="font-extrabold text-xl tracking-wide text-stone-800 uppercase flex items-center">
          D<span className="text-[#D97706]">★</span>Mart{" "}
          <span className="text-[10px] font-semibold text-stone-500 ml-1">
            READY
          </span>
        </span>
      ),
    },
    {
      name: "Metro",
      render: () => (
        <span className="font-black text-2xl tracking-widest text-stone-800 uppercase">
          METRO
        </span>
      ),
    },
  ];

  // Repeat for continuous seamless scrolling
  const marqueeList = [...partners, ...partners, ...partners];

  return (
    <section className="w-full bg-[#FAF9F5] py-10 sm:py-14 border-y border-stone-200/70 overflow-hidden select-none">
      {/* Editorial Heading (Acid League Style) */}
      <div className="text-center mb-8 px-4">
        <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-stone-900 font-bold tracking-tight">
          Also available on
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 font-sans mt-1">
          Order our fresh mara chekku harvest directly to your doorstep in 10
          minutes
        </p>
      </div>

      {/* Marquee Scroller with Side Edge Blurs */}
      <div className="relative w-full overflow-hidden">
        {/* Soft edge gradient fades */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#FAF9F5] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#FAF9F5] to-transparent z-10 pointer-events-none" />

        {/* Continuous Marquee Track */}
        <div className="flex w-max items-center animate-partner-scroll hover:[animation-play-state:paused]">
          {marqueeList.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex items-center justify-center mx-8 sm:mx-12 shrink-0 opacity-75 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              {partner.render()}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
