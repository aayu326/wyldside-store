"use client";
import { useState } from "react";
import PageShell from "@/components/PageShell";
import { ChevronDown } from "lucide-react";

const FAQS: [string, string][] = [
  ["How long does delivery take?", "Most orders arrive in 3–7 business days. Metro cities are usually faster."],
  ["Can I pay on delivery?", "Yes. Cash on Delivery is available across India. Online payments are coming soon."],
  ["How do I choose my size?", "Use the size chart on every product page. Our tees are cut oversized, so size down for a closer fit."],
  ["What is your return policy?", "Unworn items with tags can be returned within 7 days of delivery. See Shipping & returns for the steps."],
  ["How do I use a coupon?", "Enter the code in your cart. Each code has its own minimum order value."],
  ["Is this a real store?", "Right now it is a demonstration. Orders and accounts are stored only in your browser."],
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PageShell title="FAQ">
      <div className="border-t border-line">
        {FAQS.map(([q, a], i) => (
          <div key={q} className="border-b border-line">
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold text-bone">
              {q}<ChevronDown className={`h-5 w-5 shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="pb-4">{a}</p>}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
