"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ProductAccordion({ product }) {
  const [openSections, setOpenSections] = useState({
    description: true,
    fabric: false,
    shipping: false,
  });

  const toggle = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="border-t border-hairline mt-8 divide-y divide-hairline">
      {/* Description & Fit */}
      <div>
        <button
          onClick={() => toggle("description")}
          className="w-full py-4 flex items-center justify-between text-left text-[11px] uppercase tracking-micro font-semibold text-ink"
        >
          <span>Description & Silhouette</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              openSections.description ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSections.description && (
          <div className="pb-5 text-sm text-muted leading-relaxed">
            <p className="mb-2">{product.description}</p>
            {product.fit && (
              <p className="mt-2 font-medium text-ink text-xs">
                Fit: <span className="font-normal text-muted">{product.fit}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Fabric & Care */}
      <div>
        <button
          onClick={() => toggle("fabric")}
          className="w-full py-4 flex items-center justify-between text-left text-[11px] uppercase tracking-micro font-semibold text-ink"
        >
          <span>Textile Composition & Care</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              openSections.fabric ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSections.fabric && (
          <div className="pb-5 text-sm text-muted leading-relaxed space-y-2">
            <p>
              <strong className="text-ink font-medium">Fabric:</strong>{" "}
              {product.fabric || "Premium Cotton Blend"}
            </p>
            <p>
              <strong className="text-ink font-medium">Care:</strong>{" "}
              {product.careInstructions ||
                "Gentle wash in cold water. Iron on medium heat."}
            </p>
          </div>
        )}
      </div>

      {/* Shipping & Delivery */}
      <div>
        <button
          onClick={() => toggle("shipping")}
          className="w-full py-4 flex items-center justify-between text-left text-[11px] uppercase tracking-micro font-semibold text-ink"
        >
          <span>Shipping, Exchange & Authenticity</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              openSections.shipping ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSections.shipping && (
          <div className="pb-5 text-sm text-muted leading-relaxed space-y-2">
            <p>
              • <strong>Dhaka City:</strong> 2–3 business days (৳80, or FREE over ৳3,000).
            </p>
            <p>
              • <strong>Nationwide Bangladesh:</strong> 3–5 business days (৳150).
            </p>
            <p>
              • <strong>Exchanges:</strong> Easy 7-day hassle-free exchange on unworn garments with original tags attached.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
