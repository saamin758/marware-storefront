"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      router.push("/account");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-surface border border-hairline p-8">
        <div className="text-center mb-8">
          <p className="text-[11px] uppercase tracking-micro text-muted font-semibold mb-1">
            New Client
          </p>
          <h1 className="font-editorial text-3xl font-bold text-ink">
            Create Account
          </h1>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-destructive-light text-destructive border border-destructive/30 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="e.g. Tanzim Ahmed"
              className="w-full h-12 px-4 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="name@example.com"
              className="w-full h-12 px-4 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="017XXXXXXXX"
              className="w-full h-12 px-4 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Minimum 6 characters"
              className="w-full h-12 px-4 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="w-full mt-3"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-ink font-medium underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
