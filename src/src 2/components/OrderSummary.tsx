"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/utils";

export default function OrderSummary({ showCoupon = true }: { showCoupon?: boolean }) {
  const { state, totals: t, applyCoupon, set } = useStore();
  const [code, setCode] = useState("");
  return (
    <div className="space-y-3 text-sm">
      {showCoupon && (
        <div>
          {t.coupon ? (
            <div className="flex items-center justify-between border border-lime/50 bg-lime/10 px-3 py-2">
              <span><b className="text-lime">{t.coupon.code}</b> applied</span>
              <button onClick={() => set("coupon", null)} className="text-xs underline">Remove</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (applyCoupon(code)) setCode(""); }} className="flex gap-2">
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code (try WYLD10)" aria-label="Coupon code" className="input uppercase placeholder:normal-case" />
              <button className="border border-lime px-4 text-sm font-semibold text-lime hover:bg-lime hover:text-ink">Apply</button>
            </form>
          )}
        </div>
      )}
      <Row l="Subtotal" v={inr(t.subtotal)} />
      {t.mrpSavings > 0 && <Row l="Savings on MRP" v={`− ${inr(t.mrpSavings)}`} accent />}
      {t.couponDiscount > 0 && <Row l="Coupon" v={`− ${inr(t.couponDiscount)}`} accent />}
      <Row l="Shipping" v={t.shipping === 0 ? "Free" : inr(t.shipping)} />
      {t.subtotal > 0 && t.shipping > 0 && <p className="text-xs text-mute">Add {inr(state.settings.freeShipOver - (t.subtotal - t.couponDiscount))} more for free shipping.</p>}
      <div className="flex justify-between border-t border-line pt-3 font-display text-3xl font-extrabold uppercase"><span>Total</span><span>{inr(t.total)}</span></div>
    </div>
  );
}
function Row({ l, v, accent }: { l: string; v: string; accent?: boolean }) {
  return <div className={`flex justify-between ${accent ? "text-lime" : "text-bone/80"}`}><span>{l}</span><span>{v}</span></div>;
}
