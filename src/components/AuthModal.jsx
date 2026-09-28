import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Phone,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../config/firebase";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [method, setMethod] = useState("google"); // 'google', 'email', 'phone'
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Phone form
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    setError("");
  }, [method, isSignUp]);

  if (!isOpen) return null;

  // Sync with TiDB Backend
  const syncToTiDB = async (userData) => {
    try {
      await fetch(
        "https://pure-organics1.onrender.com/api/auth/sync-customer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        },
      );
    } catch (err) {
      console.warn("Backend sync notice:", err.message);
    }
  };

  // 1. Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const customerData = {
        firebase_uid: user.uid,
        name: user.displayName || "Google Patron",
        email: user.email,
        phone: user.phoneNumber || "",
        auth_provider: "google",
      };
      await syncToTiDB(customerData);
      if (onAuthSuccess) onAuthSuccess(customerData);
      onClose();
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  // 2. Email Sign-In / Sign-Up
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
      }
      const user = userCredential.user;
      const customerData = {
        firebase_uid: user.uid,
        name: fullName || user.email.split("@")[0],
        email: user.email,
        phone: "",
        auth_provider: "email",
      };
      await syncToTiDB(customerData);
      if (onAuthSuccess) onAuthSuccess(customerData);
      onClose();
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  // 3. Setup Phone Recaptcha
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );
    }
  };

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+91${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier,
      );
      setConfirmationResult(confirmation);
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setError("Please enter the 6-digit verification code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await confirmationResult.confirm(verificationCode);
      const user = result.user;
      const customerData = {
        firebase_uid: user.uid,
        name: fullName || "Mobile Patron",
        email: "",
        phone: user.phoneNumber,
        auth_provider: "phone",
      };
      await syncToTiDB(customerData);
      if (onAuthSuccess) onAuthSuccess(customerData);
      onClose();
    } catch (err) {
      setError("Invalid OTP code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#2e7d4d]">
              Pure Organics Account
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#162a1e]">
              Welcome to the Harvest
            </h2>
            <p className="text-xs text-stone-500">
              Access orders, saved addresses, and seasonal discounts
            </p>
          </div>

          {/* Quick Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 border border-stone-300 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold text-stone-700 hover:bg-[#faf7f2] transition-colors shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] uppercase font-bold text-stone-400">
              or
            </span>
          </div>

          {/* Method Selector Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#faf7f2] border border-stone-200 rounded-xl">
            <button
              type="button"
              onClick={() => setMethod("phone")}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                method === "phone"
                  ? "bg-white text-[#1b3b27] shadow-xs"
                  : "text-stone-500"
              }`}
            >
              Phone OTP
            </button>
            <button
              type="button"
              onClick={() => setMethod("email")}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                method === "email"
                  ? "bg-white text-[#1b3b27] shadow-xs"
                  : "text-stone-500"
              }`}
            >
              Email & Password
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Method 1: Phone OTP Form */}
          {method === "phone" && (
            <div className="space-y-4">
              {!confirmationResult ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-xs font-bold text-stone-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        value={phoneNumber}
                        onChange={(e) =>
                          setPhoneNumber(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-full pl-12 pr-4 py-2.5 text-xs bg-[#faf7f2] border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:border-[#2e7d4d]"
                      />
                    </div>
                  </div>
                  <div id="recaptcha-container"></div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send Harvest OTP"
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full px-4 py-2.5 text-center tracking-widest font-mono text-sm bg-[#faf7f2] border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:border-[#2e7d4d]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Verify & Sign In"
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Method 2: Email & Password Form */}
          {method === "email" && (
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#faf7f2] border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:border-[#2e7d4d]"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#faf7f2] border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:border-[#2e7d4d]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#faf7f2] border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:border-[#2e7d4d]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isSignUp ? (
                  "Create Harvest Account"
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-stone-500 hover:text-[#1b3b27] underline"
                >
                  {isSignUp
                    ? "Already have an account? Sign In"
                    : "New to Pure Organics? Create Account"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
