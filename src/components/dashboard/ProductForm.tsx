import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { CATEGORIES, type Product, type ProductBadge, type ProductStatus } from "../../data/products";
import { toast } from "../Toaster";
import { UploadIcon } from "./icons";
import { Button, Field, inputClass, selectClass, Toggle } from "./ui";

export type ProductDraft = {
  name: string;
  category: string;
  price: string;
  oldPrice: string;
  stock: string;
  description: string;
  image: string;
  imageWidth: string;
  badge: "" | ProductBadge;
  status: ProductStatus;
  featured: boolean;
};

export const emptyDraft: ProductDraft = {
  name: "",
  category: CATEGORIES[0],
  price: "",
  oldPrice: "",
  stock: "",
  description: "",
  image: "",
  imageWidth: "",
  badge: "",
  status: "published",
  featured: true,
};

export function draftFromProduct(product: Product): ProductDraft {
  return {
    name: product.name,
    category: product.category,
    price: String(product.price),
    oldPrice: product.oldPrice ? String(product.oldPrice) : "",
    stock: String(product.stock),
    description: product.description ?? "",
    image: product.image,
    imageWidth: product.imageWidth ? String(product.imageWidth) : "",
    badge: product.badge ?? "",
    status: product.status,
    featured: true,
  };
}

type Props = {
  initial?: ProductDraft;
  submitLabel: string;
  onSubmit: (draft: ProductDraft) => void;
  onCancel: () => void;
};

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;

