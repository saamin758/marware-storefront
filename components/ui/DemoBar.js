"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  RefreshCw,
  LayoutDashboard,
  Store,
  Info,
  X,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { getClientSessionId, resetClientSession } from "@/lib/session";
import { useAuth } from "@/context/AuthContext";

export default function DemoBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, login } = useAuth();

  const [sessionId, setSessionId] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setSessionId(getClientSessionId());
  }, []);

  const isAdminView = pathname?.startsWith("/ecstasy-ops-vault-8821");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRoleSwitch = async (targetRole) => {
    try {
      if (targetRole === "super_admin") {
        showToast("Logging in as Super Administrator (Sultan Mahmud)...");
        await login("superadmin@ecstasy.local", "superadmin123");
        router.push("/ecstasy-ops-vault-8821/staff");
      } else if (targetRole === "admin") {
        showToast("Logging in as Store Administrator (Operations)...");
        await login("admin@ecstasy.local", "admin123");
        router.push("/ecstasy-ops-vault-8821/dashboard");
      } else if (targetRole === "customer") {
        showToast("Logging in as Registered Customer (Samin Ahmed)...");
        await login("customer@ecstasy.local", "customer123");
        router.push("/account");
      }
    } catch {
      router.push("/ecstasy-ops-vault-8821");
    }
  };

  const handleAdminSwitch = async () => {
    if (user?.role === "super_admin" || user?.role === "admin") {
      router.push("/ecstasy-ops-vault-8821/dashboard");
    } else {
      router.push("/ecstasy-ops-vault-8821");
    }
  };

  const handleReset = async () => {
    if (confirm("Reset your demo sandbox to original fresh state? (Cart, orders, and new products in your session will be restored)")) {
      try {
        setResetting(true);
        const currentSid = getClientSessionId();
        await fetch("/api/v1/session/reset", {
          method: "POST",
          headers: { "x-session-id": currentSid },
        }).catch(() => null);

        resetClientSession();
        showToast("Demo sandbox reset to pristine factory state!");
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      } catch {
        window.location.reload();
      } finally {
        setResetting(false);
      }
    }
  };

  const shortSession = sessionId ? sessionId.slice(-6).toUpperCase() : "DEMO";

  return (
    <>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-ink text-surface px-5 py-3 rounded-none border border-hairline shadow-2xl flex items-center gap-3 text-xs uppercase tracking-micro animate-in fade-in slide-in-from-top-4">
          <Sparkles size={16} className="text-amber" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Demo Bar */}
      <aside aria-label="Portfolio Demo Controls" className="fixed bottom-4 right-4 z-40 max-w-sm sm:max-w-md select-none font-sans">
        <div className="bg-surface/95 backdrop-blur-md border border-hairline shadow-2xl">
          {/* Header Bar */}
          <div className="px-4 py-2.5 bg-ink text-surface flex items-center justify-between gap-3 text-[11px] uppercase tracking-micro">
            <div className="flex items-center gap-2 font-semibold">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Portfolio Demo Sandbox</span>
              <span className="text-[9px] text-surface/60 font-mono">
                #{shortSession}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTourOpen(true)}
                className="p-1 text-surface/75 hover:text-surface transition-colors"
                title="Agency Feature Tour"
              >
                <Info size={14} />
              </button>
              <button
                type="button"
                onClick={() => setMinimized(!minimized)}
                className="p-1 text-surface/75 hover:text-surface transition-colors"
                title={minimized ? "Expand Demo Bar" : "Minimize Demo Bar"}
              >
                {minimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {/* Action Bar (When expanded) */}
          {!minimized && (
            <div className="p-3 border-t border-hairline bg-surface space-y-2.5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-micro text-muted">
                <span>Active Persona:</span>
                <span className="font-bold text-ink">
                  {user?.role === "super_admin"
                    ? "👑 Super Admin"
                    : user?.role === "admin"
                    ? "🛡️ Store Admin"
                    : user?.role === "customer"
                    ? "👤 Customer"
                    : "🌐 Guest"}
                </span>
              </div>

              {/* Quick Persona Buttons */}
              <div className="grid grid-cols-3 gap-1.5 text-[9px] uppercase tracking-micro">
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("super_admin")}
                  className={`py-1 px-1.5 text-center font-bold border transition-colors ${
                    user?.role === "super_admin"
                      ? "bg-amber text-surface border-amber"
                      : "bg-amber-light text-amber-900 border-amber/30 hover:bg-amber-200"
                  }`}
                >
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("admin")}
                  className={`py-1 px-1.5 text-center font-semibold border transition-colors ${
                    user?.role === "admin"
                      ? "bg-ink text-surface border-ink"
                      : "bg-stone text-ink border-hairline hover:bg-neutral-200"
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("customer")}
                  className={`py-1 px-1.5 text-center font-semibold border transition-colors ${
                    user?.role === "customer"
                      ? "bg-ink text-surface border-ink"
                      : "bg-stone text-ink border-hairline hover:bg-neutral-200"
                  }`}
                >
                  Customer
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-hairline/60">
                <div className="flex items-center gap-2">
                  {isAdminView ? (
                    <Link
                      href="/"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink text-surface text-[10px] uppercase tracking-micro font-semibold hover:bg-neutral-800 transition-colors"
                    >
                      <Store size={12} />
                      Storefront
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAdminSwitch}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink text-surface text-[10px] uppercase tracking-micro font-semibold hover:bg-neutral-800 transition-colors"
                    >
                      <LayoutDashboard size={12} />
                      Admin Panel
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setTourOpen(true)}
                    className="px-2 py-1.5 border border-hairline text-ink hover:bg-stone text-[10px] uppercase tracking-micro font-semibold transition-colors flex items-center gap-1"
                  >
                    <Sparkles size={12} />
                    Tour
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={resetting}
                  className="px-2 py-1.5 border border-hairline text-muted hover:text-ink hover:bg-stone text-[10px] uppercase tracking-micro font-medium transition-colors flex items-center gap-1"
                  title="Reset session sandbox to clean demo state"
                >
                  <RefreshCw size={11} className={resetting ? "animate-spin" : ""} />
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Feature & Architecture Tour Modal */}
      {tourOpen && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="bg-surface max-w-xl w-full border border-hairline shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-hairline flex items-center justify-between bg-canvas">
              <div>
                <p className="text-[10px] uppercase tracking-micro font-bold text-sale mb-1">
                  Agency Portfolio Showcase
                </p>
                <h3 className="font-editorial text-2xl font-bold text-ink">
                  E-Commerce Architecture & Sandbox Tour
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTourOpen(false)}
                className="p-2 text-muted hover:text-ink transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-muted leading-relaxed">
              {/* Highlight Box */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck size={18} className="flex-shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <h4 className="font-bold uppercase tracking-micro text-[11px] text-emerald-950 mb-1">
                      100% Client-Isolated Demo Session
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      Every visitor receives an isolated browser sandbox (Session: <code>{sessionId}</code>). Whatever you add to the cart, order at checkout, or publish in the Admin catalog will never be seen by or interfere with other visitors.
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Highlights */}
              <div>
                <h4 className="text-[11px] uppercase tracking-micro font-bold text-ink mb-3">
                  Interactive Features to Test:
                </h4>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2 text-ink">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Customer Storefront:</strong> Browse the Autumn/Winter capsule, filter by price & category, inspect responsive 3:4 product galleries and accordion details.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-ink">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Slide-over Cart:</strong> Add items, update quantities, and watch the dynamic Free Shipping (৳3,000 threshold) progress bar calculate in real time.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-ink">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>1-Click Checkout:</strong> Use the <em>"⚡ Fill Demo Customer"</em> button on checkout to test instant order placement with Cash on Delivery across Bangladesh.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-ink">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Admin Portal:</strong> Use the bottom bar to switch to Admin mode. Inspect live order status updates, catalog inventory deductions, and sales metrics.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Tech Stack Specs */}
              <div className="pt-4 border-t border-hairline">
                <h4 className="text-[11px] uppercase tracking-micro font-bold text-ink mb-2">
                  Technical Specifications:
                </h4>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 bg-canvas border border-hairline">
                    <p className="font-semibold text-ink">Next.js 15 App Router</p>
                    <p className="text-muted">React 19 Server Components, Streaming SSR & Metadata API</p>
                  </div>
                  <div className="p-2.5 bg-canvas border border-hairline">
                    <p className="font-semibold text-ink">Vanilla Tailwind CSS</p>
                    <p className="text-muted">High-contrast monochrome luxury aesthetic & fluid typography</p>
                  </div>
                  <div className="p-2.5 bg-canvas border border-hairline">
                    <p className="font-semibold text-ink">Bangladesh Localization</p>
                    <p className="text-muted">BDT (৳) Currency, COD workflows, Dhaka vs Outside Dhaka zones</p>
                  </div>
                  <div className="p-2.5 bg-canvas border border-hairline">
                    <p className="font-semibold text-ink">Pluggable API Service</p>
                    <p className="text-muted">Centralized client ready to toggle to live Express/NestJS backend</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-hairline bg-canvas flex justify-end">
              <button
                type="button"
                onClick={() => setTourOpen(false)}
                className="px-6 py-2.5 bg-ink text-surface text-xs uppercase tracking-micro font-semibold hover:bg-neutral-800 transition-colors"
              >
                Close & Explore Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
