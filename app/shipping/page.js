export const metadata = {
  title: "Shipping & Exchange Policy | MARWARE",
  description: "Learn about delivery timeframes, rates across 64 districts in Bangladesh, and our 7-day hassle-free exchange policy.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-ink mb-4 pb-4 border-b border-hairline">
        Shipping & Exchange Policy
      </h1>
      <p className="text-muted text-xs uppercase tracking-micro mb-8">
        Last updated: October 2026 · Delivery Coverage Across Bangladesh
      </p>

      <div className="space-y-8 text-sm text-ink leading-relaxed">
        <section>
          <h2 className="text-base font-bold uppercase tracking-micro mb-3">
            1. Nationwide Delivery Rates & Timelines
          </h2>
          <p className="text-muted mb-3">
            All orders are processed, packaged, and dispatched from our central Dhaka fulfillment center.
          </p>
          <div className="border border-hairline bg-surface p-4 space-y-2 text-xs">
            <p>
              • <strong>Dhaka City Metro:</strong> Delivery within 2–3 business days. Flat delivery fee of ৳80.
            </p>
            <p>
              • <strong>Outside Dhaka / All 64 Districts:</strong> Delivery within 3–5 business days. Flat delivery fee of ৳150.
            </p>
            <p className="text-forest font-semibold pt-1">
              • <strong>Complimentary Shipping:</strong> Automatically applied to all orders with a subtotal exceeding ৳3,000.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase tracking-micro mb-3">
            2. Cash On Delivery (COD) Inspection
          </h2>
          <p className="text-muted">
            We proudly offer Cash on Delivery across Bangladesh. Customers are invited to inspect parcel condition upon handover by the courier rider before completing payment.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold uppercase tracking-micro mb-3">
            3. 7-Day Exchange Guarantee
          </h2>
          <p className="text-muted mb-3">
            If you need a different size or color, we provide a 7-day exchange window from the date of parcel receipt.
          </p>
          <ul className="list-disc list-inside text-muted space-y-1 text-xs">
            <li>Garments must remain unworn, unwashed, and in original condition.</li>
            <li>All authentic brand tags and spare buttons must remain intact.</li>
            <li>Exchanges are subject to inventory availability in the requested variant.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
