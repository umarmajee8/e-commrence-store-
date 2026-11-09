import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { SEED_PRODUCTS, type Product } from "../data/products";
import { usePersistentState } from "./usePersistentState";

export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: number;
  customer: string;
  email: string;
  city: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: OrderStatus;
  createdAt: number;
};

export type AdminUser = { name: string; email: string };

export type ProductInput = Omit<Product, "id" | "createdAt"> & {
  id?: number;
  createdAt?: number;
};

const STORAGE = {
  products: "precious.products.v1",
  orders: "precious.orders.v1",
  session: "precious.admin.v1",
};

/** Demo credentials — there is no backend, everything runs in the browser. */
export const DEMO_CREDENTIALS = { email: "admin@precious.com", password: "admin123" };

const daysAgo = (n: number) => Date.now() - n * 24 * 60 * 60 * 1000;

const SEED_ORDERS: Order[] = [
  {
    id: 1042,
    customer: "Ayesha Khan",
    email: "ayesha.khan@example.com",
    city: "Lahore",
    items: [
      { name: "Cream Knit Sweater", quantity: 1, price: 60 },
      { name: "Cat-Eye Sunglasses", quantity: 2, price: 40 },
    ],
    total: 140,
    status: "delivered",
    createdAt: daysAgo(9),
  },
  {
    id: 1043,
    customer: "Bilal Ahmed",
    email: "bilal.ahmed@example.com",
    city: "Karachi",
    items: [{ name: "MacBook Air M4", quantity: 1, price: 999 }],
    total: 999,
    status: "shipped",
    createdAt: daysAgo(6),
  },
  {
    id: 1044,
    customer: "Sara Iqbal",
    email: "sara.iqbal@example.com",
    city: "Islamabad",
    items: [
      { name: "Leather Sneakers", quantity: 1, price: 20 },
      { name: "Over-Ear Headphones", quantity: 1, price: 50 },
    ],
    total: 70,
    status: "pending",
    createdAt: daysAgo(4),
  },
  {
    id: 1045,
    customer: "Hamza Ali",
    email: "hamza.ali@example.com",
    city: "Faisalabad",
    items: [{ name: "Braided Leather Belt", quantity: 1, price: 90 }],
    total: 90,
    status: "pending",
    createdAt: daysAgo(2),
  },
  {
    id: 1046,
    customer: "Nadia Malik",
    email: "nadia.malik@example.com",
    city: "Multan",
    items: [{ name: "Panama Hat", quantity: 1, price: 80 }],
    total: 80,
    status: "cancelled",
    createdAt: daysAgo(1),
  },
  {
    id: 1047,
    customer: "Usman Tariq",
    email: "usman.tariq@example.com",
    city: "Faisalabad",
    items: [
      { name: "Rust Chino Pants", quantity: 1, price: 50 },
      { name: "Canvas Backpack", quantity: 1, price: 70 },
    ],
    total: 120,
    status: "delivered",
    createdAt: daysAgo(0),
  },
];

type StoreValue = {
  products: Product[];
  orders: Order[];
  user: AdminUser | null;
  addProduct: (input: ProductInput) => Product;
  updateProduct: (id: number, input: ProductInput) => void;
  deleteProduct: (id: number) => void;
  deleteProducts: (ids: number[]) => void;
  duplicateProduct: (id: number) => void;
  changeStatus: (ids: number[], status: Product["status"]) => void;
  addOrder: (order: Omit<Order, "id" | "createdAt">) => void;
  updateOrderStatus: (id: number, status: OrderStatus) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  resetDemoData: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

const nextId = (products: Product[]) => (products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1);

const nextOrderId = (orders: Order[]) => (orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = usePersistentState<Product[]>(STORAGE.products, SEED_PRODUCTS);
  const [orders, setOrders] = usePersistentState<Order[]>(STORAGE.orders, SEED_ORDERS);
  const [user, setUser] = usePersistentState<AdminUser | null>(STORAGE.session, null);

  const addProduct = useCallback((input: ProductInput) => {
    const created: Product = {
      ...input,
      id: nextId(products),
      createdAt: input.createdAt ?? Date.now(),
    };
    setProducts((current) => [created, ...current]);
    return created;
  }, [products, setProducts]);

  const updateProduct = useCallback((id: number, input: ProductInput) => {
    setProducts((current) => current.map((p) => (p.id === id ? { ...p, ...input, id } : p)));
  }, [setProducts]);

  const deleteProduct = useCallback((id: number) => {
    setProducts((current) => current.filter((p) => p.id !== id));
  }, [setProducts]);

  const deleteProducts = useCallback((ids: number[]) => {
    const set = new Set(ids);
    setProducts((current) => current.filter((p) => !set.has(p.id)));
  }, [setProducts]);

  const duplicateProduct = useCallback((id: number) => {
    setProducts((current) => {
      const source = current.find((p) => p.id === id);
      if (!source) return current;
      const copy: Product = {
        ...source,
        id: nextId(current),
        name: `${source.name} (copy)`,
        status: "draft",
        createdAt: Date.now(),
      };
      return [copy, ...current];
    });
  }, [setProducts]);

  const changeStatus = useCallback((ids: number[], status: Product["status"]) => {
    const set = new Set(ids);
    setProducts((current) => current.map((p) => (set.has(p.id) ? { ...p, status } : p)));
  }, [setProducts]);

  const addOrder = useCallback((order: Omit<Order, "id" | "createdAt">) => {
    setOrders((current) => [{ ...order, id: nextOrderId(current), createdAt: Date.now() }, ...current]);
  }, [setOrders]);

  const updateOrderStatus = useCallback((id: number, status: OrderStatus) => {
    setOrders((current) => current.map((o) => (o.id === id ? { ...o, status } : o)));
  }, [setOrders]);

  const login = useCallback((email: string, password: string) => {
    const ok =
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;
    if (ok) {
      setUser({ name: "Admin", email: DEMO_CREDENTIALS.email });
      window.scrollTo({ top: 0 });
    }
    return ok;
  }, [setUser]);

  const logout = useCallback(() => {
    setUser(null);
    window.scrollTo({ top: 0 });
  }, [setUser]);

  const resetDemoData = useCallback(() => {
    setProducts(SEED_PRODUCTS);
    setOrders(SEED_ORDERS);
  }, [setProducts, setOrders]);

  const value = useMemo<StoreValue>(
    () => ({
      products,
      orders,
      user,
      addProduct,
      updateProduct,
      deleteProduct,
      deleteProducts,
      duplicateProduct,
      changeStatus,
      addOrder,
      updateOrderStatus,
      login,
      logout,
      resetDemoData,
    }),
    [
      products,
      orders,
      user,
      addProduct,
      updateProduct,
      deleteProduct,
      deleteProducts,
      duplicateProduct,
      changeStatus,
      addOrder,
      updateOrderStatus,
      login,
      logout,
      resetDemoData,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

export function useStorefrontProducts() {
  const { products } = useStore();
  return useMemo(() => products.filter((p) => p.status === "published"), [products]);
}
