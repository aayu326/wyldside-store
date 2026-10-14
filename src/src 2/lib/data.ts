// ─────────────────────────────────────────────────────────────
// WYLDSIDE demo data. Everything here is mock content.
// Phase 2: replace `defaults` with API/database reads.
// ─────────────────────────────────────────────────────────────
import type { AppState, Category, Order, Product } from "./types";
import { slugify } from "./utils";

/** Stable Unsplash photo IDs (no API key). Swap any value to change an image everywhere. */
export const IMG_IDS = {
  street1: "1515886657613-9f3515b0c78f", street2: "1488161628813-04466f872be2", street3: "1529139574466-a303027c1d8b",
  tee1: "1503342217505-b0a15ec3261c", tee2: "1583743814966-8936f5b7be1a", tee3: "1576566588028-4147f3842f27", tee4: "1562157873-818bc0726f68",
  rack: "1523381210434-271e8be1f52b", store: "1441986300917-64674bd600d8", fashion1: "1509631179647-0177331693ae", fashion2: "1490481651871-ab68de25d43d",
  run: "1483721310020-03333e577078", gym: "1517836357463-d25dfeac3438", box: "1549719386-74dfcbf7dbed", football: "1579952363873-27f3bade9f55",
  cricket: "1531415074968-036ba1b575da", tennis: "1554068865-24cecd4e34b8", badminton: "1626224583764-f87db24ac4ea",
  gaming1: "1542751371-adc38448a05e", gaming2: "1511512578047-dfb367046420", gaming3: "1493711662062-fa541adb3fc8",
  race1: "1541443131876-44b03de101c5", race2: "1494976388531-d1058494cdd8",
  hike1: "1551698618-1dfe5d97d256", hike2: "1551632811-561732d1e306", hike3: "1464822759023-fed622ff2c3b",
  formal1: "1507679799987-c73779587ccf", formal2: "1594938298603-c8148c4dae35", formal3: "1596755094514-f87e34085b2c",
  wildlife: "1474511320723-9a56873867b5", science: "1532094349884-543bc11b234d", office: "1521791136064-7986c2920216", genz: "1529626455594-4ff0802cfb7e",
} as const;
export type ImgKey = keyof typeof IMG_IDS;
export const img = (k: ImgKey, w = 900) => `https://images.unsplash.com/photo-${IMG_IDS[k]}?auto=format&fit=crop&w=${w}&q=80`;

// ── Categories ───────────────────────────────────────────────
const CAT_DEF: { name: string; image: ImgKey; subs: string[]; nouns: string[]; pool: ImgKey[]; pants?: boolean }[] = [
  { name: "Sports", image: "run", subs: ["Running", "Combat", "Boxing", "Kick-boxing", "MMA", "Decathlon", "Football", "Cricket", "Badminton", "Tennis"], nouns: ["Dry-Fit Performance Tee", "Training Shorts"], pool: ["gym", "run", "tee2"] },
  { name: "Gaming", image: "gaming1", subs: ["Mobile Games", "PC Games", "Gaming Consoles"], nouns: ["Graphic Oversized Tee", "Player Hoodie"], pool: ["gaming1", "gaming2", "gaming3"] },
  { name: "Racing Sports", image: "race1", subs: ["Motorsports", "Car Racing", "F1 Race"], nouns: ["Pit Crew Oversized Tee", "Track Jacket"], pool: ["race1", "race2", "tee1"] },
  { name: "Casual Wear", image: "street1", subs: ["Millennials", "Gen-Z", "Profession Pride", "Science", "Wildlife"], nouns: ["Oversized Graphic Tee", "Relaxed Fit Tee"], pool: ["street1", "street2", "street3", "tee1", "tee3", "tee4"] },
  { name: "Formal Wear", image: "formal1", subs: ["Shirts", "Pants", "Trousers"], nouns: ["Tailored Fit", "Slim Fit"], pool: ["formal1", "formal2", "formal3"] },
  { name: "Outdoor & Hiking", image: "hike1", subs: ["Hiking Pants", "Hiking Shirts", "Hiking T-Shirts", "Hiking Shorts", "Hiking Capris"], nouns: ["Trail Ready", "Ridge Line"], pool: ["hike1", "hike2", "hike3"] },
];
const SUB_IMG: Record<string, ImgKey> = {
  running: "run", boxing: "box", combat: "box", mma: "box", "kick-boxing": "box", football: "football", cricket: "cricket", tennis: "tennis", badminton: "badminton",
  "f1-race": "race1", "car-racing": "race2", wildlife: "wildlife", science: "science", "profession-pride": "office", "gen-z": "genz",
};

