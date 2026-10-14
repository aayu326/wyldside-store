import type { AppState, Product } from "./types";

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}`;
export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
export const discountPct = (p: Pick<Product, "mrp" | "price">) =>
  p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export function computeTotals(s: AppState) {
  const lines = s.cart
    .map((l) => ({ ...l, product: s.products.find((p) => p.id === l.productId) }))
    .filter((l): l is typeof l & { product: Product } => !!l.product);
  const subtotal = lines.reduce((a, l) => a + l.product.price * l.qty, 0);
  const mrpTotal = lines.reduce((a, l) => a + l.product.mrp * l.qty, 0);
  const coupon = s.coupons.find((c) => c.active && c.code === s.coupon && subtotal >= c.minOrder);
  const couponDiscount = coupon ? Math.min(subtotal, coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value) : 0;
  const after = subtotal - couponDiscount;
  const shipping = subtotal === 0 ? 0 : after >= s.settings.freeShipOver ? 0 : s.settings.shipFee;
  return {
    lines,
    count: lines.reduce((a, l) => a + l.qty, 0),
    subtotal,
    mrpSavings: mrpTotal - subtotal,
    coupon,
    couponDiscount,
    shipping,
    total: after + shipping,
  };
}
