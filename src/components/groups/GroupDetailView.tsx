"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AddMemberModal } from "@/components/groups/AddMemberModal";
import { MemberList } from "@/components/groups/MemberList";
import { CreateExpenseModal } from "@/components/expenses/CreateExpenseModal";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { ApiError } from "@/lib/api/client";
import { listExpenses } from "@/lib/api/expenses";
import { getGroup, leaveGroup, regenerateInviteCode } from "@/lib/api/groups";
import { listMembers } from "@/lib/api/members";
import { useAuth } from "@/lib/auth/auth-context";
import type { Expense, Group, GroupMember } from "@/lib/api/types";
import { snapSpring } from "@/lib/motion";

type TabId = "expenses" | "members";

export function GroupDetailView() {
  const params = useParams<{ id: string }>();
  const groupId = Number(params.id);
  const router = useRouter();
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [tab, setTab] = useState<TabId>("expenses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [inviteBusy, setInviteBusy] = useState(false);
  const [leaveBusy, setLeaveBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isFinite(groupId)) {
      setError("Invalid group id");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [g, m, e] = await Promise.all([
        getGroup(groupId),
        listMembers(groupId),
        listExpenses(groupId, 1, 50),
      ]);
      setGroup(g);
      setMembers(m);
      setExpenses(e.data);
      setExpenseTotal(e.meta.total);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load group");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    void load();
  }, [load]);

  const myMembership = useMemo(
    () => members.find((m) => m.user.id === user?.id),
    [members, user?.id],
  );

  const canManage =
    myMembership?.role === "OWNER" || myMembership?.role === "ADMIN";

  async function copyInvite() {
    if (!group) return;
    try {
      await navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  async function rotateInvite() {
    if (!group) return;
    setInviteBusy(true);
    try {
      const next = await regenerateInviteCode(groupId);
      setGroup({
        ...group,
        inviteCode: next.inviteCode,
        inviteCodeExpiresAt: next.inviteCodeExpiresAt,
      });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not rotate invite",
      );
    } finally {
      setInviteBusy(false);
    }
  }

  async function handleLeave() {
    if (!confirm("Leave this group?")) return;
    setLeaveBusy(true);
    try {
      await leaveGroup(groupId);
      router.replace("/groups");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not leave");
      setLeaveBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto border-2 border-ink bg-canvas p-8 shadow-hard text-center font-mono text-sm uppercase tracking-widest">
        Loading group…
      </div>
    );
  }

  if (error && !group) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Link href="/groups">
          <Button variant="ghost">← Back</Button>
        </Link>
        <div className="border-2 border-ink bg-accent text-cream p-4 shadow-hard font-mono text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!group) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Link href="/groups">
          <Button variant="ghost" className="!px-0 border-0 !shadow-none">
            ← Groups
          </Button>
        </Link>
        {myMembership && myMembership.role !== "OWNER" ? (
          <Button
            variant="secondary"
            loading={leaveBusy}
            onClick={() => void handleLeave()}
            className="!text-xs !py-2"
          >
            Leave
          </Button>
        ) : null}
      </div>

      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={snapSpring}
        className="border-2 border-ink bg-cream shadow-hard-lg"
      >
        <div className="border-b-2 border-ink bg-canvas px-4 sm:px-5 py-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-1">
              Group //{group.id}
              {myMembership ? ` · ${myMembership.role}` : ""}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-none">
              {group.name}
            </h1>
            {group.description ? (
              <p className="mt-2 text-sm text-muted max-w-md">
                {group.description}
              </p>
            ) : null}
          </div>

          <div className="border-2 border-ink bg-cream px-3 py-2 space-y-2 shrink-0">
            <p className="font-mono text-[10px] uppercase text-muted">Invite</p>
            <p className="font-mono text-xl font-bold tracking-[0.2em]">
              {group.inviteCode}
            </p>
            <div className="flex gap-1">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                transition={snapSpring}
                onClick={() => void copyInvite()}
                className="border-2 border-ink bg-canvas px-2 py-1 font-mono text-[10px] uppercase hover:bg-accent hover:text-cream"
              >
                {copied ? "Copied" : "Copy"}
              </motion.button>
              {canManage ? (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  transition={snapSpring}
                  disabled={inviteBusy}
                  onClick={() => void rotateInvite()}
                  className="border-2 border-ink bg-canvas px-2 py-1 font-mono text-[10px] uppercase hover:bg-ink hover:text-cream disabled:opacity-50"
                >
                  {inviteBusy ? "…" : "Rotate"}
                </motion.button>
              ) : null}
            </div>
          </div>
        </div>

        {error ? (
          <div className="border-b-2 border-ink bg-accent text-cream px-4 py-2 font-mono text-xs">
            {error}
          </div>
        ) : null}

        <Tabs
          layoutId={`group-${groupId}-tabs`}
          active={tab}
          onChange={(id) => setTab(id as TabId)}
          tabs={[
            { id: "expenses", label: "Expenses", count: expenseTotal },
            { id: "members", label: "Members", count: members.length },
          ]}
        />

        <div className="p-4 sm:p-5">
          <AnimatePresence mode="wait">
            {tab === "expenses" ? (
              <motion.div
                key="expenses"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={snapSpring}
                className="space-y-4"
              >
                <div className="flex justify-end">
                  <Button onClick={() => setAddExpenseOpen(true)}>
                    Add expense
                  </Button>
                </div>
                <ExpenseList expenses={expenses} />
              </motion.div>
            ) : (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={snapSpring}
              >
                <MemberList
                  groupId={groupId}
                  members={members}
                  currentUserId={user?.id ?? 0}
                  canManage={canManage}
                  onChanged={setMembers}
                  onAddClick={() => setAddMemberOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <AddMemberModal
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        groupId={groupId}
        existingUserIds={members.map((m) => m.user.id)}
        onAdded={(m) => setMembers((prev) => [...prev, m])}
      />

      <CreateExpenseModal
        open={addExpenseOpen}
        onClose={() => setAddExpenseOpen(false)}
        groupId={groupId}
        members={members}
        onCreated={(expense) => {
          setExpenses((prev) => [expense, ...prev]);
          setExpenseTotal((t) => t + 1);
        }}
      />
    </div>
  );
}
