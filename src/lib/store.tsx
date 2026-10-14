"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { defaults } from "./data";
import type { AppState } from "./types";
import { computeTotals, uid } from "./utils";

const KEY = "wyldside:demo:v1";
type Setter<K extends keyof AppState> = AppState[K] | ((prev: AppState[K]) => AppState[K]);
type ToastItem = { id: string; msg: string; kind: "ok" | "err" };

type Ctx = {
  state: AppState;
  ready: boolean;
  set: <K extends keyof AppState>(key: K, value: Setter<K>) => void;
  reset: () => void;
  toast: (msg: string, kind?: "ok" | "err") => void;
  confirm: (msg: string, okLabel?: string) => Promise<boolean>;
  addToCart: (productId: string, size: string, color: string, qty?: number) => boolean;
  setQty: (productId: string, size: string, color: string, qty: number) => void;
  removeLine: (productId: string, size: string, color: string) => void;
  toggleWish: (productId: string) => void;
  applyCoupon: (code: string) => boolean;
  totals: ReturnType<typeof computeTotals>;
};

const StoreCtx = createContext<Ctx | null>(null);

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore must be used inside <StoreProvider>");
  return c;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaults);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [dialog, setDialog] = useState<{ msg: string; ok: string; resolve: (v: boolean) => void } | null>(null);

  // Hydrate from localStorage after mount (avoids SSR/client mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...defaults, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked */
    }
  }, [state, ready]);

  const set = useCallback(<K extends keyof AppState>(key: K, value: Setter<K>) => {
    setState((s) => ({
      ...s,
      [key]: typeof value === "function" ? (value as (p: AppState[K]) => AppState[K])(s[key]) : value,
    }));
  }, []);

  const toast = useCallback((msg: string, kind: "ok" | "err" = "ok") => {
    const id = uid("t");
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const confirm = useCallback(
    (msg: string, ok = "Confirm") => new Promise<boolean>((resolve) => setDialog({ msg, ok, resolve })),
    []
  );
  const closeDialog = (v: boolean) => {
    dialog?.resolve(v);
    setDialog(null);
  };

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setState(defaults);
  }, []);

  const addToCart: Ctx["addToCart"] = useCallback(
    (productId, size, color, qty = 1) => {
      const p = state.products.find((x) => x.id === productId);
      if (!p || p.stock <= 0) {
        toast("This item is sold out.", "err");
        return false;
      }
      set("cart", (cart) => {
        const i = cart.findIndex((l) => l.productId === productId && l.size === size && l.color === color);
        if (i >= 0) return cart.map((l, k) => (k === i ? { ...l, qty: Math.min(10, l.qty + qty) } : l));
        return [...cart, { productId, size, color, qty }];
      });
      toast("Added to cart");
      return true;
    },
    [state.products, set, toast]
  );
  const setQty: Ctx["setQty"] = useCallback(
    (productId, size, color, qty) =>
      set("cart", (cart) =>
        cart.map((l) => (l.productId === productId && l.size === size && l.color === color ? { ...l, qty: Math.max(1, Math.min(10, qty)) } : l))
      ),
    [set]
  );
  const removeLine: Ctx["removeLine"] = useCallback(
    (productId, size, color) => set("cart", (cart) => cart.filter((l) => !(l.productId === productId && l.size === size && l.color === color))),
    [set]
  );
  const toggleWish = useCallback(
    (id: string) =>
      set("wishlist", (w) => {
        const has = w.includes(id);
        toast(has ? "Removed from wishlist" : "Saved to wishlist");
        return has ? w.filter((x) => x !== id) : [...w, id];
      }),
    [set, toast]
  );
  const applyCoupon = useCallback(
    (raw: string) => {
      const code = raw.trim().toUpperCase();
      const c = state.coupons.find((x) => x.code === code);
      const subtotal = computeTotals(state).subtotal;
      if (!c || !c.active) return toast("That code isn't valid.", "err"), false;
      if (subtotal < c.minOrder) return toast(`Add ₹${c.minOrder - subtotal} more to use ${code}.`, "err"), false;
      set("coupon", code);
      toast(`${code} applied`);
      return true;
    },
    [state, set, toast]
  );

  const totals = useMemo(() => computeTotals(state), [state]);
  const value: Ctx = { state, ready, set, reset, toast, confirm, addToCart, setQty, removeLine, toggleWish, applyCoupon, totals };

  return (
    <StoreCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-2 border px-4 py-3 text-sm shadow-xl ${t.kind === "ok" ? "border-lime bg-ink text-bone" : "border-red-500 bg-ink text-red-300"}`}>
            {t.kind === "ok" ? <CheckCircle2 className="h-4 w-4 text-lime" /> : <AlertCircle className="h-4 w-4" />}
            {t.msg}
          </div>
        ))}
      </div>
      {dialog && (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-black/70 p-4" role="alertdialog" aria-modal="true">
          <div className="w-full max-w-sm border border-line bg-panel p-6 text-bone">
            <p className="text-sm leading-relaxed">{dialog.msg}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => closeDialog(false)} className="border border-line px-4 py-2 text-sm hover:border-bone">Cancel</button>
              <button onClick={() => closeDialog(true)} className="bg-lime px-4 py-2 text-sm font-semibold text-ink hover:bg-bone">{dialog.ok}</button>
            </div>
          </div>
        </div>
      )}
    </StoreCtx.Provider>
  );
}
