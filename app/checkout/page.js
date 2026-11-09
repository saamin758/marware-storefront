"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/services/api/orders";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { ShieldCheck, Info, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    customerName: user?.fullName || "",
    customerPhone: user?.phone || "",
    customerEmail: user?.email || "",
    shippingArea: "Dhaka Inside",
    shippingAddress: "",
    orderNote: "",
    paymentMethod: "cash_on_delivery",
    agreedToTerms: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const isCartEmpty = cart.items.length === 0;

  // Recalculate shipping based on selected area
  const shippingCost =
    parseFloat(cart.subtotal) > 3000
      ? 0
      : formData.shippingArea === "Dhaka Inside"
      ? 80
      : 150;
  const grandTotal = (parseFloat(cart.subtotal || 0) + shippingCost).toFixed(2);

  const validate = () => {
    const errs = {};
    if (!formData.customerName.trim()) {
      errs.customerName = "Full name is required";
    }

    // BD Phone validation: +8801XXXXXXXXX or 01XXXXXXXXX
    const phoneRegex = /^(?:\+?8801|01)[3-9]\d{8}$/;
    if (!formData.customerPhone.trim()) {
      errs.customerPhone = "Phone number is required";
    } else if (!phoneRegex.test(formData.customerPhone.replace(/[\s-]/g, ""))) {
      errs.customerPhone = "Please enter a valid Bangladesh phone number (e.g. 01711223344)";
    }

    if (!formData.shippingAddress.trim()) {
      errs.shippingAddress = "Full delivery address is required";
    }

    if (!formData.agreedToTerms) {
      errs.agreedToTerms = "You must accept the terms & exchange policy";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;
    if (isCartEmpty) {
      setSubmitError("Cannot place order with an empty shopping bag.");
      return;
    }

    try {
      setSubmitting(true);
      const order = await createOrder({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || null,
        shippingArea: formData.shippingArea,
        shippingAddress: formData.shippingAddress,
        orderNote: formData.orderNote || null,
        paymentMethod: formData.paymentMethod,
        shippingTotal: shippingCost.toFixed(2),
        grandTotal,
      });

      // Broadcast real-time order signal to Admin Dashboard
      if (typeof window !== "undefined") {
        try {
          const channel = new BroadcastChannel("ecstasy_realtime_orders");
          channel.postMessage({
            type: "NEW_ORDER_PLACED",
            order,
            timestamp: Date.now(),
          });
        } catch (e) {}

        try {
          localStorage.setItem(
            "ecstasy_last_order_event",
            JSON.stringify({
              id: order.id,
              orderNumber: order.orderNumber,
              customerName: order.customerName,
              customerPhone: order.customerPhone,
              grandTotal: order.grandTotal,
              timestamp: Date.now(),
            })
          );
        } catch (e) {}
      }

      await refreshCart();
      router.push(`/order-confirmation/${order.id}`);
    } catch (err) {
      setSubmitError(err.message || "Failed to process order. Please try again.");
      setSubmitting(false);
    }
  };

  if (isCartEmpty) {
    return (
      <div className="max-w-storefront mx-auto px-4 sm:px-6 lg:px-10 py-24 text-center">
        <h1 className="font-editorial text-3xl font-bold text-ink mb-4">
          Cannot Proceed to Checkout
        </h1>
        <p className="text-muted text-sm mb-6">
          Your shopping bag is empty. Please add items before checking out.
        </p>
        <Link href="/collections/men">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  const fillDemoCustomer = () => {
    setFormData((prev) => ({
      ...prev,
      customerName: "Samin Ahmed",
      customerPhone: "01712345678",
      customerEmail: "samin@example.com",
      shippingArea: "Dhaka Inside",
      shippingAddress: "House 42, Road 11, Banani, Dhaka-1213",
      orderNote: "Please ring the bell upon arrival. Cash on delivery.",
    }));
    setErrors({});
  };

  return (
    <div className="max-w-storefront mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
      <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-ink tracking-tight mb-10 pb-6 border-b border-hairline">
        Checkout & Shipping
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Form Details (60%) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* 1. Customer Contact */}
            <div className="bg-surface border border-hairline p-6">
              <div className="pb-3 mb-6 border-b border-hairline">
                <h2 className="text-[12px] uppercase tracking-micro font-semibold text-ink">
                  1. Contact Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="e.g. Samin Ahmed"
                    className={`w-full h-12 px-4 text-sm border bg-canvas text-ink focus:outline-none focus:border-ink ${
                      errors.customerName ? "border-destructive" : "border-hairline"
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-xs text-destructive mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, customerPhone: e.target.value })
                      }
                      placeholder="017XXXXXXXX"
                      className={`w-full h-12 px-4 text-sm border bg-canvas text-ink focus:outline-none focus:border-ink ${
                        errors.customerPhone ? "border-destructive" : "border-hairline"
                      }`}
                    />
                    {errors.customerPhone && (
                      <p className="text-xs text-destructive mt-1">{errors.customerPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, customerEmail: e.target.value })
                      }
                      placeholder="samin@example.com"
                      className="w-full h-12 px-4 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-surface border border-hairline p-6">
              <h2 className="text-[12px] uppercase tracking-micro font-semibold text-ink mb-6 pb-3 border-b border-hairline">
                2. Delivery Destination
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
                    Delivery Zone *
                  </label>
                  <select
                    value={formData.shippingArea}
                    onChange={(e) =>
                      setFormData({ ...formData, shippingArea: e.target.value })
                    }
                    className="w-full h-12 px-4 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink uppercase tracking-micro text-xs"
                  >
                    <option value="Dhaka Inside">Dhaka Metro (2–3 Days, ৳80)</option>
                    <option value="Dhaka Outside">Outside Dhaka / Nationwide (3–5 Days, ৳150)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
                    Street Address, Apartment & Area *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, shippingAddress: e.target.value })
                    }
                    placeholder="House number, Road number, Sector/Area, Thana, District"
                    className={`w-full p-3 text-sm border bg-canvas text-ink focus:outline-none focus:border-ink ${
                      errors.shippingAddress ? "border-destructive" : "border-hairline"
                    }`}
                  />
                  {errors.shippingAddress && (
                    <p className="text-xs text-destructive mt-1">{errors.shippingAddress}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-micro font-medium text-ink mb-1.5">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.orderNote}
                    onChange={(e) =>
                      setFormData({ ...formData, orderNote: e.target.value })
                    }
                    placeholder="e.g. Leave with security, call before arrival"
                    className="w-full h-12 px-4 text-sm border border-hairline bg-canvas text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-surface border border-hairline p-6">
              <h2 className="text-[12px] uppercase tracking-micro font-semibold text-ink mb-6 pb-3 border-b border-hairline">
                3. Payment Method
              </h2>

              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    formData.paymentMethod === "cash_on_delivery"
                      ? "border-ink bg-stone/40"
                      : "border-hairline hover:border-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={formData.paymentMethod === "cash_on_delivery"}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                    className="mt-1"
                  />
                  <div>
                    <span className="text-sm font-semibold text-ink block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-xs text-muted">
                      Pay cash to delivery rider upon inspecting package in 64 districts.
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    formData.paymentMethod === "online_simulation"
                      ? "border-ink bg-stone/40"
                      : "border-hairline hover:border-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online_simulation"
                    checked={formData.paymentMethod === "online_simulation"}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                    className="mt-1"
                  />
                  <div>
                    <span className="text-sm font-semibold text-ink block">
                      Online Payment (bKash / Card Simulation)
                    </span>
                    <span className="text-xs text-muted">
                      Simulate instant verified digital payment in development environment.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (40%) */}
          <div className="lg:col-span-5">
            <div className="bg-surface border border-hairline p-6 lg:p-8 lg:sticky lg:top-28">
              <h2 className="text-[12px] uppercase tracking-micro font-semibold text-ink mb-6 pb-3 border-b border-hairline">
                Order Review ({cart.itemCount})
              </h2>

              {/* Items Mini List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-hairline mb-6 pr-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="py-3 flex gap-3 items-center">
                    <div className="w-12 aspect-portrait bg-stone border border-hairline flex-shrink-0 overflow-hidden">
                      {item.product.primaryImage?.url && (
                        <img
                          src={item.product.primaryImage.url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-medium text-ink line-clamp-1">{item.product.name}</p>
                      <p className="text-muted text-[10px] uppercase">
                        {item.variant.size} · {item.variant.color} · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-semibold tabular-nums text-ink">
                      {formatPrice(item.lineTotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-3 text-sm pb-6 border-b border-hairline">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold text-ink tabular-nums">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Delivery Fee ({formData.shippingArea})</span>
                  <span className="font-medium text-ink tabular-nums">
                    {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-ink pt-3 border-t border-hairline">
                  <span>Grand Total</span>
                  <span className="tabular-nums">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="py-4">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-muted leading-relaxed">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, agreedToTerms: e.target.checked })
                    }
                    className="mt-0.5"
                  />
                  <span>
                    I agree to the 7-day exchange policy and verify my shipping details.
                  </span>
                </label>
                {errors.agreedToTerms && (
                  <p className="text-xs text-destructive mt-1">{errors.agreedToTerms}</p>
                )}
              </div>

              {submitError && (
                <div className="p-3 bg-destructive-light text-destructive border border-destructive/30 text-xs mb-4">
                  {submitError}
                </div>
              )}

              {/* Submit CTA */}
              <Button
                type="submit"
                size="lg"
                loading={submitting}
                className="w-full flex items-center justify-center gap-2"
              >
                Place Order · {formatPrice(grandTotal)}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
