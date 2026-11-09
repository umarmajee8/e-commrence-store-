import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import NewArrival from "./components/NewArrival";
import Footer from "./components/Footer";
import Toaster from "./components/Toaster";
import { ArrowUp } from "./components/Icons";
import AdminLogin from "./components/dashboard/AdminLogin";
import Dashboard from "./components/dashboard/Dashboard";
import type { Product } from "./data/products";
import { useStore } from "./store/store";

export type CartLine = { product: Product; quantity: number };

/** Tiny hash router: "#/admin" opens the dashboard, anything else is the storefront. */
function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash.startsWith("#/admin") ? "admin" : "store";
}

export default function App() {
  const { user, products } = useStore();
  const route = useRoute();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartBump, setCartBump] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const cartCount = useMemo(() => cart.reduce((total, line) => total + line.quantity, 0), [cart]);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart((items) => {
      const existing = items.find((line) => line.product.id === product.id);
      return existing
        ? items.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + qty } : line)
        : [...items, { product, quantity: qty }];
    });
    setCartBump((b) => b + 1);
    setCartOpen(true);
  }, []);

  const changeCartQuantity = useCallback((productId: number, quantity: number) => {
    setCart((items) => quantity <= 0
      ? items.filter((line) => line.product.id !== productId)
      : items.map((line) => line.product.id === productId ? { ...line, quantity } : line));
  }, []);

  // Keep the cart in sync with dashboard edits: refresh prices/names, drop deleted products.
  useEffect(() => {
    setCart((items) => {
      let changed = false;
      const next: CartLine[] = [];
      for (const line of items) {
        const latest = products.find((product) => product.id === line.product.id);
        if (!latest) {
          changed = true;
          continue;
        }
        if (latest !== line.product) {
          changed = true;
          next.push({ ...line, product: latest });
        } else {
          next.push(line);
        }
      }
      return changed ? next : items;
    });
  }, [products]);

  useEffect(() => {
    document.title = route === "admin"
      ? (user ? "Dashboard — Precious Store" : "Sign in — Precious Store")
      : "Precious — Minimal Fashion Store";
  }, [route, user]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (route === "admin") {
    return (
      <>
        {user ? <Dashboard /> : <AdminLogin />}
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Header
        cart={cart}
        cartCount={cartCount}
        cartBump={cartBump}
        cartOpen={cartOpen}
        onCartOpenChange={setCartOpen}
        onCartQuantityChange={changeCartQuantity}
      />
      <main>
        <Hero />
        <Features />
        <NewArrival onAdd={addToCart} />
      </main>
      <Footer />

      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-30 grid h-11 w-11 place-items-center rounded-full bg-accent text-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:bg-ink ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>

      <Toaster />
    </>
  );
}
