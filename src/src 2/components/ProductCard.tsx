"use client";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import SafeImage from "./SafeImage";
import { useStore } from "@/lib/store";
import { discountPct, inr } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function ProductCard({ p }: { p: Product }) {
  const { state, toggleWish, addToCart } = useStore();
  const [quick, setQuick] = useState(false);
  const wished = state.wishlist.includes(p.id);
  const off = discountPct(p);
  const sold = p.stock <= 0;

  return (
    <article className="group relative min-w-0" onMouseLeave={() => setQuick(false)}>
      {/* Fixed 3:4 frame: every card image is the same size, whatever the photo */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#151713]">
        <Link href={`/product/${p.slug}`} aria-label={p.name} className="absolute inset-0 block">
          <SafeImage src={p.images[0]} alt={p.name} className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-105" />
          {p.images[1] && (
            <SafeImage src={p.images[1]} alt="" className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          )}
        </Link>

        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1">
          {sold && <span className="bg-bone px-2.5 py-1 text-[10px] font-extrabold tracking-[0.08em] text-ink">SOLD OUT</span>}
          {!sold && p.isNew && <span className="bg-lime px-2.5 py-1 text-[10px] font-extrabold tracking-[0.08em] text-ink">NEW</span>}
          {!sold && off > 0 && <span className="bg-red-600 px-2.5 py-1 text-[10px] font-extrabold tracking-[0.08em] text-white">SALE</span>}
        </div>

        <button
          onClick={() => toggleWish(p.id)}
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/55 backdrop-blur-md transition hover:scale-105 hover:border-lime hover:bg-black/80"
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-lime text-lime" : "text-bone"}`} />
        </button>

        {!sold && (
          <div className="absolute inset-x-0 bottom-0 z-10">
            {quick ? (
              <div className="bg-ink/95 p-2.5">
                <p className="mb-1.5 text-[11px] text-mute">Choose a size</p>
                <div className="flex flex-wrap gap-1">
                  {p.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        if (addToCart(p.id, s, p.colors[0]?.name ?? "Default")) setQuick(false);
                      }}
                      className="min-w-9 border border-line px-2 py-1 text-xs transition hover:border-lime hover:bg-lime hover:text-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setQuick(true)}
                className="flex min-h-10 w-full items-center justify-center gap-2 bg-lime/95 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-ink transition duration-200 md:translate-y-full md:group-hover:translate-y-0 md:focus-visible:translate-y-0"
              >
                <ShoppingBag className="h-4 w-4" /> Quick add
              </button>
            )}
          </div>
        )}
      </div>

      <Link href={`/product/${p.slug}`} className="mt-3 block sm:mt-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold leading-5 tracking-[0.005em] text-bone/90 transition-colors group-hover:text-lime sm:text-sm">{p.name}</h3>
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
          <span className="font-bold">{inr(p.price)}</span>
          {off > 0 && (
            <>
              <span className="text-xs text-mute line-through">{inr(p.mrp)}</span>
              <span className="text-xs font-semibold text-lime">{off}% off</span>
            </>
          )}
        </p>
      </Link>
    </article>
  );
}
