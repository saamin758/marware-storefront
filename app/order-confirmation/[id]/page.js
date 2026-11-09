import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { getOrderById } from "@/services/api/orders";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default async function OrderConfirmationPage({ params }) {
  const { id } = await params;
  let order = null;

  try {
    order = await getOrderById(id);
  } catch (err) {
    console.error("Failed to load order confirmation:", err);
  }

  if (!order) {
    return (
      <div className="max-w-storefront mx-auto px-4 py-24 text-center">
        <h1 className="font-editorial text-3xl font-bold text-ink mb-4">
          Order Not Found
        </h1>
        <p className="text-muted text-sm mb-6">
          Could not locate the requested order reference #{id}.
        </p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      {/* Success Hero Header */}
      <div className="text-center pb-10 border-b border-hairline">
        <div className="w-16 h-16 bg-forest-light text-forest border border-forest/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} />
        </div>
        <p className="text-[11px] uppercase tracking-micro text-forest font-semibold mb-2">
          Order Successfully Placed
        </p>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-ink mb-2">
          Thank You, {order.customerName}
        </h1>
        <p className="text-muted text-sm">
          Your order has been registered and is being prepared for fulfillment.
        </p>
        <div className="mt-4 inline-block bg-stone px-4 py-2 border border-hairline text-sm font-semibold text-ink uppercase tracking-micro">
          Reference Code: {order.orderNumber}
        </div>
      </div>

      {/* Order Details & Summary */}
      <div className="my-10 space-y-8">
        {/* Shipping & Payment Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-surface border border-hairline text-xs">
          <div>
            <h3 className="uppercase tracking-micro font-semibold text-ink mb-3 pb-1 border-b border-hairline">
              Shipping Information
            </h3>
            <p className="font-medium text-ink">{order.customerName}</p>
            <p className="text-muted">{order.customerPhone}</p>
            <p className="text-muted mt-1 leading-relaxed">{order.shippingAddress}</p>
            <p className="text-muted mt-1 font-medium">{order.shippingArea}</p>
          </div>

          <div>
            <h3 className="uppercase tracking-micro font-semibold text-ink mb-3 pb-1 border-b border-hairline">
              Payment & Status
            </h3>
            <p className="font-medium text-ink capitalize mb-1">
              Method: {order.paymentMethod.replace(/_/g, " ")}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-muted">Payment:</span>
              <Badge variant={order.paymentStatus === "paid" ? "success" : "warning"}>
                {order.paymentStatus}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-muted">Fulfillment:</span>
              <Badge variant="default">{order.orderStatus}</Badge>
            </div>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="bg-surface border border-hairline p-6">
          <h3 className="uppercase tracking-micro font-semibold text-ink mb-4 pb-2 border-b border-hairline">
            Purchased Items ({order.items?.length || 0})
          </h3>

          <div className="divide-y divide-hairline">
            {order.items?.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-center">
                <div className="w-14 aspect-portrait bg-stone border border-hairline flex-shrink-0 overflow-hidden">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-medium text-ink text-sm">{item.productName}</p>
                  <p className="text-muted text-[11px] uppercase tracking-micro mt-0.5">
                    {item.selectedSize} · {item.selectedColor} · Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-sm font-semibold tabular-nums text-ink">
                  {formatPrice(item.lineTotal)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-hairline pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span className="tabular-nums font-medium text-ink">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Delivery Charges</span>
              <span className="tabular-nums font-medium text-ink">
                {parseFloat(order.shippingTotal) === 0
                  ? "FREE"
                  : formatPrice(order.shippingTotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-ink border-t border-hairline pt-3">
              <span>Final Total</span>
              <span className="tabular-nums">{formatPrice(order.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post-Purchase Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/collections/men">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
        <Link href="/account">
          <Button variant="secondary">View Order in Account</Button>
        </Link>
      </div>
    </div>
  );
}
