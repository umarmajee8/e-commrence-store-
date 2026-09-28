import p1 from "../assets/raw/p1.jpg";
import p2 from "../assets/raw/p2.jpg";
import p3 from "../assets/raw/p3.jpg";
import p4 from "../assets/raw/p4.jpg";
import p5 from "../assets/raw/p5.jpg";
import p6 from "../assets/raw/p6.jpg";
import p7 from "../assets/raw/p7.jpg";
import p8 from "../assets/raw/p8.jpg";
import p9 from "../assets/raw/p9.jpg";

export type Product = {
  id: number;
  name: string;
  alt: string;
  image: string;
  price: number;
  oldPrice?: number;
  badge?: "new" | "sale";
};

export const PRODUCTS: Product[] = [
  { id: 1, name: "T- Shirt And Jeans", alt: "Cream knit crewneck sweater", image: p1, price: 60, oldPrice: 66.67, badge: "sale" },
  { id: 2, name: "T- Shirt And Jeans", alt: "Grey canvas backpack with leather straps", image: p2, price: 70, badge: "new" },
  { id: 3, name: "T- Shirt And Jeans", alt: "Black cat-eye sunglasses", image: p3, price: 40, oldPrice: 44.44, badge: "sale" },
  { id: 4, name: "T- Shirt And Jeans", alt: "Cream panama hat with black band", image: p4, price: 80, badge: "new" },
  { id: 5, name: "T- Shirt And Jeans", alt: "Black field watch with tan leather strap", image: p5, price: 30, oldPrice: 33.33, badge: "sale" },
  { id: 6, name: "T- Shirt And Jeans", alt: "Brown braided leather belt", image: p6, price: 90, badge: "new" },
  { id: 7, name: "T- Shirt And Jeans", alt: "White leather sneaker with black stripe", image: p7, price: 20, oldPrice: 22.22, badge: "sale" },
  { id: 8, name: "T- Shirt And Jeans", alt: "Rust red chino pants", image: p8, price: 50, badge: "new" },
  { id: 9, name: "T- Shirt And Jeans", alt: "White over-ear headphones", image: p9, price: 50, badge: "new" },
];

export const money = (n: number) => `$ ${n.toFixed(2)}`;
