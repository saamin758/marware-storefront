export const metadata = {
  title: "Terms of Service | MARWARE",
  description: "Terms and conditions governing the use of the MARWARE online storefront.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-ink mb-4 pb-4 border-b border-hairline">
        Terms of Service
      </h1>
      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <p>
          By accessing and placing an order with MARWARE, you confirm that you agree to the terms and service conditions outlined below.
        </p>
        <h2 className="text-base font-bold text-ink uppercase tracking-micro">
          Pricing and Availability
        </h2>
        <p>
          All product prices are quoted in Bangladeshi Taka (BDT / ৳) and are inclusive of standard local taxes. We reserve the right to modify prices and correct catalog errors without prior notice.
        </p>
        <h2 className="text-base font-bold text-ink uppercase tracking-micro">
          Order Confirmation & Fulfillment
        </h2>
        <p>
          Receipt of an electronic order reference does not signify our final acceptance of your order. We reserve the right to verify customer phone numbers and stock levels before order dispatch.
        </p>
      </div>
    </div>
  );
}
