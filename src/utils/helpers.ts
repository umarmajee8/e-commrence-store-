export const uid = () => Math.random().toString(36).slice(2, 9);

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read the image"));
    reader.readAsDataURL(file);
  });
}

/** Resize/compress a picked image so it fits comfortably in localStorage. */
export async function toCompressedDataUrl(file: File, maxSize = 720, quality = 0.82): Promise<string> {
  const dataUrl = await readFileAsDataURL(file);
  if (typeof document === "undefined") return dataUrl;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/** Custom event used to navigate inside the dashboard without a router. */
export const DASHBOARD_NAV_EVENT = "precious:dashboard-nav";

export type DashboardTab = "overview" | "products" | "orders" | "settings";

let pendingNewProduct = false;

/** Ask the products page to open the "add product" dialog, even if it isn't mounted yet. */
export function requestNewProduct() {
  pendingNewProduct = true;
  window.dispatchEvent(new CustomEvent("precious:new-product"));
}

export function consumeNewProductRequest() {
  if (!pendingNewProduct) return false;
  pendingNewProduct = false;
  return true;
}

export function navigateDashboard(tab: DashboardTab) {
  window.dispatchEvent(new CustomEvent<DashboardTab>(DASHBOARD_NAV_EVENT, { detail: tab }));
}

export function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const compactMoney = (n: number) => `$${n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toFixed(0)}`;

export function relativeTime(timestamp: number) {
  const diff = Date.now() - timestamp;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(timestamp);
}
