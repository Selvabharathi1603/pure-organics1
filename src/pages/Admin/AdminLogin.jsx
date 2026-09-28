import React, { useState } from "react";
import {
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
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

  // If already authenticated, redirect straight to AdminDashboard
  if (currentAdmin) {
    return <AdminDashboard onLogout={logoutAdmin} />;
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

      // Authenticate via database credentials on Render
      const result = await loginAdmin(username.trim(), password);

      if (!result || !result.success) {
        setErrorMsg(
          result?.message ||
            "Invalid credentials. Please verify your username and password.",
        );
      }
    } catch (err) {
      setErrorMsg(
        "Unable to reach the server. If Render went to sleep, please wait 20 seconds and click login again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-4 py-12 space-y-6">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl border border-[#e8e2d5] shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#edf5ef] border border-[#cbe1d2] text-[#2e7d4d] flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold tracking-tight text-[#162a1e]">
            Admin Role Portal
          </h2>
          <p className="text-xs text-[#5c7365]">
            Authorized internal staff authentication only
          </p>
        </div>

        {/* Dynamic Invalid Credentials or Server Error Box */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2.5 shadow-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#516859] mb-1">
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
                placeholder="e.g. owner or admin"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-[#faf7f2] border border-[#dcd4c7] text-[#162a1e] placeholder-[#b5aba0] focus:outline-none focus:border-[#2e7d4d] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#516859] mb-1">
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
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-[#faf7f2] border border-[#dcd4c7] text-[#162a1e] placeholder-[#b5aba0] focus:outline-none focus:border-[#2e7d4d] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e9f93] hover:text-[#1b3b27] p-1 transition-colors cursor-pointer"
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
            className={`w-full py-3 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer active:scale-98 flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>
              {loading ? "Authenticating..." : "Login to Admin Panel"}
            </span>
          </button>
        </form>

        <div className="p-3 bg-[#faf7f2] border border-[#e8e2d5] rounded-xl text-[11px] text-[#6d8274] text-center">
          Default Super Admin: <b className="text-[#162a1e]">owner</b> /{" "}
          <b className="text-[#162a1e]">owner123</b>
        </div>
      </div>
    </div>
  );
}
