import Link from "next/link";
import PageShell from "@/components/PageShell";
import SafeImage from "@/components/SafeImage";
import { img } from "@/lib/data";

export const metadata = { title: "About — WYLDSIDE" };

export default function About() {
  return (
    <PageShell title="About WYLDSIDE" intro="Live on the Wyld Side. We make clothes for people who train hard, game late, race on weekends and walk further than planned.">
      <SafeImage src={img("street3", 1400)} alt="WYLDSIDE lookbook" className="aspect-[16/9] w-full" />
      <h2>Where we started</h2>
      <p>WYLDSIDE began with a simple frustration: sport, street and outdoor clothing lived in different worlds, and none of them felt like us. We build one wardrobe that moves between all of them.</p>
      <h2>How we make it</h2>
      <ul>
        <li>Heavyweight, pre-shrunk cotton for tees and hoodies.</li>
        <li>Performance fabrics tested on actual runs and climbs.</li>
        <li>Small drops, so you see less of the same thing on everyone else.</li>
      </ul>
      <p>Questions? <Link href="/contact">Get in touch</Link> or browse <Link href="/faq">the FAQ</Link>.</p>
    </PageShell>
  );
}
