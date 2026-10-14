import type { ReactNode } from "react";

export default function PageShell({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="h-display text-5xl sm:text-7xl">{title}</h1>
      {intro && <p className="mt-4 text-lg text-bone/75">{intro}</p>}
      <div className="mt-10 space-y-5 text-[15px] leading-relaxed text-bone/80 [&_h2]:mb-1 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:text-bone [&_a]:text-lime [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">{children}</div>
    </div>
  );
}
