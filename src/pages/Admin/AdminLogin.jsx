import React, { useState } from "react";
import { Lock, User, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useStore } from "../../context/storecontext";
import AdminDashboard from "./Admindashboard";

export default function AdminLogin() {
  const { currentAdmin, loginAdmin, logoutAdmin } = useStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (currentAdmin) {
    return <AdminDashboard onLogout={logoutAdmin} />;
  }

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    const result = loginAdmin(username, password);
    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      setErrorMsg("");
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

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center">
            {errorMsg}
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
                autoComplete="off"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="Enter username"
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
                autoComplete="new-password"
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
            className="w-full py-3 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer active:scale-98"
          >
            Login to Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
}
