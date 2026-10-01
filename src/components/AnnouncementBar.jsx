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
    <header className="w-full select-none font-sans z-50 relative border-b border-brand-border">
      {/* Primary Top Bar: Deep Forest Green with Crisp Badging */}
      <div className="w-full bg-brand-dark py-2.5 px-4 sm:px-8 text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          {/* Sale Hook */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="inline-flex items-center gap-1.5 bg-brand-green/20 text-[#A3E6B4] text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-0.5 rounded-full border border-brand-green/40">
              <span className="text-[11px] leading-none">✦</span>
              Harvest Special
            </span>
            <p className="text-white text-xs sm:text-sm font-semibold tracking-wide">
              FLAT <span className="text-[#F7D070] font-bold">50% OFF</span> ON
              OUR FARM BESTSELLERS
            </p>
          </div>

          {/* Clean Pill Countdown */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs border border-white/15 px-3 py-1 rounded-full text-white">
            <Clock className="w-3.5 h-3.5 text-[#F7D070]" />
            <span className="text-[11px] uppercase tracking-wider text-[#D1E7D6] font-medium">
              Ends In:
            </span>
            <div className="flex items-center gap-1 font-mono font-bold text-xs text-white">
              <span className="bg-black/30 px-1.5 py-0.5 rounded">
                {timeLeft.hours}h
              </span>
              <span>:</span>
              <span className="bg-black/30 px-1.5 py-0.5 rounded">
                {timeLeft.minutes}m
              </span>
              <span>:</span>
              <span className="bg-brand-green text-white px-1.5 py-0.5 rounded">
                {timeLeft.seconds}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fresh Sage & Cream Ticker */}
      <div className="w-full bg-brand-cream py-2 border-b border-brand-border overflow-hidden">
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

        <div className="animate-marquee items-center text-[11px] sm:text-xs tracking-wider uppercase font-semibold text-brand-dark">
          {[1, 2].map((group) => (
            <div
              key={group}
              className="flex items-center space-x-10 sm:space-x-14 pr-10 sm:pr-14 shrink-0"
            >
              <span className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-brand-green" />
                Free Shipping Above ₹499
              </span>
              <span className="text-brand-border-dark opacity-30">◆</span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                Native Wood-Pressed • Zero Chemicals
              </span>
              <span className="text-brand-border-dark opacity-30">◆</span>
              <span>
                Use Coupon:{" "}
                <strong className="text-brand-dark bg-white px-2 py-0.5 rounded-full border border-brand-border">
                  HARVEST50
                </strong>
              </span>
              <span className="text-brand-border-dark opacity-30">◆</span>
              <span>Direct Single-Origin Farm Harvests</span>
              <span className="text-brand-border-dark opacity-30">◆</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
