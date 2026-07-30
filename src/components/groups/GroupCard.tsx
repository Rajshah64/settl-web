"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Group } from "@/lib/api/types";
import { snapSpring, staggerItem } from "@/lib/motion";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function GroupCard({ group, index }: { group: Group; index: number }) {
  return (
    <motion.div variants={staggerItem} layout>
      <Link href={`/groups/${group.id}`} className="block h-full">
        <motion.article
          whileHover={{ x: -3, y: -3 }}
          whileTap={{ scale: 0.985, x: 0, y: 0 }}
          transition={snapSpring}
          className="h-full border-2 border-ink bg-cream shadow-hard hover:bg-white flex flex-col"
        >
          <div className="border-b-2 border-ink bg-canvas px-4 py-2 flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              GRP/{String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider bg-cream border border-ink px-1.5 py-0.5">
              {group.inviteCode}
            </span>
          </div>

          <div className="p-4 flex-1 flex flex-col gap-3">
            <h3 className="text-xl font-black uppercase tracking-tight leading-tight line-clamp-2">
              {group.name}
            </h3>
            {group.description ? (
              <p className="text-sm text-muted line-clamp-2 leading-snug">
                {group.description}
              </p>
            ) : (
              <p className="font-mono text-xs text-muted uppercase tracking-wider">
                No description
              </p>
            )}

            <div className="mt-auto pt-3 border-t-2 border-ink/10 flex items-end justify-between gap-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  Updated
                </p>
                <p className="font-mono text-xs">{formatDate(group.updatedAt)}</p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold">
                Open →
              </span>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
