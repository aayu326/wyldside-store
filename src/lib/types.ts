export type Sub = { id: string; slug: string; name: string };
export type Category = { id: string; slug: string; name: string; image: string; subs: Sub[] };
export type ColorOpt = { name: string; hex: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string; // category slug
  sub: string; // subcategory slug
  gender?: "male" | "female" | "unisex";
  mrp: number;
  price: number;
  images: string[];
  sizes: string[];
  colors: ColorOpt[];
  sku: string;
  stock: number;
  description: string;
  fabric: string;
  care: string;
  isNew: boolean;
  bestSeller: boolean;
  trending: boolean;
  visible: boolean;
  createdAt: number;
};

export type Slide = { id: string; title: string; sub: string; cta: string; href: string; image: string; visible: boolean };
export type Promo = { id: string; title: string; text: string; href: string; image: string; visible: boolean };
export type Section = { id: string; label: string; visible: boolean };
export type Coupon = { id: string; code: string; type: "percent" | "flat"; value: number; minOrder: number; active: boolean };
export type Review = { id: string; name: string; rating: number; title: string; text: string; product: string; status: "pending" | "approved" | "rejected" };
export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type OrderItem = { productId: string; name: string; size: string; color: string; qty: number; price: number };
export type Order = {
  id: string;
  number: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pin: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  payment: string;
  date: string;
};
export type Customer = { id: string; name: string; email: string; phone: string; city: string; joined: string };
export type Subscriber = { id: string; email: string; date: string };
export type Settings = {
  brandName: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  freeShipOver: number;
  shipFee: number;
  instagram: string;
  youtube: string;
  x: string;
};
export type NavItem = { id: string; label: string; href: string; category: string };
export type Announcement = { id: string; text: string; visible: boolean };
export type CartLine = { productId: string; size: string; color: string; qty: number };
export type User = { name: string; email: string };

export type AppState = {
  products: Product[];
  categories: Category[];
  slides: Slide[];
  promos: Promo[];
  sections: Section[];
  coupons: Coupon[];
  reviews: Review[];
  orders: Order[];
  customers: Customer[];
  subscribers: Subscriber[];
  settings: Settings;
  nav: NavItem[];
  announcements: Announcement[];
  cart: CartLine[];
  wishlist: string[];
  coupon: string | null;
  user: User | null;
};
