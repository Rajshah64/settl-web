"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { snapSpring, staggerContainer, staggerItem } from "@/lib/motion";

const CELLS = [
  {
    id: "hero",
    className: "sm:col-span-2 sm:row-span-2 bg-accent text-cream",
    eyebrow: "01 // Product",
    title: "Split without the fog",
    body: "Equal shares in paise. Sharp invite codes. No soft SaaS chrome.",
  },
  {
    id: "groups",
    className: "bg-cream",
    eyebrow: "02 // Groups",
    title: "Crews & codes",
    body: "Create a ledger, rotate 6-digit invites, kick with intent.",
  },
  {
    id: "ledger",
    className: "bg-canvas",
    eyebrow: "03 // Ledger",
    title: "Hard expenses",
    body: "Who paid, who shares, remainder that never vanishes.",
  },
  {
    id: "balances",
    className: "sm:col-span-2 bg-cream",
    eyebrow: "04 // Balances",
    title: "Who owes whom",
    body: "Net positions + suggested settle-up — computed, not guessed.",
  },
  {
    id: "stack",
    className: "bg-ink text-cream",
    eyebrow: "05 // Stack",
    title: "API-first",
    body: "Nest + Postgres now. UPI settle later.",
  },
] as const;

export function LandingBento() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 auto-rows-fr"
    >
      {CELLS.map((cell) => (
        <motion.article
          key={cell.id}
          variants={staggerItem}
          whileHover={{ x: -3, y: -3 }}
          whileTap={{ scale: 0.99 }}
          transition={snapSpring}
          className={`border-2 border-ink shadow-hard p-5 sm:p-6 flex flex-col min-h-[140px] ${cell.className}`}
        >
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.18em] mb-3 ${
              cell.id === "hero" || cell.id === "stack"
                ? "opacity-80"
                : "text-muted"
            }`}
          >
            {cell.eyebrow}
          </p>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none mb-2">
            {cell.title}
          </h3>
          <p
            className={`text-sm leading-snug mt-auto ${
              cell.id === "hero" || cell.id === "stack"
                ? "opacity-90"
                : "text-muted"
            }`}
          >
            {cell.body}
          </p>
        </motion.article>
      ))}

      <motion.div
        variants={staggerItem}
        className="sm:col-span-3 border-2 border-ink bg-canvas shadow-hard p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted mb-1">
            06 // Start
          </p>
          <p className="text-lg font-black uppercase tracking-tight">
            Ready to open a ledger?
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/register"
            className="inline-flex items-center justify-center border-2 border-ink bg-accent text-cream px-4 py-2.5 text-sm font-bold uppercase tracking-wide shadow-hard hover:bg-accent-hover"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center border-2 border-ink bg-cream px-4 py-2.5 text-sm font-bold uppercase tracking-wide shadow-hard hover:bg-white"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
