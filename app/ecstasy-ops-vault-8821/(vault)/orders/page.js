"use client";

import { useEffect, useState, useRef } from "react";
import { getOrders } from "@/services/api/orders";
import { updateOrderStatus } from "@/services/api/admin";
import { formatPrice, formatDate } from "@/lib/utils";
import { playTunngNotification } from "@/lib/orderSound";
import Badge from "@/components/ui/Badge";
import {
  Search,
  Check,
  Bell,
  BellOff,
  Sparkles,
  RefreshCw,
  Radio,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

// Web Audio API synthesized "Tunng" notification chime
function playOrderChime() {
  playTunngNotification();
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Real-time State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [recentLiveOrder, setRecentLiveOrder] = useState(null);
  const [highlightOrderId, setHighlightOrderId] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  const knownOrderIdsRef = useRef(new Set());

  // Silent background fetch to detect new orders without UI flicker
  const fetchOrders = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const data = await getOrders();
      const currentList = data || [];

      // Check if new orders arrived that were not in known IDs
      if (!isInitial && knownOrderIdsRef.current.size > 0) {
        const newArrivals = currentList.filter(
          (o) => !knownOrderIdsRef.current.has(o.id)
        );

        if (newArrivals.length > 0) {
          const newest = newArrivals[0];
          setHighlightOrderId(newest.id);
          setRecentLiveOrder(newest);

          if (soundEnabled) {
            playOrderChime();
          }

          setTimeout(() => setHighlightOrderId(null), 8000);
          setTimeout(() => setRecentLiveOrder(null), 6000);
        }
      }

      // Update known ID set
      currentList.forEach((o) => knownOrderIdsRef.current.add(o.id));
      setOrders(currentList);
      setLastSyncTime(new Date());
    } catch (err) {
      console.warn("Real-time orders sync error:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);

    // 1. Instant cross-tab real-time listener via BroadcastChannel
    let channel;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("ecstasy_realtime_orders");
        channel.onmessage = (event) => {
          if (event.data?.type === "NEW_ORDER_PLACED" && event.data.order) {
            const incoming = event.data.order;
            setHighlightOrderId(incoming.id);
            setRecentLiveOrder(incoming);

            if (soundEnabled) {
              playOrderChime();
            }

            // Immediately prepend to state
            setOrders((prev) => {
              if (prev.some((o) => o.id === incoming.id)) return prev;
              return [incoming, ...prev];
            });
            knownOrderIdsRef.current.add(incoming.id);

            setTimeout(() => setHighlightOrderId(null), 8000);
            setTimeout(() => setRecentLiveOrder(null), 6000);
          }
        };
      } catch (e) {}
    }

    // 2. Storage event listener for cross-window notifications
    const handleStorage = (e) => {
      if (e.key === "ecstasy_last_order_event" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          fetchOrders(false);
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Lightweight background poll every 3.5 seconds (ensures orders from any device appear)
    const pollInterval = setInterval(() => {
      fetchOrders(false);
    }, 3500);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorage);
      clearInterval(pollInterval);
    };
  }, [soundEnabled]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, newStatus);
      setSuccessMsg(`Order ${orderId} updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchOrders(false);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Real-Time Live Order Alert Toast */}
      {recentLiveOrder && (
        <div className="fixed top-6 right-6 z-50 bg-ink text-surface border-2 border-emerald-500 p-4 shadow-2xl flex items-start gap-3 max-w-md animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center flex-shrink-0 animate-bounce">
            <Bell size={16} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-micro text-emerald-400 font-bold">
                New Order Received Just Now!
              </span>
              <span className="text-[10px] text-surface/60 font-mono">
                {recentLiveOrder.orderNumber}
              </span>
            </div>
            <p className="text-xs font-bold text-surface mt-1">
              {recentLiveOrder.customerName} ({recentLiveOrder.customerPhone})
            </p>
            <p className="text-xs text-surface/80 mt-0.5">
              Total:{" "}
              <strong className="text-emerald-300">
                {formatPrice(recentLiveOrder.grandTotal)}
              </strong>{" "}
              • {recentLiveOrder.shippingArea}
            </p>
          </div>
        </div>
      )}

      {/* Header with Live Stream Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-hairline gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase tracking-micro font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Order Stream Active
            </span>
            <span className="text-[10px] uppercase tracking-micro text-muted">
              • Auto-syncing real-time
            </span>
          </div>
          <h1 className="font-editorial text-3xl font-bold text-ink">
            Customer Orders & Fulfillment
          </h1>
          <p className="text-muted text-xs uppercase tracking-micro mt-1">
            Real-time customer dispatch stream — new orders appear automatically without refreshing
          </p>
        </div>

        {/* Live Controls Bar */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2 text-xs uppercase tracking-micro font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              soundEnabled
                ? "bg-stone border-hairline text-ink hover:bg-neutral-200"
                : "bg-canvas border-hairline text-muted hover:text-ink"
            }`}
            title="Toggle audio notification chime for new customer orders"
          >
            {soundEnabled ? (
              <>
                <Bell size={14} className="text-emerald-600" />
                <span>Sound: On</span>
              </>
            ) : (
              <>
                <BellOff size={14} />
                <span>Sound: Off</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => fetchOrders(false)}
            className="px-3 py-2 text-xs uppercase tracking-micro font-semibold border border-hairline bg-surface hover:bg-stone text-ink flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Force sync now"
          >
            <RefreshCw size={13} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 mb-6 bg-forest-light text-forest border border-forest/30 text-xs flex items-center gap-2 font-medium">
          <Check size={16} /> {successMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-hairline p-4 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center border border-hairline max-w-md bg-canvas flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number, customer name, phone..."
            className="flex-1 h-10 px-3 text-xs bg-transparent text-ink focus:outline-none"
          />
          <span className="px-3 text-muted">
            <Search size={14} />
          </span>
        </div>

        <div className="text-xs uppercase tracking-micro text-muted font-medium hidden sm:block">
          Orders Count: <strong className="text-ink">{orders.length}</strong>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface border border-hairline overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone text-muted uppercase tracking-micro border-b border-hairline">
            <tr>
              <th className="py-3 px-6 font-semibold">Order No</th>
              <th className="py-3 px-6 font-semibold">Customer & Destination</th>
              <th className="py-3 px-6 font-semibold">Items</th>
              <th className="py-3 px-6 font-semibold">Total & Payment</th>
              <th className="py-3 px-6 font-semibold">Fulfillment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted">
                  Loading order stream...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted">
                  No orders found. When a customer places an order, it will appear here in real time.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => {
                const isFreshHighlight = highlightOrderId === ord.id;

                return (
                  <tr
                    key={ord.id}
                    className={`transition-colors duration-700 ${
                      isFreshHighlight
                        ? "bg-emerald-50 border-l-4 border-l-emerald-500 font-medium"
                        : "hover:bg-stone/30"
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-ink block">
                          {ord.orderNumber}
                        </span>
                        {isFreshHighlight && (
                          <span className="text-[9px] uppercase tracking-micro font-bold bg-emerald-600 text-white px-1.5 py-0.2 animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted block mt-0.5">
                        {formatDate(ord.createdAt)}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-medium text-ink">{ord.customerName}</p>
                      <p className="text-[11px] text-muted">{ord.customerPhone}</p>
                      <p className="text-[10px] text-muted max-w-xs truncate mt-0.5">
                        {ord.shippingAddress} ({ord.shippingArea})
                      </p>
                    </td>

                    <td className="py-4 px-6 text-muted">
                      {ord.items && ord.items.length > 0 ? (
                        ord.items.map((item, idx) => (
                          <p key={idx} className="truncate max-w-xs">
                            {item.quantity}x {item.productName} ({item.selectedSize})
                          </p>
                        ))
                      ) : (
                        <p className="italic text-muted">1x Fashion Merchandise</p>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-bold text-sm tabular-nums text-ink block">
                        {formatPrice(ord.grandTotal)}
                      </span>
                      <Badge
                        variant={ord.paymentStatus === "paid" ? "success" : "warning"}
                        className="mt-1"
                      >
                        {ord.paymentStatus} ·{" "}
                        {ord.paymentMethod === "cash_on_delivery" ? "COD" : "Online"}
                      </Badge>
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={ord.orderStatus}
                        disabled={updatingId === ord.id}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="h-9 px-2 text-xs uppercase tracking-micro font-medium border border-hairline bg-canvas text-ink focus:outline-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
