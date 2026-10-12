import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Smartphone,
  User,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useStore } from "../context/storecontext";

const API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
      (typeof process !== "undefined" && process?.env?.REACT_APP_API_URL) ||
      "https://pure-organics1.onrender.com";

export default function PhoneAuthModal({ isOpen, onClose, onSuccess }) {
  const { sendCustomerOtp, verifyCustomerOtp, customerSession } = useStore();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputsRef = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFullName(customerSession?.full_name || "");
      setPhone(customerSession?.phone || "");
      setOtpValues(["", "", "", ""]);
      setErrorMsg("");
      setLoading(false);
      setResendCooldown(0);
    }
  }, [isOpen, customerSession]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    if (!fullName.trim()) {
      setErrorMsg("please enter your full name");
      return;
    }

    if (cleanPhone.length !== 10) {
      setErrorMsg("please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    const res = await sendCustomerOtp(cleanPhone);
    setLoading(false);

    if (res.success) {
      setStep(2);
      setResendCooldown(30);
      setTimeout(() => {
        if (otpInputsRef.current[0]) {
          otpInputsRef.current[0].focus();
        }
      }, 100);
    } else {
      setErrorMsg(res.message || "failed to dispatch verification code");
    }
  };

  const handleOtpChange = (index, value) => {
    const char = value.slice(-1).replace(/\D/g, "");
    const updated = [...otpValues];
    updated[index] = char;
    setOtpValues(updated);

    if (char && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const enteredOtp = otpValues.join("");

    if (enteredOtp.length !== 4) {
      setErrorMsg("please enter all 4 digits");
      return;
    }

    setLoading(true);
    const res = await verifyCustomerOtp(
      cleanPhone,
      enteredOtp,
      fullName.trim(),
    );

    if (res.success) {
      try {
        await fetch(`${API_BASE_URL}/api/customers/update-profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: cleanPhone,
            full_name: fullName.trim(),
          }),
        });
      } catch (err) {}

      setLoading(false);
      onClose();
      if (onSuccess) onSuccess(res.customer);
    } else {
      setLoading(false);
      setErrorMsg(res.message || "invalid or expired code");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white border border-stone-200/80 rounded-3xl shadow-2xl overflow-hidden text-stone-900 transition-all">
        {/* top accent badge */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-[#D97706] to-stone-900" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* modal header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-widest text-[#D97706] uppercase">
                <Sparkles size={12} />
                pure organics account
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {step === 1 ? "quick login or sign up" : "enter security code"}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 -mr-1 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-xs sm:text-[13px] text-stone-500 leading-relaxed">
            {step === 1
              ? "enter your contact details below to track orders, save shipping addresses, and complete checkout smoothly."
              : `we sent a 4-digit verification code to +91 ${phone.slice(-10)}.`}
          </p>

          {/* error alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-shake">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  full name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Selva Bharathi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 text-sm font-semibold placeholder:text-stone-400 focus:bg-white focus:border-[#D97706] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  mobile number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-mono font-bold text-xs">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-14 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 text-sm font-mono font-bold placeholder:text-stone-400 focus:bg-white focus:border-[#D97706] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 bg-stone-950 hover:bg-[#D97706] text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>dispatching code...</span>
                  </>
                ) : (
                  <>
                    <span>request code via sms</span>
                    <Smartphone size={15} />
                  </>
                )}
              </button>

              <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>
                  zero passwords required • verified directly on mobile
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* modern 4-digit slot inputs */}
              <div className="flex justify-center gap-3">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-14 h-14 sm:w-16 sm:h-16 text-center text-xl font-mono font-black rounded-2xl bg-stone-50 border-2 border-stone-200 focus:border-[#D97706] focus:bg-white focus:outline-none transition-all text-stone-900 shadow-inner"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || otpValues.join("").length < 4}
                className="w-full py-3.5 bg-[#D97706] hover:bg-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>verifying code...</span>
                  </>
                ) : (
                  <>
                    <span>verify & proceed</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtpValues(["", "", "", ""]);
                  }}
                  className="text-stone-500 hover:text-stone-900 font-bold underline cursor-pointer"
                >
                  edit mobile number
                </button>

                {resendCooldown > 0 ? (
                  <span className="text-stone-400 font-mono text-[11px]">
                    resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[#D97706] hover:underline font-bold cursor-pointer"
                  >
                    resend code
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
