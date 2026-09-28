import { useCallback, useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import NewArrival from "./components/NewArrival";
import Footer from "./components/Footer";
import { ArrowUp } from "./components/Icons";

export default function App() {
  const [cartCount, setCartCount] = useState(2);
  const [cartBump, setCartBump] = useState(0);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [showTop, setShowTop] = useState(false);

  const addToCart = useCallback((qty = 1) => {
    setCartCount((c) => c + qty);
    setCartBump((b) => b + 1);
  }, []);

  const toggleWish = useCallback((id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Header cartCount={cartCount} wishCount={wishlist.size} cartBump={cartBump} />
      <main>
        <Hero />
        <Features />
        <NewArrival wishlist={wishlist} onWish={toggleWish} onAdd={addToCart} />
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
    </>
  );
}
