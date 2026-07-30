"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { snapSpring } from "@/lib/motion";

export default function ProfilePage() {
  const { profile, user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <header className="border-b-2 border-ink pb-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-1">
          Account // Profile
        </p>
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          Profile
        </h1>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={snapSpring}
        className="border-2 border-ink bg-cream shadow-hard divide-y-2 divide-ink"
      >
        <Row
          label="Name"
          value={
            profile
              ? `${profile.firstName} ${profile.lastName}`
              : "—"
          }
        />
        <Row label="Email" value={profile?.email ?? user?.email ?? "—"} />
        <Row label="User ID" value={String(user?.id ?? "—")} mono />
      </motion.div>

      <Button
        variant="danger"
        onClick={() => {
          logout();
          router.replace("/");
        }}
      >
        Log out
      </Button>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="px-4 py-3 flex items-baseline justify-between gap-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted shrink-0">
        {label}
      </span>
      <span
        className={`text-sm font-bold text-right ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
