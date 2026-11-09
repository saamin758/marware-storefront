"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStoreSettings, updateStoreSettings } from "@/services/api/admin";
import Button from "@/components/ui/Button";
import {
  Settings,
  Truck,
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Save,
  Crown,
  Sparkles,
  Store,
  Clock,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { isSuperAdmin, login } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    getStoreSettings()
      .then((data) => setSettings(data))
      .catch((err) => setErrorMsg(err.message || "Failed to load store settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      setErrorMsg("Permission Denied: Only Super Administrators can alter store configuration.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);
      const updated = await updateStoreSettings(settings);
      setSettings(updated);

      // Instantly broadcast setting changes to all open tabs
      if (typeof window !== "undefined") {
        try {
          const channel = new BroadcastChannel("ecstasy_store_settings");
          channel.postMessage({
            type: "SETTINGS_UPDATED",
            settings: updated,
          });
        } catch (e) {}
        localStorage.setItem("ecstasy_maintenance_mode", String(!!updated.maintenanceMode));
      }

      setSuccessMsg("Store configuration and shipping tiers successfully updated!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const switchToSuperAdmin = async () => {
    try {
      await login("superadmin@ecstasy.local", "superadmin123");
      setSuccessMsg("Switched to Super Administrator. Configuration editing unlocked!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to switch account");
    }
  };

  if (loading) {
    return <div className="text-muted text-sm py-12">Loading store configuration...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-hairline gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-micro font-bold text-sale">
              System Configuration
            </span>
            <span className="text-muted text-xs">•</span>
            <span className="text-[10px] uppercase tracking-micro text-muted">
              Global Policies
            </span>
          </div>
          <h1 className="font-editorial text-3xl font-bold text-ink">
            Store Settings & Logistics
          </h1>
          <p className="text-muted text-xs uppercase tracking-micro mt-1">
            Configure delivery fees, currency presentation, and operational parameters
          </p>
        </div>

        {isSuperAdmin && (
          <Button
            type="submit"
            form="settings-form"
            size="sm"
            loading={saving}
            className="flex items-center gap-2 self-start sm:self-auto"
          >
            <Save size={14} /> Save Configuration
          </Button>
        )}
      </div>

      {/* Role Alert if not Super Admin */}
      {!isSuperAdmin && (
        <div className="mb-8 p-4 bg-amber-light/60 border border-amber/30 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert size={20} className="text-amber flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-micro text-ink">
                Read-Only Mode: Store Administrator
              </p>
              <p className="text-xs text-muted mt-0.5">
                You are currently viewing parameters in read-only mode. Modifying logistics fees, currency symbols, or maintenance mode requires <strong>Super Administrator</strong> authority.
              </p>
            </div>
          </div>
          <button
            onClick={switchToSuperAdmin}
            className="self-start sm:self-center px-3 py-1.5 bg-ink text-surface text-[11px] uppercase tracking-micro font-medium hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            Switch to Super Admin
          </button>
        </div>
      )}

      {/* Messages */}
      {successMsg && (
        <div className="mb-6 p-4 bg-forest-light border border-forest/30 text-forest text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 p-4 bg-destructive-light border border-destructive/30 text-destructive text-xs flex items-center gap-2 font-medium">
          <AlertTriangle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form id="settings-form" onSubmit={handleSave} className="space-y-8">
        {/* Logistics & Shipping Tiers */}
        <div className="bg-surface border border-hairline p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-hairline">
            <Truck size={18} className="text-ink" />
            <h2 className="text-xs uppercase tracking-micro font-bold text-ink">
              Bangladesh Shipping Tiers & Delivery Fees
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-micro font-semibold text-ink mb-1.5">
                Inside Dhaka Fee (BDT) *
              </label>
              <input
                type="number"
                disabled={!isSuperAdmin}
                value={settings?.shippingFeeInsideDhaka ?? 80}
                onChange={(e) =>
                  handleChange("shippingFeeInsideDhaka", Number(e.target.value))
                }
                className="w-full h-11 px-3 text-xs border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <span className="text-[10px] text-muted block mt-1">
                Standard Dhaka metropolitan flat rate
              </span>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-micro font-semibold text-ink mb-1.5">
                Outside Dhaka Fee (BDT) *
              </label>
              <input
                type="number"
                disabled={!isSuperAdmin}
                value={settings?.shippingFeeOutsideDhaka ?? 150}
                onChange={(e) =>
                  handleChange("shippingFeeOutsideDhaka", Number(e.target.value))
                }
                className="w-full h-11 px-3 text-xs border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <span className="text-[10px] text-muted block mt-1">
                Nationwide courier courier delivery
              </span>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-micro font-semibold text-ink mb-1.5">
                Free Shipping Threshold (BDT) *
              </label>
              <input
                type="number"
                disabled={!isSuperAdmin}
                value={settings?.freeShippingThreshold ?? 5000}
                onChange={(e) =>
                  handleChange("freeShippingThreshold", Number(e.target.value))
                }
                className="w-full h-11 px-3 text-xs border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <span className="text-[10px] text-muted block mt-1">
                Cart subtotal qualifying for zero delivery fee
              </span>
            </div>
          </div>
        </div>

        {/* Currency & Financials */}
        <div className="bg-surface border border-hairline p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-hairline">
            <DollarSign size={18} className="text-ink" />
            <h2 className="text-xs uppercase tracking-micro font-bold text-ink">
              Currency & Tax Policies
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-micro font-semibold text-ink mb-1.5">
                Currency Code
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={settings?.currency ?? "BDT"}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full h-11 px-3 text-xs border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink disabled:opacity-60 disabled:cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-micro font-semibold text-ink mb-1.5">
                Currency Display Symbol
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={settings?.currencySymbol ?? "৳"}
                onChange={(e) => handleChange("currencySymbol", e.target.value)}
                className="w-full h-11 px-3 text-xs border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink disabled:opacity-60 disabled:cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-micro font-semibold text-ink mb-1.5">
                Standard VAT / Tax Rate (%)
              </label>
              <input
                type="number"
                disabled={!isSuperAdmin}
                value={settings?.taxRate ?? 5}
                onChange={(e) => handleChange("taxRate", Number(e.target.value))}
                className="w-full h-11 px-3 text-xs border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Storefront Operations & Toggles */}
        <div className="bg-surface border border-hairline p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-hairline">
            <Store size={18} className="text-ink" />
            <h2 className="text-xs uppercase tracking-micro font-bold text-ink">
              Storefront Identity & Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] uppercase tracking-micro font-semibold text-ink mb-1.5">
                Store Title
              </label>
              <input
                type="text"
                disabled={!isSuperAdmin}
                value={settings?.storeName ?? "Marware Lifestyle & Fashion Storefront"}
                onChange={(e) => handleChange("storeName", e.target.value)}
                className="w-full h-11 px-3 text-xs border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-micro font-semibold text-ink mb-1.5">
                Customer Support Email
              </label>
              <input
                type="email"
                disabled={!isSuperAdmin}
                value={settings?.supportEmail ?? "support@marware.com"}
                onChange={(e) => handleChange("supportEmail", e.target.value)}
                className="w-full h-11 px-3 text-xs border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="border-t border-hairline pt-6 space-y-4">
            <label className="flex items-center justify-between p-3 border border-hairline bg-stone/20 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-ink uppercase tracking-micro block">
                  Allow Guest Checkout
                </span>
                <span className="text-[11px] text-muted">
                  Permit customers to place orders without forcing account registration
                </span>
              </div>
              <input
                type="checkbox"
                disabled={!isSuperAdmin}
                checked={settings?.allowGuestCheckout ?? true}
                onChange={(e) => handleChange("allowGuestCheckout", e.target.checked)}
                className="h-4 w-4 accent-ink"
              />
            </label>

            <label className="flex items-center justify-between p-3 border border-hairline bg-stone/20 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-ink uppercase tracking-micro block">
                  Store Maintenance Mode
                </span>
                <span className="text-[11px] text-muted">
                  Temporarily lock storefront checkout for inventory audit or database maintenance
                </span>
              </div>
              <input
                type="checkbox"
                disabled={!isSuperAdmin}
                checked={settings?.maintenanceMode ?? false}
                onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
                className="h-4 w-4 accent-sale"
              />
            </label>
          </div>
        </div>

        {/* Action Button at bottom */}
        {isSuperAdmin && (
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              size="md"
              loading={saving}
              className="flex items-center gap-2"
            >
              <Save size={14} /> Save All Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

