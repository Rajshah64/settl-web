"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ApiError } from "@/lib/api/client";
import { createExpense } from "@/lib/api/expenses";
import type { Expense, GroupMember } from "@/lib/api/types";
import {
  displayName,
  formatINR,
  rupeesInputToPaise,
  splitEquallyPaise,
} from "@/lib/format";
import { snapSpring } from "@/lib/motion";
import { useAuth } from "@/lib/auth/auth-context";

interface Props {
  open: boolean;
  onClose: () => void;
  groupId: number;
  members: GroupMember[];
  onCreated: (expense: Expense) => void;
}

export function CreateExpenseModal({
  open,
  onClose,
  groupId,
  members,
  onCreated,
}: Props) {
  const { user } = useAuth();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidByUserId, setPaidByUserId] = useState(0);
  const [participantIds, setParticipantIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPaidByUserId(user?.id ?? members[0]?.user.id ?? 0);
    setParticipantIds(members.map((m) => m.user.id));
    setError(null);
  }, [open, members, user?.id]);

  const amountPaise = rupeesInputToPaise(amount);
  const previewShares =
    amountPaise && participantIds.length > 0
      ? splitEquallyPaise(amountPaise, participantIds.length)
      : [];

  function toggleParticipant(id: number) {
    setParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function selectAll() {
    setParticipantIds(members.map((m) => m.user.id));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const paise = rupeesInputToPaise(amount);
    if (!paise) {
      setError("Enter a valid amount (e.g. 1200 or 1200.50)");
      return;
    }
    if (participantIds.length < 1) {
      setError("Pick at least one participant");
      return;
    }

    setLoading(true);
    try {
      const expense = await createExpense(groupId, {
        description: description.trim(),
        amountPaise: paise,
        paidByUserId,
        participantUserIds: participantIds,
      });
      setDescription("");
      setAmount("");
      onCreated(expense);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create expense");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add expense" wide>
      <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <Input
          label="Description"
          required
          maxLength={200}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Dinner at Truffles"
        />
        <Input
          label="Amount (₹)"
          required
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1200.00"
          hint={amountPaise ? `= ${amountPaise} paise` : "Rupees, up to 2 decimals"}
        />

        <label className="flex flex-col gap-1.5 w-full">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
            Paid by
          </span>
          <select
            value={paidByUserId}
            onChange={(e) => setPaidByUserId(Number(e.target.value))}
            className="w-full border-2 border-ink bg-cream px-3 py-2.5 font-mono text-sm outline-none focus:bg-white focus:shadow-hard-sm"
            required
          >
            {members.map((m) => (
              <option key={m.user.id} value={m.user.id}>
                {displayName(m.user)}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
              Split equally among
            </span>
            <button
              type="button"
              onClick={selectAll}
              className="font-mono text-[10px] uppercase underline underline-offset-2"
            >
              Select all
            </button>
          </div>
          <div className="border-2 border-ink divide-y-2 divide-ink max-h-40 overflow-y-auto">
            {members.map((m) => {
              const checked = participantIds.includes(m.user.id);
              return (
                <motion.button
                  key={m.user.id}
                  type="button"
                  whileTap={{ scale: 0.99 }}
                  transition={snapSpring}
                  onClick={() => toggleParticipant(m.user.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left ${
                    checked ? "bg-canvas" : "bg-cream"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center border-2 border-ink font-mono text-[10px] ${
                      checked ? "bg-accent text-cream" : "bg-cream"
                    }`}
                  >
                    {checked ? "✓" : ""}
                  </span>
                  <span className="text-sm font-bold">{displayName(m.user)}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {previewShares.length > 0 ? (
          <div className="border-2 border-ink bg-canvas px-3 py-2 font-mono text-xs space-y-1">
            <p className="uppercase tracking-wider text-muted">Preview split</p>
            <p className="font-bold">
              {formatINR(previewShares[0])}
              {previewShares.some((s) => s !== previewShares[0])
                ? ` – ${formatINR(Math.max(...previewShares))} each`
                : " each"}{" "}
              · {participantIds.length} people
            </p>
          </div>
        ) : null}

        {error ? (
          <p className="font-mono text-xs text-accent border-2 border-ink bg-canvas px-2 py-1.5">
            {error}
          </p>
        ) : null}

        <div className="flex gap-2 pt-1 sticky bottom-0 bg-cream">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
