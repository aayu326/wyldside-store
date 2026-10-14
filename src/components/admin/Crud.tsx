"use client";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Modal from "@/components/Modal";
import { useStore } from "@/lib/store";
import { uid } from "@/lib/utils";
import { Field, Table, Toggle, ainput, btnGhost, btnPrimary } from "./ui";

export type CrudField<T> = {
  key: keyof T & string;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "bool" | "email";
  options?: { value: string; label: string }[];
  required?: boolean;
  hint?: string;
  hideInList?: boolean;
  hideInForm?: boolean;
  render?: (row: T) => ReactNode;
};

export default function Crud<T extends { id: string }>({
  noun, items, onChange, fields, blank, reorder = false, canAdd = true, canEdit = true, search = true, rowActions,
}: {
  noun: string;
  items: T[];
  onChange: (next: T[]) => void;
  fields: CrudField<T>[];
  blank: Omit<T, "id">;
  reorder?: boolean;
  canAdd?: boolean;
  canEdit?: boolean;
  search?: boolean;
  rowActions?: (row: T) => ReactNode;
}) {
  const { confirm, toast } = useStore();
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<{ row: T; isNew: boolean } | null>(null);
  const [errs, setErrs] = useState<Record<string, string>>({});

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? items.filter((r) => fields.some((f) => String(r[f.key] ?? "").toLowerCase().includes(t))) : items;
  }, [items, q, fields]);

  const save = () => {
    if (!edit) return;
    const e: Record<string, string> = {};
    fields.forEach((f) => {
      const v = edit.row[f.key];
      if (f.required && (v === "" || v === undefined || v === null)) e[f.key] = `${f.label} is required.`;
      if (f.type === "email" && v && !/^\S+@\S+\.\S+$/.test(String(v))) e[f.key] = "Enter a valid email.";
      if (f.type === "number" && v !== "" && Number.isNaN(Number(v))) e[f.key] = "Enter a number.";
    });
    setErrs(e);
    if (Object.keys(e).length) return toast("Fix the highlighted fields.", "err");
    onChange(edit.isNew ? [...items, edit.row] : items.map((r) => (r.id === edit.row.id ? edit.row : r)));
    toast(`${noun} ${edit.isNew ? "added" : "saved"}`);
    setEdit(null);
  };

  const remove = async (r: T) => {
    if (await confirm(`Delete this ${noun.toLowerCase()}? This can’t be undone.`, "Delete")) {
      onChange(items.filter((x) => x.id !== r.id));
      toast(`${noun} deleted`);
    }
  };
  const move = (id: string, d: number) => {
    const i = items.findIndex((x) => x.id === id);
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };

  const listFields = fields.filter((f) => !f.hideInList);
  const cell = (r: T, f: CrudField<T>) => (f.render ? f.render(r) : f.type === "bool" ? <Toggle on={!!r[f.key]} onChange={(v) => onChange(items.map((x) => (x.id === r.id ? { ...x, [f.key]: v } : x)))} label={f.label} /> : String(r[f.key] ?? ""));

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        {search ? (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-a-mute" />
            <input className={`${ainput} pl-8`} placeholder={`Search ${noun.toLowerCase()}s`} aria-label={`Search ${noun}s`} value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        ) : <span />}
        {canAdd && <button className={btnPrimary} onClick={() => { setErrs({}); setEdit({ row: { ...blank, id: uid(noun.slice(0, 2).toLowerCase()) } as T, isNew: true }); }}><Plus className="h-4 w-4" /> Add {noun.toLowerCase()}</button>}
      </div>
      <Table head={[...listFields.map((f) => f.label), "Actions"]} empty={shown.length === 0 ? `No ${noun.toLowerCase()}s yet.` : undefined}>
        {shown.map((r) => (
          <tr key={r.id}>
            {listFields.map((f) => <td key={f.key}>{cell(r, f)}</td>)}
            <td>
              <div className="flex items-center gap-1">
                {rowActions?.(r)}
                {reorder && !q && <><button aria-label="Move up" className="rounded p-1.5 hover:bg-a-raise" onClick={() => move(r.id, -1)}><ArrowUp className="h-4 w-4" /></button><button aria-label="Move down" className="rounded p-1.5 hover:bg-a-raise" onClick={() => move(r.id, 1)}><ArrowDown className="h-4 w-4" /></button></>}
                {canEdit && <button aria-label={`Edit ${noun}`} className="rounded p-1.5 hover:bg-a-raise" onClick={() => { setErrs({}); setEdit({ row: { ...r }, isNew: false }); }}><Pencil className="h-4 w-4" /></button>}
                <button aria-label={`Delete ${noun}`} className="rounded p-1.5 text-red-500 hover:bg-red-500/10" onClick={() => remove(r)}><Trash2 className="h-4 w-4" /></button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {edit && (
        <Modal themed title={`${edit.isNew ? "Add" : "Edit"} ${noun.toLowerCase()}`} onClose={() => setEdit(null)}>
          <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-4" noValidate>
            {fields.filter((f) => !f.hideInForm).map((f) => {
              const v = edit.row[f.key];
              const set = (val: unknown) => setEdit({ ...edit, row: { ...edit.row, [f.key]: val } });
              return (
                <Field key={f.key} label={f.label + (f.required ? " *" : "")} hint={f.hint}>
                  {f.type === "textarea" ? <textarea className={`${ainput} min-h-24`} value={String(v ?? "")} onChange={(e) => set(e.target.value)} />
                    : f.type === "select" ? <select className={ainput} value={String(v ?? "")} onChange={(e) => set(e.target.value)}>{f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                    : f.type === "bool" ? <div className="pt-1"><Toggle on={!!v} onChange={set} label={f.label} /></div>
                    : <input className={ainput} type={f.type === "number" ? "number" : f.type === "email" ? "email" : "text"} value={String(v ?? "")} onChange={(e) => set(f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)} />}
                  {errs[f.key] && <span className="mt-1 block text-xs text-red-500">{errs[f.key]}</span>}
                </Field>
              );
            })}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={btnGhost} onClick={() => setEdit(null)}>Cancel</button>
              <button type="submit" className={btnPrimary}>Save</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
