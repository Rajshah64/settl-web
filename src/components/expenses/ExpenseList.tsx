"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Expense } from "@/lib/api/types";
import { displayName, formatINR } from "@/lib/format";
import { staggerContainer, staggerItem } from "@/lib/motion";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

interface ExpenseListProps {
  expenses: Expense[];
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="border-2 border-dashed border-ink bg-canvas p-8 sm:p-10 text-center space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          Empty // ledger
        </p>
        <p className="text-xl font-black uppercase tracking-tight">
          No expenses yet
        </p>
        <p className="font-mono text-xs text-muted">
          Add one to start splitting equally.
        </p>
      </div>
    );
  }

  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="border-2 border-ink divide-y-2 divide-ink bg-cream shadow-hard"
    >
      <AnimatePresence mode="popLayout">
        {expenses.map((expense, i) => (
          <motion.li
            key={expense.id}
            variants={staggerItem}
            layout
            className="px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
          >
            <div className="font-mono text-[10px] text-muted shrink-0 w-8">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold uppercase tracking-tight truncate">
                {expense.description}
              </p>
              <p className="font-mono text-[11px] text-muted mt-0.5">
                Paid by {displayName(expense.paidBy)} · {formatDate(expense.spentAt)} ·{" "}
                {expense.shares.length} split
              </p>
            </div>
            <p className="font-mono text-base sm:text-lg font-bold tabular-nums shrink-0">
              {formatINR(expense.amountPaise)}
            </p>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
