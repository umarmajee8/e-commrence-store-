import { useEffect, useState } from "react";
import { BagIcon, ChevronDown, CloseIcon, MenuIcon, SearchIcon } from "./Icons";

type NavItem = { label: string; children?: string[] };

const NAV: NavItem[] = [
  { label: "Home", children: ["Home Fashion", "Home Fashion Two", "Home Furniture", "Home Electronics"] },
  { label: "Shop", children: ["Shop Grid Standard", "Shop Grid Filter", "Shop List", "Product Details"] },
  { label: "Collection" },
  { label: "Pages", children: ["Cart", "Checkout", "Wishlist", "Compare", "My Account", "Login / Register"] },
  { label: "About" },
  { label: "Contact" },
];

type HeaderProps = { cartCount: number; cartBump: number };

export default function Header({ cartCount, cartBump }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 44);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      {/* Main header */}
      <header
        className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_4px_20px_rgba(0,0,0,0.06)]" : ""
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1230px] items-center justify-between px-[15px] transition-[height] duration-300 ${
            scrolled ? "h-[70px]" : "h-[70px] lg:h-[90px]"
          }`}
        >
          <a href="#" className="text-[28px] font-bold leading-none tracking-tight text-ink lg:text-[32px]" aria-label="Precious home">
            Precious
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-[34px] xl:gap-[40px]">
              {NAV.map((item) => (
                <li key={item.label} className="group relative">
                  <a
                    href="#"
                    className="relative flex items-center gap-1 py-8 text-[14px] font-medium text-body transition-colors hover:text-accent"
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
                    )}
                    <span className="absolute bottom-[26px] left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                  </a>
                  {item.children && (
                    <ul className="invisible absolute left-1/2 top-full z-50 w-[220px] -translate-x-1/2 translate-y-3 bg-white px-6 py-5 opacity-0 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {item.children.map((c) => (
                        <li key={c}>
                          <a
                            href="#"
                            className="block py-1.5 text-[13px] text-muted transition-all duration-200 hover:translate-x-1 hover:text-accent"
                          >
                            {c}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-[18px] text-ink">
            <button type="button" aria-label="Search" className="transition-colors hover:text-accent">
              <SearchIcon className="h-[19px] w-[19px]" />
            </button>
            <button type="button" aria-label={`Cart, ${cartCount} items`} className="relative transition-colors hover:text-accent">
              <BagIcon className="h-[20px] w-[20px]" />
              <span
                key={cartBump}
                className={`absolute -right-2 -top-2.5 grid h-[16px] min-w-[16px] place-items-center rounded-full bg-ink px-1 text-[9px] font-medium leading-none text-white ${
                  cartBump ? "animate-pop" : ""
                }`}
              >
                {String(cartCount).padStart(2, "0")}
              </span>
            </button>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="ml-1 transition-colors hover:text-accent lg:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[86%] max-w-[340px] flex-col bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile menu"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <span className="text-2xl font-bold text-ink">Precious</span>
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="text-ink hover:text-accent">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="px-6 pt-5">
          <label className="flex items-center gap-2 border border-line px-3 py-2.5">
            <SearchIcon className="h-4 w-4 text-muted" />
            <input type="search" placeholder="Search products…" className="w-full bg-transparent text-[13px] outline-none" />
          </label>
        </div>
        <nav className="flex-1 overflow-y-auto px-6 py-4" aria-label="Mobile">
          <ul>
            {NAV.map((item) => (
              <li key={item.label} className="border-b border-line/70">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                      className="flex w-full items-center justify-between py-3.5 text-[14px] font-medium text-body"
                      aria-expanded={expanded === item.label}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${expanded === item.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ${
                        expanded === item.label ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <ul className="overflow-hidden">
                        {item.children.map((c) => (
                          <li key={c}>
                            <a href="#" className="block py-2 pl-3 text-[13px] text-muted hover:text-accent">
                              {c}
                            </a>
                          </li>
                        ))}
                        <li className="h-2" />
                      </ul>
                    </div>
                  </>
                ) : (
                  <a href="#" className="block py-3.5 text-[14px] font-medium text-body hover:text-accent">
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-line px-6 py-4 text-[12px] text-muted">
          <p>Call Us 3965410</p>
          <p className="mt-1">
            Free delivery on order over <span className="font-medium text-alert">$200</span>
          </p>
        </div>
      </aside>
    </>
  );
}
