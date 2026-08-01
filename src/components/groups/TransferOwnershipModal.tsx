"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ApiError } from "@/lib/api/client";
import { transferOwnership } from "@/lib/api/groups";
import type { Group, GroupMember } from "@/lib/api/types";
import { displayName } from "@/lib/format";

interface Props {
  open: boolean;
  onClose: () => void;
  groupId: number;
  members: GroupMember[];
  currentUserId: number;
  onTransferred: (group: Group) => void;
}

export function TransferOwnershipModal({
  open,
  onClose,
  groupId,
  members,
  currentUserId,
  onTransferred,
}: Props) {
  const candidates = members.filter((m) => m.user.id !== currentUserId);
  const [newOwnerUserId, setNewOwnerUserId] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const first = members.find((m) => m.user.id !== currentUserId);
    setNewOwnerUserId(first?.user.id ?? 0);
    setError(null);
  }, [open, members, currentUserId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!newOwnerUserId) {
      setError("Pick a new owner");
      return;
    }
    if (
      !window.confirm(
        "Transfer ownership? You will become an ADMIN of this group.",
      )
    ) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const group = await transferOwnership(groupId, newOwnerUserId);
      onTransferred(group);
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not transfer ownership",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Transfer ownership">
      <form onSubmit={onSubmit} className="space-y-4">
        {candidates.length === 0 ? (
          <p className="font-mono text-xs text-muted">
            Add another member before transferring ownership.
          </p>
        ) : (
          <label className="flex flex-col gap-1.5 w-full">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
              New owner
            </span>
            <select
              value={newOwnerUserId}
              onChange={(e) => setNewOwnerUserId(Number(e.target.value))}
              className="w-full border-2 border-ink bg-cream px-3 py-2.5 font-mono text-sm outline-none focus:bg-white focus:shadow-hard-sm"
              required
            >
              {candidates.map((m) => (
                <option key={m.user.id} value={m.user.id}>
                  {displayName(m.user)} · {m.role}
                </option>
              ))}
            </select>
          </label>
        )}
        {error ? (
          <p className="font-mono text-xs text-accent border-2 border-ink bg-canvas px-2 py-1.5">
            {error}
          </p>
        ) : null}
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            loading={loading}
            disabled={candidates.length === 0}
            className="flex-1"
          >
            Transfer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
