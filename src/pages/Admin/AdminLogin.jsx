import React, { useState } from "react";
import {
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Store,
} from "lucide-react";
import { useStore } from "../../context/storecontext";
import AdminDashboard from "./Admindashboard";

export default function AdminLogin() {
  const { currentAdmin, loginAdmin, logoutAdmin } = useStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // If logged in, show Dashboard
  if (currentAdmin) {
    return (
      <AdminDashboard
        onLogout={() => {
          logoutAdmin();
        }}
      />
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const result = await loginAdmin(username.trim(), password);

      if (result && result.success) {
        setLoading(false);
        return;
      }

      setErrorMsg(
        result?.message ||
          "Invalid credentials. Please verify your username and password.",
      );
      setLoading(false);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Unable to reach the server. Please check your backend connection.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col items-center justify-center p-4 sm:p-6 select-none font-sans">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10 space-y-7">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706] mx-auto shadow-xs">
            <Store className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97706] block">
              Pure Organics
            </span>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Admin Login
            </h1>
            <p className="text-xs text-stone-500">
              Sign in to manage catalog, orders, and stock
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="Enter username"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#D97706] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#D97706] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 p-1 transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
                tabIndex="-1"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer active:scale-98 flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="pt-1 text-center">
          <p className="text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
            Pure Organics Store Management
          </p>
        </div>
      </div>
    </div>
  );
}
