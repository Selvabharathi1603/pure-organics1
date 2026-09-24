import React from "react";
import { Check } from "lucide-react";

export default function TrackingStepper({ currentStatus = "Placed" }) {
  const steps = ["Placed", "Packed", "Shipped", "Delivered"];
  const currentStepIndex = steps.indexOf(currentStatus);

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between max-w-xl mx-auto">
        {/* Track Line */}
        <div className="absolute left-6 right-6 top-4 h-1 bg-[#e8e2d5] -z-0" />

        {/* Green Progress Line */}
        <div
          className="absolute left-6 top-4 h-1 bg-[#2e7d4d] transition-all duration-500 ease-in-out -z-0"
          style={{
            width: `${Math.max(
              0,
              (currentStepIndex / (steps.length - 1)) * 88,
            )}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isDone = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ring-4 ring-[#faf7f2] ${
                  isDone
                    ? "bg-[#1b3b27] text-white shadow-sm"
                    : "bg-white text-[#8e9f93] border border-[#dcd4c7]"
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>
              <span
                className={`mt-2 text-xs tracking-tight ${
                  isCurrent
                    ? "text-[#1b3b27] font-bold"
                    : isDone
                      ? "text-[#2e7d4d] font-semibold"
                      : "text-[#8e9f93]"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
