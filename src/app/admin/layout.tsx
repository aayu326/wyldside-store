"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3, Boxes, ExternalLink, FolderTree, Home, LayoutDashboard, Mail, Menu, MessageSquare, Moon, Navigation, Package, RotateCcw,
  Settings, Sun, Tag, Users, X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { btnGhost, btnPrimary, ainput } from "@/components/admin/ui";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: Boxes },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/coupons", label: "Coupons & marketing", icon: Tag },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/navigation", label: "Navigation", icon: Navigation },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/settings", label: "Store settings", icon: Settings },
];
const DEMO_PASSCODE = "wyld-admin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { reset, confirm, toast } = useStore();
  const [auth, setAuth] = useState<boolean | null>(null);
  const [light, setLight] = useState(false);
  const [pass, setPass] = useState("");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    setAuth(sessionStorage.getItem("wyldside:admin") === "1");
    setLight(localStorage.getItem("wyldside:admin-theme") === "light");
  }, []);
  useEffect(() => setMenu(false), [path]);

  const toggleTheme = () => {
    setLight((l) => {
      localStorage.setItem("wyldside:admin-theme", l ? "dark" : "light");
      return !l;
    });
  };

  if (auth === null) return <div className="admin min-h-screen" />;

  if (!auth) {
    return (
      <div className="admin grid min-h-screen place-items-center p-4">
        <form
          className="w-full max-w-sm space-y-4 rounded-lg border border-a-line bg-a-panel p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (pass === DEMO_PASSCODE) { sessionStorage.setItem("wyldside:admin", "1"); setAuth(true); }
            else toast("Wrong passcode.", "err");
          }}
        >
          <h1 className="text-xl font-semibold">WYLDSIDE admin <span className="ml-1 rounded bg-lime px-1.5 py-0.5 align-middle text-[10px] font-bold text-ink">DEMO</span></h1>
          <p className="text-sm text-a-mute">Demo access only. This client-side check is <b>not security</b>; anyone can bypass it. Real authentication arrives in Phase 2.</p>
          <input className={ainput} type="password" autoFocus placeholder="Passcode" aria-label="Passcode" value={pass} onChange={(e) => setPass(e.target.value)} />
          <p className="text-xs text-a-mute">Demo passcode: <code className="rounded bg-a-raise px-1">{DEMO_PASSCODE}</code></p>
          <button className={`${btnPrimary} w-full`}>Enter admin</button>
          <Link href="/" className="block text-center text-xs text-a-mute underline">Back to store</Link>
        </form>
      </div>
    );
  }

  const sidebar = (
    <nav className="flex h-full flex-col" aria-label="Admin">
      <div className="px-4 py-5 text-lg font-extrabold tracking-tight">WYLD<span className="text-lime">SIDE</span> <span className="ml-1 text-xs font-normal text-a-mute">admin</span></div>
      <ul className="flex-1 space-y-0.5 px-2">
        {NAV.map((n) => {
          const on = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
          return (
            <li key={n.href}>
              <Link href={n.href} aria-current={on ? "page" : undefined} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${on ? "bg-lime font-semibold text-ink" : "text-a-mute hover:bg-a-raise hover:text-a-text"}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="space-y-1 border-t border-a-line p-2">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-a-mute hover:bg-a-raise"><ExternalLink className="h-4 w-4" /> View storefront</Link>
        <button onClick={async () => { if (await confirm("Reset all demo data (products, orders, settings, cart) to defaults?", "Reset")) { reset(); toast("Demo data reset"); } }} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-a-mute hover:bg-a-raise"><RotateCcw className="h-4 w-4" /> Reset demo data</button>
      </div>
    </nav>
  );

  return (
    <div className={`admin min-h-screen font-sans ${light ? "light" : ""}`}>
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-a-line bg-a-panel lg:block">{sidebar}</aside>
      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenu(false)} />
          <aside className="admin absolute inset-y-0 left-0 w-64 border-r border-a-line bg-a-panel">{sidebar}</aside>
        </div>
      )}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-a-line bg-a-panel/95 px-4 py-3 backdrop-blur">
          <button className="lg:hidden" aria-label="Open admin menu" onClick={() => setMenu(true)}>{menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          <BarChart3 className="hidden h-4 w-4 text-a-mute sm:block" />
          <span className="rounded bg-lime px-1.5 py-0.5 text-[10px] font-bold text-ink">DEMO DATA · SAVED IN THIS BROWSER</span>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggleTheme} aria-label="Toggle light or dark theme" className={btnGhost}>{light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</button>
            <button onClick={() => { sessionStorage.removeItem("wyldside:admin"); setAuth(false); }} className={btnGhost}>Sign out</button>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
