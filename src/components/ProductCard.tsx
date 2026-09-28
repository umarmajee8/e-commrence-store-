import { useState } from "react";
import type { Product } from "../data/products";
import { money } from "../data/products";
import { EyeIcon, HeartIcon } from "./Icons";

type Props = {
  product: Product;
  wished: boolean;
  onWish: () => void;
  onAdd: () => void;
  onQuickView: () => void;
};

export default function ProductCard({ product, wished, onWish, onAdd, onQuickView }: Props) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-tile">
        {product.badge && (
          <span
            className={`absolute right-3 top-3 z-10 text-[11px] font-medium lg:right-4 lg:top-4 lg:text-[12px] ${
              product.badge === "sale" ? "text-pink" : "text-accent"
            }`}
          >
            {product.badge === "sale" ? "-10%" : "New"}
          </span>
        )}

        <a href="#" className="absolute inset-0 grid place-items-center" aria-label={`View ${product.name}`} onClick={(e) => { e.preventDefault(); onQuickView(); }}>
          <img
            src={product.image}
            alt={product.alt}
            loading="lazy"
            className="w-full object-contain mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
          />
        </a>

        {/* Hover action bar */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-full opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 bg-accent py-2.5 text-[11px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-ink lg:text-[12px]"
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
          <button
            type="button"
            aria-label="Quick view"
            onClick={onQuickView}
            className="grid w-10 place-items-center border-l border-white/30 bg-accent text-white transition-colors hover:bg-ink"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-[18px] flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-[13px] text-body lg:text-[14px]">
            <a href="#" className="transition-colors hover:text-accent" onClick={(e) => { e.preventDefault(); onQuickView(); }}>
              {product.name}
            </a>
          </h3>
          <p className="mt-[5px] text-[13px] text-body lg:text-[14px]">
            <span>{money(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="mx-1.5 text-muted">-</span>
                <del className="text-pink">{money(product.oldPrice)}</del>
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onWish}
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={`mt-0.5 shrink-0 transition-colors hover:text-accent ${wished ? "text-accent" : "text-muted"}`}
        >
          <HeartIcon filled={wished} className={`h-[15px] w-[15px] ${wished ? "animate-pop" : ""}`} />
        </button>
      </div>
    </article>
  );
}
