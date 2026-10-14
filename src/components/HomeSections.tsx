"use client";
import Link from "next/link";
import { useState } from "react";
import { useRef } from "react";
import { Star } from "lucide-react";
import SafeImage from "./SafeImage";
import ProductCard from "./ProductCard";
import { useStore } from "@/lib/store";
import { COLLECTIONS, GALLERY, img } from "@/lib/data";
import { uid } from "@/lib/utils";
import type { Product } from "@/lib/types";

const wrap = "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10";

function Head({ title, href, label = "View all" }: { title: string; href?: string; label?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b border-line/80 pb-4 sm:mb-7 sm:pb-5">
      <h2 className="h-display text-3xl sm:text-5xl lg:text-6xl">{title}</h2>
      {href && <Link href={href} className="shrink-0 pb-1 text-xs font-bold uppercase tracking-[0.12em] text-lime transition hover:text-bone sm:text-sm">{label} <span aria-hidden="true">↗</span></Link>}
    </div>
  );
}

function Row({ title, href, items }: { title: string; href: string; items: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (!items.length) return null;

  const scrollTrack = (direction: number) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: direction * trackRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section className={`${wrap} pt-8 sm:pt-12 lg:pt-14`}>
      <div className="mb-4 flex items-end justify-between gap-3 border-b border-line/80 pb-3 sm:mb-5 sm:pb-4">
        <h2 className="h-display text-3xl sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => scrollTrack(-1)}
            aria-label={`Scroll ${title} left`}
            className="grid h-9 w-9 place-items-center border border-line text-xl transition hover:border-lime hover:text-lime"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollTrack(1)}
            aria-label={`Scroll ${title} right`}
            className="grid h-9 w-9 place-items-center border border-line text-xl transition hover:border-lime hover:text-lime"
          >
            →
          </button>
          <Link
            href={href}
            className="hidden pb-1 text-xs font-bold uppercase tracking-wider text-lime hover:text-bone sm:inline"
          >
            View all ↗
          </Link>
        </div>
      </div>

      <div
        ref={trackRef}
        className="product-horizontal-track flex gap-3 overflow-x-auto overscroll-x-contain pb-4 sm:gap-4"
        aria-label={title}
      >
        {items.map((p) => (
          <div
            key={p.id}
            className="w-[68%] min-w-[68%] shrink-0 sm:w-[40%] sm:min-w-[40%] md:w-[29%] md:min-w-[29%] lg:w-[23%] lg:min-w-[23%]"
          >
            <ProductCard p={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function CategorySelector() {
  const { state } = useStore();
  return (
    <section className={`${wrap} pt-10 sm:pt-14`} aria-label="Shop by category">
      <div className="mb-5 flex items-end justify-between border-b border-line/80 pb-4 sm:mb-7 sm:pb-5">
        <div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-lime sm:text-xs">Find your lane</p><h2 className="h-display text-3xl sm:text-5xl">Shop by category</h2></div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {state.categories.map((c) => (
          <Link key={c.id} href={`/shop?cat=${c.slug}`} className="group relative block min-w-0 overflow-hidden bg-panel">
            <SafeImage src={c.image} alt={c.name} className="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.035]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent transition-colors group-hover:from-black/70" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-4">
              <span className="font-display text-lg font-extrabold uppercase leading-tight tracking-wide sm:text-2xl">{c.name}</span>
              <span aria-hidden="true" className="mb-0.5 grid h-7 w-7 shrink-0 place-items-center border border-white/40 text-sm transition group-hover:border-lime group-hover:bg-lime group-hover:text-ink">↗</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function NewArrivals() {
  const { state } = useStore();
  const items = state.products.filter((p) => p.visible && p.isNew).slice(0, 8);
  return <Row title="New arrivals" href="/shop?sort=newest" items={items} />;
}
export function BestSellers() {
  const { state } = useStore();
  return <Row title="Best sellers" href="/shop" items={state.products.filter((p) => p.visible && p.bestSeller).slice(0, 4)} />;
}
export function Trending() {
  const { state } = useStore();
  return <Row title="Trending now" href="/shop" items={state.products.filter((p) => p.visible && p.trending).slice(0, 4)} />;
}

export function Collections() {
  return (
    <section className={`${wrap} pt-12 sm:pt-16 lg:pt-20`}>
      <Head title="Shop by collection" />
      <div className="grid gap-3 md:grid-cols-6">
        {COLLECTIONS.map((c, k) => (
          <Link key={c.name} href={c.href} className={`group relative block overflow-hidden ${k < 2 ? "md:col-span-3" : "md:col-span-2"}`}>
            <SafeImage src={img(c.image, 1200)} alt="" className={k < 2 ? "aspect-[16/10]" : "aspect-[4/5]"} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="h-display text-4xl group-hover:text-lime">{c.name}</h3>
              <p className="mt-1 text-sm text-bone/80">{c.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Promos() {
  const { state } = useStore();
  const list = state.promos.filter((p) => p.visible);
  if (!list.length) return null;
  return (
    <section className={`${wrap} grid gap-4 pt-12 sm:pt-16 lg:pt-20 md:grid-cols-2`}>
      {list.map((p) => (
        <Link key={p.id} href={p.href} className="group relative block overflow-hidden bg-panel">
          <SafeImage src={p.image} alt="" className="aspect-[16/9]" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 to-ink/10" />
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10">
            <h3 className="h-display max-w-xs text-4xl text-lime sm:text-6xl">{p.title}</h3>
            <p className="mt-2 max-w-xs text-sm text-bone/80">{p.text}</p>
            <span className="mt-4 w-fit border-b border-bone pb-0.5 text-sm font-semibold group-hover:border-lime group-hover:text-lime">Shop now</span>
          </div>
        </Link>
      ))}
    </section>
  );
}

export function Reviews() {
  const { state } = useStore();
  const list = state.reviews.filter((r) => r.status === "approved").slice(0, 6);
  if (!list.length) return null;
  return (
    <section className={`${wrap} pt-12 sm:pt-16 lg:pt-20`}>
      <Head title="What people say" />
      <div className="grid gap-3 md:grid-cols-3">
        {list.map((r) => (
          <figure key={r.id} className="border border-line/80 bg-panel p-5 sm:p-6">
            <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, k) => <Star key={k} className={`h-4 w-4 ${k < r.rating ? "fill-lime text-lime" : "text-line"}`} />)}
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold uppercase">{r.title}</h3>
            <blockquote className="mt-2 text-sm leading-relaxed text-bone/75">{r.text}</blockquote>
            <figcaption className="mt-4 text-xs text-mute">{r.name} on {r.product}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Gallery() {
  const spans = ["col-span-2 row-span-2", "", "", "", "", "col-span-2"];
  return (
    <section className={`${wrap} pt-12 sm:pt-16 lg:pt-20`}>
      <Head title="Out in the wild" href="/shop" label="Shop the look" />
      <div className="grid auto-rows-[160px] grid-cols-2 gap-2 sm:auto-rows-[220px] md:grid-cols-4">
        {GALLERY.map((k, n) => (
          <Link key={k} href="/shop" className={`group overflow-hidden ${spans[n]}`} aria-label="Shop the look">
            <SafeImage src={img(k, 1000)} alt="" className="h-full w-full transition duration-500 group-hover:scale-105" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Newsletter() {
  const { state, set, toast } = useStore();
  const [email, setEmail] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(v)) return toast("Enter a valid email address.", "err");
    if (state.subscribers.some((s) => s.email === v)) return toast("You’re already subscribed.", "err");
    set("subscribers", (l) => [{ id: uid("sb"), email: v, date: new Date().toISOString() }, ...l]);
    setEmail("");
    toast("Subscribed. Drops land in your inbox first.");
  };
  return (
    <section className={`${wrap} pt-12 sm:pt-16 lg:pt-20`}>
      <div className="bg-lime p-6 text-ink sm:p-10 lg:p-14">
        <h2 className="h-display text-5xl sm:text-7xl">First to the drop</h2>
        <p className="mt-3 max-w-md text-sm font-medium">New releases and member-only codes, no more than twice a month.</p>
        <form onSubmit={submit} className="mt-6 flex max-w-lg flex-col gap-2 sm:flex-row">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" aria-label="Email address" className="flex-1 border-2 border-ink bg-transparent px-4 py-3 text-sm placeholder:text-ink/60 focus:outline-none focus-visible:bg-white/30" />
          <button className="bg-ink px-6 py-3 font-display text-lg font-bold uppercase text-lime hover:bg-bone hover:text-ink">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
