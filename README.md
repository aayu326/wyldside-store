# WYLDSIDE — Phase 1 (frontend + admin demo)

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · lucide-react.
No backend, database, auth service or payment gateway. All data is mock data in `src/lib/data.ts`,
held in React state and persisted to `localStorage` (key `wyldside:demo:v1`).

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build
```

## Where things live
- `src/lib/data.ts` – all demo content and Unsplash image IDs (swap here, or edit in /admin).
- `src/lib/store.tsx` – single state provider (products, orders, cart, settings…) + localStorage hydration.
- `src/components/` – storefront components; `src/components/admin/` – admin UI kit + generic `Crud` table.
- `src/app/(shop)/` – storefront routes; `src/app/admin/` – admin routes.

## Admin demo access
Go to `/admin`. Passcode: `wyld-admin`. This is a client-side check for the demo only and is **not security**.
Use "Reset demo data" in the admin sidebar to restore defaults.

## Phase 2 hand-off
Replace `StoreProvider` reads/writes with API calls, replace the passcode gate with real auth,
swap `<img>` for `next/image` (remote pattern already configured), and add payments/inventory.
