"use client";
import { Download } from "lucide-react";
import Crud from "@/components/admin/Crud";
import { PageHead, Panel, btnGhost } from "@/components/admin/ui";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/utils";
import type { Subscriber } from "@/lib/types";

export default function Subscribers() {
  const { state, set, toast } = useStore();
  const exportCsv = () => {
    const csv = "email,subscribed\n" + state.subscribers.map((s) => `${s.email},${s.date}`).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "wyldside-subscribers.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("CSV downloaded");
  };
  return (
    <>
      <PageHead title="Newsletter subscribers" sub={`${state.subscribers.length} subscribers`} actions={<button className={btnGhost} onClick={exportCsv}><Download className="h-4 w-4" /> Export CSV</button>} />
      <Panel>
        <Crud<Subscriber>
          noun="Subscriber" items={state.subscribers} onChange={(v) => set("subscribers", v)}
          blank={{ email: "", date: new Date().toISOString() }}
          fields={[{ key: "email", label: "Email", type: "email", required: true }, { key: "date", label: "Subscribed", hideInForm: true, render: (r) => fmtDate(r.date) }]}
        />
      </Panel>
    </>
  );
}
