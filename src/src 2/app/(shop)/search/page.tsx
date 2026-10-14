import { Suspense } from "react";
import Listing from "@/components/Listing";

export const metadata = { title: "Search — WYLDSIDE" };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-mute">Loading…</div>}>
      <Listing mode="search" />
    </Suspense>
  );
}
