import React from "react";
import { Link } from "react-router-dom";
import { Wheat, Leaf, Zap, ArrowRight } from "lucide-react";

const PREFERENCES = [
  {
    title: "Gluten-Free & Low GI",
    subtitle: "Unpolished Native Millets",
    tag: "Ancient Grains",
    query: "Millets",
    icon: Wheat,
    cardBg: "bg-gradient-to-br from-[#fbf9f4] to-[#f2ede4]",
    borderColor: "border-[#e5dfd2]",
    badgeStyle: "bg-[#c58f38]/15 text-[#825b18] border-[#c58f38]/30",
  },
  {
    title: "100% Cold Wood-Pressed",
    subtitle: "Vaagai Chekku Native Oils",
    tag: "Zero Refining",
    query: "Oil",
    icon: Leaf,
    cardBg: "bg-gradient-to-br from-[#f4f9f5] to-[#e8f3eb]",
    borderColor: "border-[#cfe0d4]",
    badgeStyle: "bg-[#2e7d4d]/15 text-[#1b4d2f] border-[#2e7d4d]/30",
  },
  {
    title: "Natural Iron & Vitality",
    subtitle: "Palm Jaggery & Raw Comb Honey",
    tag: "Sustained Energy",
    query: "Groceries",
    icon: Zap,
    cardBg: "bg-gradient-to-br from-[#fcf6ee] to-[#f4ebe0]",
    borderColor: "border-[#e7d8c6]",
    badgeStyle: "bg-[#b86d29]/15 text-[#7c4412] border-[#b86d29]/30",
  },
];

export default function DietPreferences() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-center gap-4 text-center">
        <div className="h-px bg-[#e2dad0] flex-1 max-w-[100px] hidden sm:block" />
        <h2 className="font-serif text-2xl sm:text-3xl text-[#162a1e]">
          Shop by{" "}
          <span className="text-[#2e7d4d] italic font-serif">Health Goal</span>
        </h2>
        <div className="h-px bg-[#e2dad0] flex-1 max-w-[100px] hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PREFERENCES.map((pref) => {
          const Icon = pref.icon;
          return (
            <Link
              key={pref.title}
              to={`/shop?category=${encodeURIComponent(pref.query)}`}
              className={`group relative p-7 rounded-3xl ${pref.cardBg} border ${pref.borderColor} hover:border-[#2e7d4d] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1`}
            >
              <div className="space-y-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${pref.badgeStyle}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {pref.tag}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#162a1e]">
                  {pref.title}
                </h3>
                <p className="text-xs text-[#526659] leading-relaxed">
                  {pref.subtitle}
                </p>
              </div>

              <div className="pt-6 flex items-center text-xs font-bold text-[#1b3b27] group-hover:text-[#2e7d4d] gap-1">
                Explore Harvests{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
