"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/auth-context";
import { snapSpring } from "@/lib/motion";

export default function LandingPage() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) router.replace("/groups");
  }, [ready, user, router]);

  return (
    <div className="min-h-screen bg-cream bg-grid flex flex-col">
      <header className="border-b-2 border-ink bg-canvas px-4 sm:px-8 py-4 flex items-center justify-between">
        <span className="text-2xl font-black uppercase tracking-tighter">
          Settl
        </span>
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="secondary">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button>Get started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={snapSpring}
          className="max-w-2xl w-full border-2 border-ink bg-cream shadow-hard-lg"
        >
          <div className="border-b-2 border-ink bg-accent px-6 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream">
              Expense ledger // Phase 1
            </p>
          </div>
          <div className="p-6 sm:p-10 space-y-6">
            <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
              Split.
              <br />
              Track.
              <br />
              <span className="text-accent">Settle.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-md leading-relaxed">
              Group expenses without the soft SaaS fog. Sharp edges. Clear
              balances. Built for trips, flats, and dinner tabs.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/register">
                <Button className="min-w-[140px]">Create account</Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="min-w-[140px]">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
