"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { CreateGroupModal } from "@/components/groups/CreateGroupModal";
import { GroupCard } from "@/components/groups/GroupCard";
import { JoinGroupModal } from "@/components/groups/JoinGroupModal";
import { ApiError } from "@/lib/api/client";
import { listMyGroups } from "@/lib/api/groups";
import type { Group } from "@/lib/api/types";
import { snapSpring, staggerContainer } from "@/lib/motion";

export function GroupsDashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMyGroups();
      setGroups(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function upsertGroup(group: Group) {
    setGroups((prev) => {
      const without = prev.filter((g) => g.id !== group.id);
      return [group, ...without];
    });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b-2 border-ink pb-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-1">
            Dashboard // Groups
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
            Your groups
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setJoinOpen(true)}>
            Join
          </Button>
          <Button onClick={() => setCreateOpen(true)}>New group</Button>
        </div>
      </header>

      {loading ? (
        <div className="border-2 border-ink bg-canvas p-8 shadow-hard text-center">
          <p className="font-mono text-sm uppercase tracking-widest animate-pulse">
            Loading ledger…
          </p>
        </div>
      ) : null}

      {!loading && error ? (
        <div className="border-2 border-ink bg-accent text-cream p-4 shadow-hard space-y-3">
          <p className="font-mono text-sm">{error}</p>
          <Button variant="secondary" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      ) : null}

      {!loading && !error && groups.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={snapSpring}
          className="border-2 border-ink bg-canvas p-8 sm:p-12 shadow-hard text-center space-y-4"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Empty // 00
          </p>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            No groups yet
          </h2>
          <p className="text-sm text-muted max-w-sm mx-auto">
            Create a group for a trip, flat, or dinner crew — or join with a
            6-digit invite code.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <Button variant="secondary" onClick={() => setJoinOpen(true)}>
              Join
            </Button>
            <Button onClick={() => setCreateOpen(true)}>New group</Button>
          </div>
        </motion.div>
      ) : null}

      {!loading && !error && groups.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {groups.map((group, i) => (
              <GroupCard key={group.id} group={group} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : null}

      <CreateGroupModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={upsertGroup}
      />
      <JoinGroupModal
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        onJoined={upsertGroup}
      />
    </div>
  );
}
