"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import { joinGroup } from "@/lib/api/groups";
import { useAuth } from "@/lib/auth/auth-context";
import { joinPath } from "@/lib/join-link";
import { snapSpring } from "@/lib/motion";

export default function JoinByLinkPage() {
  const params = useParams<{ code: string }>();
  const code = String(params.code ?? "");
  const router = useRouter();
  const { user, ready } = useAuth();
  const [status, setStatus] = useState<"idle" | "joining" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const valid = /^\d{6}$/.test(code);

  useEffect(() => {
    if (!ready) return;
    if (!valid) {
      setStatus("error");
      setError("Invalid invite link");
      return;
    }
    if (!user) {
      const next = encodeURIComponent(joinPath(code));
      router.replace(`/login?next=${next}`);
      return;
    }

    let cancelled = false;
    setStatus("joining");
    void (async () => {
      try {
        const group = await joinGroup(code);
        if (!cancelled) router.replace(`/groups/${group.id}`);
      } catch (err) {
        if (cancelled) return;
        // Already a member → try to land on groups list; API returns conflict/etc.
        const message =
          err instanceof ApiError ? err.message : "Could not join group";
        // If already member, backend may 409 — still try redirect via list
        if (err instanceof ApiError && err.status === 409) {
          router.replace("/groups");
          return;
        }
        setStatus("error");
        setError(message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, user, code, valid, router]);

  return (
    <div className="min-h-screen bg-cream bg-grid flex flex-col">
      <header className="border-b-2 border-ink bg-canvas px-4 sm:px-8 py-4">
        <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
          Settl
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={snapSpring}
          className="border-2 border-ink bg-cream shadow-hard p-6 sm:p-8 max-w-md w-full text-center space-y-4"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Join // short link
          </p>
          {status === "joining" || status === "idle" ? (
            <>
              <h1 className="text-2xl font-black uppercase tracking-tight">
                Joining group…
              </h1>
              <p className="font-mono text-sm text-muted">Code {code}</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black uppercase tracking-tight text-accent">
                Couldn’t join
              </h1>
              <p className="font-mono text-sm">{error}</p>
              <div className="flex justify-center gap-2 pt-2">
                <Link href="/groups">
                  <Button variant="secondary">Groups</Button>
                </Link>
                <Link href="/groups">
                  <Button onClick={() => router.push("/groups")}>Home</Button>
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
