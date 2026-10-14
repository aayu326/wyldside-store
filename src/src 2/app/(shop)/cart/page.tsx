"use client";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import OrderSummary from "@/components/OrderSummary";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/utils";

export default function CartPage() {
  const { totals: t, setQty, removeLine, ready } = useStore();
  return (
    <div className="mx-auto max-w-[1300px] px-4 py-10 lg:px-8">
      <h1 className="h-display text-5xl sm:text-7xl">Your cart</h1>
      {!t.lines.length ? (
        <div className="py-20 text-center">
          <p className="text-bone/70">{ready ? "Your cart is empty." : "Loading…"}</p>
          <Link href="/shop" className="btn-lime mt-6">Start shopping</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
          <ul className="divide-y divide-line border-y border-line">
            {t.lines.map((l) => (
              <li key={`${l.productId}${l.size}${l.color}`} className="flex gap-4 py-5">
                <Link href={`/product/${l.product.slug}`} className="w-24 shrink-0 sm:w-28"><SafeImage src={l.product.images[0]} alt={l.product.name} className="aspect-[3/4]" /></Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link href={`/product/${l.product.slug}`} className="font-medium hover:text-lime">{l.product.name}</Link>
                      <p className="mt-1 text-xs text-mute">Size {l.size} · {l.color}</p>
                    </div>
                    <p className="font-bold">{inr(l.product.price * l.qty)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center border border-line">
                      <button aria-label="Decrease quantity" onClick={() => setQty(l.productId, l.size, l.color, l.qty - 1)} className="grid h-9 w-9 place-items-center hover:text-lime"><Minus className="h-4 w-4" /></button>
                      <span className="w-8 text-center text-sm" aria-live="polite">{l.qty}</span>
                      <button aria-label="Increase quantity" onClick={() => setQty(l.productId, l.size, l.color, l.qty + 1)} className="grid h-9 w-9 place-items-center hover:text-lime"><Plus className="h-4 w-4" /></button>
                    </div>
                    <button onClick={() => removeLine(l.productId, l.size, l.color)} className="flex items-center gap-1 text-xs text-mute hover:text-red-400"><Trash2 className="h-4 w-4" /> Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit border border-line bg-panel p-6">
            <h2 className="mb-4 font-display text-2xl font-bold uppercase">Order summary</h2>
            <OrderSummary />
            <Link href="/checkout" className="btn-lime mt-6 w-full">Checkout</Link>
            <Link href="/shop" className="mt-3 block text-center text-sm text-mute hover:text-lime">Keep shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
