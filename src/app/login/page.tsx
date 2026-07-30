"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/lib/auth/auth-context";
import { snapSpring } from "@/lib/motion";

export default function LoginPage() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) router.replace("/groups");
  }, [ready, user, router]);

  return (
    <div className="min-h-screen bg-cream bg-grid flex flex-col">
      <header className="border-b-2 border-ink bg-canvas px-4 sm:px-8 py-4">
        <a href="/" className="text-2xl font-black uppercase tracking-tighter">
          Settl
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
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
      </main>
    </div>
  );
}