export default function ProductForm({ initial = emptyDraft, submitLabel, onSubmit, onCancel }: Props) {
  const [draft, setDraft] = useState<ProductDraft>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductDraft, string>>>({});
  const [dragging, setDragging] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // The parent remounts this form (via `key`) whenever the edited product changes,
  // so the draft can safely start from `initial`.
  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const price = Number(draft.price);
  const oldPrice = Number(draft.oldPrice);
  const autoDiscount = draft.price && draft.oldPrice && oldPrice > price
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : null;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Please choose an image file (JPG, PNG or WebP).", "error");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast("That image is larger than 6 MB — pick a smaller one.", "error");
      return;
    }
    setLoadingImage(true);
    try {
      const { toCompressedDataUrl } = await import("../../utils/helpers");
      const dataUrl = await toCompressedDataUrl(file);
      set("image", dataUrl);
      toast("Image added to the product.");
    } catch {
      toast("Could not read that image. Try another file.", "error");
    } finally {
      setLoadingImage(false);
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void handleFile(event.dataTransfer.files?.[0]);
  };

  const validate = () => {
    const next: Partial<Record<keyof ProductDraft, string>> = {};
    if (!draft.name.trim()) next.name = "Product name is required.";
    if (!draft.price.trim() || Number.isNaN(price) || price <= 0) next.price = "Enter a price greater than 0.";
    if (draft.oldPrice.trim() && (Number.isNaN(oldPrice) || oldPrice <= price)) {
      next.oldPrice = "Compare-at price should be higher than the price.";
    }
    if (draft.stock.trim() && (Number.isNaN(Number(draft.stock)) || Number(draft.stock) < 0)) {
      next.stock = "Stock must be 0 or more.";
    }
    if (!draft.image) next.image = "Add a product image.";
    if (draft.imageWidth.trim() && (Number(draft.imageWidth) < 20 || Number(draft.imageWidth) > 100)) {
      next.imageWidth = "Use a value between 20 and 100.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      toast("Please fix the highlighted fields.", "error");
      document.querySelector<HTMLElement>("[data-form-error='true']")?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      return;
    }
    onSubmit(draft);
  };

  const categoryOptions = Array.from(new Set([...CATEGORIES, draft.category].filter(Boolean)));

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Image + preview */}
      <div className="space-y-4">
        <div
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-tile text-center transition-colors ${
            errors.image ? "border-alert" : dragging ? "border-ink bg-[#ededed]" : "border-line"
          }`}
          data-form-error={Boolean(errors.image)}
        >
          {draft.image ? (
            <>
              <img src={draft.image} alt="Product preview" className="h-full w-full object-contain p-3 mix-blend-multiply" />
              <div className="absolute inset-x-0 bottom-0 flex divide-x divide-white/25 bg-ink/85 text-white backdrop-blur-sm">
                <button type="button" onClick={() => fileRef.current?.click()} className="flex-1 py-2.5 text-[11.5px] font-medium uppercase tracking-wide hover:bg-black">
                  Replace
                </button>
                <button type="button" onClick={() => set("image", "")} className="flex-1 py-2.5 text-[11.5px] font-medium uppercase tracking-wide hover:bg-black">
                  Remove
                </button>
              </div>
            </>
          ) : (
            <div className="px-6">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-muted shadow-sm">
                {loadingImage ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" /> : <UploadIcon className="h-5 w-5" />}
              </span>
              <p className="mt-3 text-[13px] font-medium text-ink">{loadingImage ? "Processing image…" : "Drop an image here"}</p>
              <p className="mt-1 text-[11.5px] leading-4 text-muted">or click to browse. JPG, PNG or WebP up to 6 MB.</p>
              <button type="button" onClick={() => fileRef.current?.click()} className="mt-3 rounded-lg border border-line bg-white px-3.5 py-1.5 text-[12px] font-medium text-ink hover:border-ink">
                Choose file
              </button>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => { void handleFile(event.target.files?.[0]); event.target.value = ""; }}
        />
        {errors.image && <p className="text-[12px] text-alert">{errors.image}</p>}

        <Field label="Image URL" hint="optional">
          <input
            className={inputClass}
            placeholder="https://… or paste a data URL"
            value={draft.image.startsWith("data:") ? "" : draft.image}
            onChange={(event) => set("image", event.target.value)}
          />
        </Field>
        {draft.image.startsWith("data:") && (
          <p className="-mt-2 text-[11.5px] text-muted">Uploaded image is in use. Paste a URL to use a hosted image instead.</p>
        )}

        <Field label="Image zoom" hint="% of tile width">
          <input
            className={inputClass}
            inputMode="numeric"
            placeholder="100 (default)"
            value={draft.imageWidth}
            onChange={(event) => set("imageWidth", event.target.value.replace(/[^\d]/g, ""))}
          />
        </Field>
        {errors.imageWidth && <p className="-mt-2 text-[12px] text-alert">{errors.imageWidth}</p>}
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <Field label="Product name" error={errors.name}>
          <input
            className={inputClass}
            placeholder="e.g. Cream Knit Sweater"
            value={draft.name}
            onChange={(event) => set("name", event.target.value)}
            data-form-error={Boolean(errors.name)}
            autoFocus
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <input
              className={inputClass}
              list="product-categories"
              value={draft.category}
              onChange={(event) => set("category", event.target.value)}
              placeholder="Pick or type a category"
            />
            <datalist id="product-categories">
              {categoryOptions.map((category) => <option key={category} value={category} />)}
            </datalist>
          </Field>
          <Field label="Stock quantity">
            <input
              className={inputClass}
              inputMode="numeric"
              placeholder="0"
              value={draft.stock}
              onChange={(event) => set("stock", event.target.value.replace(/[^\d]/g, ""))}
            />
          </Field>
        </div>
        {errors.stock && <p className="-mt-2 text-[12px] text-alert">{errors.stock}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Price ($)" error={errors.price}>
            <input
              className={inputClass}
              inputMode="decimal"
              placeholder="0.00"
              value={draft.price}
              onChange={(event) => set("price", event.target.value.replace(/[^\d.]/g, ""))}
              data-form-error={Boolean(errors.price)}
            />
          </Field>
          <Field label="Compare-at price ($)" hint="shows strike-through" error={errors.oldPrice}>
            <input
              className={inputClass}
              inputMode="decimal"
              placeholder="optional"
              value={draft.oldPrice}
              onChange={(event) => set("oldPrice", event.target.value.replace(/[^\d.]/g, ""))}
            />
          </Field>
        </div>
        {autoDiscount !== null && (
          <p className="-mt-1 inline-flex items-center gap-2 rounded-full bg-[#e7f8f0] px-3 py-1 text-[11.5px] font-medium text-[#0b7a51]">
            Storefront will show a −{autoDiscount}% badge
          </p>
        )}

        <Field label="Description">
          <textarea
            className={`${inputClass} min-h-[92px] resize-y leading-6`}
            placeholder="A short product description shoppers will see in quick view."
            value={draft.description}
            onChange={(event) => set("description", event.target.value)}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Badge">
            <select className={selectClass} value={draft.badge} onChange={(event) => set("badge", event.target.value as ProductDraft["badge"])}>
              <option value="">No badge</option>
              <option value="new">New</option>
              <option value="sale">Sale (−percentage)</option>
            </select>
          </Field>
          <Field label="Visibility">
            <select className={selectClass} value={draft.status} onChange={(event) => set("status", event.target.value as ProductStatus)}>
              <option value="published">Published — visible in store</option>
              <option value="draft">Draft — hidden from store</option>
            </select>
          </Field>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-[#fafafa] px-4 py-3.5">
          <div>
            <p className="text-[13px] font-medium text-ink">Show in New Arrival</p>
            <p className="mt-0.5 text-[11.5px] text-muted">Display this product in the featured grid on the homepage.</p>
          </div>
          <Toggle checked={draft.featured} onChange={(next) => set("featured", next)} label="Show in New Arrival" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 lg:col-span-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="min-w-[150px]">{submitLabel}</Button>
      </div>
    </form>
  );
}
