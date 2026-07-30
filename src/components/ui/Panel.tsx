"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { panelEnter } from "@/lib/motion";

interface PanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
  eyebrow?: string;
}

export function Panel({ children, className = "", title, eyebrow }: PanelProps) {
  return (
    <motion.div
      variants={panelEnter}
      initial="hidden"
      animate="show"
      exit="exit"
      className={`border-2 border-ink bg-cream shadow-hard-lg ${className}`}
    >
      {(eyebrow || title) && (
        <div className="border-b-2 border-ink bg-canvas px-5 py-4">
          {eyebrow ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-1">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="text-2xl font-black uppercase tracking-tight text-ink leading-none">
              {title}
            </h2>
          ) : null}
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
    </motion.div>
  );
}
