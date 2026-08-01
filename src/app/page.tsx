"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { LandingBento } from "@/components/landing/LandingBento";
import { useAuth } from "@/lib/auth/auth-context";
import { snapSpring } from "@/lib/motion";

export default function LandingPage() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) router.replace("/groups");
  }, [ready, user, router]);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="border-b-2 border-ink bg-canvas px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
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

      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-5xl mx-auto w-full space-y-10">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={snapSpring}
          className="space-y-4"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Expense ledger // brutalist edition
          </p>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.85] max-w-3xl">
            Split.
            <br />
            Track.
            <br />
            <span className="text-accent">Settle.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            Group expenses without the soft SaaS fog. Cream canvas, ink borders,
            burnt amber accents — a ledger you can feel.
          </p>
        </motion.section>

        <LandingBento />
      </main>

      <footer className="border-t-2 border-ink bg-canvas px-4 sm:px-8 py-4 font-mono text-[10px] uppercase tracking-wider text-muted flex justify-between gap-4">
        <span>Settl © {new Date().getFullYear()}</span>
        <span>Phase 3 // settle up</span>
      </footer>
    </div>
  );
}
