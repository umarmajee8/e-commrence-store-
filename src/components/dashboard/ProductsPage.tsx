import { useEffect, useMemo, useRef, useState } from "react";
import { money, type Product } from "../../data/products";
import { useStore } from "../../store/store";
import { formatDate } from "../../utils/helpers";
import { toast } from "../Toaster";
import ProductForm, { draftFromProduct, emptyDraft, type ProductDraft } from "./ProductForm";
import Modal from "./Modal";
import { Badge, Button, selectClass, inputClass } from "./ui";
import { BoxIcon, CopyIcon, EditIcon, EyeOff, GridIcon, MenuBars, PlusIcon, Search, SparkIcon, TrashIcon } from "./icons";

type SortKey = "newest" | "oldest" | "price-high" | "price-low" | "name" | "stock-low";
type CategoryFilter = "all" | string;
type StatusFilter = "all" | "published" | "draft";

type PageProps = {
  query: string;
  onQueryChange: (value: string) => void;
  /** Incremented by the shell whenever "New product" is clicked from another tab. */
  openCreateSeq: number;
  onCreateConsumed: () => void;
};

export default function ProductsPage({ query, onQueryChange, openCreateSeq, onCreateConsumed }: PageProps) {
  const { products, addProduct, updateProduct, deleteProduct, deleteProducts, duplicateProduct, changeStatus } = useStore();

  const [category, setCategory] = useState<CategoryFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [selected, setSelected] = useState<number[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = products.filter((product) => {
      const matchesQuery = !needle || product.name.toLowerCase().includes(needle) || product.category.toLowerCase().includes(needle);
      const matchesCategory = category === "all" || product.category === category;
      const matchesStatus = status === "all" || product.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case "oldest": return a.createdAt - b.createdAt;
        case "price-high": return b.price - a.price;
        case "price-low": return a.price - b.price;
        case "name": return a.name.localeCompare(b.name);
        case "stock-low": return a.stock - b.stock;
        default: return b.createdAt - a.createdAt;
      }
    });
    return sorted;
  }, [products, query, category, status, sort]);

  useEffect(() => {
    setSelected((current) => current.filter((id) => products.some((product) => product.id === id)));
  }, [products]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openCreateRef = useRef(openCreate);
  openCreateRef.current = openCreate;

  useEffect(() => {
    if (openCreateSeq > 0) {
      openCreateRef.current();
      onCreateConsumed();
    }
  }, [openCreateSeq, onCreateConsumed]);

  useEffect(() => {
    const openNew = () => openCreateRef.current();
    window.addEventListener("precious:new-product", openNew);
    return () => window.removeEventListener("precious:new-product", openNew);
  }, []);

  const openEdit = (product: Product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const toProduct = (draft: ProductDraft, base?: Product): Omit<Product, "id" | "createdAt"> => ({
    name: draft.name.trim(),
    alt: base?.alt && base.name === draft.name.trim() ? base.alt : draft.name.trim(),
    image: draft.image,
    price: Number(draft.price),
    oldPrice: draft.oldPrice.trim() ? Number(draft.oldPrice) : undefined,
    badge: draft.badge || undefined,
    imageWidth: draft.imageWidth.trim() ? Number(draft.imageWidth) : undefined,
    category: draft.category.trim() || "Uncategorised",
    stock: draft.stock.trim() ? Number(draft.stock) : 0,
    description: draft.description.trim() || undefined,
    status: draft.status,
    featured: draft.featured,
  });

  const handleSubmit = (draft: ProductDraft) => {
    if (editing) {
      updateProduct(editing.id, toProduct(draft, editing));
      toast(`“${draft.name}” updated — storefront is in sync.`);
    } else {
      addProduct({ ...toProduct(draft), createdAt: Date.now() });
      toast(`“${draft.name}” added to your catalogue.`);
      setStatus("all");
      setCategory("all");
      onQueryChange("");
    }
    closeForm();
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteProduct(deleting.id);
    toast(`“${deleting.name}” deleted.`, "info");
    setDeleting(null);
  };

  const toggleSelected = (id: number) => {
    setSelected((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  };

  const allVisibleSelected = filtered.length > 0 && filtered.every((product) => selected.includes(product.id));
  const toggleAll = () => {
    setSelected(allVisibleSelected ? [] : filtered.map((product) => product.id));
  };

  const clearFilters = () => {
    onQueryChange("");
    setCategory("all");
    setStatus("all");
    setSort("newest");
  };

  const filtersActive = query.trim() !== "" || category !== "all" || status !== "all";
  const lowStock = filtered.filter((product) => product.status === "published" && product.stock <= 5).length;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <section className="rounded-2xl border border-line bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search products by name or category…"
              aria-label="Search products"
              className={`${inputClass} pl-10`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)} className={`${selectClass} h-[42px] w-auto min-w-[130px]`}>
              <option value="all">All categories</option>
              {categories.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
            <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} className={`${selectClass} h-[42px] w-auto min-w-[120px]`}>
              <option value="all">All status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value as SortKey)} className={`${selectClass} h-[42px] w-auto min-w-[140px]`}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="price-high">Price: high → low</option>
              <option value="price-low">Price: low → high</option>
              <option value="stock-low">Stock: low → high</option>
              <option value="name">Name A → Z</option>
            </select>
            <div className="flex rounded-lg border border-line p-0.5" role="group" aria-label="View mode">
              <button type="button" onClick={() => setView("grid")} aria-pressed={view === "grid"} aria-label="Grid view" className={`grid h-9 w-9 place-items-center rounded-md transition-colors ${view === "grid" ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
                <GridIcon className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setView("table")} aria-pressed={view === "table"} aria-label="Table view" className={`grid h-9 w-9 place-items-center rounded-md transition-colors ${view === "table" ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
                <MenuBars className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={openCreate} className="h-[42px]"><PlusIcon className="h-4 w-4" /> Add product</Button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted">
          <span>
            Showing <span className="font-medium text-ink">{filtered.length}</span> of {products.length} products
          </span>
          {lowStock > 0 && (
            <button type="button" onClick={() => setSort("stock-low")} className="inline-flex items-center gap-1.5 transition-colors hover:text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-alert" />
              {lowStock} low on stock — sort by stock
            </button>
          )}
          {filtersActive && (
            <button type="button" onClick={clearFilters} className="font-medium text-ink underline underline-offset-2 hover:text-black">
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Bulk bar */}
      {selected.length > 0 && (
        <div className="sticky top-[70px] z-20 flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-ink px-4 py-3 text-white shadow-lg">
          <span className="text-[13px] font-medium">{selected.length} selected</span>
          <span className="hidden h-4 w-px bg-white/20 sm:block" />
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => { changeStatus(selected, "published"); toast(`${selected.length} product(s) published.`); setSelected([]); }} className="rounded-lg bg-white/10 px-3 py-1.5 text-[12px] font-medium hover:bg-white/20">Publish</button>
            <button type="button" onClick={() => { changeStatus(selected, "draft"); toast(`${selected.length} product(s) moved to draft.`, "info"); setSelected([]); }} className="rounded-lg bg-white/10 px-3 py-1.5 text-[12px] font-medium hover:bg-white/20">Move to draft</button>
            <button type="button" onClick={() => setBulkDeleteOpen(true)} className="rounded-lg bg-alert px-3 py-1.5 text-[12px] font-medium hover:bg-[#e13c3c]">Delete</button>
            <button type="button" onClick={() => setSelected([])} className="px-2 text-[12px] text-white/70 hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <section className="rounded-2xl border border-line bg-white px-6 py-16 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-tile text-muted"><BoxIcon className="h-6 w-6" /></span>
          <h2 className="mt-4 text-[16px] font-semibold text-ink">No products found</h2>
          <p className="mx-auto mt-1.5 max-w-[360px] text-[13px] leading-5 text-muted">
            {products.length === 0 ? "Your catalogue is empty. Add your first product to start selling." : "Try a different search term, or clear the filters to see everything."}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button onClick={openCreate}><PlusIcon className="h-4 w-4" /> Add product</Button>
            {filtersActive && <Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
          </div>
        </section>
      ) : view === "grid" ? (
        <section aria-label="Product grid" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCardAdmin
              key={product.id}
              product={product}
              selected={selected.includes(product.id)}
              onSelect={() => toggleSelected(product.id)}
              onEdit={() => openEdit(product)}
              onDuplicate={() => { duplicateProduct(product.id); toast("Product duplicated as a draft."); }}
              onDelete={() => setDeleting(product)}
              onToggleStatus={() => {
                updateProduct(product.id, { ...product, status: product.status === "published" ? "draft" : "published" });
                toast(product.status === "published" ? "Product hidden from store." : "Product published to store.", "info");
              }}
            />
          ))}
        </section>
      ) : (
        <section aria-label="Product table" className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-[13px]">
              <thead className="border-b border-line bg-[#fafafa] text-[11px] uppercase tracking-[0.06em] text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    <input type="checkbox" aria-label="Select all products" checked={allVisibleSelected} onChange={toggleAll} className="h-3.5 w-3.5 accent-black" />
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">Product</th>
                  <th scope="col" className="px-3 py-3 font-medium">Category</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">Price</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">Stock</th>
                  <th scope="col" className="px-3 py-3 font-medium">Status</th>
                  <th scope="col" className="px-3 py-3 font-medium">Added</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((product) => (
                  <tr key={product.id} className="group transition-colors hover:bg-[#fafafa]">
                    <td className="px-4 py-3">
                      <input type="checkbox" aria-label={`Select ${product.name}`} checked={selected.includes(product.id)} onChange={() => toggleSelected(product.id)} className="h-3.5 w-3.5 accent-black" />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-tile">
                          <img src={product.image} alt="" className="h-full w-full object-contain p-1 mix-blend-multiply" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">{product.name}</p>
                          <p className="text-[11px] text-muted">#{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted">{product.category}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-ink">{money(product.price)}</td>
                    <td className={`px-3 py-3 text-right tabular-nums ${product.stock <= 5 ? "text-alert" : "text-ink"}`}>{product.stock}</td>
                    <td className="px-3 py-3">
                      <Badge tone={product.status === "published" ? "success" : "muted"}>{product.status}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted">{formatDate(product.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton label={`Edit ${product.name}`} onClick={() => openEdit(product)}><EditIcon className="h-4 w-4" /></IconButton>
                        <IconButton label={`Duplicate ${product.name}`} onClick={() => { duplicateProduct(product.id); toast("Product duplicated as a draft."); }}><CopyIcon className="h-4 w-4" /></IconButton>
                        <IconButton
                          label={product.status === "published" ? `Move ${product.name} to draft` : `Publish ${product.name}`}
                          onClick={() => {
                            updateProduct(product.id, { ...product, status: product.status === "published" ? "draft" : "published" });
                            toast(product.status === "published" ? "Product hidden from store." : "Product published to store.", "info");
                          }}
                        >
                          {product.status === "published" ? <EyeOff className="h-4 w-4" /> : <SparkIcon className="h-4 w-4" />}
                        </IconButton>
                        <IconButton label={`Delete ${product.name}`} danger onClick={() => setDeleting(product)}><TrashIcon className="h-4 w-4" /></IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Add / edit dialog */}
      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editing ? "Edit product" : "Add new product"}
        subtitle={editing ? `Update “${editing.name}” — changes go live on the storefront instantly.` : "Fill in the details below. It appears in the store the moment you save."}
        width="max-w-[960px]"
      >
        <ProductForm
          key={editing ? `edit-${editing.id}` : "create"}
          initial={editing ? draftFromProduct(editing) : emptyDraft}
          submitLabel={editing ? "Save changes" : "Add product"}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      {/* Single delete */}
      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete product?"
        width="max-w-[440px]"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete product</Button>
          </>
        }
      >
        <p className="text-[13.5px] leading-6 text-body">
          <span className="font-medium text-ink">“{deleting?.name}”</span> will be removed from your catalogue and disappear from the storefront. This cannot be undone.
        </p>
      </Modal>

      {/* Bulk delete */}
      <Modal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        title={`Delete ${selected.length} product${selected.length === 1 ? "" : "s"}?`}
        width="max-w-[440px]"
        footer={
          <>
            <Button variant="secondary" onClick={() => setBulkDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { deleteProducts(selected); toast(`${selected.length} product(s) deleted.`, "info"); setSelected([]); setBulkDeleteOpen(false); }}>Delete {selected.length}</Button>
          </>
        }
      >
        <p className="text-[13.5px] leading-6 text-body">
          The selected products will be removed from your catalogue and storefront. This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

function IconButton({ label, onClick, danger, children }: { label: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-8 w-8 place-items-center rounded-lg border border-transparent text-muted transition-colors ${
        danger ? "hover:border-alert/20 hover:bg-[#fff0f0] hover:text-alert" : "hover:border-line hover:bg-white hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function ProductCardAdmin({
  product,
  selected,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
}: {
  product: Product;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  return (
    <article className={`group overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-[0_14px_34px_rgba(0,0,0,0.08)] ${selected ? "border-ink ring-1 ring-ink" : "border-line"}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-tile">
        <img src={product.image} alt={product.alt} className="h-full w-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.04]" />
        <label className="absolute left-3 top-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-line bg-white/95 shadow-sm">
          <input type="checkbox" checked={selected} onChange={onSelect} aria-label={`Select ${product.name}`} className="h-3.5 w-3.5 accent-black" />
        </label>
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          <Badge tone={product.status === "published" ? "success" : "muted"}>{product.status}</Badge>
          {product.badge && <Badge tone={product.badge === "sale" ? "danger" : "dark"}>{product.badge === "sale" ? "Sale" : "New"}</Badge>}
        </div>
        {product.stock <= 5 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-medium text-alert shadow-sm">
            {product.stock === 0 ? "Out of stock" : `Only ${product.stock} left`}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[14px] font-medium text-ink">{product.name}</h3>
            <p className="mt-1 flex items-center gap-2 text-[11.5px] text-muted">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className={product.stock <= 5 ? "text-alert" : ""}>{product.stock} in stock</span>
            </p>
          </div>
          <p className="shrink-0 text-[14px] font-semibold tabular-nums text-ink">{money(product.price)}</p>
        </div>
        <div className="mt-4 flex items-center gap-1.5 border-t border-line pt-3.5">
          <Button variant="secondary" className="flex-1 px-3 py-2" onClick={onEdit} aria-label={`Edit ${product.name}`}><EditIcon className="h-3.5 w-3.5" /> Edit</Button>
          <IconButton label={`Duplicate ${product.name}`} onClick={onDuplicate}><CopyIcon className="h-4 w-4" /></IconButton>
          <IconButton label={product.status === "published" ? `Hide ${product.name}` : `Publish ${product.name}`} onClick={onToggleStatus}>
            {product.status === "published" ? <EyeOff className="h-4 w-4" /> : <SparkIcon className="h-4 w-4" />}
          </IconButton>
          <IconButton label={`Delete ${product.name}`} danger onClick={onDelete}><TrashIcon className="h-4 w-4" /></IconButton>
        </div>
      </div>
    </article>
  );
}
