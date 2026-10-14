"use client";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { useStore } from "@/lib/store";

export default function WishlistPage() {
  const { state } = useStore();
  const items = state.products.filter((p) => state.wishlist.includes(p.id));
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
      <h1 className="h-display text-5xl sm:text-7xl">Wishlist</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center"><p className="text-bone/70">Tap the heart on any product to save it here.</p><Link href="/shop" className="btn-lime mt-6">Browse products</Link></div>
      ) : (
        <div className="mt-8"><ProductGrid items={items} /></div>
      )}
    </div>
  );
}
