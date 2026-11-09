import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "../../store/store";
import { DASHBOARD_NAV_EVENT, type DashboardTab } from "../../utils/helpers";
import { GridIcon, BoxIcon, OrdersIcon, SettingsIcon, LogoutIcon, SparkIcon, MenuBars } from "./icons";
import { CloseIcon } from "../Icons";
import Overview from "./Overview";
import ProductsPage from "./ProductsPage";
import OrdersPage from "./OrdersPage";
import SettingsPage from "./SettingsPage";
import { Button } from "./ui";

const NAV: Array<{ id: DashboardTab; label: string; Icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactElement }> = [
  { id: "overview", label: "Overview", Icon: GridIcon },
  { id: "products", label: "Products", Icon: BoxIcon },
  { id: "orders", label: "Orders", Icon: OrdersIcon },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
];

const TITLES: Record<DashboardTab, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "Here is how your store is doing right now." },
  products: { title: "Products", subtitle: "Add new items, update prices and manage stock." },
  orders: { title: "Orders", subtitle: "Track and update customer orders." },
  settings: { title: "Settings", subtitle: "Store details and demo data controls." },
};

export default function Dashboard() {
  const { products, orders, user, logout } = useStore();
  const [tab, setTab] = useState<DashboardTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [productFormSeq, setProductFormSeq] = useState(0);
  const productsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onTab = (event: Event) => {
      const detail = (event as CustomEvent<DashboardTab>).detail;
      if (detail) setTab(detail);
    };
    window.addEventListener(DASHBOARD_NAV_EVENT, onTab);
    return () => window.removeEventListener(DASHBOARD_NAV_EVENT, onTab);
  }, []);

  useEffect(() => {
    if (tab !== "products") setQuery("");
  }, [tab]);

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  }, [tab]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const go = useCallback((next: DashboardTab) => setTab(next), []);

  const openNewProduct = useCallback(() => {
    setProductFormSeq((value) => value + 1);
    setTab("products");
  }, []);

  useEffect(() => {
    if (productFormSeq > 0) productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [productFormSeq]);

  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const draftCount = products.filter((product) => product.status === "draft").length;

  const counts: Record<DashboardTab, number | null> = {
    overview: null,
    products: products.length,
    orders: pendingOrders,
    settings: null,
  };

  const nav = (
    <>
      <div className="flex items-center justify-between px-5 pt-5 lg:px-6 lg:pt-7">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white"><SparkIcon className="h-4.5 w-4.5" /></span>
          <div>
            <p className="text-[17px] font-bold leading-none tracking-tight text-ink">Precious</p>
            <p className="mt-1 text-[10.5px] uppercase tracking-[0.16em] text-muted">Admin panel</p>
          </div>
        </div>
        <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="text-muted lg:hidden">
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-7 flex-1 px-3" aria-label="Dashboard">
        <p className="px-3 pb-2 text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted/80">Manage</p>
        <ul className="space-y-1">
          {NAV.map(({ id, label, Icon }) => {
            const active = tab === id;
            const count = counts[id];
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => go(id)}
                  aria-current={active ? "page" : undefined}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                    active ? "bg-ink text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)]" : "text-body hover:bg-tile"
                  }`}
                >
                  <Icon className={`h-[18px] w-[18px] ${active ? "text-white" : "text-muted group-hover:text-ink"}`} />
                  <span className="flex-1 text-left">{label}</span>
                  {count !== null && count > 0 && (
                    <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium ${active ? "bg-white/15 text-white" : id === "orders" ? "bg-[#fff4e0] text-[#a35f00]" : "bg-tile text-muted"}`}>
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-7 rounded-2xl border border-line bg-gradient-to-b from-[#fbfbfb] to-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Store health</p>
            <span className="rounded-full bg-[#e7f8f0] px-2 py-0.5 text-[10px] font-medium text-[#0b7a51]">Live</span>
          </div>
          <p className="mt-3 text-[22px] font-semibold leading-none text-ink">{products.length}</p>
          <p className="mt-1 text-[11.5px] text-muted">products in catalogue</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-tile">
            <div className="h-full rounded-full bg-ink" style={{ width: `${Math.min(100, products.length * 6)}%` }} />
          </div>
          <p className="mt-2.5 text-[11.5px] text-muted">{draftCount} draft{draftCount === 1 ? "" : "s"} hidden from store</p>
        </div>
      </nav>

      <div className="border-t border-line p-3">
        <a
          href="#"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-body transition-colors hover:bg-tile"
        >
          <GridIcon className="h-[18px] w-[18px] text-muted" />
          View storefront
          <span className="ml-auto text-[11px] text-muted">↗</span>
        </a>
        <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-[12px] font-semibold text-white">
            {(user?.name ?? "A").slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-ink">{user?.name ?? "Admin"}</p>
            <p className="truncate text-[11px] text-muted">{user?.email}</p>
          </div>
          <button type="button" onClick={logout} aria-label="Log out" title="Log out" className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-white hover:text-alert">
            <LogoutIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f6f6f7]">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[268px] flex-col border-r border-line bg-white lg:flex">{nav}</aside>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-[90] bg-ink/40 backdrop-blur-[2px] transition-opacity lg:hidden ${sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      <aside className={`fixed left-0 top-0 z-[91] flex h-screen w-[280px] max-w-[86vw] flex-col border-r border-line bg-white transition-transform duration-300 lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {nav}
      </aside>

      {/* Main column */}
      <div className="lg:pl-[268px]">
        <header className="sticky top-0 z-30 border-b border-line bg-[#f6f6f7]/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
            <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open menu" className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-ink lg:hidden">
              <MenuBars className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[16px] font-semibold text-ink sm:text-[18px]">{TITLES[tab].title}</h1>
              <p className="hidden truncate text-[12px] text-muted sm:block">{TITLES[tab].subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" className="hidden sm:inline-flex" onClick={() => go("products")}>
                <BoxIcon className="h-4 w-4" /> Manage catalogue
              </Button>
              <Button onClick={openNewProduct}>
                New product
              </Button>
            </div>
          </div>
        </header>

        <main className="px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pt-7">
          {tab === "overview" && <Overview onNavigate={go} />}
          <div ref={productsRef}>
            {tab === "products" && (
              <ProductsPage
                query={query}
                onQueryChange={setQuery}
                openCreateSeq={productFormSeq}
                onCreateConsumed={() => setProductFormSeq(0)}
              />
            )}
          </div>
          {tab === "orders" && <OrdersPage />}
          {tab === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
