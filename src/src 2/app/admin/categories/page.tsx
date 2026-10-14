"use client";
import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Pencil, Plus, Trash2, X } from "lucide-react";
import Modal from "@/components/Modal";
import { Field, PageHead, Panel, ainput, btnGhost, btnPrimary } from "@/components/admin/ui";
import { useStore } from "@/lib/store";
import { slugify, uid } from "@/lib/utils";
import type { Category } from "@/lib/types";

export default function Categories() {
  const { state, set, confirm, toast } = useStore();
  const cats = state.categories;
  const [open, setOpen] = useState<string | null>(cats[0]?.id ?? null);
  const [edit, setEdit] = useState<{ cat: Category; isNew: boolean } | null>(null);
  const [subName, setSubName] = useState("");
  const setCats = (fn: (c: Category[]) => Category[]) => set("categories", fn);

  const taken = (slug: string, ignoreCat?: string, ignoreSub?: string) =>
    cats.some((c) => (c.id !== ignoreCat && c.slug === slug) || c.subs.some((s) => s.id !== ignoreSub && s.slug === slug));

  const saveCat = () => {
    if (!edit) return;
    const name = edit.cat.name.trim();
    const slug = slugify(name);
    if (name.length < 2) return toast("Enter a category name.", "err");
    if (taken(slug, edit.cat.id)) return toast("A category or subcategory with that name already exists.", "err");
    const next = { ...edit.cat, name, slug };
    setCats((l) => (edit.isNew ? [...l, next] : l.map((c) => (c.id === next.id ? next : c))));
    toast(edit.isNew ? "Category added" : "Category saved");
    setEdit(null);
  };
  const delCat = async (c: Category) => {
    const used = state.products.filter((p) => p.category === c.slug).length;
    if (await confirm(used ? `${c.name} has ${used} products. They will stay in the store but lose their category. Delete anyway?` : `Delete ${c.name}?`, "Delete")) {
      setCats((l) => l.filter((x) => x.id !== c.id));
      toast("Category deleted");
    }
  };
  const move = (id: string, d: number) => setCats((l) => { const i = l.findIndex((c) => c.id === id); const j = i + d; if (j < 0 || j >= l.length) return l; const n = [...l]; [n[i], n[j]] = [n[j], n[i]]; return n; });
  const addSub = (c: Category) => {
    const name = subName.trim(); const slug = slugify(name);
    if (!name) return toast("Enter a subcategory name.", "err");
    if (taken(slug)) return toast("That name is already used.", "err");
    setCats((l) => l.map((x) => (x.id === c.id ? { ...x, subs: [...x.subs, { id: uid("sub"), slug, name }] } : x)));
    setSubName("");
  };
  const moveSub = (c: Category, id: string, d: number) => setCats((l) => l.map((x) => { if (x.id !== c.id) return x; const i = x.subs.findIndex((s) => s.id === id); const j = i + d; if (j < 0 || j >= x.subs.length) return x; const n = [...x.subs]; [n[i], n[j]] = [n[j], n[i]]; return { ...x, subs: n }; }));

  return (
    <>
      <PageHead title="Categories" sub="Order here controls the storefront filters and footer. Header menu order is set under Navigation."
        actions={<button className={btnPrimary} onClick={() => setEdit({ isNew: true, cat: { id: uid("cat"), slug: "", name: "", image: "", subs: [] } })}><Plus className="h-4 w-4" /> Add category</button>} />
      <div className="space-y-3">
        {cats.map((c, i) => (
          <Panel key={c.id}>
            <div className="flex items-center gap-2">
              <button aria-expanded={open === c.id} aria-label={`Toggle ${c.name}`} onClick={() => setOpen(open === c.id ? null : c.id)} className="rounded p-1.5 hover:bg-a-raise"><ChevronDown className={`h-4 w-4 transition ${open === c.id ? "rotate-180" : ""}`} /></button>
              <div className="flex-1"><p className="font-medium">{c.name}</p><p className="text-xs text-a-mute">/{c.slug} · {c.subs.length} subcategories · {state.products.filter((p) => p.category === c.slug).length} products</p></div>
              <button aria-label="Move up" disabled={i === 0} onClick={() => move(c.id, -1)} className="rounded p-1.5 hover:bg-a-raise disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
              <button aria-label="Move down" disabled={i === cats.length - 1} onClick={() => move(c.id, 1)} className="rounded p-1.5 hover:bg-a-raise disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
              <button aria-label="Edit category" onClick={() => setEdit({ isNew: false, cat: { ...c } })} className="rounded p-1.5 hover:bg-a-raise"><Pencil className="h-4 w-4" /></button>
              <button aria-label="Delete category" onClick={() => delCat(c)} className="rounded p-1.5 text-red-500 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>
            </div>
            {open === c.id && (
              <div className="mt-4 border-t border-a-line pt-4">
                <ul className="flex flex-wrap gap-2">
                  {c.subs.map((s, k) => (
                    <li key={s.id} className="flex items-center gap-1 rounded border border-a-line px-2 py-1 text-sm">
                      <button aria-label={`Move ${s.name} earlier`} disabled={k === 0} onClick={() => moveSub(c, s.id, -1)} className="disabled:opacity-30"><ArrowUp className="h-3 w-3 -rotate-90" /></button>
                      {s.name}
                      <button aria-label={`Move ${s.name} later`} disabled={k === c.subs.length - 1} onClick={() => moveSub(c, s.id, 1)} className="disabled:opacity-30"><ArrowDown className="h-3 w-3 -rotate-90" /></button>
                      <button aria-label={`Remove ${s.name}`} className="ml-1 text-red-500" onClick={async () => { if (await confirm(`Remove subcategory ${s.name}?`, "Remove")) setCats((l) => l.map((x) => (x.id === c.id ? { ...x, subs: x.subs.filter((y) => y.id !== s.id) } : x))); }}><X className="h-3.5 w-3.5" /></button>
                    </li>
                  ))}
                </ul>
                <form className="mt-3 flex max-w-sm gap-2" onSubmit={(e) => { e.preventDefault(); addSub(c); }}>
                  <input className={ainput} placeholder="New subcategory" aria-label="New subcategory name" value={subName} onChange={(e) => setSubName(e.target.value)} />
                  <button className={btnGhost}>Add</button>
                </form>
              </div>
            )}
          </Panel>
        ))}
      </div>
      {edit && (
        <Modal themed title={edit.isNew ? "Add category" : "Edit category"} onClose={() => setEdit(null)}>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveCat(); }}>
            <Field label="Name *"><input className={ainput} autoFocus value={edit.cat.name} onChange={(e) => setEdit({ ...edit, cat: { ...edit.cat, name: e.target.value } })} /></Field>
            <Field label="Cover image URL" hint="Shown in the homepage category selector."><input className={ainput} value={edit.cat.image} onChange={(e) => setEdit({ ...edit, cat: { ...edit.cat, image: e.target.value } })} /></Field>
            <div className="flex justify-end gap-2"><button type="button" className={btnGhost} onClick={() => setEdit(null)}>Cancel</button><button className={btnPrimary}>Save</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
