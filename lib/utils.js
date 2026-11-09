import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine Tailwind CSS classes cleanly
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Bangladeshi Taka (BDT / ৳)
 * e.g. 2450 -> "৳2,450" or "৳2,450.00"
 */
export function formatPrice(amount, showDecimals = false) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "৳0";
  }
  const numeric = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(numeric);
}

/**
 * Format date for order history and admin reviews
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
