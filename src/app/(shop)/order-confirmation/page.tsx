"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/utils";

function Inner() {
  const id = useSearchParams().get("id");
  const { state, ready } = useStore();
  const o = state.orders.find((x) => x.id === id);
  if (!o) return <div className="px-4 py-24 text-center"><h1 className="h-display text-5xl">{ready ? "Order not found" : "Loading…"}</h1><Link href="/shop" className="btn-lime mt-8">Back to shop</Link></div>;
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-lime" />
      <h1 className="h-display mt-4 text-6xl">Demo order placed</h1>
      <p className="mt-3 text-bone/70">Order <b className="text-bone">{o.number}</b>. This was a demonstration. Nothing was charged or shipped.</p>
      <div className="mt-8 border border-line bg-panel p-6 text-left text-sm">
        {o.items.map((i, k) => <div key={k} className="flex justify-between py-1"><span>{i.name} ({i.size}) × {i.qty}</span><span>{inr(i.price * i.qty)}</span></div>)}
        <div className="mt-3 flex justify-between border-t border-line pt-3 font-bold"><span>Total ({o.payment})</span><span>{inr(o.total)}</span></div>
        <p className="mt-4 text-xs text-mute">Delivering to {o.customerName}, {o.address}, {o.city} {o.pin}</p>
      </div>
      <div className="mt-8 flex justify-center gap-3"><Link href="/shop" className="btn-lime">Continue shopping</Link><Link href="/account" className="btn-ghost">View orders</Link></div>
    </div>
  );
}
export default function Page() {
  return <Suspense fallback={null}><Inner /></Suspense>;
}
