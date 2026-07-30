"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Panel } from "@/components/ui/Panel";
import { useAuth } from "@/lib/auth/auth-context";
import { ApiError } from "@/lib/api/client";
import { panelEnter, snapSpring } from "@/lib/motion";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });
      router.replace("/groups");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel eyebrow="Access // 00" title="Create account" className="w-full max-w-md">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="First name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            label="Last name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          hint="Min 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          Join Settl
        </Button>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...snapSpring, delay: 0.15 }}
        className="mt-5 font-mono text-xs text-muted"
      >
        Already in?{" "}
        <Link
          href="/login"
          className="text-ink font-bold underline underline-offset-2 decoration-2 hover:text-accent"
        >
          Sign in
        </Link>
      </motion.p>
    </Panel>
  );
}
