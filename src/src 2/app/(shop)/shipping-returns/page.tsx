import PageShell from "@/components/PageShell";

export const metadata = { title: "Shipping & returns — WYLDSIDE" };

export default function Shipping() {
  return (
    <PageShell title="Shipping & returns">
      <h2>Shipping</h2>
      <ul>
        <li>Orders are packed within 48 hours.</li>
        <li>Delivery takes 3–7 business days across India.</li>
        <li>Free shipping above the threshold shown in your cart. A flat fee applies below it.</li>
      </ul>
      <h2>Returns & exchanges</h2>
      <ul>
        <li>Return unworn, unwashed items with tags within 7 days of delivery.</li>
        <li>Exchanges for size are free, subject to stock.</li>
        <li>Refunds go to the original payment method, or as store credit for Cash on Delivery orders.</li>
      </ul>
      <h2>Damaged or wrong item</h2>
      <p>Contact us within 48 hours with a photo and your order number and we will fix it.</p>
    </PageShell>
  );
}
