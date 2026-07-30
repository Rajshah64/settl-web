"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/auth-context";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center bg-grid">
        <div className="border-2 border-ink bg-canvas px-6 py-4 shadow-hard font-mono text-sm uppercase tracking-widest">
          Booting…
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
