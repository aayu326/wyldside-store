"use client";
import { useState } from "react";
import { Eye } from "lucide-react";
import Modal from "@/components/Modal";
import { Badge, PageHead, Panel, Table, ainput, btnGhost, statusTone } from "@/components/admin/ui";
import { useStore } from "@/lib/store";
import { fmtDate, inr } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function Orders() {
  const { state, set, toast } = useStore();
  const [filter, setFilter] = useState("");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const open = state.orders.find((o) => o.id === openId);
  const list = state.orders.filter((o) => (!filter || o.status === filter) && (!q.trim() || `${o.number} ${o.customerName} ${o.email}`.toLowerCase().includes(q.trim().toLowerCase())));
  const setStatus = (id: string, status: OrderStatus) => { set("orders", (l) => l.map((o) => (o.id === id ? { ...o, status } : o))); toast(`Order marked ${status.toLowerCase()}`); };

  return (
    <>
      <PageHead title="Orders" sub={`${state.orders.length} orders`} />
      <Panel>
        <div className="mb-3 flex flex-wrap gap-2">
          <input className={`${ainput} w-full sm:w-64`} placeholder="Search order, name or email" aria-label="Search orders" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className={`${ainput} w-auto`} aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        <Table head={["Order", "Customer", "Date", "Items", "Total", "Status", ""]} empty={list.length === 0 ? "No orders match." : undefined}>
          {list.map((o) => (
            <tr key={o.id}>
              <td className="font-medium">{o.number}</td><td>{o.customerName}<span className="block text-xs text-a-mute">{o.email}</span></td><td className="whitespace-nowrap text-a-mute">{fmtDate(o.date)}</td>
              <td>{o.items.reduce((a, i) => a + i.qty, 0)}</td><td className="tabular-nums">{inr(o.total)}</td>
              <td><select aria-label={`Status for ${o.number}`} value={o.status} onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)} className={`${ainput} w-32 py-1`}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
              <td><button aria-label={`View ${o.number}`} className="rounded p-1.5 hover:bg-a-raise" onClick={() => setOpenId(o.id)}><Eye className="h-4 w-4" /></button></td>
            </tr>
          ))}
        </Table>
      </Panel>
      {open && (
        <Modal themed wide title={`Order ${open.number}`} onClose={() => setOpenId(null)}>
          <div className="grid gap-5 sm:grid-cols-2 text-sm">
            <div><p className="text-xs text-a-mute">Customer</p><p>{open.customerName}</p><p className="text-a-mute">{open.email} · {open.phone}</p></div>
            <div><p className="text-xs text-a-mute">Ship to</p><p>{open.address}, {open.city} {open.pin}</p></div>
            <div><p className="text-xs text-a-mute">Placed</p><p>{fmtDate(open.date)} · {open.payment}</p></div>
            <div><p className="mb-1 text-xs text-a-mute">Status</p><div className="flex items-center gap-2"><Badge tone={statusTone(open.status)}>{open.status}</Badge><select aria-label="Change status" className={`${ainput} w-36 py-1`} value={open.status} onChange={(e) => setStatus(open.id, e.target.value as OrderStatus)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div></div>
          </div>
          <Table head={["Item", "Size / colour", "Qty", "Price"]}>
            {open.items.map((i, k) => <tr key={k}><td>{i.name}</td><td className="text-a-mute">{i.size} / {i.color}</td><td>{i.qty}</td><td className="tabular-nums">{inr(i.price * i.qty)}</td></tr>)}
          </Table>
          <div className="mt-3 ml-auto max-w-xs space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-a-mute">Subtotal</span>{inr(open.subtotal)}</div>
            {open.discount > 0 && <div className="flex justify-between"><span className="text-a-mute">Discount</span>− {inr(open.discount)}</div>}
            <div className="flex justify-between"><span className="text-a-mute">Shipping</span>{open.shipping ? inr(open.shipping) : "Free"}</div>
            <div className="flex justify-between border-t border-a-line pt-2 font-semibold"><span>Total</span>{inr(open.total)}</div>
          </div>
          <div className="mt-5 flex justify-end"><button className={btnGhost} onClick={() => setOpenId(null)}>Close</button></div>
        </Modal>
      )}
    </>
  );
}
