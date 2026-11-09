"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Wrench,
  ShieldAlert,
  Clock,
  RefreshCw,
  Mail,
  Phone,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function MaintenanceGuard({ children }) {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [storeSettings, setStoreSettings] = useState(null);
  const [checking, setChecking] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/v1/settings", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        setMaintenanceMode(!!json.data.maintenanceMode);
        setStoreSettings(json.data);
      }
    } catch (err) {
      console.warn("Could not check maintenance mode status:", err);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Listen to real-time broadcast channel from admin settings
    let channel;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("ecstasy_store_settings");
        channel.onmessage = (event) => {
          if (event.data?.type === "SETTINGS_UPDATED" && event.data.settings) {
            setMaintenanceMode(!!event.data.settings.maintenanceMode);
            setStoreSettings((prev) => ({
              ...prev,
              ...event.data.settings,
            }));
          }
        };
      } catch (e) {}
    }

    // Storage event listener for multi-tab fallback
    const handleStorage = (e) => {
      if (e.key === "ecstasy_maintenance_mode") {
        setMaintenanceMode(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);

    // Fast polling every 4 seconds to detect settings changes
    const interval = setInterval(fetchSettings, 4000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Admin routes and secret vault routes are NEVER blocked by maintenance mode!
  const isBackOfficeRoute =
    pathname?.startsWith("/ecstasy-ops-vault") ||
    pathname?.startsWith("/login");

  // If maintenance mode is active:
  if (maintenanceMode && !isBackOfficeRoute) {
    // If the authenticated user is an administrator:
    // Allow them to preview the live storefront, but show a sticky alert banner at the top!
    if (isAdmin) {
      return (
        <>
          <div className="bg-amber text-black px-4 py-2.5 text-xs font-semibold uppercase tracking-micro flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 border-b border-amber-600 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <span>
                ⚠️ Maintenance Mode Active: Public visitors cannot browse or place orders. You are viewing with privileged Admin Preview.
              </span>
            </div>
            <Link
              href="/ecstasy-ops-vault-8821/settings"
              className="px-3 py-1 bg-black text-white hover:bg-neutral-800 text-[10px] uppercase tracking-micro font-bold transition-colors"
            >
              Configure in Settings →
            </Link>
          </div>
          {children}
        </>
      );
    }

    // For public visitors and standard customers:
    // Display the luxury editorial Maintenance Lock Screen
    return (
      <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between p-6 sm:p-12 font-sans selection:bg-ink selection:text-surface">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-hairline pb-6">
          <span className="font-editorial text-2xl font-bold tracking-[0.25em] text-ink">
            MARWARE
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-micro font-bold bg-amber-light text-amber border border-amber/30 px-2.5 py-1">
            <Clock size={12} /> Scheduled Maintenance
          </span>
        </header>

        {/* Center Maintenance Hero */}
        <main className="max-w-xl mx-auto py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-stone border border-hairline text-ink mb-6">
            <Wrench size={24} className="stroke-[1.5]" />
          </div>

          <p className="text-[11px] uppercase tracking-micro text-sale font-bold mb-2">
            Storefront Offline for Maintenance
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight mb-6 leading-tight">
            Refining Our Digital Boutique
          </h1>

          <p className="text-muted text-sm sm:text-base leading-relaxed mb-8">
            We are currently optimizing our seasonal catalog, performing inventory reconciliation, and upgrading our checkout infrastructure. Online ordering is temporarily suspended.
          </p>

          <div className="bg-surface border border-hairline p-6 mb-8 text-left space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-micro text-ink border-b border-hairline pb-2">
              Concierge & Client Support:
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted">
              <Mail size={14} className="text-ink" />
              <span>{storeSettings?.supportEmail || "support@marware.com"}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted">
              <Phone size={14} className="text-ink" />
              <span>{storeSettings?.supportPhone || "+880 9678-000000"}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setChecking(true);
                fetchSettings();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-surface text-xs uppercase tracking-micro font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} className={checking ? "animate-spin" : ""} /> Check Again
            </button>
          </div>
        </main>

        {/* Bottom Discreet Link for Administrators */}
        <footer className="border-t border-hairline pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-micro text-muted gap-4">
          <span>© {new Date().getFullYear()} MARWARE • High-Grade Tailored Fashion</span>
          <Link
            href="/ecstasy-ops-vault-8821"
            className="text-muted hover:text-ink transition-colors flex items-center gap-1 font-medium"
          >
            <Lock size={11} /> Administrative Access
          </Link>
        </footer>
      </div>
    );
  }

  // Normal mode: render children with zero interference
  return children;
}

