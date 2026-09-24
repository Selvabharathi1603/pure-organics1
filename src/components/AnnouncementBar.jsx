import React, { useState, useEffect } from "react";
import { Sparkles, Clock, ShieldCheck, Truck } from "lucide-react";

export default function AnnouncementBar() {
  const [timeLeft, setTimeLeft] = useState({
    hours: "08",
    minutes: "42",
    seconds: "19",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let sec = parseInt(prev.seconds, 10) - 1;
        if (sec >= 0)
          return { ...prev, seconds: sec < 10 ? `0${sec}` : `${sec}` };
        let min = parseInt(prev.minutes, 10) - 1;
        if (min >= 0)
          return {
            ...prev,
            minutes: min < 10 ? `0${min}` : `${min}`,
            seconds: "59",
          };
        return { hours: "07", minutes: "59", seconds: "59" };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full select-none font-sans z-50 relative">
      {/* Top Banner: Rich Botanical Forest Green with Golden Harvest Accents */}
      <div className="w-full bg-[#1b3b27] py-2.5 px-4 sm:px-8 border-b border-[#244c33] text-white shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          {/* Sale Hook */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            <span className="inline-flex items-center gap-1.5 bg-[#f59e0b] text-[#1b3b27] text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-3 h-3 fill-current text-[#1b3b27]" />
              Harvest Special
            </span>
            <p className="text-white text-xs sm:text-sm font-semibold tracking-wide">
              FLAT{" "}
              <span className="text-[#fbbf24] font-black text-sm sm:text-base">
                50% OFF
              </span>{" "}
              ON OUR FARM BESTSELLERS
            </p>
          </div>

          {/* High-Contrast Countdown Clock */}
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur border border-white/15 px-3 py-1 rounded-full text-white">
            <Clock className="w-3.5 h-3.5 text-[#fbbf24] animate-pulse" />
            <span className="text-[11px] uppercase tracking-wider text-emerald-100 font-medium">
              Ends In:
            </span>
            <div className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm text-[#fbbf24]">
              <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                {timeLeft.hours}h
              </span>
              <span>:</span>
              <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                {timeLeft.minutes}m
              </span>
              <span>:</span>
              <span className="bg-[#fbbf24] text-[#1b3b27] px-1.5 py-0.5 rounded font-black">
                {timeLeft.seconds}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fresh Sage & Cream Ticker */}
      <div className="w-full bg-[#eef5ee] py-2 border-b border-[#d8e8d8] overflow-hidden">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 35s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="animate-marquee items-center text-[11px] sm:text-xs tracking-wider uppercase font-semibold text-[#1b3b27]">
          {[1, 2].map((group) => (
            <div
              key={group}
              className="flex items-center space-x-10 sm:space-x-14 pr-10 sm:pr-14 shrink-0"
            >
              <span className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#2e7d4d]" /> Free Express
                Shipping on Orders Above ₹499
              </span>
              <span className="text-[#a3c9a8]">◆</span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d4d]" /> 100%
                Native Wood-Pressed • Zero Chemicals
              </span>
              <span className="text-[#a3c9a8]">◆</span>
              <span>
                Use Coupon:{" "}
                <strong className="text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded border border-[#fde68a]">
                  HARVEST50
                </strong>
              </span>
              <span className="text-[#a3c9a8]">◆</span>
              <span>Direct Single-Origin Farm Harvests</span>
              <span className="text-[#a3c9a8]">◆</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
