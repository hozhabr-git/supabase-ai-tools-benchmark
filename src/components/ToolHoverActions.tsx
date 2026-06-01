"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Copy, Loader2, Trash2 } from "lucide-react";
import { AlertDialog } from "@/components/AlertDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CopyFeedbackDialog } from "@/components/CopyFeedbackDialog";
import { copyToClipboard } from "@/lib/copy-to-clipboard";

type ToolHoverActionsProps = {
  toolId: string;
  toolName: string;
  onDeleted?: () => void;
  redirectTo?: string;
};

const iconBtn =
  "pointer-events-auto absolute z-20 rounded-md p-1 opacity-0 transition-[opacity,background-color,transform] duration-300 ease-out hover:scale-110 hover:bg-white/10 focus-visible:opacity-100 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40";

export function ToolHoverActions({
  toolId,
  toolName,
  onDeleted,
  redirectTo,
}: ToolHoverActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [copiedValue, setCopiedValue] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  function showAlert(message: string) {
    setAlertMessage(message);
    setAlertOpen(true);
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/tools/${toolId}`, { method: "DELETE" });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        showAlert(json.error ?? "Failed to delete tool");
        return;
      }

      setDeleteOpen(false);
      onDeleted?.();
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  function openDeleteDialog(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDeleteOpen(true);
  }

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const value = `${window.location.origin}/tools/${toolId}`;
    const ok = await copyToClipboard(value);

    if (!ok) {
      showAlert("Could not copy to clipboard");
      return;
    }

    setCopiedValue(value);
    setCopyOpen(true);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <button
        type="button"
        onClick={openDeleteDialog}
        disabled={deleting}
        aria-label={`Delete ${toolName}`}
        className={`${iconBtn} left-3 top-3 text-red-400/90 hover:text-red-300`}
      >
        {deleting ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Trash2 className="h-3 w-3" />
        )}
      </button>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy link to ${toolName}`}
        className={`${iconBtn} right-3 top-3 text-emerald-500 hover:text-emerald-400`}
      >
        {copied ? (
          <Check className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </button>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete tool?"
        description={`Are you sure you want to delete "${toolName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setDeleteOpen(false)}
      />

      <CopyFeedbackDialog
        open={copyOpen}
        copiedValue={copiedValue}
        onClose={() => setCopyOpen(false)}
      />

      <AlertDialog
        open={alertOpen}
        title="Something went wrong"
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
}
