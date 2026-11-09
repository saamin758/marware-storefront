import Link from "next/link";
import Button from "./Button";

export default function EmptyState({
  title = "No Products Found",
  description = "We couldn't find items matching your selected criteria. Try resetting filters or exploring other collections.",
  actionLabel = "Explore All Collections",
  actionHref = "/collections/men",
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-surface border border-hairline my-6 max-w-2xl mx-auto">
      <h3 className="font-editorial text-2xl text-ink tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-muted text-sm max-w-md mb-8 leading-relaxed">
        {description}
      </p>
      {onAction ? (
        <Button onClick={onAction}>{actionLabel}</Button>
      ) : (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
