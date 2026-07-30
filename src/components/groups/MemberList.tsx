"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import { removeMember } from "@/lib/api/members";
import type { GroupMember, GroupRole } from "@/lib/api/types";
import { displayName, initials } from "@/lib/format";
import { snapSpring, staggerContainer, staggerItem } from "@/lib/motion";

const ROLE_STYLE: Record<GroupRole, string> = {
  OWNER: "bg-accent text-cream border-ink",
  ADMIN: "bg-ink text-cream border-ink",
  MEMBER: "bg-cream text-ink border-ink",
};

interface MemberListProps {
  groupId: number;
  members: GroupMember[];
  currentUserId: number;
  canManage: boolean;
  onChanged: (members: GroupMember[]) => void;
  onAddClick: () => void;
}

export function MemberList({
  groupId,
  members,
  currentUserId,
  canManage,
  onChanged,
  onAddClick,
}: MemberListProps) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRemove(userId: number) {
    setError(null);
    setBusyId(userId);
    try {
      await removeMember(groupId, userId);
      onChanged(members.filter((m) => m.user.id !== userId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Remove failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {members.length} member{members.length === 1 ? "" : "s"}
        </p>
        {canManage ? (
          <Button onClick={onAddClick} className="!py-2 !text-xs">
            Add member
          </Button>
        ) : null}
      </div>

      {error ? (
        <p className="font-mono text-xs text-accent border-2 border-ink bg-canvas px-2 py-1.5">
          {error}
        </p>
      ) : null}

      {members.length === 0 ? (
        <div className="border-2 border-dashed border-ink bg-canvas p-8 text-center">
          <p className="font-bold uppercase">No members</p>
        </div>
      ) : (
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="border-2 border-ink divide-y-2 divide-ink bg-cream shadow-hard"
        >
          <AnimatePresence mode="popLayout">
            {members.map((m) => {
              const isSelf = m.user.id === currentUserId;
              const canRemove =
                canManage &&
                !isSelf &&
                m.role !== "OWNER";

              return (
                <motion.li
                  key={m.id}
                  variants={staggerItem}
                  layout
                  exit={{ opacity: 0, x: -8, transition: { duration: 0.15 } }}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-canvas font-mono text-xs font-bold">
                    {initials(m.user)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold truncate">
                      {displayName(m.user)}
                      {isSelf ? (
                        <span className="ml-2 font-mono text-[10px] text-muted">
                          YOU
                        </span>
                      ) : null}
                    </p>
                    <p className="font-mono text-[11px] text-muted truncate">
                      {m.user.email}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${ROLE_STYLE[m.role]}`}
                  >
                    {m.role}
                  </span>
                  {canRemove ? (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      transition={snapSpring}
                      disabled={busyId === m.user.id}
                      onClick={() => void handleRemove(m.user.id)}
                      className="shrink-0 border-2 border-ink bg-cream px-2 py-1 font-mono text-[10px] uppercase hover:bg-accent hover:text-cream disabled:opacity-50"
                    >
                      {busyId === m.user.id ? "…" : "Kick"}
                    </motion.button>
                  ) : null}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
