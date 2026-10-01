import React, { useState, useEffect, useRef } from "react";
import { X, Phone, Mail, Edit3 } from "lucide-react";
import { API_BASE_URL } from "../config/api";

export default function CustomerAuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState("PHONE"); // 'PHONE' -> 'OTP' -> 'PROFILE'
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bannerHint, setBannerHint] = useState("");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const otpInputRefs = useRef([]);

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

  if (!isOpen) return null;

  // 1. Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (phone.trim().length !== 10) {
      setErrorMsg("Please enter a valid 10-digit phone number");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep("OTP");
        setTimer(30);
        setCanResend(false);

        // Demo Helper: Shows OTP in a discrete banner so testing never stalls
        if (data.demoOtp) {
          setBannerHint(`Demo Code: ${data.demoOtp}`);
          // Pre-split for quick autofill
          const digits = data.demoOtp.split("");
          setOtp(digits);
        }
      } else {
        setErrorMsg(data.error || "Failed to dispatch OTP");
      }
    } catch (err) {
      setErrorMsg("Network error. Check backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setErrorMsg("Enter full 6-digit OTP");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: enteredOtp }),
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
        setErrorMsg(data.error || "Incorrect OTP");
      }
    } catch {
      setErrorMsg("Verification failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Complete Profile (Save Names into DB)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile.firstName.trim()) {
      setErrorMsg("First name is mandatory");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    const payload = {
      phone,
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      email: profile.email.trim(),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/complete-profile`, {
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
        setErrorMsg(errData.error || "Could not save profile");
      }
    } catch {
      setErrorMsg("Profile save failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md bg-[#FAF8EE] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E9E4CE] text-[#1B2E1E]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* STEP 1: PHONE NUMBER */}
        {step === "PHONE" && (
          <div className="space-y-6 text-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1B2E1E] tracking-tight">
                Login with OTP
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
                Enter your log in details
              </p>
            </div>

            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="flex items-center bg-white border border-[#D5D0B8] rounded-xl px-3 py-2.5 shadow-2xs focus-within:border-[#67B043] transition-colors">
                <div className="flex items-center gap-1.5 pr-2.5 border-r border-stone-200 shrink-0">
                  <span className="text-lg leading-none">🇮🇳</span>
                  <span className="text-xs font-bold text-stone-700">▼</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full pl-3 text-sm font-medium text-stone-800 placeholder-stone-400 outline-none bg-transparent"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#67B043] hover:bg-[#599E38] text-white font-bold text-sm rounded-xl transition-all active:scale-98 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? "Sending..." : "Request OTP"}
              </button>
            </form>

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
                <Phone size={14} /> Phone
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-[#F3EED8] hover:bg-[#EAE4CA] border border-[#DDD5B9] py-2.5 rounded-xl text-xs font-semibold text-stone-700 transition-colors"
              >
                <Mail size={14} /> Email
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === "OTP" && (
          <div className="space-y-6 text-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1B2E1E] tracking-tight">
                Enter OTP
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                The OTP is sent to your Phone number
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-sm sm:text-base font-bold text-stone-800 tracking-wider">
                +91 {phone}
              </span>
              <button
                type="button"
                onClick={() => setStep("PHONE")}
                className="p-1 text-stone-600 hover:text-black cursor-pointer"
              >
                <Edit3 size={15} />
              </button>
            </div>

            {bannerHint && (
              <div className="py-1 px-3 bg-[#EBF7EE] text-[#2F6B38] text-xs font-bold rounded-lg border border-[#CDE5D3]">
                {bannerHint}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-10 h-12 sm:w-11 sm:h-12 text-center text-lg font-bold text-stone-800 bg-white border border-[#D5D0B8] rounded-lg focus:border-[#67B043] outline-none shadow-2xs"
                  />
                ))}
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#67B043] hover:bg-[#599E38] text-white font-bold text-sm rounded-xl transition-all active:scale-98 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="space-y-1 text-xs text-stone-500 pt-1">
                <p>Didn't Receive the OTP?</p>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    className="font-bold underline text-[#67B043] hover:text-[#599E38] cursor-pointer"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="font-bold text-stone-700">
                    Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: CUSTOMER DATA COLLECTION */}
        {step === "PROFILE" && (
          <div className="space-y-5 text-left">
            <div className="text-center">
              <h2 className="text-xl font-extrabold text-[#1B2E1E]">
                Personalize Your Pantry
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Provide your details to link previous and future orders
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
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
                  className="w-full bg-white border border-[#D5D0B8] rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none focus:border-[#67B043]"
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
                  className="w-full bg-white border border-[#D5D0B8] rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none focus:border-[#67B043]"
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
                  className="w-full bg-white border border-[#D5D0B8] rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none focus:border-[#67B043]"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#67B043] hover:bg-[#599E38] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer mt-2"
              >
                {loading ? "Saving Details..." : "Save & Access Account"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
