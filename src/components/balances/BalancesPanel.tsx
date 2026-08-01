"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import { getGroupBalances } from "@/lib/api/balances";
import {
  createSettlement,
  deleteSettlement,
  listSettlements,
} from "@/lib/api/settlements";
import type { GroupBalances, Settlement, SuggestedSettlement } from "@/lib/api/types";
import { displayName, formatINR, initials } from "@/lib/format";
import { snapSpring, staggerContainer, staggerItem } from "@/lib/motion";
import { useAuth } from "@/lib/auth/auth-context";
import { upiPayHref } from "@/lib/upi";

interface Props {
  groupId: number;
  /** Bump to force reload after new expense */
  refreshKey?: number;
  /** OWNER/ADMIN may record or undo any settlement */
  canManage?: boolean;
}

export function BalancesPanel({
  groupId,
  refreshKey = 0,
  canManage = false,
}: Props) {
  const { user } = useAuth();
  const [data, setData] = useState<GroupBalances | null>(null);
  const [recorded, setRecorded] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingKey, setPayingKey] = useState<string | null>(null);
  const [undoingId, setUndoingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [balances, settlements] = await Promise.all([
        getGroupBalances(groupId),
        listSettlements(groupId),
      ]);
      setData(balances);
      setRecorded(settlements);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load balances");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  const suggestionKey = (s: SuggestedSettlement, i: number) =>
    `${s.from.id}-${s.to.id}-${s.amountPaise}-${i}`;

  const canMarkPaid = (s: SuggestedSettlement) => {
    if (!user) return false;
    return canManage || user.id === s.from.id || user.id === s.to.id;
  };

  const handleMarkPaid = async (s: SuggestedSettlement, i: number) => {
    const key = suggestionKey(s, i);
    setPayingKey(key);
    setActionError(null);
    try {
      await createSettlement(groupId, {
        fromUserId: s.from.id,
        toUserId: s.to.id,
        amountPaise: s.amountPaise,
      });
      await load();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to record settlement",
      );
    } finally {
      setPayingKey(null);
    }
  };

  const handleUndo = async (settlement: Settlement) => {
    if (
      !window.confirm(
        `Undo settlement of ${formatINR(settlement.amountPaise)} from ${displayName(settlement.fromUser)} to ${displayName(settlement.toUser)}?`,
      )
    ) {
      return;
    }
    setUndoingId(settlement.id);
    setActionError(null);
    try {
      await deleteSettlement(groupId, settlement.id);
      await load();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to undo settlement",
      );
    } finally {
      setUndoingId(null);
    }
  };

  const canUndo = (settlement: Settlement) => {
    if (!user) return false;
    return (
      canManage ||
      user.id === settlement.fromUser.id ||
      user.id === settlement.toUser.id ||
      user.id === settlement.createdBy.id
    );
  };

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
      {actionError ? (
        <div className="border-2 border-accent bg-cream px-4 py-3 font-mono text-sm text-accent">
          {actionError}
        </div>
      ) : null}

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
                      zero ? "bg-canvas" : "bg-cream"
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
                        {zero ? "Settled" : positive ? "Is owed" : "Owes"}
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
            {data.settlements.map((s, i) => {
              const key = suggestionKey(s, i);
              const markable = canMarkPaid(s);
              const upiHref = upiPayHref({
                to: s.to,
                amountPaise: s.amountPaise,
                note: "Settl settle-up",
              });
              const showUpi = Boolean(upiHref && user?.id === s.from.id);
              return (
                <motion.li
                  key={key}
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
                  <div className="flex flex-wrap gap-2 sm:ml-2 shrink-0">
                    {showUpi && upiHref ? (
                      <a
                        href={upiHref}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide bg-canvas text-ink border-2 border-ink shadow-hard hover:bg-ink hover:text-cream"
                      >
                        Pay UPI
                      </a>
                    ) : null}
                    {markable ? (
                      <Button
                        variant="secondary"
                        className="text-xs py-2 px-3"
                        loading={payingKey === key}
                        onClick={() => void handleMarkPaid(s, i)}
                      >
                        Mark paid
                      </Button>
                    ) : !showUpi ? (
                      <span className="font-mono text-[10px] text-muted uppercase tracking-wider self-center">
                        Party only
                      </span>
                    ) : null}
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
        <p className="font-mono text-[10px] text-muted uppercase tracking-wider">
          Pay UPI opens your UPI app when the payee has a VPA on their profile.
          Mark paid records the settlement after you pay.
        </p>
      </section>

      {/* Recorded settlements */}
      <section className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Recorded settlements
        </p>
        {recorded.length === 0 ? (
          <div className="border-2 border-dashed border-ink bg-canvas p-6 text-center font-mono text-xs text-muted">
            No settlements recorded yet
          </div>
        ) : (
          <ul className="border-2 border-ink divide-y-2 divide-ink bg-cream shadow-hard">
            {recorded.map((s) => (
              <li
                key={s.id}
                className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold uppercase tracking-tight">
                    <span className="text-accent">
                      {displayName(s.fromUser)}
                    </span>
                    {" → "}
                    <span>{displayName(s.toUser)}</span>
                  </p>
                  <p className="font-mono text-[10px] text-muted mt-1">
                    {new Date(s.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    {s.note ? ` · ${s.note}` : ""}
                  </p>
                </div>
                <p className="font-mono text-base font-bold tabular-nums">
                  {formatINR(s.amountPaise)}
                </p>
                {canUndo(s) ? (
                  <Button
                    variant="ghost"
                    className="sm:ml-2 shrink-0 text-xs py-2 px-3"
                    loading={undoingId === s.id}
                    onClick={() => void handleUndo(s)}
                  >
                    Undo
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
