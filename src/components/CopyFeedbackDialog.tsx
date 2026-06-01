"use client";

import { useEffect, useId } from "react";

type CopyFeedbackDialogProps = {
  open: boolean;
  copiedValue: string;
  onClose: () => void;
};

export function CopyFeedbackDialog({
  open,
  copiedValue,
  onClose,
}: CopyFeedbackDialogProps) {
  const labelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className="relative w-full max-w-md rounded-2xl border border-white/15 bg-zinc-900 p-6 shadow-2xl shadow-black/50"
      >
        <p id={labelId} className="sr-only">
          Copied value
        </p>
        <p className="break-all rounded-xl border border-emerald-500/30 bg-black/40 px-4 py-3 font-mono text-sm text-emerald-300">
          {copiedValue}
        </p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