export const categoriesSeed: Category[] = CAT_DEF.map((c, i) => ({
  id: `cat_${i + 1}`,
  slug: slugify(c.name),
  name: c.name,
  image: img(c.image, 800),
  subs: c.subs.map((s, j) => ({ id: `sub_${i + 1}_${j + 1}`, slug: slugify(s), name: s })),
}));

// ── Products (generated, 2 per subcategory) ──────────────────
const BASE = new Date("2026-10-01T10:00:00Z").getTime();
const PALETTE = [
  { name: "Jet Black", hex: "#111111" }, { name: "Bone", hex: "#E9E6DC" }, { name: "Volt", hex: "#C6FF00" },
  { name: "Slate", hex: "#4B5563" }, { name: "Olive", hex: "#556B2F" }, { name: "Rust", hex: "#B7410E" }, { name: "Navy", hex: "#1E2A44" },
];
const DISC = [0, 0.2, 0.3, 0.4, 0.5, 0.25];

function buildProducts(): Product[] {
  const out: Product[] = [];
  let i = 0;
  CAT_DEF.forEach((c) => {
    const cslug = slugify(c.name);
    c.subs.forEach((s) => {
      const sslug = slugify(s);
      c.nouns.forEach((noun, n) => {
        const isFormal = cslug === "formal-wear";
        const name = isFormal ? `${noun} Formal ${s.replace(/s$/, "")}` : cslug === "outdoor-hiking" ? `${noun} ${s}` : `${s} ${noun}`;
        const mrp = 899 + (i % 8) * 150 + (isFormal ? 700 : 0);
        const d = DISC[i % DISC.length];
        const price = d === 0 ? mrp : Math.max(399, Math.round((mrp * (1 - d)) / 100) * 100 - 1);
        const main = SUB_IMG[sslug] ?? c.pool[i % c.pool.length];
        const gallery = [main, c.pool[(i + 1) % c.pool.length], c.pool[(i + 2) % c.pool.length]].filter((v, k, a) => a.indexOf(v) === k);
        const waist = isFormal && sslug !== "shirts";
        out.push({
          id: `p_${i + 1}`,
          slug: slugify(`${name}-${i + 1}`),
          name,
          category: cslug,
          sub: sslug,
          mrp,
          price: Math.min(price, mrp),
          images: gallery.map((k) => img(k, 900)),
          sizes: waist ? ["30", "32", "34", "36", "38"] : ["S", "M", "L", "XL", "XXL"],
          colors: [PALETTE[i % 7], PALETTE[(i + 2) % 7], PALETTE[(i + 4) % 7]],
          sku: `WS-${cslug.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
          stock: i % 13 === 0 ? 0 : i % 7 === 0 ? 6 : 20 + ((i * 7) % 60),
          description: `${name} from the ${s} line. Built for people who move first and explain later — a clean silhouette with sharp, deliberate detailing.`,
          fabric: isFormal ? "65% cotton, 33% polyester, 2% elastane" : "100% combed cotton, 240 GSM, pre-shrunk",
          care: "Machine wash cold with like colours. Do not bleach. Tumble dry low. Iron inside out on low heat.",
          isNew: i % 5 === 0,
          bestSeller: i % 4 === 0,
          trending: i % 3 === 0,
          visible: true,
          createdAt: BASE - i * 86400000,
        });
        i++;
      });
    });
  });
  return out;
}
export const productsSeed = buildProducts();

// ── Curated collections (static, link to category filters) ───
export const COLLECTIONS: { name: string; blurb: string; image: ImgKey; href: string }[] = [
  { name: "Night Run Club", blurb: "Reflective, light, fast.", image: "run", href: "/shop?cat=running" },
  { name: "Pit Lane", blurb: "Race-day graphics.", image: "race1", href: "/shop?cat=racing-sports" },
  { name: "Player Two", blurb: "Gaming-grade comfort.", image: "gaming2", href: "/shop?cat=gaming" },
  { name: "Trail Ready", blurb: "Built for the climb.", image: "hike2", href: "/shop?cat=outdoor-hiking" },
  { name: "Office Hours", blurb: "Sharp without the stiffness.", image: "formal2", href: "/shop?cat=formal-wear" },
];
export const GALLERY: ImgKey[] = ["street1", "run", "race2", "hike3", "gaming2", "street3"];
export const SIZE_CHART = [
  ["S", "36", "27.5", "38"], ["M", "38", "28", "40"], ["L", "40", "28.5", "42"], ["XL", "42", "29.5", "44"], ["XXL", "44", "30", "46"],
];

// ── Orders / customers / reviews ─────────────────────────────
const customersSeed = [
  ["Aarav Mehta", "aarav@example.com", "Mumbai"], ["Ishita Rao", "ishita@example.com", "Bengaluru"], ["Kabir Singh", "kabir@example.com", "Delhi"],
  ["Meera Nair", "meera@example.com", "Kochi"], ["Rohan Das", "rohan@example.com", "Kolkata"], ["Tanvi Shah", "tanvi@example.com", "Ahmedabad"],
  ["Vikram Joshi", "vikram@example.com", "Pune"], ["Zoya Khan", "zoya@example.com", "Hyderabad"],
].map(([name, email, city], i) => ({ id: `cu_${i + 1}`, name, email, city, phone: `98${String(10000000 + i * 1111111).slice(0, 8)}`, joined: new Date(BASE - (i + 3) * 9 * 86400000).toISOString() }));

const STATUSES: Order["status"][] = ["Delivered", "Shipped", "Processing", "Pending", "Delivered", "Cancelled", "Delivered", "Shipped", "Pending", "Delivered"];
const ordersSeed: Order[] = STATUSES.map((status, i) => {
  const c = customersSeed[i % customersSeed.length];
  const items = [productsSeed[(i * 3) % productsSeed.length], productsSeed[(i * 5 + 1) % productsSeed.length]].slice(0, 1 + (i % 2)).map((p) => ({
    productId: p.id, name: p.name, size: p.sizes[1], color: p.colors[0].name, qty: 1 + (i % 3 === 0 ? 1 : 0), price: p.price,
  }));
  const subtotal = items.reduce((a, x) => a + x.price * x.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 79;
  return {
    id: `o_${i + 1}`, number: `WS-${1001 + i}`, customerName: c.name, email: c.email, phone: c.phone, address: `${12 + i}, Demo Street`, city: c.city, pin: "400001",
    items, subtotal, discount: 0, shipping, total: subtotal + shipping, status, payment: "Cash on Delivery",
    date: new Date(BASE - i * 86400000 * 1.5).toISOString(),
  };
});

export const SALES_SERIES = [
  { d: "Mon", v: 18400 }, { d: "Tue", v: 22100 }, { d: "Wed", v: 15800 }, { d: "Thu", v: 27900 }, { d: "Fri", v: 31200 }, { d: "Sat", v: 38600 }, { d: "Sun", v: 29400 },
];

export const defaults: AppState = {
  products: productsSeed,
  categories: categoriesSeed,
  slides: [
    { id: "s1", title: "Live on the Wyld Side", sub: "The Autumn drop. Oversized graphics, heavyweight cotton, zero apologies.", cta: "Shop new arrivals", href: "/shop?sort=newest", image: img("street1", 1800), visible: true },
    { id: "s2", title: "Built for the track", sub: "Racing-inspired tees and jackets for people who live in the slipstream.", cta: "Shop racing", href: "/shop?cat=racing-sports", image: img("race1", 1800), visible: true },
    { id: "s3", title: "Player two has entered", sub: "Gaming-grade comfort for long sessions and longer nights.", cta: "Shop gaming", href: "/shop?cat=gaming", image: img("gaming2", 1800), visible: true },
    { id: "s4", title: "Go further out", sub: "Trail-ready hiking layers that handle the climb and the walk home.", cta: "Shop outdoor", href: "/shop?cat=outdoor-hiking", image: img("hike2", 1800), visible: true },
  ],
  promos: [
    { id: "pr1", title: "Flat 40% off sportswear", text: "Training tees and shorts, this week only.", href: "/shop?cat=sports&sort=discount", image: img("gym", 1200), visible: true },
    { id: "pr2", title: "Buy 2, save ₹200", text: "Use code FIRST200 on orders above ₹1,499.", href: "/shop", image: img("tee2", 1200), visible: true },
  ],
  sections: [
    { id: "categories", label: "Category selector", visible: true },
    { id: "newArrivals", label: "New Arrivals", visible: true },
    { id: "bestSellers", label: "Best Sellers", visible: true },
    { id: "promos", label: "Promotional banners", visible: true },
    { id: "trending", label: "Trending Now", visible: true },
    { id: "collections", label: "Shop by Collection", visible: true },
    { id: "reviews", label: "Customer reviews", visible: true },
    { id: "gallery", label: "Lifestyle gallery", visible: true },
    { id: "newsletter", label: "Newsletter", visible: true },
  ],
  coupons: [
    { id: "c1", code: "WYLD10", type: "percent", value: 10, minOrder: 0, active: true },
    { id: "c2", code: "FIRST200", type: "flat", value: 200, minOrder: 1499, active: true },
    { id: "c3", code: "EXPIRED", type: "percent", value: 50, minOrder: 0, active: false },
  ],
  reviews: [
    { id: "r1", name: "Aarav M.", rating: 5, title: "Heavyweight, properly oversized", text: "The fabric has real weight and the drop shoulder sits exactly right. Washed three times, no shrinkage.", product: "Casual Oversized Tee", status: "approved" },
    { id: "r2", name: "Ishita R.", rating: 5, title: "My new running tee", text: "Dries fast, doesn't cling, and the colour hasn't faded. Ordered two more.", product: "Running Performance Tee", status: "approved" },
    { id: "r3", name: "Kabir S.", rating: 4, title: "Great hoodie", text: "Warm and soft. Runs slightly large, so size down if you like a fitted look.", product: "Player Hoodie", status: "approved" },
    { id: "r4", name: "Meera N.", rating: 5, title: "Delivery in 3 days", text: "Packaging was neat and the hiking shirt is lighter than it looks.", product: "Hiking Shirt", status: "approved" },
    { id: "r5", name: "Rohan D.", rating: 3, title: "Good, wish there were more colours", text: "Quality is solid. I'd love a few more colour options in the formal range.", product: "Formal Shirt", status: "pending" },
    { id: "r6", name: "Spam Bot", rating: 1, title: "Visit my site", text: "Buy cheap watches at example.invalid", product: "—", status: "pending" },
  ],
  orders: ordersSeed,
  customers: customersSeed,
  subscribers: ["hello@example.com", "streetfan@example.com", "runner@example.com", "gamer@example.com", "trail@example.com", "pit@example.com"].map((email, i) => ({ id: `sb_${i + 1}`, email, date: new Date(BASE - i * 3 * 86400000).toISOString() })),
  settings: {
    brandName: "WYLDSIDE", logoUrl: "", email: "support@wyldside.example", phone: "+91 90000 00000",
    address: "12 Demo Lane, Hauz Khas, New Delhi 110016", freeShipOver: 999, shipFee: 79,
    instagram: "https://instagram.com", youtube: "https://youtube.com", x: "https://x.com",
  },
  nav: [
    { id: "n1", label: "Sports", href: "/shop?cat=sports", category: "sports" },
    { id: "n2", label: "Gaming", href: "/shop?cat=gaming", category: "gaming" },
    { id: "n3", label: "Racing Sports", href: "/shop?cat=racing-sports", category: "racing-sports" },
    { id: "n4", label: "Casual Wear", href: "/shop?cat=casual-wear", category: "casual-wear" },
    { id: "n5", label: "Formal Wear", href: "/shop?cat=formal-wear", category: "formal-wear" },
    { id: "n6", label: "Outdoor & Hiking", href: "/shop?cat=outdoor-hiking", category: "outdoor-hiking" },
    { id: "n7", label: "Sale", href: "/shop?sort=discount", category: "" },
  ],
  announcements: [
    { id: "a1", text: "Free shipping on orders above ₹999", visible: true },
    { id: "a2", text: "Use WYLD10 for 10% off your first order", visible: true },
    { id: "a3", text: "Cash on Delivery available across India", visible: true },
  ],
  cart: [],
  wishlist: [],
  coupon: null,
  user: null,
};
