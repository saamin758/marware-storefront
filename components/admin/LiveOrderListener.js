"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { playTunngNotification, initAudioUnlock } from "@/lib/orderSound";
import { Bell, BellOff, Volume2, X, ExternalLink, Sparkles } from "lucide-react";

export default function LiveOrderListener() {
  const pathname = usePathname();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [liveToast, setLiveToast] = useState(null);
  const [testActive, setTestActive] = useState(false);

  const seenOrderIdsRef = useRef(new Set());
  const channelRef = useRef(null);

  // Initialize sound settings & audio unlock on mount
  useEffect(() => {
    initAudioUnlock();

    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ecstasy_admin_sound_enabled");
        if (saved !== null) {
          setSoundEnabled(saved === "true");
        }
      } catch {}
    }
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("ecstasy_admin_sound_enabled", String(next));
        } catch {}
      }
      return next;
    });
  };

  const handleTestTunng = () => {
    setTestActive(true);
    playTunngNotification();
    setTimeout(() => setTestActive(false), 1200);
  };

  const triggerNewOrderAlert = (order) => {
    if (!order || !order.id) return;
    if (seenOrderIdsRef.current.has(order.id)) return;

    seenOrderIdsRef.current.add(order.id);

    // 1. Play the "Tunng" notification chime
    if (soundEnabled) {
      playTunngNotification();
    }

    // 2. Show the floating notification toast
    setLiveToast(order);

    // Auto-dismiss toast after 8 seconds
    setTimeout(() => {
      setLiveToast((current) => (current?.id === order.id ? null : current));
    }, 8000);
  };

  useEffect(() => {
    // 1. Populate initial seen orders so existing orders don't chime on first load
    const primeSeenOrders = async () => {
      try {
        const res = await fetch("/api/v1/orders", { cache: "no-store" });
        const json = await res.json();
        const orders = json.data || json || [];
        if (Array.isArray(orders)) {
          orders.forEach((o) => seenOrderIdsRef.current.add(o.id));
        }
      } catch {}
    };
    primeSeenOrders();

    // 2. Cross-tab BroadcastChannel listener
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel("ecstasy_realtime_orders");
        channelRef.current = channel;
        channel.onmessage = (event) => {
          if (event.data?.type === "NEW_ORDER_PLACED" && event.data.order) {
            triggerNewOrderAlert(event.data.order);
          }
        };
      } catch {}
    }

    // 3. Multi-window storage event fallback
    const handleStorage = (e) => {
      if (e.key === "ecstasy_last_order_event" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.id) {
            triggerNewOrderAlert(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);

    // 4. Background silent polling every 4 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/v1/orders", { cache: "no-store" });
        const json = await res.json();
        const orders = json.data || json || [];
        if (Array.isArray(orders) && seenOrderIdsRef.current.size > 0) {
          const newOrders = orders.filter((o) => !seenOrderIdsRef.current.has(o.id));
          if (newOrders.length > 0) {
            triggerNewOrderAlert(newOrders[0]);
          }
        }
      } catch {}
    }, 4000);

    return () => {
      if (channelRef.current) {
        try {
          channelRef.current.close();
        } catch {}
      }
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [soundEnabled]);

  return (
    <>
      {/* Floating Real-Time "Tunng" Notification Alert */}
      {liveToast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-ink text-surface border border-neutral-700 p-4 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-micro text-emerald-400 flex items-center gap-1.5">
                  <Sparkles size={12} /> New Order Received!
                </p>
                <p className="font-editorial text-sm font-bold text-white mt-0.5">
                  Order #{liveToast.orderNumber || liveToast.id?.slice(-6)?.toUpperCase()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setLiveToast(null)}
              className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer"
              aria-label="Dismiss alert"
            >
              <X size={15} />
            </button>
          </div>

          <div className="mt-2.5 pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
            <div className="text-neutral-300 truncate max-w-[190px]">
              {liveToast.customerName || "Customer"}
            </div>
            <div className="font-bold text-white tabular-nums">
              {formatPrice(liveToast.grandTotal || 0)}
            </div>
          </div>

          <div className="mt-3">
            <Link
              href="/ecstasy-ops-vault-8821/orders"
              onClick={() => setLiveToast(null)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-surface text-ink text-[11px] uppercase tracking-micro font-bold hover:bg-neutral-200 transition-colors"
            >
              <span>View Customer Orders</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      )}

      {/* Unobtrusive Sound Status Widget for the Admin Header / Sidebar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSound}
          title={soundEnabled ? "Mute order sound" : "Enable order sound"}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-micro font-semibold border transition-all cursor-pointer ${
            soundEnabled
              ? "bg-stone border-hairline text-ink hover:border-muted"
              : "bg-surface border-hairline text-muted hover:text-ink line-through"
          }`}
        >
          {soundEnabled ? <Bell size={12} className="text-emerald-600" /> : <BellOff size={12} />}
          <span>{soundEnabled ? "Tunng Sound: ON" : "Sound: Muted"}</span>
        </button>

        <button
          type="button"
          onClick={handleTestTunng}
          title="Click to test the 'Tunng' bell chime sound"
          className={`flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-micro font-bold border border-hairline bg-surface text-ink hover:bg-stone transition-all cursor-pointer ${
            testActive ? "scale-95 bg-emerald-50 text-emerald-700 border-emerald-300" : ""
          }`}
        >
          <Volume2 size={11} className={testActive ? "animate-bounce" : ""} />
          <span>{testActive ? "Playing..." : "Test 'Tunng'"}</span>
        </button>
      </div>
    </>
  );
}

