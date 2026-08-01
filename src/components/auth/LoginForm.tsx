"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Panel } from "@/components/ui/Panel";
import { useAuth } from "@/lib/auth/auth-context";
import { ApiError } from "@/lib/api/client";
import { panelEnter, snapSpring } from "@/lib/motion";

function safeNextPath(raw: string | null): string {
  if (!raw) return "/groups";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/groups";
  return raw;
}

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel eyebrow="Access // 01" title="Sign in" className="w-full max-w-md">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="err"
              variants={panelEnter}
              initial="hidden"
              animate="show"
              exit="exit"
              className="border-2 border-ink bg-accent text-cream px-3 py-2 font-mono text-xs"
            >
              {error}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Button type="submit" loading={loading} className="w-full">
          Enter Settl
        </Button>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...snapSpring, delay: 0.15 }}
        className="mt-5 font-mono text-xs text-muted"
      >
        No account?{" "}
        <Link
          href={
            next !== "/groups"
              ? `/register?next=${encodeURIComponent(next)}`
              : "/register"
          }
          className="text-ink font-bold underline underline-offset-2 decoration-2 hover:text-accent"
        >
          Register
        </Link>
      </motion.p>
    </Panel>
  );
}
