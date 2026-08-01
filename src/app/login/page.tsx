"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/lib/auth/auth-context";
import { snapSpring } from "@/lib/motion";

function safeNextPath(raw: string | null): string {
  if (!raw) return "/groups";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/groups";
  return raw;
}

function LoginInner() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, router, next]);

  return (
    <AnimatePresence mode="wait">
      {ready && !user ? (
        <motion.div
          key="login"
          initial={{ opacity: 0, scale: 0.94, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={snapSpring}
          className="w-full max-w-md"
        >
          <LoginForm />
        </motion.div>
      ) : (
        <motion.div
          key="boot"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-2 border-ink bg-canvas px-6 py-4 shadow-hard font-mono text-sm uppercase tracking-widest"
        >
          Loading…
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-cream bg-grid flex flex-col">
      <header className="border-b-2 border-ink bg-canvas px-4 sm:px-8 py-4">
        <a href="/" className="text-2xl font-black uppercase tracking-tighter">
          Settl
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Suspense
          fallback={
            <div className="border-2 border-ink bg-canvas px-6 py-4 shadow-hard font-mono text-sm uppercase tracking-widest">
              Loading…
            </div>
          }
        >
          <LoginInner />
        </Suspense>
      </main>
    </div>
  );
}
