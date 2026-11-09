"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import LiveOrderListener from "@/components/admin/LiveOrderListener";
import BrandLogo from "@/components/ui/BrandLogo";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  ShieldCheck,
  Settings,
  Store,
  LogOut,
  Crown,
  Shield,
  Radio,
} from "lucide-react";

export default function VaultBackOfficeLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, isSuperAdmin } = useAuth();

  const hasAdminAccess =
    user && (user.role === "admin" || user.role === "super_admin");

  useEffect(() => {
    if (!loading && !hasAdminAccess) {
      router.push("/ecstasy-ops-vault-8821");
    }
  }, [hasAdminAccess, loading, router]);

  if (loading || !hasAdminAccess) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="font-editorial text-2xl font-bold text-ink mb-2">
            Administrator Authentication Required
          </h2>
          <p className="text-muted text-sm mb-6">
            Please authenticate through the secure operations gateway.
          </p>
          <Link
            href="/ecstasy-ops-vault-8821"
            className="px-6 py-3 bg-ink text-surface text-xs uppercase tracking-micro font-medium shadow-sm hover:bg-neutral-800 transition-colors"
          >
            Go to Operations Vault
          </Link>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/ecstasy-ops-vault-8821/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/ecstasy-ops-vault-8821/products", label: "Catalog Products", icon: ShoppingBag },
    { href: "/ecstasy-ops-vault-8821/orders", label: "Customer Orders", icon: Package },
    {
      href: "/ecstasy-ops-vault-8821/staff",
      label: "Staff & Team",
      icon: Users,
      badge: isSuperAdmin ? "Control" : "View",
    },
    { href: "/ecstasy-ops-vault-8821/roles", label: "Roles & Matrix", icon: ShieldCheck },
    { href: "/ecstasy-ops-vault-8821/settings", label: "Store Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-hairline flex flex-col justify-between p-6 flex-shrink-0">
        <div>
          <div className="pb-6 mb-6 border-b border-hairline">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-micro font-bold text-sale block">
                Store Operations
              </span>
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-micro font-bold bg-amber-light text-amber border border-amber/30 px-1.5 py-0.5">
                  <Crown size={10} /> Super Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-micro font-bold bg-stone text-ink border border-hairline px-1.5 py-0.5">
                  <Shield size={10} /> Admin
                </span>
              )}
            </div>
            <div className="pt-1">
              <BrandLogo href="/" size="sm" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 text-xs uppercase tracking-micro font-medium transition-colors ${
                    isActive
                      ? "bg-ink text-surface font-semibold"
                      : "text-muted hover:text-ink hover:bg-stone"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 tracking-wider ${
                        isActive
                          ? "bg-surface/20 text-surface"
                          : "bg-stone-dark text-muted"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Footer */}
        <div className="pt-6 border-t border-hairline flex flex-col gap-3">
          <div className="bg-stone/60 p-3 border border-hairline">
            <p className="text-[10px] uppercase tracking-micro text-muted font-semibold truncate">
              Signed in as:
            </p>
            <p className="text-xs font-semibold text-ink truncate">
              {user?.fullName || user?.email}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] uppercase tracking-micro text-muted">
                {user?.role === "super_admin" ? "Super Administrator" : "Operations Admin"}
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs uppercase tracking-micro text-muted hover:text-ink transition-colors"
          >
            <Store size={15} /> View Live Storefront
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/ecstasy-ops-vault-8821");
            }}
            className="flex items-center gap-2 text-xs uppercase tracking-micro text-destructive hover:underline text-left cursor-pointer transition-colors"
          >
            <LogOut size={15} /> Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar with Live Order Stream Status & Tunng Sound Engine */}
        <header className="bg-surface border-b border-hairline px-6 sm:px-10 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] uppercase tracking-micro text-muted font-bold flex items-center gap-1.5">
              <Radio size={12} className="text-emerald-600" /> Live Order Stream Active
            </span>
          </div>

          {/* Real-time Order Audio Engine and Test Tunng Controls */}
          <LiveOrderListener />
        </header>

        <div className="p-6 sm:p-10 lg:p-12 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}

