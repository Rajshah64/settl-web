"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api/client";
import type { Group } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { snapSpring } from "@/lib/motion";

export default function GroupDetailPage() {
  const params = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<Group>(`/groups/${params.id}`);
        if (!cancelled) setGroup(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Failed to load group",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/groups">
        <Button variant="ghost" className="!px-0 !shadow-none border-0">
          ← Back to groups
        </Button>
      </Link>

      {loading ? (
        <div className="border-2 border-ink bg-canvas p-8 shadow-hard font-mono text-sm uppercase tracking-widest text-center">
          Loading group…
        </div>
      ) : null}

      {error ? (
        <div className="border-2 border-ink bg-accent text-cream p-4 shadow-hard font-mono text-sm">
          {error}
        </div>
      ) : null}

      {group ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={snapSpring}
          className="border-2 border-ink bg-cream shadow-hard-lg"
        >
          <div className="border-b-2 border-ink bg-canvas px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-1">
                Group //{group.id}
              </p>
              <h1 className="text-3xl font-black uppercase tracking-tighter">
                {group.name}
              </h1>
            </div>
            <div className="border-2 border-ink bg-cream px-3 py-2">
              <p className="font-mono text-[10px] uppercase text-muted">
                Invite
              </p>
              <p className="font-mono text-lg font-bold tracking-widest">
                {group.inviteCode}
              </p>
            </div>
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            {group.description ? (
              <p className="text-sm text-muted">{group.description}</p>
            ) : null}
            <div className="border-2 border-dashed border-ink bg-canvas p-6 text-center space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                Phase 2
              </p>
              <p className="font-bold uppercase tracking-tight">
                Expenses & members coming next
              </p>
              <p className="font-mono text-xs text-muted">
                This build stops at auth + groups list.
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
