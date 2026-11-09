"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getRolePermissionsMatrix } from "@/services/api/admin";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  ShieldCheck,
  Crown,
  Shield,
  User,
  Users,
  Check,
  X,
  Lock,
  ArrowRight,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";

export default function AdminRolesPage() {
  const { user, login } = useAuth();
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [switchLoading, setSwitchLoading] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    getRolePermissionsMatrix()
      .then((data) => setMatrixData(data))
      .catch((err) => console.error("Matrix load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleQuickSwitch = async (roleKey) => {
    try {
      setSwitchLoading(roleKey);
      if (roleKey === "super_admin") {
        await login("superadmin@ecstasy.local", "superadmin123");
        setToastMsg("Switched session to Super Administrator (Sultan Mahmud)!");
      } else if (roleKey === "admin") {
        await login("admin@ecstasy.local", "admin123");
        setToastMsg("Switched session to Store Administrator (Store Administrator)!");
      } else if (roleKey === "customer") {
        await login("customer@ecstasy.local", "customer123");
        setToastMsg("Switched session to Customer (Samin Ahmed)!");
      }
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setSwitchLoading(null);
    }
  };

  if (loading) {
    return <div className="text-muted text-sm py-12">Loading roles specification...</div>;
  }

  const roles = matrixData?.roles || [];
  const permissionModules = matrixData?.permissionModules || [];

  return (
    <div>
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-ink text-surface px-5 py-3 border border-hairline shadow-2xl flex items-center gap-3 text-xs uppercase tracking-micro animate-in fade-in slide-in-from-top-4">
          <Sparkles size={16} className="text-amber" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-6 mb-8 border-b border-hairline">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-micro font-bold text-sale">
            Access Control Architecture
          </span>
          <span className="text-muted text-xs">•</span>
          <span className="text-[10px] uppercase tracking-micro text-muted">
            Authorization Matrix
          </span>
        </div>
        <h1 className="font-editorial text-3xl font-bold text-ink">
          Roles & Permissions Matrix
        </h1>
        <p className="text-muted text-xs uppercase tracking-micro mt-1">
          Complete breakdown of Super Admin, Admin, Customer, and Guest access boundaries
        </p>
      </div>

      {/* Current Active Role Card */}
      <div className="mb-10 p-6 bg-surface border border-hairline flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-micro text-muted font-bold block mb-1">
            Current Authenticated Persona
          </span>
          <div className="flex items-center gap-3">
            <span className="font-editorial text-2xl font-bold text-ink">
              {user?.fullName || "Guest Visitor"}
            </span>
            {user?.role === "super_admin" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase tracking-micro font-bold bg-amber-light text-amber border border-amber/30">
                <Crown size={13} /> Super Admin (Root)
              </span>
            ) : user?.role === "admin" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase tracking-micro font-bold bg-stone text-ink border border-hairline">
                <Shield size={13} /> Store Admin (Operations)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase tracking-micro font-bold bg-stone text-muted border border-hairline">
                <User size={13} /> Customer
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-2 max-w-xl">
            {user?.role === "super_admin"
              ? "You hold complete governance privileges. You can create other admins, promote to super admin, configure core store logistics, and delete team accounts."
              : user?.role === "admin"
              ? "You hold catalog and order fulfillment privileges. You can view the staff directory in read-only mode, but cannot invite, alter, or delete administrators."
              : "Customer account browsing the storefront."}
          </p>
        </div>

        {/* Quick Simulator Switcher */}
        <div className="bg-canvas p-4 border border-hairline flex flex-col gap-2 min-w-[260px]">
          <span className="text-[10px] uppercase tracking-micro font-bold text-muted">
            Live Role Simulator:
          </span>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => handleQuickSwitch("super_admin")}
              disabled={user?.role === "super_admin" || switchLoading}
              className={`flex items-center justify-between px-3 py-2 text-xs uppercase tracking-micro font-medium transition-colors ${
                user?.role === "super_admin"
                  ? "bg-amber text-surface font-bold cursor-default"
                  : "bg-surface border border-hairline text-ink hover:bg-stone"
              }`}
            >
              <span className="flex items-center gap-2">
                <Crown size={13} /> Super Admin
              </span>
              {user?.role === "super_admin" ? "Active" : "Switch"}
            </button>

            <button
              onClick={() => handleQuickSwitch("admin")}
              disabled={user?.role === "admin" || switchLoading}
              className={`flex items-center justify-between px-3 py-2 text-xs uppercase tracking-micro font-medium transition-colors ${
                user?.role === "admin"
                  ? "bg-ink text-surface font-bold cursor-default"
                  : "bg-surface border border-hairline text-ink hover:bg-stone"
              }`}
            >
              <span className="flex items-center gap-2">
                <Shield size={13} /> Store Admin
              </span>
              {user?.role === "admin" ? "Active" : "Switch"}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Role Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {roles.map((r) => {
          const isSuper = r.key === "super_admin";
          const isAdmin = r.key === "admin";
          const isCurrent = user?.role === r.key;

          return (
            <div
              key={r.key}
              className={`bg-surface border p-6 flex flex-col justify-between transition-all ${
                isCurrent
                  ? "border-ink ring-1 ring-ink"
                  : "border-hairline"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[9px] uppercase tracking-micro font-bold px-2 py-0.5 ${
                      isSuper
                        ? "bg-amber-light text-amber border border-amber/30"
                        : isAdmin
                        ? "bg-stone text-ink border border-hairline"
                        : "bg-canvas text-muted border border-hairline"
                    }`}
                  >
                    Level {r.hierarchyLevel} • {r.badge}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] uppercase tracking-micro bg-ink text-surface px-1.5 py-0.2 font-semibold">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {isSuper ? (
                    <Crown size={18} className="text-amber" />
                  ) : isAdmin ? (
                    <Shield size={18} className="text-ink" />
                  ) : (
                    <User size={18} className="text-muted" />
                  )}
                  <h3 className="font-editorial text-lg font-bold text-ink">
                    {r.name}
                  </h3>
                </div>

                <p className="text-xs text-muted leading-relaxed mb-4">
                  {r.description}
                </p>

                <div className="border-t border-hairline pt-3 mb-4">
                  <span className="text-[10px] uppercase tracking-micro text-muted font-bold block mb-2">
                    Key Rights & Authority:
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-ink">
                    {r.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-forest mt-0.5">•</span>
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {(isSuper || isAdmin) && (
                <button
                  onClick={() => handleQuickSwitch(r.key)}
                  disabled={isCurrent}
                  className={`w-full py-2 text-[10px] uppercase tracking-micro font-semibold transition-colors mt-4 ${
                    isCurrent
                      ? "bg-stone text-muted cursor-default border border-hairline"
                      : "bg-ink text-surface hover:bg-neutral-800"
                  }`}
                >
                  {isCurrent ? "Currently Active" : `Switch to ${r.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Comprehensive Permissions Matrix Table */}
      <div className="bg-surface border border-hairline mb-12">
        <div className="p-6 border-b border-hairline">
          <div className="flex items-center gap-2 mb-1">
            <Layers size={16} className="text-sale" />
            <span className="text-[10px] uppercase tracking-micro font-bold text-sale">
              Enforcement Matrix
            </span>
          </div>
          <h2 className="font-editorial text-xl font-bold text-ink">
            Granular Operational Permissions by Role
          </h2>
          <p className="text-xs text-muted mt-1">
            Enforced server-side in API route handlers and verified on client navigation
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-hairline bg-stone/40 text-[10px] uppercase tracking-micro text-muted font-semibold">
                <th className="py-3 px-6 w-1/3">System Functionality</th>
                <th className="py-3 px-4 text-center">Guest</th>
                <th className="py-3 px-4 text-center">Customer</th>
                <th className="py-3 px-4 text-center bg-stone/50 font-bold text-ink">
                  Store Admin
                </th>
                <th className="py-3 px-4 text-center bg-amber-light/30 font-bold text-amber-900">
                  Super Admin
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline text-xs">
              {permissionModules.map((module) => (
                <div key={module.category} className="contents">
                  <tr className="bg-canvas border-t-2 border-hairline">
                    <td
                      colSpan={5}
                      className="py-2.5 px-6 font-bold uppercase tracking-micro text-[11px] text-ink"
                    >
                      {module.category}
                    </td>
                  </tr>
                  {module.items.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-stone/20 transition-colors"
                    >
                      <td className="py-3 px-6 text-ink font-medium">
                        {item.name}
                      </td>
                      {/* Guest */}
                      <td className="py-3 px-4 text-center">
                        {item.guest ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-forest-light text-forest">
                            <Check size={12} />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone text-muted-light">
                            <X size={12} />
                          </span>
                        )}
                      </td>
                      {/* Customer */}
                      <td className="py-3 px-4 text-center">
                        {item.customer ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-forest-light text-forest">
                            <Check size={12} />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone text-muted-light">
                            <X size={12} />
                          </span>
                        )}
                      </td>
                      {/* Admin */}
                      <td className="py-3 px-4 text-center bg-stone/20">
                        {item.admin ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-forest-light text-forest">
                            <Check size={12} />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone text-muted-light">
                            <X size={12} />
                          </span>
                        )}
                      </td>
                      {/* Super Admin */}
                      <td className="py-3 px-4 text-center bg-amber-light/20">
                        {item.super_admin ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber text-surface font-bold shadow-sm">
                            <Check size={12} />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone text-muted-light">
                            <X size={12} />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </div>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

