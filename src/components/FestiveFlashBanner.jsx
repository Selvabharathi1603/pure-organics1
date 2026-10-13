import React from "react";
import { Link } from "react-router-dom";
import festiveBannerImg from "../assets/image/FESTIVESALEBANNER.png";

export default function FestiveFlashBanner() {
  return (
    <section className="w-full bg-[#120B06] m-0 p-0 leading-none select-none">
      <div className="w-full max-w-[1920px] mx-auto m-0 p-0">
        <Link
          to="/shop"
          className="block w-full m-0 p-0 cursor-pointer relative group leading-none"
        >
          <img
            src={festiveBannerImg}
            alt="Diwali and Navratri Maha Sale"
            className="w-full h-auto max-h-[82vh] object-contain sm:object-cover object-center block m-0 p-0 transition-transform duration-500 group-hover:scale-[1.003]"
          />
        </Link>
      </div>
    </section>
  );
}
