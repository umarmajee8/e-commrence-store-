import { useMemo } from "react";
import { categoryColor, money } from "../../data/products";
import { useStore } from "../../store/store";
import { formatDate, navigateDashboard, relativeTime } from "../../utils/helpers";
import { AreaChart, CategoryBars, Donut } from "./Charts";
import { Badge, Button } from "./ui";
import { BoxIcon, CopyIcon, DollarIcon, EditIcon, OrdersIcon, PlusIcon, TrendDown, TrendUp } from "./icons";

const ORDER_TONE = {
  pending: "warn",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
} as const;

export default function Overview({ onNavigate }: { onNavigate: (tab: "overview" | "products" | "orders" | "settings") => void }) {
  const { products, orders, duplicateProduct } = useStore();

  const stats = useMemo(() => {
    const published = products.filter((p) => p.status === "published");
    const revenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0);
    const lowStock = published.filter((p) => p.stock <= 5);
    const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    return { published, revenue, lowStock, inventoryValue, pending };
  }, [products, orders]);

  const weekly = useMemo(() => {
    const buckets = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - i));
      return { date, label: date.toLocaleDateString("en-GB", { weekday: "short" }), value: 0 };
    });
    for (const order of orders) {
      if (order.status === "cancelled") continue;
      for (const bucket of buckets) {
        const start = bucket.date.getTime();
        const end = start + 24 * 60 * 60 * 1000;
        if (order.createdAt >= start && order.createdAt < end) bucket.value += order.total;
      }
    }
    return buckets.map(({ label, value }) => ({ label, value }));
  }, [orders]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const product of products) map.set(product.category, (map.get(product.category) ?? 0) + 1);
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count, color: categoryColor(name) }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  const statusSegments = useMemo(
    () => [
      { label: "Delivered", value: orders.filter((o) => o.status === "delivered").length, color: "#0b7a51" },
      { label: "Shipped", value: orders.filter((o) => o.status === "shipped").length, color: "#2f5fd0" },
      { label: "Pending", value: orders.filter((o) => o.status === "pending").length, color: "#f08c00" },
      { label: "Cancelled", value: orders.filter((o) => o.status === "cancelled").length, color: "#e14b4b" },
    ],
    [orders],
  );

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4),
    [orders],
  );

  const recentProducts = useMemo(
    () => [...products].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4),
    [products],
  );

  const openNewProduct = () => {
    onNavigate("products");
    navigateDashboard("products");
  };

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Store statistics">
        <StatCard
          label="Total revenue"
          value={money(stats.revenue)}
          caption={`${orders.length} orders all time`}
          trend={12.4}
          Icon={DollarIcon}
        />
        <StatCard
          label="Products"
          value={String(products.length)}
          caption={`${stats.published.length} published · ${products.length - stats.published.length} draft`}
          trend={4.1}
          Icon={BoxIcon}
        />
        <StatCard
          label="Orders"
          value={String(orders.length)}
          caption={`${stats.pending} waiting to be shipped`}
          trend={-2.3}
          Icon={OrdersIcon}
        />
        <StatCard
          label="Inventory value"
          value={money(stats.inventoryValue)}
          caption={`${stats.lowStock.length} low-stock item${stats.lowStock.length === 1 ? "" : "s"}`}
          trend={8.6}
          Icon={TrendUp}
        />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        {/* Revenue chart */}
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6" aria-label="Revenue this week">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-ink">Revenue — last 7 days</h2>
              <p className="mt-1 text-[12px] text-muted">Paid and pending orders, cancelled excluded.</p>
            </div>
            <Badge tone="success"><TrendUp className="h-3 w-3" /> Live data</Badge>
          </div>
          <AreaChart data={weekly} />
        </section>

        {/* Order status donut */}
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6" aria-label="Orders by status">
          <h2 className="text-[15px] font-semibold text-ink">Order status</h2>
          <p className="mt-1 text-[12px] text-muted">Where every order currently stands.</p>
          <div className="mt-6">
            <Donut segments={statusSegments} total={orders.length} caption="orders" />
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.15fr]">
        {/* Catalogue by category */}
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6" aria-label="Products by category">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-ink">Catalogue by category</h2>
              <p className="mt-1 text-[12px] text-muted">{products.length} products across {categories.length} categories.</p>
            </div>
            <Button variant="secondary" onClick={() => onNavigate("products")}>View all</Button>
          </div>
          <CategoryBars data={categories} />
        </section>

        {/* Recent orders */}
        <section className="rounded-2xl border border-line bg-white" aria-label="Recent orders">
          <div className="flex items-start justify-between gap-3 border-b border-line p-5 sm:p-6">
            <div>
              <h2 className="text-[15px] font-semibold text-ink">Recent orders</h2>
              <p className="mt-1 text-[12px] text-muted">Newest checkouts from your store.</p>
            </div>
            <Button variant="secondary" onClick={() => onNavigate("orders")}>All orders</Button>
          </div>
          <ul className="divide-y divide-line">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tile text-[11px] font-semibold text-ink">
                  {order.customer.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{order.customer}</p>
                  <p className="truncate text-[11.5px] text-muted">#{order.id} · {relativeTime(order.createdAt)}</p>
                </div>
                <span className="text-[13px] font-medium tabular-nums text-ink">{money(order.total)}</span>
                <Badge tone={ORDER_TONE[order.status]}>{order.status}</Badge>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
        {/* Latest products */}
        <section className="rounded-2xl border border-line bg-white" aria-label="Latest products">
          <div className="flex items-start justify-between gap-3 border-b border-line p-5 sm:p-6">
            <div>
              <h2 className="text-[15px] font-semibold text-ink">Latest products</h2>
              <p className="mt-1 text-[12px] text-muted">Just added to your catalogue.</p>
            </div>
            <Button onClick={openNewProduct}><PlusIcon className="h-4 w-4" /> Add product</Button>
          </div>
          <ul className="divide-y divide-line">
            {recentProducts.map((product) => (
              <li key={product.id} className="flex items-center gap-3 px-5 py-3 sm:px-6">
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-tile">
                  <img src={product.image} alt={product.alt} className="h-full w-full object-contain p-1 mix-blend-multiply" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{product.name}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted">{formatDate(product.createdAt)} · {product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-medium tabular-nums text-ink">{money(product.price)}</p>
                  <p className={`text-[11px] ${product.stock <= 5 ? "text-alert" : "text-muted"}`}>{product.stock} in stock</p>
                </div>
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" className="px-2" onClick={() => onNavigate("products")} aria-label={`Edit ${product.name}`} title={`Edit ${product.name}`}>
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" className="px-2" onClick={() => duplicateProduct(product.id)} aria-label={`Duplicate ${product.name}`} title={`Duplicate ${product.name}`}>
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Low stock */}
        <section className="rounded-2xl border border-line bg-white" aria-label="Low stock alerts">
          <div className="border-b border-line p-5 sm:p-6">
            <h2 className="text-[15px] font-semibold text-ink">Low stock alerts</h2>
            <p className="mt-1 text-[12px] text-muted">Published products with 5 units or fewer.</p>
          </div>
          {stats.lowStock.length ? (
            <ul className="divide-y divide-line">
              {stats.lowStock.map((product) => (
                <li key={product.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-alert" />
                  <p className="min-w-0 flex-1 truncate text-[13px] text-ink">{product.name}</p>
                  <Badge tone="danger">{product.stock} left</Badge>
                  <Button variant="secondary" className="px-3 py-1.5" onClick={() => onNavigate("products")}>Restock</Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-[13px] font-medium text-ink">Everything is well stocked</p>
              <p className="mt-1 text-[12px] text-muted">No published product is below 5 units.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  caption,
  trend,
  Icon,
}: {
  label: string;
  value: string;
  caption: string;
  trend: number;
  Icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}) {
  const up = trend >= 0;
  return (
    <article className="rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-tile text-ink"><Icon className="h-[19px] w-[19px]" /></span>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10.5px] font-medium ${up ? "bg-[#e7f8f0] text-[#0b7a51]" : "bg-[#ffeaea] text-[#c92a2a]"}`}>
          {up ? <TrendUp className="h-3 w-3" /> : <TrendDown className="h-3 w-3" />}
          {Math.abs(trend)}%
        </span>
      </div>
      <p className="mt-4 text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className="mt-1.5 text-[24px] font-semibold leading-none tracking-tight text-ink tabular-nums">{value}</p>
      <p className="mt-2.5 text-[11.5px] text-muted">{caption}</p>
    </article>
  );
}
