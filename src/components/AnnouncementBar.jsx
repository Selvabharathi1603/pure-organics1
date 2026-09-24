import React from "react";
import { useStore } from "../context/storecontext";

const DEFAULT_ANNOUNCEMENTS = [
  "Up to 30% off on selected harvests + additional 5% off on prepaid orders | Code: PREPAY5",
  "Free doorstep delivery across India on orders above ₹799",
  "Cash on Delivery available on all regional pin codes",
  "Complimentary Farm Sampler Jar with orders above ₹999",
  "Fresh Harvest Batch Live: Stone-ground Flours & Wood-Pressed Gingelly",
];

export default function AnnouncementBar() {
  const store = useStore?.() || {};
  const activeAnnouncements =
    store.announcements && store.announcements.length > 0
      ? store.announcements
      : DEFAULT_ANNOUNCEMENTS;

  return (
    <div className="w-full bg-[#1b3b27] text-[#f4f7f4] text-xs sm:text-sm font-medium py-2.5 overflow-hidden select-none border-b border-[#142e1e]">
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: flex;
          width: max-content;
          animation: ticker 32s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="animate-ticker">
        {/* Track 1 */}
        <div className="flex items-center space-x-8 sm:space-x-12 pr-8 sm:pr-12 shrink-0">
          {activeAnnouncements.map((item, index) => (
            <React.Fragment key={`ann-1-${index}`}>
              <span className="tracking-wide whitespace-nowrap text-[11px] sm:text-xs font-medium">
                {item}
              </span>
              <span className="text-[#c58f38] text-[8px]">✦</span>
            </React.Fragment>
          ))}
        </div>

        {/* Track 2 Duplicate */}
        <div className="flex items-center space-x-8 sm:space-x-12 pr-8 sm:pr-12 shrink-0">
          {activeAnnouncements.map((item, index) => (
            <React.Fragment key={`ann-2-${index}`}>
              <span className="tracking-wide whitespace-nowrap text-[11px] sm:text-xs font-medium">
                {item}
              </span>
              <span className="text-[#c58f38] text-[8px]">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
