import { useMemo, useState } from "react";
import { money } from "../../data/products";
import { useStore, type OrderStatus } from "../../store/store";
import { formatDateTime } from "../../utils/helpers";
import { toast } from "../Toaster";
import { Badge, inputClass, selectClass } from "./ui";
import { OrdersIcon, Search } from "./icons";

const STATUS_TONE: Record<OrderStatus, "warn" | "info" | "success" | "danger"> = {
  pending: "warn",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
};

const STATUSES: OrderStatus[] = ["pending", "shipped", "delivered", "cancelled"];

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return [...orders]
      .sort((a, b) => b.createdAt - a.createdAt)
      .filter((order) => (filter === "all" || order.status === filter) && (!needle || order.customer.toLowerCase().includes(needle) || String(order.id).includes(needle)));
  }, [orders, filter, query]);

  const revenue = orders.filter((order) => order.status !== "cancelled").reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-3">
        <MiniStat label="Orders" value={String(orders.length)} caption="All time" />
        <MiniStat label="Revenue" value={money(revenue)} caption="Excludes cancelled" />
        <MiniStat label="Awaiting action" value={String(orders.filter((order) => order.status === "pending").length)} caption="Pending orders" accent />
      </section>

      <section className="rounded-2xl border border-line bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter orders by status">
            {(["all", ...STATUSES] as const).map((value) => {
              const active = filter === value;
              const count = value === "all" ? orders.length : orders.filter((order) => order.status === value).length;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  aria-pressed={active}
                  className={`rounded-lg px-3 py-2 text-[12.5px] font-medium capitalize transition-colors ${active ? "bg-ink text-white" : "text-muted hover:bg-tile hover:text-ink"}`}
                >
                  {value} <span className={`ml-1 tabular-nums ${active ? "text-white/60" : "text-muted/70"}`}>{count}</span>
                </button>
              );
            })}
          </div>
          <div className="relative ml-auto w-full lg:max-w-[280px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input aria-label="Search orders" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer or order #" className={`${inputClass} pl-10`} />
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="rounded-2xl border border-line bg-white px-6 py-16 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-tile text-muted"><OrdersIcon className="h-6 w-6" /></span>
          <h2 className="mt-4 text-[16px] font-semibold text-ink">No orders match</h2>
          <p className="mt-1.5 text-[13px] text-muted">Try another status filter or search term.</p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-[13px]">
              <thead className="border-b border-line bg-[#fafafa] text-[11px] uppercase tracking-[0.06em] text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Order</th>
                  <th scope="col" className="px-3 py-3 font-medium">Customer</th>
                  <th scope="col" className="px-3 py-3 font-medium">Items</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">Total</th>
                  <th scope="col" className="px-3 py-3 font-medium">Placed</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-[#fafafa]">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">#{order.id}</td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-ink">{order.customer}</p>
                      <p className="text-[11.5px] text-muted">{order.city} · {order.email}</p>
                    </td>
                    <td className="max-w-[260px] px-3 py-3 text-muted">
                      {order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-medium tabular-nums text-ink">{money(order.total)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted">{formatDateTime(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          aria-label={`Status for order ${order.id}`}
                          value={order.status}
                          onChange={(event) => {
                            updateOrderStatus(order.id, event.target.value as OrderStatus);
                            toast(`Order #${order.id} marked ${event.target.value}.`);
                          }}
                          className={`${selectClass} h-9 w-auto min-w-[118px] py-0 text-[12px] capitalize`}
                        >
                          {STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
                        </select>
                        <Badge tone={STATUS_TONE[order.status]}>{order.status}</Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function MiniStat({ label, value, caption, accent }: { label: string; value: string; caption: string; accent?: boolean }) {
  return (
    <article className="rounded-2xl border border-line bg-white p-5">
      <p className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className={`mt-2 text-[22px] font-semibold leading-none tracking-tight tabular-nums ${accent ? "text-alert" : "text-ink"}`}>{value}</p>
      <p className="mt-2 text-[11.5px] text-muted">{caption}</p>
    </article>
  );
}


