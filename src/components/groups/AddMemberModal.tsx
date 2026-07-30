"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ApiError } from "@/lib/api/client";
import { addMember } from "@/lib/api/members";
import { searchUsers } from "@/lib/api/users";
import type { GroupMember, UserProfile } from "@/lib/api/types";
import { displayName } from "@/lib/format";

interface Props {
  open: boolean;
  onClose: () => void;
  groupId: number;
  existingUserIds: number[];
  onAdded: (member: GroupMember) => void;
}

export function AddMemberModal({
  open,
  onClose,
  groupId,
  existingUserIds,
  onAdded,
}: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<UserProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const term = q.trim();
    if (term.length < 1) {
      setResults([]);
      return;
    }

    const handle = window.setTimeout(() => {
      void (async () => {
        setSearching(true);
        setError(null);
        try {
          const res = await searchUsers(term, 1, 8);
          setResults(
            res.data.filter((u) => !existingUserIds.includes(u.id)),
          );
        } catch (err) {
          setError(err instanceof ApiError ? err.message : "Search failed");
          setResults([]);
        } finally {
          setSearching(false);
        }
      })();
    }, 280);

    return () => window.clearTimeout(handle);
  }, [q, open, existingUserIds]);

  async function handleAdd(userId: number) {
    setBusyId(userId);
    setError(null);
    try {
      const member = await addMember(groupId, userId);
      onAdded(member);
      setQ("");
      setResults([]);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add member");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add member">
      <div className="space-y-4">
        <Input
          label="Search users"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Name or email"
          hint="Type to search the directory"
          autoFocus
        />

        {error ? (
          <p className="font-mono text-xs text-accent border-2 border-ink bg-canvas px-2 py-1.5">
            {error}
          </p>
        ) : null}

        <div className="border-2 border-ink min-h-[120px] bg-canvas">
          {searching ? (
            <p className="p-4 font-mono text-xs uppercase tracking-widest text-muted">
              Searching…
            </p>
          ) : null}
          {!searching && q.trim() && results.length === 0 ? (
            <p className="p-4 font-mono text-xs text-muted">No matches</p>
          ) : null}
          {!searching && results.length > 0 ? (
            <ul className="divide-y-2 divide-ink">
              {results.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between gap-2 bg-cream px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">
                      {displayName(u)}
                    </p>
                    <p className="font-mono text-[11px] text-muted truncate">
                      {u.email}
                    </p>
                  </div>
                  <Button
                    className="!py-1.5 !text-xs shrink-0"
                    loading={busyId === u.id}
                    onClick={() => void handleAdd(u.id)}
                  >
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
          {!q.trim() && !searching ? (
            <p className="p-4 font-mono text-xs text-muted">
              Start typing a name or email
            </p>
          ) : null}
        </div>

        <Button type="button" variant="secondary" onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </Modal>
  );
}
