"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this data? This action cannot be undone.",
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z- flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={isLoading ? undefined : onClose}
      />
      <div className="relative bg-surface borderborder-surface-light w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">{message}</p>
        </div>

        <div className="flex border-t border-surface-light">
          <button
            disabled={isLoading}
            onClick={onClose}
            className="flex-1 px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-foreground hover:bg-white/5 transition-all border-r border-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={onConfirm}
            className="flex-1 px-6 py-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Delete Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
