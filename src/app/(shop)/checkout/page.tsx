"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import OrderSummary from "@/components/OrderSummary";
import { useStore } from "@/lib/store";
import { uid } from "@/lib/utils";
import type { Order } from "@/lib/types";

type F = { name: string; email: string; phone: string; address: string; city: string; pin: string };

export default function CheckoutPage() {
  const { state, totals: t, set, toast } = useStore();
  const router = useRouter();
  const [f, setF] = useState<F>({ name: state.user?.name ?? "", email: state.user?.email ?? "", phone: "", address: "", city: "", pin: "" });
  const [pay, setPay] = useState<"cod" | "online">("cod");
  const [err, setErr] = useState<Partial<Record<keyof F, string>>>({});

  if (!t.lines.length) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="h-display text-5xl">Nothing to check out</h1>
        <Link href="/shop" className="btn-lime mt-8">Shop now</Link>
      </div>
    );
  }

  const validate = () => {
    const e: Partial<Record<keyof F, string>> = {};
    if (f.name.trim().length < 2) e.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email.";
    if (!/^\d{10}$/.test(f.phone)) e.phone = "Enter a 10-digit mobile number.";
    if (f.address.trim().length < 6) e.address = "Enter your street address.";
    if (f.city.trim().length < 2) e.city = "Enter your city.";
    if (!/^\d{6}$/.test(f.pin)) e.pin = "Enter a 6-digit PIN code.";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const place = (e: React.FormEvent) => {
    e.preventDefault();
    if (pay === "online") return toast("Online payment is coming soon. Choose Cash on Delivery.", "err");
    if (!validate()) return toast("Fix the highlighted fields.", "err");
    const id = uid("o");
    const order: Order = {
      id, number: `WS-${1001 + state.orders.length}`, customerName: f.name, email: f.email, phone: f.phone, address: f.address, city: f.city, pin: f.pin,
      items: t.lines.map((l) => ({ productId: l.productId, name: l.product.name, size: l.size, color: l.color, qty: l.qty, price: l.product.price })),
      subtotal: t.subtotal, discount: t.couponDiscount, shipping: t.shipping, total: t.total, status: "Pending", payment: "Cash on Delivery", date: new Date().toISOString(),
    };
    set("orders", (o) => [order, ...o]);
    set("customers", (c) => (c.some((x) => x.email === f.email) ? c : [{ id: uid("cu"), name: f.name, email: f.email, phone: f.phone, city: f.city, joined: new Date().toISOString() }, ...c]));
    set("cart", []);
    set("coupon", null);
    router.push(`/order-confirmation?id=${id}`);
  };

  const field = (k: keyof F, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={k} className="mb-1 block text-xs font-semibold">{label}</label>
      <input id={k} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!err[k]} className={`input ${err[k] ? "border-red-500" : ""}`} {...props} />
      {err[k] && <p className="mt-1 text-xs text-red-400">{err[k]}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1300px] px-4 py-10 lg:px-8">
      <h1 className="h-display text-5xl sm:text-7xl">Checkout</h1>
      <div className="mt-4 flex items-start gap-2 border border-lime/40 bg-lime/10 p-3 text-sm">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
        <p>This is a demo checkout. No real order is placed and no payment is taken. Orders are saved only in this browser.</p>
      </div>
      <form onSubmit={place} noValidate className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-display text-3xl font-bold uppercase">Delivery details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("name", "Full name", { autoComplete: "name" })}
              {field("email", "Email", { type: "email", autoComplete: "email" })}
              {field("phone", "Mobile number", { inputMode: "numeric", maxLength: 10, autoComplete: "tel" })}
              {field("pin", "PIN code", { inputMode: "numeric", maxLength: 6, autoComplete: "postal-code" })}
              <div className="sm:col-span-2">{field("address", "Address", { autoComplete: "street-address" })}</div>
              {field("city", "City", { autoComplete: "address-level2" })}
            </div>
          </section>
          <section>
            <h2 className="mb-4 font-display text-3xl font-bold uppercase">Payment</h2>
            <div className="space-y-2">
              <label className={`flex cursor-pointer items-center gap-3 border p-4 ${pay === "cod" ? "border-lime" : "border-line"}`}>
                <input type="radio" name="pay" checked={pay === "cod"} onChange={() => setPay("cod")} className="accent-lime" />
                <span><b>Cash on Delivery</b><br /><span className="text-xs text-mute">Pay when your order arrives.</span></span>
              </label>
              <label className="flex cursor-not-allowed items-center gap-3 border border-line p-4 opacity-60">
                <input type="radio" name="pay" disabled className="accent-lime" />
                <span className="flex-1"><b>Online payment</b><br /><span className="text-xs text-mute">UPI, cards, net banking</span></span>
                <span className="bg-line px-2 py-0.5 text-xs">Coming soon</span>
              </label>
            </div>
          </section>
        </div>
        <aside className="h-fit border border-line bg-panel p-6">
          <h2 className="mb-4 font-display text-2xl font-bold uppercase">Order summary</h2>
          <ul className="mb-5 space-y-2 border-b border-line pb-4 text-sm">
            {t.lines.map((l) => (
              <li key={`${l.productId}${l.size}${l.color}`} className="flex justify-between gap-3"><span className="text-bone/80">{l.product.name} ({l.size}) × {l.qty}</span></li>
            ))}
          </ul>
          <OrderSummary />
          <button type="submit" className="btn-lime mt-6 w-full">Place demo order</button>
        </aside>
      </form>
    </div>
  );
}
