"use client";
import { useState } from "react";
import { Eye } from "lucide-react";
import Crud from "@/components/admin/Crud";
import Modal from "@/components/Modal";
import { Badge, PageHead, Panel, Table, btnGhost, statusTone } from "@/components/admin/ui";
import { useStore } from "@/lib/store";
import { fmtDate, inr } from "@/lib/utils";
import type { Customer } from "@/lib/types";

export default function Customers() {
  const { state, set } = useStore();
  const [view, setView] = useState<Customer | null>(null);
  const orders = view ? state.orders.filter((o) => o.email === view.email) : [];
  const spent = orders.filter((o) => o.status !== "Cancelled").reduce((a, o) => a + o.total, 0);

  return (
    <>
      <PageHead title="Customers" sub={`${state.customers.length} customers. New checkouts add customers automatically.`} />
      <Panel>
        <Crud<Customer>
          noun="Customer" items={state.customers} onChange={(v) => set("customers", v)}
          blank={{ name: "", email: "", phone: "", city: "", joined: new Date().toISOString() }}
          fields={[
            { key: "name", label: "Name", required: true },
            { key: "email", label: "Email", type: "email", required: true },
            { key: "phone", label: "Phone" },
            { key: "city", label: "City" },
            { key: "joined", label: "Joined", hideInForm: true, render: (r) => fmtDate(r.joined) },
          ]}
          rowActions={(r) => <button aria-label="View profile" className="rounded p-1.5 hover:bg-a-raise" onClick={() => setView(r)}><Eye className="h-4 w-4" /></button>}
        />
      </Panel>
      {view && (
        <Modal themed wide title="Customer profile" onClose={() => setView(null)}>
          <div className="grid gap-4 text-sm sm:grid-cols-3">
            <div><p className="text-xs text-a-mute">Name</p><p className="font-medium">{view.name}</p></div>
            <div><p className="text-xs text-a-mute">Contact</p><p>{view.email}</p><p className="text-a-mute">{view.phone}</p></div>
            <div><p className="text-xs text-a-mute">Lifetime spend</p><p className="font-medium">{inr(spent)} <span className="text-a-mute">({orders.length} orders)</span></p></div>
          </div>
          <div className="mt-4">
            <Table head={["Order", "Date", "Total", "Status"]} empty={orders.length === 0 ? "No orders yet." : undefined}>
              {orders.map((o) => <tr key={o.id}><td>{o.number}</td><td className="text-a-mute">{fmtDate(o.date)}</td><td>{inr(o.total)}</td><td><Badge tone={statusTone(o.status)}>{o.status}</Badge></td></tr>)}
            </Table>
          </div>
          <div className="mt-4 flex justify-end"><button className={btnGhost} onClick={() => setView(null)}>Close</button></div>
        </Modal>
      )}
    </>
  );
}
