"use client";
import { useEffect, useState } from "react";
import { Field, PageHead, Panel, ainput, btnGhost, btnPrimary } from "@/components/admin/ui";
import { useStore } from "@/lib/store";
import type { Settings } from "@/lib/types";

export default function StoreSettings() {
  const { state, set, toast, ready } = useStore();
  const [s, setS] = useState<Settings>(state.settings);
  const [errs, setErrs] = useState<Record<string, string>>({});
  useEffect(() => { if (ready) setS(state.settings); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const txt = (k: keyof Settings, label: string, hint?: string) => (
    <Field label={label} hint={hint}><input className={ainput} value={String(s[k])} onChange={(e) => setS({ ...s, [k]: e.target.value })} />{errs[k] && <span className="mt-1 block text-xs text-red-500">{errs[k]}</span>}</Field>
  );
  const save = () => {
    const e: Record<string, string> = {};
    if (s.brandName.trim().length < 4) e.brandName = "Brand name needs at least 4 characters.";
    if (!/^\S+@\S+\.\S+$/.test(s.email)) e.email = "Enter a valid email.";
    if (!(Number(s.freeShipOver) >= 0)) e.freeShipOver = "Enter 0 or more.";
    if (!(Number(s.shipFee) >= 0)) e.shipFee = "Enter 0 or more.";
    setErrs(e);
    if (Object.keys(e).length) return toast("Fix the highlighted fields.", "err");
    set("settings", { ...s, freeShipOver: Number(s.freeShipOver), shipFee: Number(s.shipFee) });
    toast("Settings saved");
  };
  return (
    <>
      <PageHead title="Store settings" actions={<><button className={btnGhost} onClick={() => { setS(state.settings); setErrs({}); }}>Cancel</button><button className={btnPrimary} onClick={save}>Save settings</button></>} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Brand"><div className="space-y-4">{txt("brandName", "Store name", "First 4 letters are white, the rest lime.")}{txt("logoUrl", "Logo image URL", "Leave empty to use the text logo.")}</div></Panel>
        <Panel title="Contact"><div className="space-y-4">{txt("email", "Support email")}{txt("phone", "Phone")}{txt("address", "Address")}</div></Panel>
        <Panel title="Shipping"><div className="space-y-4">{txt("freeShipOver", "Free shipping above (₹)")}{txt("shipFee", "Flat shipping fee (₹)")}</div></Panel>
        <Panel title="Social links"><div className="space-y-4">{txt("instagram", "Instagram URL")}{txt("youtube", "YouTube URL")}{txt("x", "X URL")}</div></Panel>
      </div>
    </>
  );
}
