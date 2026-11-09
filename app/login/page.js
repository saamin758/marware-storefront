"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.user?.role === "admin" || res.user?.role === "super_admin") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillCustomer = () => {
    setEmail("customer@ecstasy.local");
    setPassword("customer123");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-surface border border-hairline p-8">
        <div className="text-center mb-8">
          <p className="text-[11px] uppercase tracking-micro text-muted font-semibold mb-1">
            Welcome Back
          </p>
          <h1 className="font-editorial text-3xl font-bold text-ink">
            Sign In
          </h1>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-destructive-light text-destructive border border-destructive/30 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-12 px-4 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] uppercase tracking-micro font-medium text-ink">
                Password
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 px-4 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="w-full mt-2"
          >
            Sign In
          </Button>
        </form>

        {/* Customer Demo Quick Fill */}
        <div className="mt-8 pt-6 border-t border-hairline">
          <button
            type="button"
            onClick={fillCustomer}
            className="w-full py-2.5 text-[11px] uppercase tracking-micro border border-hairline bg-stone hover:bg-neutral-200 text-ink font-semibold transition-colors"
          >
            Quick Fill Customer Demo
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-ink font-medium underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
