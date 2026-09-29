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
    <div className="min-h-screen bg-[#faf8f5] text-[#162a1e] flex flex-col items-center justify-center p-4 sm:p-6 select-none font-sans">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-[#e8e2d8] shadow-[0_10px_30px_rgba(27,59,39,0.05)] p-8 sm:p-10 space-y-7">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#edf5ef] border border-[#cbe1d2] flex items-center justify-center text-[#1b3b27] mx-auto shadow-xs">
            <Store className="w-6 h-6 text-[#2e7d4d]" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#2e7d4d] font-bold block">
              Pure Organics
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#162a1e] tracking-tight">
              Admin Role Portal
            </h1>
            <p className="text-xs text-[#6d8274]">
              Authorized internal staff authentication only
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#516859] mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9f93]" />
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
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-[#faf7f2] border border-[#dcd4c7] text-[#162a1e] placeholder-[#a69c91] focus:outline-none focus:border-[#2e7d4d] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#516859] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9f93]" />
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
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-[#faf7f2] border border-[#dcd4c7] text-[#162a1e] placeholder-[#a69c91] focus:outline-none focus:border-[#2e7d4d] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e9f93] hover:text-[#162a1e] p-1 transition-colors cursor-pointer"
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
            className={`w-full py-3 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer active:scale-98 flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <p className="text-[11px] text-[#738d81] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d4d]" />
            Encrypted Farm Administration Gateway
          </p>
        </div>
      </div>
    </div>
  );
}
