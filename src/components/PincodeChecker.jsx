import React, { useState, useEffect } from "react";
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  Loader2,
  RotateCcw,
} from "lucide-react";

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Base API configuration
  const API_BASE = "https://pure-organics1.onrender.com/api";

  // Check saved result on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("po_verified_pincode");
      if (saved) {
        const parsed = JSON.parse(saved);
        setResult(parsed);
        setPincode(parsed.pincode || "");
      }
    } catch (e) {
      console.warn("Storage read error:", e);
    }
  }, []);

  const handleCheck = async (e) => {
    if (e) e.preventDefault();
    const cleanPin = pincode.trim();

    if (cleanPin.length !== 6 || !/^\d+$/.test(cleanPin)) {
      setErrorMsg("Please enter a valid 6-digit Indian pincode.");
      setResult(null);
      return;
    }

    setErrorMsg("");
    setLoading(true);
    setResult(null);

    console.log(
      "Checking pincode:",
      cleanPin,
      "via",
      `${API_BASE}/pincodes/check/${cleanPin}`,
    );

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second safety timeout

      const response = await fetch(`${API_BASE}/pincodes/check/${cleanPin}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      console.log("Pincode check response:", data);

      if (response.ok) {
        setResult(data);
        if (data.serviceable) {
          localStorage.setItem("po_verified_pincode", JSON.stringify(data));
        }
      } else {
        setErrorMsg(data.error || "Unable to check pincode right now.");
      }
    } catch (err) {
      console.error("Backend pincode check failed:", err);
      if (err.name === "AbortError") {
        setErrorMsg(
          "Server is waking up (Render cold-start). Please click Check again in a few seconds.",
        );
      } else {
        setErrorMsg("Server unreachable. Please verify backend connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setPincode("");
    setErrorMsg("");
    localStorage.removeItem("po_verified_pincode");
  };

  return (
    <div className="bg-[#faf7f2] border border-[#e8e2d8] rounded-2xl p-3.5 my-3 text-xs font-sans">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-[#1b3b27] font-semibold">
          <Truck className="w-4 h-4 text-[#2e7d4d]" />
          <span>Delivery & Dispatch Check</span>
        </div>
        {result && result.serviceable && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-[#5c7365] hover:text-[#1b3b27] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Change
          </button>
        )}
      </div>

      {(!result || !result.serviceable) && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              maxLength={6}
              value={pincode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setPincode(val);
                if (result || errorMsg) {
                  setResult(null);
                  setErrorMsg("");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCheck();
                }
              }}
              placeholder="Enter 6-digit Pincode (e.g. 627416)"
              className="w-full pl-8 pr-3 py-2 bg-white border border-[#dcd4c7] rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#1b3b27] text-xs font-mono"
            />
          </div>
          <button
            type="button"
            onClick={handleCheck}
            disabled={loading || pincode.length !== 6}
            className="px-4 py-2 bg-[#1b3b27] hover:bg-[#255236] text-white rounded-xl font-bold uppercase tracking-wider text-[11px] cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <span>Check</span>
            )}
          </button>
        </div>
      )}

      {/* Success response from Database */}
      {result && result.serviceable && (
        <div className="pt-1 space-y-1.5 text-stone-700 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-[#2e7d4d] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>
              Delivering to {result.district}, {result.state} ({result.pincode})
            </span>
          </div>
          <div className="pl-5 space-y-0.5 text-[11px] text-stone-600">
            <p>
              ⏱ Estimated Arrival:{" "}
              <strong className="text-stone-800">
                {result.deliveryDays === 1
                  ? "Next Day Delivery (24 hrs)"
                  : `${result.deliveryDays} Business Days`}
              </strong>
            </p>
            <p>
              💵{" "}
              {result.codAvailable
                ? "Cash on Delivery Available"
                : "Prepaid Only (UPI/Cards)"}{" "}
              •{" "}
              {result.shippingCharge === 0
                ? "Free Farm Dispatch"
                : `Shipping: ₹${result.shippingCharge}`}
            </p>
          </div>
        </div>
      )}

      {/* Unserviceable response from Database */}
      {result && !result.serviceable && (
        <div className="mt-2.5 pt-2 text-amber-800 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>{result.message}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="mt-2 text-rose-600 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
