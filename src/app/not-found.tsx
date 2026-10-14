import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-20 text-center">
        <div>
          <p className="h-display text-[9rem] text-lime sm:text-[14rem]">404</p>
          <h1 className="h-display text-4xl">You’ve gone off the map</h1>
          <p className="mt-3 text-bone/70">That page doesn’t exist, or it moved.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/" className="btn-lime">Back home</Link>
            <Link href="/shop" className="btn-ghost">Shop all</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
