"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { panelEnter, snapSpring } from "@/lib/motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-ink/40"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            variants={panelEnter}
            initial="hidden"
            animate="show"
            exit="exit"
            className="relative z-10 w-full max-w-md border-2 border-ink bg-cream shadow-hard-lg"
          >
            <div className="flex items-center justify-between border-b-2 border-ink bg-canvas px-4 py-3">
              <h3
                id="modal-title"
                className="text-lg font-black uppercase tracking-tight"
              >
                {title}
              </h3>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                transition={snapSpring}
                onClick={onClose}
                className="border-2 border-ink bg-cream px-2 py-0.5 font-mono text-xs uppercase hover:bg-accent hover:text-cream"
              >
                Esc
              </motion.button>
            </div>
            <div className="p-4 sm:p-5">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
