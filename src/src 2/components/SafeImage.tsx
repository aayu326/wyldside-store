"use client";
import { useEffect, useRef, useState } from "react";

export default function SafeImage({ src, alt, className = "", eager = false }: { src?: string; alt: string; className?: string; eager?: boolean }) {
  const [st, setSt] = useState<"load" | "ok" | "err">("load");
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setSt(src ? "load" : "err");
    const el = ref.current;
    if (el && el.complete && el.naturalWidth > 0) setSt("ok");
  }, [src]);

  return (
    <div className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} overflow-hidden bg-panel ${className}`}>
      {src && st !== "err" ? (
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onLoad={() => setSt("ok")}
          onError={() => setSt("err")}
          className={`h-full w-full object-cover transition-opacity duration-500 ${st === "ok" ? "opacity-100" : "opacity-0"}`}
        />
      ) : (
        <div role="img" aria-label={alt} className="grid h-full w-full place-items-center bg-[repeating-linear-gradient(135deg,#141414_0_12px,#181818_12px_24px)]">
          <span className="font-display text-2xl font-extrabold tracking-tight text-lime/60">WYLDSIDE</span>
        </div>
      )}
      {st === "load" && src && <div className="absolute inset-0 animate-pulse bg-[#1a1a1a]" />}
    </div>
  );
}
