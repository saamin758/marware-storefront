"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import {
  ShieldAlert,
  Crown,
  Shield,
  Lock,
  KeyRound,
  Store,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function SecretAdminVaultLoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "super_admin")) {
      router.push("/ecstasy-ops-vault-8821/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter administrator email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);

      // Verify that this persona is actually administrative staff
      if (res.user?.role !== "admin" && res.user?.role !== "super_admin") {
        setError(
          "Access Denied: This secure vault is strictly reserved for authorized administrative staff. Registered customers must sign in through the public storefront."
        );
        return;
      }

      router.push("/ecstasy-ops-vault-8821/dashboard");
    } catch (err) {
      setError(err.message || "Invalid administrative credentials or account suspended.");
    } finally {
      setLoading(false);
    }
  };

  const fillSuperAdmin = () => {
    setEmail("superadmin@ecstasy.local");
    setPassword("superadmin123");
    setError(null);
  };

  const fillStoreAdmin = () => {
    setEmail("admin@ecstasy.local");
    setPassword("admin123");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#E8E7E2] flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-amber selection:text-white">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-[#222222] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] uppercase tracking-micro text-[#888888] font-bold">
            MARWARE • Executive Control Gateway
          </span>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-micro text-[#888888] hover:text-[#E8E7E2] transition-colors"
        >
          <Store size={12} /> Return to Storefront
        </Link>
      </header>

      {/* Center Portal Box */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md bg-[#141414] border border-[#2A2A2A] p-8 sm:p-10 shadow-2xl relative">
          {/* Subtle Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700"></div>

          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1C1C1C] border border-[#333333] text-amber mb-3">
              <Lock size={20} />
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[9px] uppercase tracking-micro font-bold bg-amber-950/80 text-amber-400 border border-amber-800/60 px-2 py-0.5">
                Restricted Staff Only
              </span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Operations Vault
            </h1>
            <p className="text-[10px] uppercase tracking-micro text-[#888888] mt-1">
              Authorized personnel authentication portal
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3 mb-6 bg-red-950/60 text-red-300 border border-red-800/50 text-xs flex items-start gap-2 leading-relaxed">
              <AlertTriangle size={15} className="flex-shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-micro font-semibold text-[#AAAAAA] mb-1.5">
                Staff Identity / Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ecstasy.local"
                  required
                  className="w-full h-11 px-3 bg-[#0D0D0D] border border-[#2E2E2E] text-white text-xs placeholder-[#555555] focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-micro font-semibold text-[#AAAAAA] mb-1.5">
                Access Token / Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full h-11 px-3 bg-[#0D0D0D] border border-[#2E2E2E] text-white text-xs placeholder-[#555555] focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-amber hover:bg-amber-600 text-black text-xs uppercase tracking-micro font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 mt-3"
            >
              {loading ? (
                "Authenticating Staff..."
              ) : (
                <>
                  <KeyRound size={14} /> Enter Operations Dashboard
                </>
              )}
            </button>
          </form>

          {/* Fast-Fill Badges (Exclusively in this secret gateway) */}
          <div className="mt-8 pt-6 border-t border-[#222222]">
            <p className="text-[9px] uppercase tracking-micro text-[#777777] font-semibold text-center mb-3">
              Administrative Quick Access:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillSuperAdmin}
                className="py-2.5 px-3 bg-[#1C1C1C] hover:bg-[#252525] border border-amber/40 text-amber text-[10px] uppercase tracking-micro font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Crown size={12} /> Super Admin
              </button>
              <button
                type="button"
                onClick={fillStoreAdmin}
                className="py-2.5 px-3 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] text-[#CCCCCC] text-[10px] uppercase tracking-micro font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Shield size={12} /> Store Admin
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer Notice */}
      <footer className="text-center text-[10px] uppercase tracking-micro text-[#555555] border-t border-[#1C1C1C] pt-4">
        Protected Back-Office Endpoint • Confidentiality Level: High • MARWARE
      </footer>
    </div>
  );
}

