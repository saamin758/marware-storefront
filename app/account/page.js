"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getOrders } from "@/services/api/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Package, LogOut, User } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      getOrders()
        .then((data) => setOrders(data || []))
        .catch((err) => console.error("Error loading account orders:", err))
        .finally(() => setLoadingOrders(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="max-w-storefront mx-auto px-4 py-24 text-center text-muted">
        Loading account details...
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-16">
      {/* Top Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-10 border-b border-hairline gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-micro text-muted font-semibold mb-1">
            Client Portal
          </p>
          <h1 className="font-editorial text-3xl font-bold text-ink">
            {user.fullName}
          </h1>
          <p className="text-xs text-muted mt-1">
            {user.email} · {user.phone || "No phone registered"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user.role === "admin" && (
            <Link href="/ecstasy-ops-vault-8821/dashboard">
              <Button variant="secondary" size="sm">
                Open Admin Dashboard
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1.5"
          >
            <LogOut size={14} /> Sign Out
          </Button>
        </div>
      </div>

      {/* Orders History Section */}
      <div>
        <h2 className="text-sm uppercase tracking-micro font-bold text-ink mb-6 pb-2 border-b border-hairline flex items-center gap-2">
          <Package size={16} /> Order History ({orders.length})
        </h2>

        {loadingOrders ? (
          <div className="py-12 text-center text-muted text-sm">
            Fetching order archives...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center border border-hairline bg-surface">
            <p className="text-muted text-sm mb-4">You have not placed any orders yet.</p>
            <Link href="/collections/men">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-surface border border-hairline p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-hairline gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-ink text-sm block">
                      {order.orderNumber}
                    </span>
                    <span className="text-muted">{formatDate(order.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={order.paymentStatus === "paid" ? "success" : "warning"}>
                      Payment: {order.paymentStatus}
                    </Badge>
                    <Badge variant="default">Status: {order.orderStatus}</Badge>
                    <span className="font-bold text-sm text-ink tabular-nums ml-2">
                      {formatPrice(order.grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="py-4 divide-y divide-hairline">
                  {order.items?.map((item) => (
                    <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-medium text-ink">{item.productName}</p>
                        <p className="text-muted text-[11px] uppercase tracking-micro">
                          {item.selectedSize} · {item.selectedColor} · Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium tabular-nums text-ink">
                        {formatPrice(item.lineTotal)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-hairline flex justify-end">
                  <Link
                    href={`/order-confirmation/${order.id}`}
                    className="text-xs uppercase tracking-micro text-ink underline font-medium hover:text-muted"
                  >
                    View Official Invoice
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
