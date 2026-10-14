"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { fmtDate, inr } from "@/lib/utils";

export default function Account() {
  const { state, set, toast } = useStore();
  const [f, setF] = useState({ name: "", email: "" });
  const [tab, setTab] = useState<"orders" | "profile">("orders");
  const u = state.user;

  if (!u) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="h-display text-6xl">Sign in</h1>
        <p className="mt-3 text-sm text-mute">Demo only. There is no real authentication. Enter any name and email to preview the account area.</p>
        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (f.name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(f.email)) return toast("Enter your name and a valid email.", "err");
            set("user", { name: f.name.trim(), email: f.email.trim().toLowerCase() });
          }}
        >
          <input className="input" placeholder="Name" aria-label="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input className="input" type="email" placeholder="Email" aria-label="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <button className="btn-lime w-full">Continue</button>
        </form>
      </div>
    );
  }

  const mine = state.orders.filter((o) => o.email === u.email);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="h-display text-5xl sm:text-6xl">Hi, {u.name.split(" ")[0]}</h1>
        <button onClick={() => set("user", null)} className="text-sm text-mute underline hover:text-lime">Sign out</button>
      </div>
      <div className="mt-8 flex gap-6 border-b border-line">
        {(["orders", "profile"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 pb-3 font-display text-xl font-bold uppercase ${tab === t ? "border-lime text-lime" : "border-transparent text-bone/60"}`}>{t === "orders" ? "Orders" : "Profile"}</button>
        ))}
      </div>
      {tab === "orders" ? (
        mine.length === 0 ? (
          <div className="py-14 text-center"><p className="text-bone/70">No orders yet for {u.email}.</p><Link href="/shop" className="btn-lime mt-5">Shop now</Link></div>
        ) : (
          <ul className="mt-6 space-y-3">
            {mine.map((o) => (
              <li key={o.id} className="border border-line bg-panel p-5">
                <div className="flex flex-wrap justify-between gap-2 text-sm"><b>{o.number}</b><span className="text-lime">{o.status}</span></div>
                <p className="mt-1 text-xs text-mute">{fmtDate(o.date)} · {o.items.length} item(s) · {inr(o.total)}</p>
              </li>
            ))}
          </ul>
        )
      ) : (
        <dl className="mt-6 grid max-w-md gap-3 text-sm">
          <div><dt className="text-mute">Name</dt><dd>{u.name}</dd></div>
          <div><dt className="text-mute">Email</dt><dd>{u.email}</dd></div>
          <div><dt className="text-mute">Wishlist</dt><dd><Link href="/wishlist" className="text-lime underline">{state.wishlist.length} saved item(s)</Link></dd></div>
        </dl>
      )}
    </div>
  );
}
