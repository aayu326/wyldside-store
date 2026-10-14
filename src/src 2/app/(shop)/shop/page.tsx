import { Suspense } from "react";
import Listing from "@/components/Listing";

export const metadata = { title: "Shop — WYLDSIDE" };

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-mute">Loading…</div>}>
      <Listing mode="shop" />
    </Suspense>
  );
}
