"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductGrid from "./ProductGrid";
import { useStore } from "@/lib/store";
import { discountPct } from "@/lib/utils";

const PAGE = 12;
const SORTS: [string, string][] = [["featured", "Featured"], ["newest", "Newest"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"], ["discount", "Biggest discount"]];

export default function Listing({ mode }: { mode: "shop" | "search" }) {
  const { state, ready } = useStore();
  const params = useSearchParams();
  const router = useRouter();
  const key = params.toString();
  const cat = params.get("cat") ?? "";

  const [q, setQ] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "featured");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [panel, setPanel] = useState(false);

  useEffect(() => {
    setQ(params.get("q") ?? "");
    setSort(params.get("sort") ?? "featured");
    setShown(PAGE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const visible = useMemo(() => state.products.filter((p) => p.visible), [state.products]);
  const allSizes = useMemo(() => Array.from(new Set(visible.flatMap((p) => p.sizes))), [visible]);
  const allColors = useMemo(() => {
    const m = new Map<string, string>();
    visible.forEach((p) => p.colors.forEach((c) => m.set(c.name, c.hex)));
    return Array.from(m.entries());
  }, [visible]);

  const activeCat = state.categories.find((c) => c.slug === cat);
  const activeSub = state.categories.flatMap((c) => c.subs).find((s) => s.slug === cat);
  const title = mode === "search" ? `Results for “${params.get("q") ?? ""}”` : activeCat?.name ?? activeSub?.name ?? (params.get("sort") === "discount" ? "Sale" : "All products");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const lo = min ? Number(min) : 0;
    const hi = max ? Number(max) : Infinity;
    let out = visible.filter((p) => {
      if (cat && p.category !== cat && p.sub !== cat) return false;
      if (term) {
        const c = state.categories.find((x) => x.slug === p.category);
        const s = c?.subs.find((x) => x.slug === p.sub);
        if (![p.name, p.sku, c?.name, s?.name].some((t) => t?.toLowerCase().includes(term))) return false;
      }
      if (sizes.length && !p.sizes.some((s) => sizes.includes(s))) return false;
      if (colors.length && !p.colors.some((c) => colors.includes(c.name))) return false;
      return p.price >= lo && p.price <= hi;
    });
    if (sort === "newest") out = [...out].sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "price-asc") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "discount") out = [...out].sort((a, b) => discountPct(b) - discountPct(a));
    return out;
  }, [visible, cat, q, sizes, colors, min, max, sort, state.categories]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const go = (slug: string) => router.push(slug ? `/shop?cat=${slug}` : "/shop");
  const clear = () => { setSizes([]); setColors([]); setMin(""); setMax(""); setQ(""); };
  const hasFilters = sizes.length || colors.length || min || max || q;

  const chip = (on: boolean) => `min-w-10 border px-2.5 py-1.5 text-xs ${on ? "border-lime bg-lime text-ink" : "border-line hover:border-bone"}`;
  const panelBody = (
    <div className="space-y-7">
      <div>
        <h3 className="mb-2 font-display text-xl font-bold uppercase">Category</h3>
        <ul className="space-y-0.5 text-sm">
          <li><button onClick={() => go("")} className={`py-1 ${!cat ? "font-bold text-lime" : "text-bone/75 hover:text-lime"}`}>All products</button></li>
          {state.categories.map((c) => (
            <li key={c.id}>
              <button onClick={() => go(c.slug)} className={`py-1 ${cat === c.slug ? "font-bold text-lime" : "text-bone/75 hover:text-lime"}`}>{c.name}</button>
              {(cat === c.slug || c.subs.some((s) => s.slug === cat)) && (
                <ul className="ml-3 border-l border-line pl-3">
                  {c.subs.map((s) => (
                    <li key={s.id}><button onClick={() => go(s.slug)} className={`py-0.5 text-[13px] ${cat === s.slug ? "font-bold text-lime" : "text-bone/60 hover:text-lime"}`}>{s.name}</button></li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-2 font-display text-xl font-bold uppercase">Size</h3>
        <div className="flex flex-wrap gap-1.5">{allSizes.map((s) => <button key={s} aria-pressed={sizes.includes(s)} onClick={() => toggle(sizes, setSizes, s)} className={chip(sizes.includes(s))}>{s}</button>)}</div>
      </div>
      <div>
        <h3 className="mb-2 font-display text-xl font-bold uppercase">Colour</h3>
        <div className="flex flex-wrap gap-2">
          {allColors.map(([n, hex]) => (
            <button key={n} title={n} aria-label={n} aria-pressed={colors.includes(n)} onClick={() => toggle(colors, setColors, n)} style={{ background: hex }} className={`h-7 w-7 rounded-full border-2 ${colors.includes(n) ? "border-lime ring-2 ring-lime/40" : "border-line"}`} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-display text-xl font-bold uppercase">Price (₹)</h3>
        <div className="flex items-center gap-2">
          <input value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))} placeholder="Min" inputMode="numeric" aria-label="Minimum price" className="input" />
          <span className="text-mute">to</span>
          <input value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))} placeholder="Max" inputMode="numeric" aria-label="Maximum price" className="input" />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[["Under 999", "", "999"], ["1,000–1,999", "1000", "1999"], ["2,000+", "2000", ""]].map(([l, a, b]) => (
            <button key={l} onClick={() => { setMin(a); setMax(b); }} className="border border-line px-2 py-1 text-xs hover:border-lime">{l}</button>
          ))}
        </div>
      </div>
      {hasFilters ? <button onClick={clear} className="text-sm text-lime underline">Clear all filters</button> : null}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-mute">
        <Link href="/" className="hover:text-lime">Home</Link> / <Link href="/shop" className="hover:text-lime">Shop</Link>
        {activeCat && <> / <span className="text-bone">{activeCat.name}</span></>}
        {activeSub && <> / <span className="text-bone">{activeSub.name}</span></>}
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <h1 className="h-display text-5xl sm:text-7xl">{title}</h1>
          <p className="mt-2 text-sm text-mute">{ready ? `${list.length} products` : "Loading…"}</p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE); }} placeholder="Filter results" aria-label="Search within results" className="input pl-9" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products" className="input w-auto">
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <button onClick={() => setPanel(true)} className="input flex w-auto items-center gap-2 lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block">{panelBody}</aside>
        <div>
          {list.length === 0 ? (
            <div className="py-20 text-center">
              <p className="h-display text-4xl">Nothing matches</p>
              <p className="mt-2 text-sm text-bone/70">Try removing a filter or searching for something broader.</p>
              <button onClick={clear} className="btn-lime mt-6">Clear filters</button>
            </div>
          ) : (
            <>
              <ProductGrid items={list.slice(0, shown)} sidebar />
              {shown < list.length && (
                <div className="mt-12 text-center">
                  <button onClick={() => setShown((s) => s + PAGE)} className="btn-ghost">Load more ({list.length - shown} left)</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {panel && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-black/70" onClick={() => setPanel(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-ink">
            <div className="flex items-center justify-between border-b border-line p-4">
              <h2 className="font-display text-2xl font-bold uppercase">Filters</h2>
              <button aria-label="Close filters" onClick={() => setPanel(false)}><X className="h-6 w-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{panelBody}</div>
            <div className="border-t border-line p-4"><button onClick={() => setPanel(false)} className="btn-lime w-full">Show {list.length} products</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
