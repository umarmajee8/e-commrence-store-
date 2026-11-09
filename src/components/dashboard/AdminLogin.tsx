import { useState, type FormEvent } from "react";
import { DEMO_CREDENTIALS, useStore } from "../../store/store";
import { EyeOff, EyeOpen, LockIcon } from "./icons";
import { inputClass } from "./ui";

export default function AdminLogin() {
  const { login } = useStore();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    window.setTimeout(() => {
      if (!login(email, password)) {
        setError("Email or password is incorrect. Use the demo details below.");
        setBusy(false);
      }
    }, 450);
  };

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError("");
  };

  return (
    <div className="grid min-h-screen bg-[#f6f6f7] lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #6f6f6f 0%, transparent 65%)" }}
          aria-hidden="true"
        />
        <a href="#" className="relative text-[30px] font-bold tracking-tight">Precious<span className="text-white/40">.</span></a>
        <div className="relative max-w-[400px]">
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/50">Admin suite</p>
          <h1 className="mt-4 text-[38px] font-normal leading-[1.15]">Run your store from one dashboard.</h1>
          <p className="mt-5 text-[14px] leading-6 text-white/60">
            Add products, update stock and prices, track orders and see how your shop is performing — all in real time.
          </p>
          <ul className="mt-9 space-y-3 text-[13px] text-white/75">
            {["Add, edit and delete products instantly", "Every change shows up on the storefront", "Orders, revenue and low-stock alerts"].map((line) => (
              <li key={line} className="flex items-center gap-3">
                <span className="grid h-5 w-5 place-items-center rounded-full border border-white/25 text-[10px]">✓</span>
                {line}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-[12px] text-white/35">© 2019 Precious. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[400px]">
          <a href="#" className="mb-9 inline-block text-[26px] font-bold tracking-tight text-ink lg:hidden">Precious<span className="text-muted">.</span></a>
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-white text-ink shadow-sm">
            <LockIcon className="h-5 w-5" />
          </span>
          <h2 className="mt-5 text-[27px] font-semibold text-ink">Admin sign in</h2>
          <p className="mt-2 text-[13.5px] text-muted">Sign in to manage products and orders.</p>

          <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.06em] text-ink">Email</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@store.com"
                required
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.06em] text-ink">Password</label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-11`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <EyeOpen className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-[#ffeaea] px-3.5 py-2.5 text-[12.5px] text-[#c92a2a]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="h-12 w-full rounded-lg bg-ink text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-black disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in to dashboard"}
            </button>
          </form>

          <div className="mt-7 rounded-xl border border-dashed border-line bg-white p-4">
            <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink">Demo account</p>
            <p className="mt-2 text-[13px] text-muted">
              {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
            </p>
            <button type="button" onClick={fillDemo} className="mt-3 text-[12.5px] font-medium text-ink underline underline-offset-4 hover:text-black">
              Fill demo credentials
            </button>
          </div>

          <a href="#" className="mt-8 inline-flex items-center gap-2 text-[12.5px] text-muted transition-colors hover:text-ink">
            <span aria-hidden="true">←</span> Back to storefront
          </a>
        </div>
      </div>
    </div>
  );
}
