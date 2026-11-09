import p1 from "../assets/raw/p1.jpg";
import p2 from "../assets/raw/p2.jpg";
import p3 from "../assets/raw/p3.jpg";
import p4 from "../assets/raw/p4.jpg";
import p5 from "../assets/raw/p5.jpg";
import p6 from "../assets/raw/p6.jpg";
import p7 from "../assets/raw/p7.jpg";
import p8 from "../assets/raw/p8.jpg";
import p9 from "../assets/raw/p9.jpg";
import macbookAirM4 from "../assets/raw/macbook-air-m4.jpg";

export type ProductBadge = "new" | "sale";
export type ProductStatus = "published" | "draft";

export type Product = {
  id: number;
  name: string;
  alt: string;
  image: string;
  price: number;
  oldPrice?: number;
  badge?: ProductBadge;
  imageWidth?: number;
  /** Merchandising fields, editable from the admin dashboard. */
  category: string;
  stock: number;
  description?: string;
  status: ProductStatus;
  /** Show in the homepage "New Arrival" grid. */
  featured?: boolean;
  createdAt: number;
};

/** Preset categories; the admin form also accepts a custom one. */
export const CATEGORIES = ["Men", "Women", "Shoes", "Accessories", "Electronics"] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Men: "#2f6fed",
  Women: "#d6336c",
  Shoes: "#0ca678",
  Accessories: "#f08c00",
  Electronics: "#7048e8",
};

export const categoryColor = (category: string) => CATEGORY_COLORS[category] ?? "#495057";

const DAY = 24 * 60 * 60 * 1000;
const SEED_BASE = Date.now() - 40 * DAY;

export const SEED_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Cream Knit Sweater",
    alt: "Cream knit crewneck sweater",
    image: p1,
    price: 60,
    oldPrice: 66.67,
    badge: "sale",
    category: "Women",
    stock: 14,
    status: "published",
    description: "A soft, relaxed crewneck knit in a warm cream shade — made for everyday layering.",
    createdAt: SEED_BASE + 1 * 3 * DAY,
  },
  {
    id: 2,
    name: "Canvas Backpack",
    alt: "Grey canvas backpack with leather straps",
    image: p2,
    price: 70,
    badge: "new",
    category: "Accessories",
    stock: 8,
    status: "published",
    description: "Grey canvas backpack with leather straps and a roomy main compartment for daily commutes.",
    createdAt: SEED_BASE + 2 * 3 * DAY,
  },
  {
    id: 3,
    name: "Cat-Eye Sunglasses",
    alt: "Black cat-eye sunglasses",
    image: p3,
    price: 40,
    oldPrice: 44.44,
    badge: "sale",
    category: "Accessories",
    stock: 21,
    status: "published",
    description: "Glossy black cat-eye frames with UV400 lenses and a slim, lightweight fit.",
    createdAt: SEED_BASE + 3 * 3 * DAY,
  },
  {
    id: 4,
    name: "Panama Hat",
    alt: "Cream panama hat with black band",
    image: p4,
    price: 80,
    badge: "new",
    category: "Accessories",
    stock: 6,
    status: "published",
    description: "Hand-woven panama hat finished with a black ribbon band for sunny days.",
    createdAt: SEED_BASE + 4 * 3 * DAY,
  },
  {
    id: 5,
    name: "Field Watch",
    alt: "Black field watch with tan leather strap",
    image: p5,
    price: 30,
    oldPrice: 33.33,
    badge: "sale",
    category: "Accessories",
    stock: 12,
    status: "published",
    description: "Minimal black dial, tan leather strap and a quartz movement built for every day.",
    createdAt: SEED_BASE + 5 * 3 * DAY,
  },
  {
    id: 6,
    name: "Braided Leather Belt",
    alt: "Brown braided leather belt",
    image: p6,
    price: 90,
    badge: "new",
    category: "Accessories",
    stock: 9,
    status: "published",
    description: "Full-grain braided leather belt with a brushed metal buckle.",
    createdAt: SEED_BASE + 6 * 3 * DAY,
  },
  {
    id: 7,
    name: "Leather Sneakers",
    alt: "White leather sneaker with black stripe",
    image: p7,
    price: 20,
    oldPrice: 22.22,
    badge: "sale",
    category: "Shoes",
    stock: 17,
    status: "published",
    description: "Clean white leather sneakers with a contrasting black stripe and cushioned sole.",
    createdAt: SEED_BASE + 7 * 3 * DAY,
  },
  {
    id: 8,
    name: "Rust Chino Pants",
    alt: "Rust red chino pants",
    image: p8,
    price: 50,
    badge: "new",
    category: "Men",
    stock: 11,
    status: "published",
    description: "Tailored rust chinos in stretch cotton — smart enough for work, easy enough for weekends.",
    createdAt: SEED_BASE + 8 * 3 * DAY,
  },
  {
    id: 9,
    name: "Over-Ear Headphones",
    alt: "White over-ear headphones",
    image: p9,
    price: 50,
    badge: "new",
    category: "Electronics",
    stock: 7,
    status: "published",
    description: "Wireless over-ear headphones with soft memory-foam cushions and 30-hour battery life.",
    createdAt: SEED_BASE + 9 * 3 * DAY,
  },
  {
    id: 11,
    name: "MacBook Air M4",
    alt: "Midnight MacBook Air with a blue abstract display",
    image: macbookAirM4,
    price: 999,
    badge: "new",
    imageWidth: 72,
    category: "Electronics",
    stock: 4,
    status: "published",
    description: "Midnight MacBook Air with the M4 chip, a stunning Liquid Retina display and all-day battery.",
    createdAt: SEED_BASE + 10 * 3 * DAY,
  },
];

export const money = (n: number) => `$ ${n.toFixed(2)}`;
