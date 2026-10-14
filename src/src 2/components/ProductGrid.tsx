import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

/** One standard grid for every product list: 2 cols mobile, 4 cols desktop, identical gaps everywhere. */
export default function ProductGrid({ items, sidebar = false }: { items: Product[]; sidebar?: boolean }) {
  const cols = sidebar ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-3 lg:grid-cols-4";
  return (
    <div className={`grid grid-cols-2 items-start gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9 lg:gap-x-6 lg:gap-y-11 ${cols}`}>
      {items.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
