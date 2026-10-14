"use client";
import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export default function Modal({ title, onClose, children, wide = false, themed = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean; themed?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-black/70 p-4" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`w-full ${wide ? "max-w-3xl" : "max-w-lg"} border ${themed ? "border-a-line bg-a-panel text-a-text" : "border-line bg-panel text-bone"}`}>
        <div className={`flex items-center justify-between border-b px-5 py-4 ${themed ? "border-a-line" : "border-line"}`}>
          <h2 className={themed ? "text-base font-semibold" : "font-display text-2xl font-bold uppercase"}>{title}</h2>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
