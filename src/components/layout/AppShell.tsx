"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { snapSpring } from "@/lib/motion";

const NAV = [
  { href: "/groups", label: "Groups", code: "01" },
  { href: "/profile", label: "Profile", code: "02" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r-2 border-ink bg-canvas">
        <div className="border-b-2 border-ink px-4 py-5">
          <Link href="/groups" className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              settl // v0.1
            </span>
            <h1 className="mt-1 text-3xl font-black uppercase tracking-tighter leading-none">
              Settl
            </h1>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-2">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="block">
                <motion.div
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={snapSpring}
                  className={`border-2 border-ink px-3 py-2.5 flex items-center gap-3 ${
                    active
                      ? "bg-accent text-cream shadow-hard-sm"
                      : "bg-cream hover:bg-white"
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-70">
                    {item.code}
                  </span>
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t-2 border-ink p-3 space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted truncate px-1">
            {profile
              ? `${profile.firstName} ${profile.lastName}`
              : "signed in"}
          </p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            transition={snapSpring}
            onClick={handleLogout}
            className="w-full border-2 border-ink bg-cream px-3 py-2 text-xs font-bold uppercase tracking-wide hover:bg-ink hover:text-cream"
          >
            Log out
          </motion.button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 border-b-2 border-ink bg-canvas">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/groups">
              <span className="text-xl font-black uppercase tracking-tighter">
                Settl
              </span>
            </Link>
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              transition={snapSpring}
              onClick={handleLogout}
              className="border-2 border-ink bg-cream px-2 py-1 font-mono text-[10px] uppercase"
            >
              Out
            </motion.button>
          </div>
          <div className="flex border-t-2 border-ink">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex-1 text-center py-2.5 text-xs font-bold uppercase tracking-wide border-r-2 border-ink last:border-r-0 ${
                    active ? "bg-accent text-cream" : "bg-cream"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
