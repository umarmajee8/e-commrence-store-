import { useCallback, useEffect, useRef, useState } from "react";
import { PRODUCTS, money, type Product } from "../data/products";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { CheckIcon, CloseIcon } from "./Icons";

type Props = {
  onAdd: (product: Product, qty?: number) => void;
};

function QuickView({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (product: Product, q: number) => void }) {
  const [qty, setQty] = useState(1);
  const [shown, setShown] = useState(false);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<number | null>(null);

  const handleAdd = () => {
    onAdd(product, qty);
    setAdded(true);
    if (addedTimer.current !== null) window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => {
      setAdded(false);
      addedTimer.current = null;
    }, 2000);
  };

  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (addedTimer.current !== null) window.clearTimeout(addedTimer.current);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} quick view`}
      className={`fixed inset-0 z-[60] grid place-items-center p-4 transition-colors duration-300 ${shown ? "bg-black/50" : "bg-black/0"}`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative grid max-h-[92vh] w-full max-w-[860px] overflow-y-auto bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:grid-cols-2 ${
          shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 text-ink hover:text-accent">
          <CloseIcon className="h-6 w-6" />
        </button>
        <div className="grid aspect-square place-items-center bg-tile md:aspect-auto">
          <img
            src={product.image}
            alt={product.alt}
            style={product.imageWidth ? { width: `${product.imageWidth}%` } : undefined}
            className="w-full mix-blend-multiply"
          />
        </div>
        <div className="flex flex-col justify-center p-7 md:p-10">
          <h2 className="text-[24px] font-medium text-ink">{product.name}</h2>
          <p className="mt-3 text-[22px] text-alert">
            {money(product.price)}
            {product.oldPrice && <del className="ml-3 text-[16px] text-muted">{money(product.oldPrice)}</del>}
          </p>
          <p className="mt-5 border-b border-line pb-6 text-[14px] leading-[26px] text-muted">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex h-[52px] items-center border border-line">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-full w-10 text-lg text-muted hover:text-accent">
                −
              </button>
              <span className="w-8 text-center text-[14px]" aria-live="polite">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="h-full w-10 text-lg text-muted hover:text-accent">
                +
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              aria-live="polite"
              className="h-[52px] bg-ink px-8 text-[13px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-accent"
            >
              {added ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span>Added</span>
                  <CheckIcon className="h-4 w-4" aria-hidden="true" />
                </span>
              ) : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewArrival({ onAdd }: Props) {
  const [quick, setQuick] = useState<Product | null>(null);
  const closeQuick = useCallback(() => setQuick(null), []);

  return (
    <section id="new-arrival" aria-labelledby="new-arrival-title" className="scroll-mt-24 pb-[50px] pt-[40px] lg:pb-[70px] lg:pt-[45px]">
      <div className="mx-auto max-w-[1230px] px-[15px]">
        <Reveal className="mb-[45px] text-center lg:mb-[55px]">
          <h2 id="new-arrival-title" className="text-[26px] font-semibold text-ink lg:text-[30px]">
            New Arrival
          </h2>
          <span className="mx-auto mt-2 block h-[2px] w-[80px] bg-ink" aria-hidden="true" />
          <p className="mt-5 text-[13px] text-body lg:text-[14px]">Lorem ipsum dolor sit amet conse ctetu.</p>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-[15px] gap-y-8 sm:grid-cols-3 md:gap-x-[30px] lg:grid-cols-5 lg:gap-y-[30px]">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.id} delay={(i % 5) * 90}>
              <ProductCard
                product={p}
                onAdd={() => onAdd(p, 1)}
                onQuickView={() => setQuick(p)}
              />
            </Reveal>
          ))}
        </div>
      </div>

      {quick && (
        <QuickView
          product={quick}
          onClose={closeQuick}
          onAdd={onAdd}
        />
      )}
    </section>
  );
}
