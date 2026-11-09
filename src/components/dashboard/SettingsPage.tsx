import { useState } from "react";
import { DEMO_CREDENTIALS, useStore } from "../../store/store";
import { toast } from "../Toaster";
import Modal from "./Modal";
import { Button, Field, inputClass } from "./ui";
import { DownloadIcon, LockIcon, StoreIcon, TrashIcon } from "./icons";

export default function SettingsPage() {
  const { products, orders, user, logout, resetDemoData } = useStore();
  const [storeName, setStoreName] = useState("Precious");
  const [email, setEmail] = useState("support@precious.com");
  const [currency, setCurrency] = useState("USD ($)");
  const [freeShipping, setFreeShipping] = useState("200");
  const [resetOpen, setResetOpen] = useState(false);

  const exportData = () => {
    const payload = JSON.stringify({ storeName, products, orders }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "precious-store-data.json";
    link.click();
    URL.revokeObjectURL(url);
    toast("Store data exported as JSON.");
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-tile text-ink"><StoreIcon className="h-[19px] w-[19px]" /></span>
            <div>
              <h2 className="text-[15px] font-semibold text-ink">Store details</h2>
              <p className="text-[12px] text-muted">How your shop is presented.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Store name"><input className={inputClass} value={storeName} onChange={(event) => setStoreName(event.target.value)} /></Field>
            <Field label="Support email"><input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
            <Field label="Currency"><input className={inputClass} value={currency} onChange={(event) => setCurrency(event.target.value)} /></Field>
            <Field label="Free shipping over ($)"><input className={inputClass} inputMode="numeric" value={freeShipping} onChange={(event) => setFreeShipping(event.target.value.replace(/[^\d]/g, ""))} /></Field>
          </div>
          <div className="mt-5 flex justify-end">
            <Button onClick={() => toast("Store details saved.")}>Save changes</Button>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 className="text-[15px] font-semibold text-ink">Data</h2>
          <p className="mt-1 text-[12px] text-muted">Everything is stored in this browser — no backend is connected.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportData}><DownloadIcon className="h-4 w-4" /> Export data</Button>
            <Button variant="secondary" onClick={() => setResetOpen(true)}><TrashIcon className="h-4 w-4" /> Reset demo data</Button>
          </div>
        </section>
      </div>

      <div className="space-y-5">
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-tile text-ink"><LockIcon className="h-[19px] w-[19px]" /></span>
            <div>
              <h2 className="text-[15px] font-semibold text-ink">Signed in as</h2>
              <p className="text-[12px] text-muted">{user?.email}</p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-[12.5px]">
            <div className="flex justify-between"><dt className="text-muted">Demo email</dt><dd className="font-medium text-ink">{DEMO_CREDENTIALS.email}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Demo password</dt><dd className="font-medium text-ink">{DEMO_CREDENTIALS.password}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Products</dt><dd className="font-medium text-ink tabular-nums">{products.length}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Orders</dt><dd className="font-medium text-ink tabular-nums">{orders.length}</dd></div>
          </dl>
          <Button variant="secondary" className="mt-5 w-full" onClick={logout}>Log out</Button>
        </section>

        <section className="rounded-2xl border border-line bg-[#fafafa] p-5 text-[12.5px] leading-5 text-muted sm:p-6">
          <h2 className="text-[13px] font-semibold text-ink">How this demo works</h2>
          <p className="mt-2">
            Sign in with the demo account, add or edit products, and open the storefront — your catalogue, prices and stock appear there immediately. Data persists in this browser via localStorage.
          </p>
        </section>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset demo data?"
        width="max-w-[440px]"
        footer={
          <>
            <Button variant="secondary" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                resetDemoData();
                setResetOpen(false);
                toast("Demo catalogue and orders restored.", "info");
              }}
            >
              Reset everything
            </Button>
          </>
        }
      >
        <p className="text-[13.5px] leading-6 text-body">
          All products you added or edited will be replaced with the original demo catalogue, and orders reset to the sample set.
        </p>
      </Modal>
    </div>
  );
}
