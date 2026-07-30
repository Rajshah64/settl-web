"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import { getGroupBalances } from "@/lib/api/balances";
import type { GroupBalances } from "@/lib/api/types";
import { displayName, formatINR, initials } from "@/lib/format";
import { snapSpring, staggerContainer, staggerItem } from "@/lib/motion";
import { useAuth } from "@/lib/auth/auth-context";

interface Props {
  groupId: number;
  /** Bump to force reload after new expense */
  refreshKey?: number;
}

export function BalancesPanel({ groupId, refreshKey = 0 }: Props) {
  const { user } = useAuth();
  const [data, setData] = useState<GroupBalances | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getGroupBalances(groupId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load balances");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  if (loading) {
    return (
      <div className="border-2 border-ink bg-canvas p-8 text-center font-mono text-sm uppercase tracking-widest">
        Crunching ledger…
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-2 border-ink bg-accent text-cream p-4 space-y-3">
        <p className="font-mono text-sm">{error}</p>
        <Button variant="secondary" onClick={() => void load()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const settled =
    data.settlements.length === 0 &&
    data.balances.every((b) => b.netPaise === 0);

  return (
    <div className="space-y-6">
      {/* Bento: net positions */}
      <section className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Net positions
        </p>
        {settled ? (
          <div className="border-2 border-ink bg-canvas p-8 text-center shadow-hard space-y-2">
            <p className="text-2xl font-black uppercase tracking-tight">
              All square
            </p>
            <p className="font-mono text-xs text-muted">
              No outstanding balances in this group.
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <AnimatePresence mode="popLayout">
              {data.balances.map((row) => {
                const isSelf = row.user.id === user?.id;
                const positive = row.netPaise > 0;
                const zero = row.netPaise === 0;
                return (
                  <motion.article
                    key={row.user.id}
                    variants={staggerItem}
                    whileHover={{ x: -2, y: -2 }}
                    transition={snapSpring}
                    className={`border-2 border-ink shadow-hard p-4 flex items-center gap-3 ${
                      zero
                        ? "bg-canvas"
                        : positive
                          ? "bg-cream"
                          : "bg-cream"
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink bg-canvas font-mono text-xs font-bold">
                      {initials(row.user)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold truncate">
                        {displayName(row.user)}
                        {isSelf ? (
                          <span className="ml-2 font-mono text-[10px] text-muted">
                            YOU
                          </span>
                        ) : null}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        {zero
                          ? "Settled"
                          : positive
                            ? "Is owed"
                            : "Owes"}
                      </p>
                    </div>
                    <p
                      className={`font-mono text-lg font-bold tabular-nums shrink-0 ${
                        zero
                          ? "text-muted"
                          : positive
                            ? "text-ink"
                            : "text-accent"
                      }`}
                    >
                      {zero
                        ? formatINR(0)
                        : `${positive ? "+" : "−"}${formatINR(Math.abs(row.netPaise))}`}
                    </p>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Suggested settle-up */}
      <section className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Suggested settle-up
        </p>
        {data.settlements.length === 0 ? (
          <div className="border-2 border-dashed border-ink bg-canvas p-6 text-center font-mono text-xs text-muted">
            Nothing to settle
          </div>
        ) : (
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="border-2 border-ink divide-y-2 divide-ink bg-cream shadow-hard"
          >
            {data.settlements.map((s, i) => (
              <motion.li
                key={`${s.from.id}-${s.to.id}-${i}`}
                variants={staggerItem}
                className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
              >
                <span className="font-mono text-[10px] text-muted w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="flex-1 text-sm font-bold uppercase tracking-tight">
                  <span className="text-accent">{displayName(s.from)}</span>
                  {" → "}
                  <span>{displayName(s.to)}</span>
                </p>
                <p className="font-mono text-base font-bold tabular-nums">
                  {formatINR(s.amountPaise)}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        )}
        <p className="font-mono text-[10px] text-muted uppercase tracking-wider">
          Preview only — mark-as-paid lands in Phase 3
        </p>
      </section>
    </div>
  );
}
