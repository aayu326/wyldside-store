"use client";
import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";
import Logo from "./Logo";
import { useStore } from "@/lib/store";

export default function Footer() {
  const { state } = useStore();
  const s = state.settings;
  const col = (title: string, links: [string, string][]) => (
    <div>
      <h4 className="font-display text-xl font-bold uppercase">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-bone/70">
        {links.map(([l, h]) => (
          <li key={l}><Link href={h} className="hover:text-lime">{l}</Link></li>
        ))}
      </ul>
    </div>
  );
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Logo className="text-5xl" />
          <p className="mt-3 max-w-xs text-sm text-bone/70">Live on the Wyld Side. Streetwear, sport and trail gear for people who don’t sit still.</p>
          <div className="mt-5 flex gap-3">
            <a href={s.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center border border-line hover:border-lime hover:text-lime"><Instagram className="h-4 w-4" /></a>
            <a href={s.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="grid h-10 w-10 place-items-center border border-line hover:border-lime hover:text-lime"><Youtube className="h-4 w-4" /></a>
            <a href={s.x} target="_blank" rel="noreferrer" aria-label="X" className="grid h-10 w-10 place-items-center border border-line font-bold hover:border-lime hover:text-lime">X</a>
          </div>
        </div>
        {col("Shop", state.categories.map((c) => [c.name, `/shop?cat=${c.slug}`] as [string, string]))}
        {col("Help", [["Shipping & returns", "/shipping-returns"], ["FAQ", "/faq"], ["Contact", "/contact"], ["Track order", "/account"], ["Wishlist", "/wishlist"]])}
        <div>
          <h4 className="font-display text-xl font-bold uppercase">Reach us</h4>
          <address className="mt-3 space-y-2 text-sm not-italic text-bone/70">
            <p>{s.address}</p>
            <p><a href={`mailto:${s.email}`} className="hover:text-lime">{s.email}</a></p>
            <p><a href={`tel:${s.phone.replace(/\s/g, "")}`} className="hover:text-lime">{s.phone}</a></p>
          </address>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-mute lg:px-8">
          <p>© 2026 {s.brandName}. Demo storefront, no real orders or payments.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-lime">Privacy policy</Link>
            <Link href="/terms" className="hover:text-lime">Terms & conditions</Link>
            <Link href="/about" className="hover:text-lime">About</Link>
            <Link href="/admin" className="hover:text-lime">Admin demo</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
