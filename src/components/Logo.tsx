"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";

export default function Logo({ className = "text-3xl" }: { className?: string }) {
  const { state } = useStore();
  const { logoUrl, brandName } = state.settings;
  return (
    <Link href="/" aria-label={`${brandName} home`} className="shrink-0">
      {logoUrl ? (
        <img src={logoUrl} alt={brandName} className="h-8 w-auto" />
      ) : (
        <span className={`h-display ${className}`}>
          {brandName.slice(0, 4)}
          <span className="text-lime">{brandName.slice(4)}</span>
        </span>
      )}
    </Link>
  );
}
