import { cn } from "@/lib/utils";

export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center font-medium uppercase tracking-micro text-[10px] px-2 py-0.5 select-none";

  const variants = {
    default: "bg-ink text-surface",
    sale: "bg-sale text-surface",
    soldout: "bg-neutral-800 text-stone",
    success: "bg-forest-light text-forest border border-forest/20",
    warning: "bg-amber-light text-amber border border-amber/20",
    neutral: "bg-stone text-ink border border-hairline",
  };

  return (
    <span className={cn(base, variants[variant], className)}>{children}</span>
  );
}
