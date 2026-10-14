"use client";
import type { ReactNode } from "react";

export const btn = "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition disabled:opacity-40";
export const btnPrimary = `${btn} bg-lime text-ink hover:brightness-95`;
export const btnGhost = `${btn} border border-a-line hover:bg-a-raise`;
export const btnDanger = `${btn} border border-red-500/40 text-red-500 hover:bg-red-500/10`;
export const ainput = "w-full rounded-md border border-a-line bg-a-raise px-3 py-2 text-sm text-a-text placeholder:text-a-mute focus:border-lime focus:outline-none";

export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-sm text-a-mute">{sub}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{actions}</div>
    </div>
  );
}

export function Panel({ title, children, actions, className = "" }: { title?: string; children: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-a-line bg-a-panel ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-a-line px-4 py-3">
          <h2 className="text-sm font-semibold">{title}</h2>
          {actions}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

const TONES: Record<string, string> = {
  green: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/15 text-amber-600",
  red: "bg-red-500/15 text-red-500",
  blue: "bg-sky-500/15 text-sky-500",
  gray: "bg-a-raise text-a-mute",
};
export function Badge({ tone = "gray", children }: { tone?: keyof typeof TONES | string; children: ReactNode }) {
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${TONES[tone] ?? TONES.gray}`}>{children}</span>;
}
export const statusTone = (s: string) =>
  ({ Delivered: "green", approved: "green", Shipped: "blue", Processing: "amber", pending: "amber", Pending: "amber", Cancelled: "red", rejected: "red" } as Record<string, string>)[s] ?? "gray";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-a-mute">{hint}</span>}
    </label>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`relative h-5 w-9 shrink-0 rounded-full transition ${on ? "bg-lime" : "bg-a-line"}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
    </button>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b border-a-line text-xs text-a-mute">{head.map((h, i) => <th key={i} className="whitespace-nowrap px-3 py-2 font-medium">{h}</th>)}</tr></thead>
        <tbody className="[&_td]:px-3 [&_td]:py-2.5 [&_tr]:border-b [&_tr]:border-a-line/60 [&_tr:last-child]:border-0">{children}</tbody>
      </table>
      {empty && <p className="py-8 text-center text-sm text-a-mute">{empty}</p>}
    </div>
  );
}
