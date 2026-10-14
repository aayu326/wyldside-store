"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import { Field, PageHead, Panel, Toggle, ainput, btnGhost, btnPrimary } from "@/components/admin/ui";
import { useStore } from "@/lib/store";
import { slugify, uid } from "@/lib/utils";
import type { Product } from "@/lib/types";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "40"];

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { state, set, toast, ready } = useStore();
  const isNew = id === "new";
  const existing = state.products.find((p) => p.id === id);
  const [p, setP] = useState<Product | null>(null);
  const [imgs, setImgs] = useState("");
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [newColor, setNewColor] = useState({ name: "", hex: "#C6FF00" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const base: Product = isNew
      ? { id: uid("p"), slug: "", name: "", category: state.categories[0]?.slug ?? "", sub: state.categories[0]?.subs[0]?.slug ?? "", mrp: 0, price: 0, images: [], sizes: ["S", "M", "L", "XL"], colors: [{ name: "Jet Black", hex: "#111111" }], sku: "", stock: 0, description: "", fabric: "100% cotton", care: "Machine wash cold. Do not bleach.", isNew: true, bestSeller: false, trending: false, visible: true, createdAt: Date.now() }
      : existing ?? (null as unknown as Product);
    setP(base);
    setLoaded(true);
    setImgs(base?.images.join("\n") ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, id]);

  if (!ready || !loaded) return <p className="text-sm text-a-mute">Loading…</p>;
  if (!p) return <div><p className="text-sm">Product not found.</p><Link href="/admin/products" className="text-sm underline">Back to products</Link></div>;

  const up = (patch: Partial<Product>) => setP({ ...p, ...patch });
  const subs = state.categories.find((c) => c.slug === p.category)?.subs ?? [];
  const imageList = imgs.split("\n").map((s) => s.trim()).filter(Boolean);

  const save = () => {
    const e: Record<string, string> = {};
    if (p.name.trim().length < 3) e.name = "Enter a product name (3+ characters).";
    if (!p.sku.trim()) e.sku = "SKU is required.";
    else if (state.products.some((x) => x.sku === p.sku.trim() && x.id !== p.id)) e.sku = "This SKU is already used.";
    if (!(p.mrp > 0)) e.mrp = "MRP must be above 0.";
    if (!(p.price > 0)) e.price = "Selling price must be above 0.";
    else if (p.price > p.mrp) e.price = "Selling price can’t exceed MRP.";
    if (!(p.stock >= 0)) e.stock = "Stock can’t be negative.";
    if (!p.sizes.length) e.sizes = "Choose at least one size.";
    if (!p.colors.length) e.colors = "Add at least one colour.";
    if (!imageList.length) e.images = "Add at least one image URL.";
    setErrs(e);
    if (Object.keys(e).length) return toast("Fix the highlighted fields.", "err");
    const final: Product = { ...p, name: p.name.trim(), sku: p.sku.trim(), images: imageList, slug: isNew || !p.slug ? slugify(`${p.name}-${p.id.slice(-4)}`) : p.slug };
    set("products", (l) => (isNew ? [final, ...l] : l.map((x) => (x.id === final.id ? final : x))));
    toast(isNew ? "Product created" : "Product saved");
    router.push("/admin/products");
  };

  const err = (k: string) => errs[k] && <span className="mt-1 block text-xs text-red-500">{errs[k]}</span>;
  const num = (v: number) => (Number.isFinite(v) ? v : "");

  return (
    <>
      <PageHead title={isNew ? "Add product" : "Edit product"} sub={isNew ? undefined : p.sku}
        actions={<><Link href="/admin/products" className={btnGhost}>Cancel</Link><button onClick={save} className={btnPrimary}>Save product</button></>} />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Panel title="Basics">
            <div className="space-y-4">
              <Field label="Name *"><input className={ainput} value={p.name} onChange={(e) => up({ name: e.target.value })} />{err("name")}</Field>
              <Field label="Description"><textarea className={`${ainput} min-h-28`} value={p.description} onChange={(e) => up({ description: e.target.value })} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Fabric"><input className={ainput} value={p.fabric} onChange={(e) => up({ fabric: e.target.value })} /></Field>
                <Field label="Care"><input className={ainput} value={p.care} onChange={(e) => up({ care: e.target.value })} /></Field>
              </div>
            </div>
          </Panel>
          <Panel title="Images">
            <Field label="Image URLs *" hint="One per line. The first image is the main photo."><textarea className={`${ainput} min-h-24 font-mono text-xs`} value={imgs} onChange={(e) => setImgs(e.target.value)} />{err("images")}</Field>
            <div className="mt-3 flex flex-wrap gap-2">{imageList.map((u, i) => <SafeImage key={i} src={u} alt="" className="h-24 w-20 rounded" />)}</div>
          </Panel>
          <Panel title="Sizes & colours">
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold">Sizes *</p>
                <div className="flex flex-wrap gap-1.5">{SIZES.map((s) => { const on = p.sizes.includes(s); return <button type="button" key={s} aria-pressed={on} onClick={() => up({ sizes: on ? p.sizes.filter((x) => x !== s) : [...p.sizes, s] })} className={`min-w-10 rounded border px-2 py-1 text-xs ${on ? "border-lime bg-lime text-ink" : "border-a-line"}`}>{s}</button>; })}</div>
                {err("sizes")}
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold">Colours *</p>
                <div className="flex flex-wrap gap-2">{p.colors.map((c) => <span key={c.name} className="flex items-center gap-2 rounded border border-a-line px-2 py-1 text-xs"><span className="h-3.5 w-3.5 rounded-full border border-a-line" style={{ background: c.hex }} />{c.name}<button type="button" aria-label={`Remove ${c.name}`} onClick={() => up({ colors: p.colors.filter((x) => x.name !== c.name) })}><X className="h-3 w-3" /></button></span>)}</div>
                {err("colors")}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <input className={`${ainput} w-40`} placeholder="Colour name" aria-label="Colour name" value={newColor.name} onChange={(e) => setNewColor({ ...newColor, name: e.target.value })} />
                  <input type="color" aria-label="Colour value" value={newColor.hex} onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })} className="h-9 w-12 rounded border border-a-line bg-transparent" />
                  <button type="button" className={btnGhost} onClick={() => { const n = newColor.name.trim(); if (!n || p.colors.some((c) => c.name.toLowerCase() === n.toLowerCase())) return toast("Enter a unique colour name.", "err"); up({ colors: [...p.colors, { name: n, hex: newColor.hex }] }); setNewColor({ name: "", hex: "#C6FF00" }); }}><Plus className="h-4 w-4" /> Add colour</button>
                </div>
              </div>
            </div>
          </Panel>
        </div>
        <div className="space-y-4">
          <Panel title="Pricing & inventory">
            <div className="space-y-4">
              <Field label="MRP (₹) *"><input type="number" min={0} className={ainput} value={num(p.mrp)} onChange={(e) => up({ mrp: Number(e.target.value) })} />{err("mrp")}</Field>
              <Field label="Selling price (₹) *"><input type="number" min={0} className={ainput} value={num(p.price)} onChange={(e) => up({ price: Number(e.target.value) })} />{err("price")}</Field>
              <Field label="SKU *"><input className={ainput} value={p.sku} onChange={(e) => up({ sku: e.target.value })} />{err("sku")}</Field>
              <Field label="Stock *"><input type="number" min={0} className={ainput} value={num(p.stock)} onChange={(e) => up({ stock: Number(e.target.value) })} />{err("stock")}</Field>
            </div>
          </Panel>
          <Panel title="Organisation">
            <div className="space-y-4">
              <Field label="Category"><select className={ainput} value={p.category} onChange={(e) => up({ category: e.target.value, sub: state.categories.find((c) => c.slug === e.target.value)?.subs[0]?.slug ?? "" })}>{state.categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select></Field>
              <Field label="Subcategory"><select className={ainput} value={p.sub} onChange={(e) => up({ sub: e.target.value })}>{subs.map((s) => <option key={s.id} value={s.slug}>{s.name}</option>)}</select></Field>
              {([["isNew", "Mark as New"], ["bestSeller", "Best seller"], ["trending", "Trending"], ["visible", "Visible in store"]] as const).map(([k, l]) => (
                <div key={k} className="flex items-center justify-between text-sm">{l}<Toggle on={p[k]} onChange={(v) => up({ [k]: v } as Partial<Product>)} label={l} /></div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
