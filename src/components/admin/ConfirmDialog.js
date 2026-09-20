"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  text,
  confirmLabel = "Delete",
  busy = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !busy && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-5"
      onClick={() => !busy && onCancel()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md border border-line bg-surface p-7"
      >
        <div className="grid h-12 w-12 place-items-center bg-red-500/15 text-red-500">
          <AlertTriangle size={24} />
        </div>
        <h3 id="confirm-title" className="mt-5 text-xl font-bold">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>

        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="border border-line px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center gap-2 bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-red-700 disabled:opacity-70"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}