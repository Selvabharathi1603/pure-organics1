import React from "react";
import { Check } from "lucide-react";

export default function TrackingStepper({ currentStatus = "Placed" }) {
  const steps = ["Placed", "Packed", "Shipped", "Delivered"];
  const currentStepIndex = steps.indexOf(currentStatus);

  return (
    <div className="w-full py-5 font-sans select-none">
      <div className="relative flex items-center justify-between max-w-xl mx-auto px-4">
        {/* Background track line */}
        <div className="absolute left-8 right-8 top-4 h-1 bg-stone-200 z-0" />

        {/* Warm amber active progress line - NO GREEN */}
        <div
          className="absolute left-8 top-4 h-1 bg-[#D97706] transition-all duration-500 ease-in-out z-0"
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
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-300 ring-4 ring-white ${
                  isDone
                    ? "bg-[#D97706] text-black shadow-xs font-extrabold"
                    : "bg-white text-stone-400 border border-stone-300"
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>
              <span
                className={`mt-2 text-xs font-medium tracking-tight ${
                  isCurrent
                    ? "text-stone-900 font-bold"
                    : isDone
                      ? "text-[#D97706] font-semibold"
                      : "text-stone-400"
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
