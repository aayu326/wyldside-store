"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Heart, Ruler, Truck } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import ProductGrid from "@/components/ProductGrid";
import Modal from "@/components/Modal";
import { useStore } from "@/lib/store";
import { SIZE_CHART } from "@/lib/data";
import { discountPct, inr } from "@/lib/utils";

function Acc({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [o, setO] = useState(open);
  return (
    <div className="border-b border-line">
      <button onClick={() => setO(!o)} aria-expanded={o} className="flex w-full items-center justify-between py-4 font-display text-xl font-bold uppercase">
        {title}
        <ChevronDown className={`h-5 w-5 transition ${o ? "rotate-180" : ""}`} />
      </button>
      {o && <div className="pb-5 text-sm leading-relaxed text-bone/75">{children}</div>}
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { state, ready, addToCart, toggleWish, toast } = useStore();
  const p = state.products.find((x) => x.slug === slug);
  const [img, setImg] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [chart, setChart] = useState(false);

  useEffect(() => {
    setImg(0);
    setSize("");
    setColor(p?.colors[0]?.name ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p?.id]);

  if (!p) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="h-display text-6xl">{ready ? "Product not found" : "Loading…"}</h1>
        {ready && <><p className="mt-3 text-bone/70">It may have been removed from the store.</p><Link href="/shop" className="btn-lime mt-8">Back to shop</Link></>}
      </div>
    );
  }

  const off = discountPct(p);
  const sold = p.stock <= 0;
  const wished = state.wishlist.includes(p.id);
  const related = state.products.filter((x) => x.visible && x.id !== p.id && (x.sub === p.sub || x.category === p.category)).slice(0, 4);
  const cat = state.categories.find((c) => c.slug === p.category);

  const add = (buy: boolean) => {
    if (!size) return toast("Choose a size first.", "err");
    if (addToCart(p.id, size, color || p.colors[0]?.name || "Default") && buy) router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-5 text-xs text-mute">
        <Link href="/" className="hover:text-lime">Home</Link> / <Link href={`/shop?cat=${p.category}`} className="hover:text-lime">{cat?.name}</Link> / <span className="text-bone">{p.name}</span>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <div className="grid gap-3 sm:grid-cols-[80px_1fr]">
          <div className="order-2 flex gap-2 sm:order-1 sm:flex-col">
            {p.images.map((src, k) => (
              <button key={k} onClick={() => setImg(k)} aria-label={`View image ${k + 1}`} aria-current={k === img} className={`w-20 shrink-0 border-2 ${k === img ? "border-lime" : "border-transparent opacity-70 hover:opacity-100"}`}>
                <SafeImage src={src} alt="" className="aspect-[3/4]" />
              </button>
            ))}
          </div>
          <div className="order-1 sm:order-2"><SafeImage src={p.images[img]} alt={p.name} eager className="aspect-[4/5] w-full" /></div>
        </div>

        <div className="lg:sticky lg:top-40 lg:self-start">
          <div className="flex gap-2">
            {sold && <span className="bg-bone px-2 py-0.5 text-xs font-bold text-ink">SOLD OUT</span>}
            {!sold && p.isNew && <span className="bg-lime px-2 py-0.5 text-xs font-bold text-ink">NEW</span>}
            {!sold && off > 0 && <span className="bg-red-600 px-2 py-0.5 text-xs font-bold">SALE</span>}
          </div>
          <h1 className="h-display mt-3 text-5xl sm:text-6xl">{p.name}</h1>
          <p className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold">{inr(p.price)}</span>
            {off > 0 && <><span className="text-lg text-mute line-through">MRP {inr(p.mrp)}</span><span className="font-semibold text-lime">{off}% off</span></>}
          </p>
          <p className="mt-1 text-xs text-mute">Inclusive of all taxes. SKU {p.sku}</p>

          <fieldset className="mt-7">
            <legend className="mb-2 text-sm font-semibold">Colour: <span className="font-normal text-bone/70">{color}</span></legend>
            <div className="flex gap-2">
              {p.colors.map((c) => (
                <button key={c.name} onClick={() => setColor(c.name)} aria-label={c.name} aria-pressed={color === c.name} title={c.name} style={{ background: c.hex }} className={`h-9 w-9 rounded-full border-2 ${color === c.name ? "border-lime ring-2 ring-lime/40" : "border-line"}`} />
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <legend className="text-sm font-semibold">Size</legend>
              <button onClick={() => setChart(true)} className="flex items-center gap-1 text-xs text-lime underline"><Ruler className="h-3.5 w-3.5" /> Size chart</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {p.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} aria-pressed={size === s} className={`min-w-12 border px-3 py-2.5 text-sm font-medium ${size === s ? "border-lime bg-lime text-ink" : "border-line hover:border-bone"}`}>{s}</button>
              ))}
            </div>
          </fieldset>

          <div className="mt-7 grid grid-cols-[1fr_auto] gap-2">
            <button disabled={sold} onClick={() => add(false)} className="btn-lime">{sold ? "Sold out" : "Add to cart"}</button>
            <button onClick={() => toggleWish(p.id)} aria-pressed={wished} aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} className="grid w-14 place-items-center border border-line hover:border-lime"><Heart className={`h-5 w-5 ${wished ? "fill-lime text-lime" : ""}`} /></button>
            <button disabled={sold} onClick={() => add(true)} className="btn-ghost col-span-2">Buy now</button>
          </div>
          {!sold && p.stock <= 10 && <p className="mt-3 text-sm text-lime">Only {p.stock} left in stock.</p>}
          <p className="mt-4 flex items-center gap-2 text-xs text-bone/70"><Truck className="h-4 w-4" /> Cash on Delivery available. Free shipping above {inr(state.settings.freeShipOver)}.</p>

          <div className="mt-8 border-t border-line">
            <Acc title="Description" open>{p.description}</Acc>
            <Acc title="Fabric & care"><p><b className="text-bone">Fabric:</b> {p.fabric}</p><p className="mt-2"><b className="text-bone">Care:</b> {p.care}</p></Acc>
            <Acc title="Shipping & returns">
              <p>Orders ship within 48 hours and arrive in 3–7 business days. Shipping is {inr(state.settings.shipFee)} below {inr(state.settings.freeShipOver)}.</p>
              <p className="mt-2">Easy 7-day returns on unworn items with tags. <Link href="/shipping-returns" className="text-lime underline">Full policy</Link></p>
            </Acc>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="h-display mb-6 text-4xl sm:text-5xl">You may also like</h2>
          <ProductGrid items={related} />
        </section>
      )}

      {chart && (
        <Modal title="Size chart" onClose={() => setChart(false)}>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-line text-left text-mute"><th className="py-2">Size</th><th>Chest (in)</th><th>Length (in)</th><th>Hip (in)</th></tr></thead>
            <tbody>{SIZE_CHART.map((r) => <tr key={r[0]} className="border-b border-line/60">{r.map((c, k) => <td key={k} className={`py-2 ${k === 0 ? "font-bold" : ""}`}>{c}</td>)}</tr>)}</tbody>
          </table>
          <p className="mt-4 text-xs text-mute">Measurements are of the garment, in inches. Between sizes? Size up for a relaxed fit.</p>
        </Modal>
      )}
    </div>
  );
}
