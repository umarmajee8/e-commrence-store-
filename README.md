# Precious — Minimal Fashion Store + Admin Dashboard

A React + Vite + Tailwind storefront with a built-in admin dashboard. Add, edit and delete
products from the dashboard and the storefront updates instantly. All data is persisted in
the browser (`localStorage`) — no backend required.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # single-file production build in dist/
```

## Admin dashboard

Open **http://localhost:5173/#/admin** (or click the **Admin** pill in the header).

| Field    | Value             |
| -------- | ----------------- |
| Email    | `admin@precious.com` |
| Password | `admin123`        |

Demo credentials are shown on the sign-in screen and can be filled with one click.

### What you can do

- **Overview** — revenue, product/order counts, inventory value, 7-day revenue chart,
  order-status donut, catalogue-by-category bars, latest products, low-stock alerts.
- **Products** — search, filter by category/status, sort, grid or table view, bulk
  publish/draft/delete, duplicate, show or hide a product, and a full add/edit form
  (image upload with drag & drop + automatic compression, price, compare-at price,
  stock, category, badge, description, visibility).
- **Orders** — sample orders with status changing from the table.
- **Settings** — store details, JSON export, reset demo data, log out.

New products appear in the storefront **New Arrival** grid the moment they are saved
(published products only). Quick view shows the description and live stock, and the cart
stays in sync when a product is edited or deleted.

## Project structure

```
src/
  App.tsx                     hash routing (#/admin) + cart state
  data/products.ts            product type, seed catalogue, categories
  store/
    store.tsx                 StoreProvider: products, orders, admin session
    usePersistentState.ts     localStorage-backed useState
  components/
    dashboard/                AdminLogin, Dashboard shell, Overview, ProductsPage,
                              OrdersPage, SettingsPage, ProductForm, Modal, Charts, ui
    Header.tsx, NewArrival.tsx, ProductCard.tsx, Toaster.tsx, ...
```
