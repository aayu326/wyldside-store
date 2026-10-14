"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Logo from "./Logo";
import { useStore } from "@/lib/store";

export default function Header() {
  const { state, totals } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [q, setQ] = useState("");
  const [ai, setAi] = useState(0);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);

  const msgs = state.announcements.filter((a) => a.visible);
  useEffect(() => {
    if (msgs.length < 2) return;
    const t = setInterval(() => setAi((i) => (i + 1) % msgs.length), 4000);
    return () => clearInterval(t);
  }, [msgs.length]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setDrawer(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const subsOf = (slug: string) => state.categories.find((c) => c.slug === slug)?.subs ?? [];

  return (
    <header className="sticky top-0 z-40 bg-ink/95 backdrop-blur-xl">
      {msgs.length > 0 && (
        <div className="bg-lime px-3 py-2 text-center text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink sm:text-xs">{msgs[ai % msgs.length].text}</div>
      )}
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-10">
        <button className="lg:hidden" aria-label="Open menu" onClick={() => setDrawer(true)}>
          <Menu className="h-6 w-6" />
        </button>
        <Logo />
        <form onSubmit={submit} role="search" className="relative ml-4 hidden max-w-md flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tees, hoodies, hiking…" className="input pl-9" aria-label="Search products" />
        </form>
        <nav className="ml-auto flex items-center gap-0.5 sm:gap-1" aria-label="Account and cart">
          <Link href="/account" aria-label="Account" className="grid h-10 w-10 place-items-center hover:text-lime"><User className="h-5 w-5" /></Link>
          <Link href="/wishlist" aria-label="Wishlist" className="relative grid h-10 w-10 place-items-center hover:text-lime">
            <Heart className="h-5 w-5" />
            {state.wishlist.length > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center bg-lime px-1 text-[10px] font-bold text-ink">{state.wishlist.length}</span>}
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative grid h-10 w-10 place-items-center hover:text-lime">
            <ShoppingBag className="h-5 w-5" />
            {totals.count > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center bg-lime px-1 text-[10px] font-bold text-ink">{totals.count}</span>}
          </Link>
        </nav>
      </div>

      {/* Desktop category bar + mega menu */}
      <div className="relative hidden border-y border-line/80 lg:block" onMouseLeave={() => setOpen(null)}>
        <ul className="mx-auto flex max-w-[1440px] gap-7 px-8 xl:gap-9">
          {state.nav.map((n) => {
            const subs = subsOf(n.category);
            return (
              <li key={n.id} onMouseEnter={() => setOpen(subs.length ? n.id : null)}>
                <Link
                  href={n.href}
                  onFocus={() => setOpen(subs.length ? n.id : null)}
                  className={`flex items-center gap-1 py-3 font-display text-lg font-bold uppercase tracking-wide hover:text-lime ${n.label === "Sale" ? "text-lime" : ""}`}
                >
                  {n.label}
                  {subs.length > 0 && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>
              </li>
            );
          })}
        </ul>
        {open && (
          <div className="absolute inset-x-0 top-full border-b border-line bg-ink/98 shadow-2xl">
            <div className="mx-auto grid max-w-[1440px] grid-cols-5 gap-x-8 gap-y-2 px-8 py-6">
              {subsOf(state.nav.find((n) => n.id === open)?.category ?? "").map((s) => (
                <Link key={s.id} href={`/shop?cat=${s.slug}`} onClick={() => setOpen(null)} className="py-1.5 text-sm text-bone/80 hover:text-lime">{s.name}</Link>
              ))}
              <Link href={state.nav.find((n) => n.id === open)?.href ?? "/shop"} onClick={() => setOpen(null)} className="py-1.5 text-sm font-semibold text-lime">Shop all</Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile horizontal category strip */}
      <div className="scrollbar-hide flex gap-5 overflow-x-auto border-y border-line/80 px-4 lg:hidden">
        {state.nav.map((n) => (
          <Link key={n.id} href={n.href} className="shrink-0 py-2.5 font-display text-base font-bold uppercase tracking-wide">{n.label}</Link>
        ))}
      </div>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-ink p-5">
            <div className="mb-5 flex items-center justify-between">
              <Logo className="text-2xl" />
              <button aria-label="Close menu" onClick={() => setDrawer(false)}><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={submit} className="relative mb-4" role="search">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="input pl-9" aria-label="Search products" />
            </form>
            <ul>
              {state.nav.map((n) => {
                const subs = subsOf(n.category);
                return (
                  <li key={n.id} className="border-b border-line">
                    <div className="flex items-center justify-between">
                      <Link href={n.href} onClick={() => setDrawer(false)} className="flex-1 py-3 font-display text-xl font-bold uppercase">{n.label}</Link>
                      {subs.length > 0 && (
                        <button aria-label={`Toggle ${n.label}`} aria-expanded={mobileOpen === n.id} onClick={() => setMobileOpen(mobileOpen === n.id ? null : n.id)} className="p-3">
                          <ChevronDown className={`h-4 w-4 transition ${mobileOpen === n.id ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                    {mobileOpen === n.id && (
                      <div className="grid grid-cols-2 gap-x-4 pb-3">
                        {subs.map((s) => (
                          <Link key={s.id} href={`/shop?cat=${s.slug}`} onClick={() => setDrawer(false)} className="py-1.5 text-sm text-bone/80">{s.name}</Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 grid gap-2 text-sm">
              {[["/account", "Account"], ["/wishlist", "Wishlist"], ["/cart", "Cart"], ["/contact", "Contact"], ["/faq", "FAQ"]].map(([h, l]) => (
                <Link key={h} href={h} onClick={() => setDrawer(false)} className="py-1 text-bone/80">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
