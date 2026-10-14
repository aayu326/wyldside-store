"use client";
import { Check, X } from "lucide-react";
import Crud from "@/components/admin/Crud";
import { Badge, PageHead, Panel, statusTone } from "@/components/admin/ui";
import { useStore } from "@/lib/store";
import type { Review } from "@/lib/types";

export default function Reviews() {
  const { state, set, toast } = useStore();
  const mark = (id: string, status: Review["status"]) => { set("reviews", (l) => l.map((r) => (r.id === id ? { ...r, status } : r))); toast(`Review ${status}`); };
  const pending = state.reviews.filter((r) => r.status === "pending").length;
  return (
    <>
      <PageHead title="Reviews" sub={`${pending} awaiting moderation. Only approved reviews appear on the storefront.`} />
      <Panel>
        <Crud<Review>
          noun="Review" items={state.reviews} onChange={(v) => set("reviews", v)} canAdd={false}
          blank={{ name: "", rating: 5, title: "", text: "", product: "", status: "pending" }}
          fields={[
            { key: "name", label: "Reviewer", required: true },
            { key: "rating", label: "Rating", type: "number", render: (r) => `${r.rating} / 5` },
            { key: "title", label: "Title", required: true },
            { key: "text", label: "Review", type: "textarea", render: (r) => <span className="line-clamp-2 max-w-xs">{r.text}</span> },
            { key: "product", label: "Product" },
            { key: "status", label: "Status", type: "select", options: ["pending", "approved", "rejected"].map((v) => ({ value: v, label: v })), render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
          ]}
          rowActions={(r) => (
            <>
              <button aria-label="Approve" disabled={r.status === "approved"} onClick={() => mark(r.id, "approved")} className="rounded p-1.5 text-emerald-500 hover:bg-emerald-500/10 disabled:opacity-30"><Check className="h-4 w-4" /></button>
              <button aria-label="Reject" disabled={r.status === "rejected"} onClick={() => mark(r.id, "rejected")} className="rounded p-1.5 text-amber-500 hover:bg-amber-500/10 disabled:opacity-30"><X className="h-4 w-4" /></button>
            </>
          )}
        />
      </Panel>
    </>
  );
}
