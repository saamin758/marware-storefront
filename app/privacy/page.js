export const metadata = {
  title: "Privacy Policy | MARWARE",
  description: "Learn how MARWARE respects customer privacy, handles contact details, and protects PII.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-ink mb-4 pb-4 border-b border-hairline">
        Privacy Policy
      </h1>
      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <p>
          At MARWARE, we are committed to safeguarding the privacy and personal details of our customers.
        </p>
        <h2 className="text-base font-bold text-ink uppercase tracking-micro">
          Information We Collect
        </h2>
        <p>
          We collect your name, delivery address, phone number, and email strictly for the purposes of parcel dispatch, SMS order tracking updates, and customer support.
        </p>
        <h2 className="text-base font-bold text-ink uppercase tracking-micro">
          Payment Privacy
        </h2>
        <p>
          We never store full debit or credit card credentials. Electronic payment transactions are processed securely through certified banking and mobile financial services gateways.
        </p>
      </div>
    </div>
  );
}
