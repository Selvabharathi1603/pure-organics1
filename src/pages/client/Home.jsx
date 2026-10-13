import React from "react";
import HeroSection from "../../components/HeroSection";
import TrustBadgeMarquee from "../../components/TrustBadgeMarquee";
import ShopByCategory from "../../components/ShopByCategory";
import DietPreferences from "../../components/DietPreference";
import GiftingAndLists from "../../components/GiftingAndLists";
import CustomerTestimonials from "../../components/CustomerTestimonials";
import MillHeritage from "../../components/MillHeritage";
import AlsoAvailableOn from "../../components/AlsoAvailableOn";
import PurityManifesto from "../../components/PurityManifesto";
import FeaturedHarvests from "../../components/FeaturedHarvests";
import NilaAssistantCallout from "../../components/NilaAssistantCallout";
import FestiveFlashBanner from "../../components/FestiveFlashBanner";
import { Tag } from "lucide-react";
import { useStore } from "../../context/storecontext";

export default function Home() {
  const { products, announcements } = useStore();
  const featuredProducts = (products || []).slice(0, 3);

  const bannerText =
    announcements?.bannerText ||
    "Direct Cold-Pressed Harvests Dispatched Daily • 100% Mara Chekku";
  const couponCode = announcements?.couponCode || "HARVEST10";

  return (
    <div className="w-full min-h-screen bg-[#FAF9F5] text-stone-900 font-sans overflow-x-hidden selection:bg-[#D97706] selection:text-white">
      {/* 0. FESTIVE FLASH BANNER & HERO SECTION (ZERO GAP ATTACHED) */}
      <div className="w-full m-0 p-0 leading-none">
        <FestiveFlashBanner />
        <div className="-mt-px">
          <HeroSection />
        </div>
      </div>

      {/* 2. TRUST BADGE MARQUEE */}
      <TrustBadgeMarquee />

      {/* 3. CATEGORY HUBS */}
      <ShopByCategory />

      {/* 4. MILL HERITAGE & PLATFORMS */}
      <MillHeritage />
      <AlsoAvailableOn />

      {/* 5. DIET & DAILY HEALTH PREFERENCES */}
      <div className="w-full">
        <DietPreferences />
      </div>

      {/* 6. OUR MILL QUALITY STANDARDS */}
      <div className="w-full">
        <PurityManifesto />
      </div>

      {/* 7. ESSENTIAL LISTS & GIFTING BOX */}
      <div className="w-full">
        <GiftingAndLists />
      </div>

      {/* 8. FEATURED HARVESTS */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <FeaturedHarvests featuredProducts={featuredProducts} />
      </section>

      {/* 9. NILA ASSISTANT CALLOUT */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <NilaAssistantCallout />
      </section>

      {/* 10. CUSTOMER TESTIMONIALS */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pb-12">
        <CustomerTestimonials />
      </section>
    </div>
  );
}
