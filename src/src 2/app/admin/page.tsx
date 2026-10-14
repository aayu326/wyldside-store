"use client";
import Link from "next/link";
import { AlertTriangle, IndianRupee, Package, ShoppingCart, Users } from "lucide-react";
import { Badge, PageHead, Panel, Table, statusTone } from "@/components/admin/ui";
import { useStore } from "@/lib/store";
import { SALES_SERIES } from "@/lib/data";
import { fmtDate, inr } from "@/lib/utils";

export default function Dashboard() {
  const { state } = useStore();
  const live = state.orders.filter((o) => o.status !== "Cancelled");
  const revenue = live.reduce((a, o) => a + o.total, 0);
  const low = state.products.filter((p) => p.stock <= 10).sort((a, b) => a.stock - b.stock);
  const max = Math.max(...SALES_SERIES.map((s) => s.v));
  const byCat = state.categories.map((c) => ({ name: c.name, n: state.products.filter((p) => p.category === c.slug).length }));
  const total = byCat.reduce((a, c) => a + c.n, 0) || 1;

  const stats = [
    { l: "Revenue", v: inr(revenue), i: IndianRupee },
    { l: "Orders", v: String(state.orders.length), i: ShoppingCart },
    { l: "Customers", v: String(state.customers.length), i: Users },
    { l: "Active products", v: String(state.products.filter((p) => p.visible).length), i: Package },
  ];

  return (
    <>
      <PageHead title="Dashboard" sub="Sales figures are sample data; orders and stock reflect your demo store." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-lg border border-a-line bg-a-panel p-4">
            <div className="flex items-center justify-between text-xs text-a-mute">{s.l}<s.i className="h-4 w-4" /></div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Sales, last 7 days" className="xl:col-span-2">
          <div className="flex h-52 items-end gap-3" role="img" aria-label="Bar chart of daily sales for the last seven days">
            {SALES_SERIES.map((s) => (
              <div key={s.d} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[11px] tabular-nums text-a-mute">{(s.v / 1000).toFixed(1)}k</span>
                <div className="w-full rounded-t bg-lime/90 transition hover:bg-lime" style={{ height: `${(s.v / max) * 150}px` }} />
                <span className="text-xs text-a-mute">{s.d}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Products by category">
          <ul className="space-y-3">
            {byCat.map((c) => (
              <li key={c.name} className="text-sm">
                <div className="mb-1 flex justify-between"><span>{c.name}</span><span className="text-a-mute">{c.n}</span></div>
                <div className="h-1.5 rounded bg-a-raise"><div className="h-full rounded bg-lime" style={{ width: `${(c.n / total) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Recent orders" className="xl:col-span-2" actions={<Link href="/admin/orders" className="text-xs underline">View all</Link>}>
          <Table head={["Order", "Customer", "Date", "Total", "Status"]}>
            {state.orders.slice(0, 6).map((o) => (
              <tr key={o.id}><td className="font-medium">{o.number}</td><td>{o.customerName}</td><td className="text-a-mute">{fmtDate(o.date)}</td><td className="tabular-nums">{inr(o.total)}</td><td><Badge tone={statusTone(o.status)}>{o.status}</Badge></td></tr>
            ))}
          </Table>
        </Panel>
        <Panel title="Low-stock alerts" actions={<AlertTriangle className="h-4 w-4 text-amber-500" />}>
          {low.length === 0 ? <p className="text-sm text-a-mute">All products are well stocked.</p> : (
            <ul className="space-y-2 text-sm">
              {low.slice(0, 7).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2">
                  <Link href={`/admin/products/${p.id}`} className="truncate hover:underline">{p.name}</Link>
                  <Badge tone={p.stock === 0 ? "red" : "amber"}>{p.stock === 0 ? "Out" : `${p.stock} left`}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
