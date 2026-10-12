import React from "react";
import { ShieldCheck, Flame, Users } from "lucide-react";

const STANDARDS = [
  {
    id: "01",
    icon: ShieldCheck,
    title: "Native Heritage Seeds",
    tamil: "பாரம்பரிய நாட்டு விதைகள்",
    description:
      "Harvested directly from local rain-fed soils without synthetic sprays, chemical fertilizers, or artificial seed polishing.",
  },
  {
    id: "02",
    icon: Flame,
    title: "Vaagai Wood Chekku",
    tamil: "வாகை மரச்செக்கு அழுத்தம்",
    description:
      "Gently crushed in native Vaagai wooden pestles with zero machine boilers, preserving the natural taste and thick aroma below 38°C.",
  },
  {
    id: "03",
    icon: Users,
    title: "Direct from Village Farmers",
    tamil: "நேரடி விவசாயக் கூட்டுறவு",
    description:
      "Sourced straight from grower families across Tirunelveli and Thanjavur districts with fair gate payments and zero broker markups.",
  },
];

export default function PurityManifesto() {
  return (
    <section className="w-full py-8 sm:py-12 select-none font-sans text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Top Left-Aligned Section Headline */}
        <div className="text-left">
          <h2
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            className="text-2xl sm:text-3xl md:text-4xl font-medium text-stone-950 tracking-tight"
          >
            Purity Without{" "}
            <span className="text-[#D97706] italic font-normal">
              Compromise.
            </span>
          </h2>
        </div>

        {/* Unified Horizontal Container (Exact Format as Croma Banner) */}
        <div className="w-full bg-[#FAF9F5] border border-stone-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
            {STANDARDS.map((item) => {
              const IconComponent = item.icon;

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-4 text-left group"
                >
                  {/* Clean Stroke Icon */}
                  <div className="shrink-0 mt-0.5">
                    <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-[#D97706] stroke-[1.8]" />
                  </div>

                  {/* Text Hierarchy */}
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
