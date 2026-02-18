"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  side?: "right" | "bottom";
}

export default function Drawer({ open, onClose, children, title, side = "right" }: DrawerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const slideFrom = side === "right"
    ? { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } }
    : { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };

  const containerClass = side === "right"
    ? "fixed inset-y-0 right-0 z-[100] w-full max-w-md"
    : "fixed inset-x-0 bottom-0 z-[100] max-h-[85vh]";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={slideFrom.initial}
            animate={slideFrom.animate}
            exit={slideFrom.exit}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`${containerClass} flex flex-col overflow-hidden bg-surface shadow-2xl ring-1 ring-surface-border ${
              side === "bottom" ? "rounded-t-2xl" : ""
            }`}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              {title && <h2 className="font-semibold text-white">{title}</h2>}
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
