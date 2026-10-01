import React, { useState, useEffect, useRef } from "react";
import { X, Phone, Mail, Edit3, ArrowRight, Loader2 } from "lucide-react";
import { API_BASE_URL as CONFIG_URL } from "../config/api";

// Fallback to local server port 5000 if config URL is missing or empty
const BASE_URL = CONFIG_URL || "http://localhost:5000";

export default function CustomerAuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState("PHONE"); // 'PHONE' | 'OTP' | 'PROFILE'
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const otpInputRefs = useRef([]);

  // Countdown timer for Resend Code
  useEffect(() => {
    let interval = null;
    if (step === "OTP" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Reset modal state on close/open
  useEffect(() => {
    if (!isOpen) {
      setStep("PHONE");
      setOtp(["", "", "", "", "", ""]);
      setErrorMsg("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Request OTP Action
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.trim().replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep("OTP");
        setTimer(30);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
      } else {
        setErrorMsg(data.error || "Failed to dispatch verification code");
      }
    } catch (err) {
      setErrorMsg(
        `Server connection failed at ${BASE_URL}. Ensure backend is running.`,
      );
    } finally {
      setLoading(false);
    }
  };

  // OTP Box Navigation & Typing
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "");
    if (!digit && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = digit.slice(-1);
    setOtp(newOtp);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length > 0) {
      const digits = pasted.split("");
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
    }
  };

  // 2. Verify OTP Action
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit code");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const cleanPhone = phone.trim().replace(/\D/g, "");
      const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, otp: enteredOtp }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.isNewUser) {
          setStep("PROFILE");
        } else {
          localStorage.setItem("customer_token", data.token);
          localStorage.setItem("customer_info", JSON.stringify(data.customer));
          if (onLoginSuccess) onLoginSuccess(data.customer);
          onClose();
        }
      } else {
        setErrorMsg(data.error || "The code entered is incorrect or expired");
      }
    } catch {
      setErrorMsg("Verification service unavailable. Try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Complete Profile (Save Names into DB)
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!profile.firstName.trim()) {
      setErrorMsg("First name is required to complete profile");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    const cleanPhone = phone.trim().replace(/\D/g, "");
    const payload = {
      phone: cleanPhone,
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      email: profile.email.trim(),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/auth/complete-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        localStorage.setItem("customer_info", JSON.stringify(payload));
        if (onLoginSuccess) onLoginSuccess(payload);
        onClose();
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || "Could not save your details");
      }
    } catch {
      setErrorMsg("Profile service temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md bg-[#FAF8EE] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E9E4CE] text-[#1B2E1E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer transition-colors"
        >
          <X size={18} />
        </button>

        {/* ================= STEP 1: PHONE ================= */}
        {step === "PHONE" && (
          <div className="space-y-6 text-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1B2E1E] tracking-tight">
                Login with OTP
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Enter your mobile number to proceed
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center bg-white border border-[#D5D0B8] rounded-xl px-3 py-2.5 shadow-2xs focus-within:border-[#67B043] focus-within:ring-1 focus-within:ring-[#67B043] transition-all">
                <div className="flex items-center gap-1.5 pr-2.5 border-r border-stone-200 shrink-0">
                  <span className="text-lg leading-none">🇮🇳</span>
                  <span className="text-xs font-semibold text-stone-700">
                    +91
                  </span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleRequestOtp(e)}
                  className="w-full pl-3 text-sm font-medium text-stone-800 placeholder-stone-400 outline-none bg-transparent"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium text-left">
                  {errorMsg}
                </p>
              )}

              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={loading}
                className="w-full py-3 bg-[#67B043] hover:bg-[#599E38] disabled:bg-[#A3D28E] text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Request OTP"
                )}
              </button>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <div className="w-full border-t border-[#D5D0B8]" />
              <span className="absolute bg-[#FAF8EE] px-3 text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                Or Login Using
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-[#F3EED8] hover:bg-[#EAE4CA] border border-[#DDD5B9] py-2.5 rounded-xl text-xs font-semibold text-stone-700 transition-colors"
              >
                <Phone size={14} /> Mobile
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-[#F3EED8] hover:bg-[#EAE4CA] border border-[#DDD5B9] py-2.5 rounded-xl text-xs font-semibold text-stone-700 transition-colors"
              >
                <Mail size={14} /> Email
              </button>
            </div>

            <p className="text-[11px] text-stone-500">
              By proceeding, you agree to our{" "}
              <span className="underline cursor-pointer text-stone-700">
                Terms of Use
              </span>{" "}
              and{" "}
              <span className="underline cursor-pointer text-stone-700">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        )}

        {/* ================= STEP 2: OTP ================= */}
        {step === "OTP" && (
          <div className="space-y-6 text-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1B2E1E] tracking-tight">
                Enter Verification Code
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                We've sent a 6-digit code to your phone
              </p>
            </div>

            <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-[#F3EED8] rounded-full border border-[#DDD5B9]">
              <span className="text-xs font-semibold text-stone-800 tracking-wider">
                +91 {phone}
              </span>
              <button
                type="button"
                onClick={() => setStep("PHONE")}
                className="text-stone-500 hover:text-black cursor-pointer"
                title="Change phone number"
              >
                <Edit3 size={13} />
              </button>
            </div>

            <div className="space-y-5">
              <div
                className="flex justify-center gap-2 sm:gap-2.5"
                onPaste={handlePaste}
              >
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleVerifyOtp(e);
                      else handleKeyDown(idx, e);
                    }}
                    className="w-10 h-12 sm:w-11 sm:h-12 text-center text-lg font-bold text-stone-800 bg-white border border-[#D5D0B8] rounded-xl focus:border-[#67B043] focus:ring-1 focus:ring-[#67B043] outline-none transition-all shadow-2xs"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
              )}

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full py-3 bg-[#67B043] hover:bg-[#599E38] disabled:bg-[#A3D28E] text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Verify Code"
                )}
              </button>

              <div className="text-xs text-stone-600 pt-1">
                <span className="block mb-1 text-stone-500">
                  Didn't receive code?
                </span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    className="font-bold text-[#67B043] hover:text-[#599E38] cursor-pointer underline"
                  >
                    Resend Code
                  </button>
                ) : (
                  <span className="font-semibold text-stone-600">
                    Resend in 00:{timer < 10 ? `0${timer}` : timer}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PROFILE ================= */}
        {step === "PROFILE" && (
          <div className="space-y-5 text-left">
            <div className="text-center">
              <h2 className="text-xl font-extrabold text-[#1B2E1E]">
                Welcome to Pure Organics
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Tell us your name so we can personalize your harvest orders
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Selva"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSaveProfile(e)}
                  className="w-full bg-white border border-[#D5D0B8] rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none focus:border-[#67B043] focus:ring-1 focus:ring-[#67B043]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bharathi"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSaveProfile(e)}
                  className="w-full bg-white border border-[#D5D0B8] rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none focus:border-[#67B043] focus:ring-1 focus:ring-[#67B043]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSaveProfile(e)}
                  className="w-full bg-white border border-[#D5D0B8] rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none focus:border-[#67B043] focus:ring-1 focus:ring-[#67B043]"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
              )}

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={loading || !profile.firstName.trim()}
                className="w-full py-3 bg-[#67B043] hover:bg-[#599E38] disabled:bg-[#A3D28E] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-1.5 mt-2"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Complete Setup</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
