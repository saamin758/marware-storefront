import { cn } from "@/lib/utils";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium tracking-micro uppercase transition-colors duration-200 cursor-pointer select-none border";

  const variants = {
    primary:
      "bg-ink text-surface border-ink hover:bg-neutral-800 active:bg-black disabled:bg-stone disabled:text-muted disabled:border-stone disabled:cursor-not-allowed",
    secondary:
      "bg-transparent text-ink border-ink hover:bg-ink hover:text-surface active:bg-neutral-900 disabled:border-hairline disabled:text-muted disabled:cursor-not-allowed",
    outline:
      "bg-surface text-ink border-hairline hover:border-ink disabled:border-stone disabled:text-muted disabled:cursor-not-allowed",
    sale:
      "bg-sale text-surface border-sale hover:bg-sale-dark disabled:bg-stone disabled:text-muted disabled:border-stone disabled:cursor-not-allowed",
    ghost:
      "bg-transparent text-ink border-transparent hover:bg-stone-dark hover:text-ink disabled:text-muted disabled:cursor-not-allowed",
  };

  const sizes = {
    sm: "h-9 px-3 text-[11px]",
    md: "h-12 px-6 text-[12px]",
    lg: "h-14 px-8 text-[13px]",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
