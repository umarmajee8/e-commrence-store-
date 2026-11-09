import { useEffect, type ReactNode } from "react";
import { CloseIcon } from "../Icons";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
};

export default function Modal({ open, onClose, title, subtitle, children, footer, width = "max-w-[720px]" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={`flex max-h-[94vh] w-full ${width} flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:rounded-2xl`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <h2 className="text-[17px] font-semibold text-ink sm:text-[19px]">{title}</h2>
            {subtitle && <p className="mt-1 text-[12px] text-muted sm:text-[13px]">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-tile hover:text-ink">
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">{children}</div>
        {footer && <footer className="flex items-center justify-end gap-3 border-t border-line bg-[#fafafa] px-5 py-4 sm:px-7">{footer}</footer>}
      </div>
    </div>
  );
}
