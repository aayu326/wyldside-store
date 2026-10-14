"use client";
import Crud from "@/components/admin/Crud";
import SafeImage from "@/components/SafeImage";
import { Badge, PageHead, Panel } from "@/components/admin/ui";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/utils";
import type { Announcement, Coupon, Promo } from "@/lib/types";

export default function Coupons() {
  const { state, set } = useStore();
  return (
    <>
      <PageHead title="Coupons & marketing" sub="Coupons work in the demo cart. Banners and announcements show on the storefront." />
      <div className="space-y-4">
        <Panel title="Coupons">
          <Crud<Coupon>
            noun="Coupon" items={state.coupons} onChange={(v) => set("coupons", v.map((c) => ({ ...c, code: c.code.trim().toUpperCase() })))}
            blank={{ code: "", type: "percent", value: 10, minOrder: 0, active: true }}
            fields={[
              { key: "code", label: "Code", required: true },
              { key: "type", label: "Type", type: "select", options: [{ value: "percent", label: "Percent off" }, { value: "flat", label: "Flat ₹ off" }] },
              { key: "value", label: "Value", type: "number", required: true, render: (r) => (r.type === "percent" ? `${r.value}%` : inr(r.value)) },
              { key: "minOrder", label: "Minimum order (₹)", type: "number", render: (r) => (r.minOrder ? inr(r.minOrder) : <Badge>None</Badge>) },
              { key: "active", label: "Active", type: "bool" },
            ]}
          />
        </Panel>
        <Panel title="Promotional banners (homepage)">
          <Crud<Promo>
            noun="Banner" items={state.promos} onChange={(v) => set("promos", v)} reorder search={false}
            blank={{ title: "", text: "", href: "/shop", image: "", visible: true }}
            fields={[
              { key: "image", label: "Image", required: true, hint: "Image URL.", render: (r) => <SafeImage src={r.image} alt="" className="h-12 w-20 rounded" /> },
              { key: "title", label: "Headline", required: true },
              { key: "text", label: "Supporting text", hideInList: true },
              { key: "href", label: "Link", required: true },
              { key: "visible", label: "Visible", type: "bool" },
            ]}
          />
        </Panel>
        <Panel title="Announcement bar messages">
          <Crud<Announcement>
            noun="Message" items={state.announcements} onChange={(v) => set("announcements", v)} reorder search={false}
            blank={{ text: "", visible: true }}
            fields={[{ key: "text", label: "Message", required: true }, { key: "visible", label: "Visible", type: "bool" }]}
          />
        </Panel>
      </div>
    </>
  );
}
