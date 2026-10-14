"use client";
import { ArrowDown, ArrowUp } from "lucide-react";
import Crud from "@/components/admin/Crud";
import SafeImage from "@/components/SafeImage";
import { PageHead, Panel, Toggle } from "@/components/admin/ui";
import { useStore } from "@/lib/store";
import type { Slide } from "@/lib/types";

export default function HomepageManager() {
  const { state, set, toast } = useStore();
  const move = (i: number, d: number) => set("sections", (l) => { const j = i + d; if (j < 0 || j >= l.length) return l; const n = [...l]; [n[i], n[j]] = [n[j], n[i]]; return n; });

  return (
    <>
      <PageHead title="Homepage manager" sub="Changes appear on the storefront homepage immediately." />
      <div className="space-y-4">
        <Panel title="Hero slides">
          <Crud<Slide>
            noun="Slide" items={state.slides} onChange={(v) => set("slides", v)} reorder search={false}
            blank={{ title: "", sub: "", cta: "Shop now", href: "/shop", image: "", visible: true }}
            fields={[
              { key: "image", label: "Image", type: "text", required: true, hint: "Image URL (wide, 1800px recommended).", render: (r) => <SafeImage src={r.image} alt="" className="h-12 w-20 rounded" /> },
              { key: "title", label: "Headline", required: true },
              { key: "sub", label: "Subheading", type: "textarea", hideInList: true },
              { key: "cta", label: "Button label", required: true, hideInList: true },
              { key: "href", label: "Button link", required: true, hint: "For example /shop?cat=gaming" },
              { key: "visible", label: "Visible", type: "bool" },
            ]}
          />
        </Panel>
        <Panel title="Homepage sections" >
          <p className="mb-3 text-sm text-a-mute">Reorder or hide sections below the hero.</p>
          <ul className="divide-y divide-a-line rounded border border-a-line">
            {state.sections.map((s, i) => (
              <li key={s.id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
                <span className="flex-1">{s.label}</span>
                <button aria-label={`Move ${s.label} up`} disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1.5 hover:bg-a-raise disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                <button aria-label={`Move ${s.label} down`} disabled={i === state.sections.length - 1} onClick={() => move(i, 1)} className="rounded p-1.5 hover:bg-a-raise disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                <Toggle on={s.visible} label={`Show ${s.label}`} onChange={(v) => { set("sections", (l) => l.map((x) => (x.id === s.id ? { ...x, visible: v } : x))); toast(`${s.label} ${v ? "shown" : "hidden"}`); }} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
