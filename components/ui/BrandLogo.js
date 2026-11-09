import Link from "next/link";

export default function BrandLogo({
  href = "/",
  size = "md",
  showEmblem = true,
  className = "",
  monogramOnly = false,
}) {
  const emblemSizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const textSizes = {
    sm: "text-lg tracking-[0.22em]",
    md: "text-2xl sm:text-3xl tracking-[0.25em]",
    lg: "text-3xl sm:text-4xl tracking-[0.28em]",
  };

  const Content = (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {showEmblem && (
        <span
          className={`relative ${emblemSizes[size]} bg-ink border border-neutral-700 flex items-center justify-center flex-shrink-0 shadow-xs`}
        >
          <span className="font-editorial font-bold text-surface">M</span>
          <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-[#D4AF37]" />
        </span>
      )}

      {!monogramOnly && (
        <span className={`font-editorial font-bold text-ink ${textSizes[size]}`}>
          MARWARE
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-90">
        {Content}
      </Link>
    );
  }

  return Content;
}

