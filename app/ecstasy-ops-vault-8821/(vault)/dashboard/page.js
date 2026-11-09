"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardMetrics } from "@/services/api/admin";
import { formatPrice, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { DollarSign, ShoppingBag, AlertTriangle, Package, Plus } from "lucide-react";

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetricsSilently = () => {
    getDashboardMetrics()
      .then((data) => setMetrics(data))
      .catch((err) => console.warn("Error refreshing metrics:", err));
  };

  useEffect(() => {
    getDashboardMetrics()
      .then((data) => setMetrics(data))
      .catch((err) => console.error("Error loading metrics:", err))
      .finally(() => setLoading(false));

    // Real-time broadcast listener
    let channel;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("ecstasy_realtime_orders");
        channel.onmessage = (event) => {
          if (event.data?.type === "NEW_ORDER_PLACED") {
            fetchMetricsSilently();
          }
        };
      } catch (e) {}
    }

    const handleStorage = (e) => {
      if (e.key === "ecstasy_last_order_event") {
        fetchMetricsSilently();
      }
    };
    window.addEventListener("storage", handleStorage);

    // 4-second background poll
    const interval = setInterval(fetchMetricsSilently, 4000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <div className="text-muted text-sm py-12">Loading executive metrics...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-hairline gap-4">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-ink">
            Store Performance
          </h1>
          <p className="text-muted text-xs uppercase tracking-micro mt-1">
            Real-time catalog metrics & order fulfillment
          </p>
        </div>

        <Link href="/ecstasy-ops-vault-8821/products/new">
          <Button size="sm" className="flex items-center gap-2">
            <Plus size={14} /> Add Product
          </Button>
        </Link>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface border border-hairline p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-micro text-muted font-semibold">
              Gross Revenue
            </span>
            <DollarSign size={18} className="text-forest" />
          </div>
          <p className="font-editorial text-3xl font-bold text-ink tabular-nums">
            {formatPrice(metrics?.totalRevenue || 0)}
          </p>
        </div>

        <div className="bg-surface border border-hairline p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-micro text-muted font-semibold">
              Total Orders
            </span>
            <Package size={18} className="text-ink" />
          </div>
          <p className="font-editorial text-3xl font-bold text-ink tabular-nums">
            {metrics?.totalOrders || 0}
          </p>
        </div>

        <div className="bg-surface border border-hairline p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-micro text-muted font-semibold">
              Live Products
            </span>
            <ShoppingBag size={18} className="text-ink" />
          </div>
          <p className="font-editorial text-3xl font-bold text-ink tabular-nums">
            {metrics?.totalProducts || 0}
          </p>
        </div>

        <div className="bg-surface border border-hairline p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-micro text-muted font-semibold">
              Low Stock Variants
            </span>
            <AlertTriangle size={18} className="text-amber" />
          </div>
          <p className="font-editorial text-3xl font-bold text-ink tabular-nums">
            {metrics?.lowStockCount || 0}
          </p>
        </div>
      </div>

      {/* Governance & Operations Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link
          href="/ecstasy-ops-vault-8821/staff"
          className="bg-surface border border-hairline p-5 hover:border-ink transition-colors group block"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-micro font-bold text-sale">
              Governance
            </span>
            <span className="text-xs text-muted group-hover:text-ink transition-colors font-medium">
              Manage →
            </span>
          </div>
          <h3 className="font-editorial text-lg font-bold text-ink group-hover:text-sale transition-colors">
            Staff & Administrators
          </h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Provision new Store Admins & Super Admins, assign operational permissions, and toggle access.
          </p>
        </Link>

        <Link
          href="/ecstasy-ops-vault-8821/roles"
          className="bg-surface border border-hairline p-5 hover:border-ink transition-colors group block"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-micro font-bold text-amber">
              Security Matrix
            </span>
            <span className="text-xs text-muted group-hover:text-ink transition-colors font-medium">
              View →
            </span>
          </div>
          <h3 className="font-editorial text-lg font-bold text-ink group-hover:text-amber transition-colors">
            Roles & Permissions Matrix
          </h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Inspect capability boundaries between Super Admin, Operations Admin, Customer, and Guest.
          </p>
        </Link>

        <Link
          href="/ecstasy-ops-vault-8821/settings"
          className="bg-surface border border-hairline p-5 hover:border-ink transition-colors group block"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-micro font-bold text-forest">
              Logistics
            </span>
            <span className="text-xs text-muted group-hover:text-ink transition-colors font-medium">
              Configure →
            </span>
          </div>
          <h3 className="font-editorial text-lg font-bold text-ink group-hover:text-forest transition-colors">
            Store Settings & Logistics
          </h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Configure delivery tiers (Inside/Outside Dhaka), BDT currency, and maintenance mode.
          </p>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-surface border border-hairline">
        <div className="p-6 border-b border-hairline flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-micro font-bold text-ink">
            Recent Orders
          </h2>
          <Link
            href="/ecstasy-ops-vault-8821/orders"
            className="text-xs uppercase tracking-micro text-muted hover:text-ink underline"
          >
            Manage All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone text-muted uppercase tracking-micro border-b border-hairline">
              <tr>
                <th className="py-3 px-6 font-semibold">Order</th>
                <th className="py-3 px-6 font-semibold">Customer</th>
                <th className="py-3 px-6 font-semibold">Date</th>
                <th className="py-3 px-6 font-semibold">Total</th>
                <th className="py-3 px-6 font-semibold">Payment</th>
                <th className="py-3 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {metrics?.recentOrders?.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone/30">
                  <td className="py-4 px-6 font-semibold text-ink">
                    {ord.orderNumber}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-ink">{ord.customerName}</p>
                    <p className="text-[11px] text-muted">{ord.customerPhone}</p>
                  </td>
                  <td className="py-4 px-6 text-muted">{formatDate(ord.createdAt)}</td>
                  <td className="py-4 px-6 font-bold text-ink tabular-nums">
                    {formatPrice(ord.grandTotal)}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={ord.paymentStatus === "paid" ? "success" : "warning"}>
                      {ord.paymentStatus}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="default">{ord.orderStatus}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

