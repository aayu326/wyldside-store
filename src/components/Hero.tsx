"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SafeImage from "./SafeImage";
import { useStore } from "@/lib/store";

export default function Hero() {
  const { state } = useStore();
  const slides = state.slides.filter((s) => s.visible);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const cur = n ? i % n : 0;

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => setI((x) => x + 1), 6500);
    return () => clearInterval(t);
  }, [paused, n]);

  if (!n) return null;
  const go = (d: number) => setI((x) => (x + d + n * 1000) % n);

  return (
    <section className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel" aria-label="Featured drops">
      <div className="relative h-[min(76svh,820px)] min-h-[500px] overflow-hidden sm:min-h-[560px]">
        {slides.map((s, k) => (
          <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${k === cur ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={k !== cur}>
            <SafeImage src={s.image} alt="" eager={k === 0} className="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
            <div className="absolute inset-0 mx-auto flex max-w-[1440px] items-end px-5 pb-24 sm:px-8 sm:pb-28 lg:px-12">
              <div className="max-w-3xl pb-2 sm:pb-4">
                <h1 className="h-display max-w-4xl text-[clamp(3.25rem,9.5vw,8.5rem)]">{s.title}</h1>
                <p className="mt-4 max-w-md text-sm leading-7 text-bone/80 sm:mt-5 sm:text-base sm:leading-8 lg:text-lg">{s.sub}</p>
                <Link href={s.href} className="btn-lime mt-7" tabIndex={k === cur ? 0 : -1}>{s.cta}</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {n > 1 && (
        <div className="absolute bottom-5 left-0 right-0 mx-auto flex max-w-[1440px] items-center justify-between px-5 sm:bottom-7 sm:px-8 lg:px-12">
          <div className="flex gap-2" role="tablist" aria-label="Choose slide">
            {slides.map((s, k) => (
              <button key={s.id} role="tab" aria-selected={k === cur} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`h-1.5 transition-all ${k === cur ? "w-14 bg-lime" : "w-6 bg-bone/40 hover:bg-bone/70"}`} />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-3 font-display text-lg tabular-nums text-bone/70">{cur + 1} / {n}</span>
            <button aria-label="Previous slide" onClick={() => go(-1)} className="grid h-10 w-10 place-items-center border border-bone/30 hover:border-lime hover:text-lime"><ChevronLeft className="h-5 w-5" /></button>
            <button aria-label="Next slide" onClick={() => go(1)} className="grid h-10 w-10 place-items-center border border-bone/30 hover:border-lime hover:text-lime"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      )}
    </section>
  );
}
