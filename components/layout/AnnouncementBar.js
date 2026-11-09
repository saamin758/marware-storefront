"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-ink text-surface px-4 py-2 text-center relative z-40">
      <div className="max-w-storefront mx-auto flex items-center justify-center">
        <p className="text-[11px] uppercase tracking-micro font-medium">
          COMPLIMENTARY NATIONWIDE SHIPPING ON ORDERS OVER ৳3,000 | EDITORIAL AUTUMN DROP
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 text-neutral-400 hover:text-white transition-colors"
          aria-label="Dismiss announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
