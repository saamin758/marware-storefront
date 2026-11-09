import ProductCard from "./ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";

export default function ProductGrid({
  products = [],
  loading = false,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionHref,
}) {
  const items = Array.isArray(products)
    ? products
    : products?.data || products?.products || [];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="w-full aspect-portrait" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || "No Products Found"}
        description={
          emptyDescription ||
          "There are no published products available in this selection."
        }
        actionLabel={emptyActionLabel || "Explore All Collections"}
        actionHref={emptyActionHref || "/collections/all"}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
