"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Copy, Pencil, Plus, Search, Trash2 } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import { Badge, PageHead, Panel, Table, Toggle, ainput, btnPrimary } from "@/components/admin/ui";
import { useStore } from "@/lib/store";
import { inr, slugify, uid } from "@/lib/utils";

export default function Products() {
  const { state, set, confirm, toast } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [status, setStatus] = useState("");

  const list = useMemo(() => state.products.filter((p) => {
    const t = q.trim().toLowerCase();
    if (t && !`${p.name} ${p.sku}`.toLowerCase().includes(t)) return false;
    if (cat && p.category !== cat) return false;
    if (status === "live" && !p.visible) return false;
    if (status === "hidden" && p.visible) return false;
    if (status === "low" && p.stock > 10) return false;
    return true;
  }), [state.products, q, cat, status]);

  const dup = (id: string) => {
    const p = state.products.find((x) => x.id === id);
    if (!p) return;
    const nid = uid("p");
    set("products", (l) => [{ ...p, id: nid, name: `${p.name} (copy)`, slug: slugify(`${p.name}-copy-${nid}`), sku: `${p.sku}-C`, visible: false, createdAt: Date.now() }, ...l]);
    toast("Duplicated as a hidden draft");
  };
  const del = async (id: string) => {
    if (await confirm("Delete this product? It will disappear from the storefront.", "Delete")) {
      set("products", (l) => l.filter((p) => p.id !== id));
      set("cart", (c) => c.filter((l) => l.productId !== id));
      set("wishlist", (w) => w.filter((x) => x !== id));
      toast("Product deleted");
    }
  };

  return (
    <>
      <PageHead title="Products" sub={`${state.products.length} products`} actions={<Link href="/admin/products/new" className={btnPrimary}><Plus className="h-4 w-4" /> Add product</Link>} />
      <Panel>
        <div className="mb-3 flex flex-wrap gap-2">
          <div className="relative w-full sm:w-64"><Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-a-mute" /><input className={`${ainput} pl-8`} placeholder="Search name or SKU" aria-label="Search products" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <select className={`${ainput} w-auto`} aria-label="Filter by category" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{state.categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select>
          <select className={`${ainput} w-auto`} aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option><option value="live">Visible</option><option value="hidden">Hidden</option><option value="low">Low stock</option></select>
        </div>
        <Table head={["Product", "SKU", "Category", "Price", "Stock", "Visible", "Actions"]} empty={list.length === 0 ? "No products match these filters." : undefined}>
          {list.map((p) => (
            <tr key={p.id}>
              <td><div className="flex items-center gap-3"><SafeImage src={p.images[0]} alt="" className="h-12 w-10 shrink-0 rounded" /><Link href={`/admin/products/${p.id}`} className="max-w-[220px] truncate font-medium hover:underline">{p.name}</Link></div></td>
              <td className="text-a-mute">{p.sku}</td>
              <td className="text-a-mute">{state.categories.find((c) => c.slug === p.category)?.name}</td>
              <td className="tabular-nums">{inr(p.price)}{p.mrp > p.price && <span className="ml-1 text-xs text-a-mute line-through">{inr(p.mrp)}</span>}</td>
              <td><Badge tone={p.stock === 0 ? "red" : p.stock <= 10 ? "amber" : "green"}>{p.stock}</Badge></td>
              <td><Toggle on={p.visible} label={`Show ${p.name}`} onChange={(v) => set("products", (l) => l.map((x) => (x.id === p.id ? { ...x, visible: v } : x)))} /></td>
              <td><div className="flex gap-1">
                <Link href={`/admin/products/${p.id}`} aria-label="Edit" className="rounded p-1.5 hover:bg-a-raise"><Pencil className="h-4 w-4" /></Link>
                <button aria-label="Duplicate" onClick={() => dup(p.id)} className="rounded p-1.5 hover:bg-a-raise"><Copy className="h-4 w-4" /></button>
                <button aria-label="Delete" onClick={() => del(p.id)} className="rounded p-1.5 text-red-500 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>
              </div></td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}
