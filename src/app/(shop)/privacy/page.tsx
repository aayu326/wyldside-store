import PageShell from "@/components/PageShell";

export const metadata = { title: "Privacy policy — WYLDSIDE" };

export default function Privacy() {
  return (
    <PageShell title="Privacy policy" intro="Demo content. Replace with your legal policy before launch.">
      <h2>What this demo stores</h2>
      <p>This demonstration site keeps your cart, wishlist and any demo orders or accounts only in your own browser (localStorage). Nothing is sent to a server.</p>
      <h2>What a live store would collect</h2>
      <ul><li>Contact and delivery details you enter at checkout.</li><li>Order history and support messages.</li><li>Basic analytics about how the site is used.</li></ul>
      <h2>Your choices</h2>
      <p>You can clear all demo data by clearing this site’s storage in your browser settings.</p>
    </PageShell>
  );
}
