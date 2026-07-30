"use client";

import { motion } from "motion/react";
import { snapSpring } from "@/lib/motion";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  layoutId?: string;
}

export function Tabs({
  tabs,
  active,
  onChange,
  layoutId = "brutal-tab",
}: TabsProps) {
  return (
    <div className="flex border-2 border-ink bg-canvas">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative flex-1 px-3 py-3 text-xs sm:text-sm font-bold uppercase tracking-wide border-r-2 border-ink last:border-r-0 ${
              isActive ? "text-cream" : "text-ink hover:bg-cream"
            }`}
          >
            {isActive ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 bg-accent"
                transition={snapSpring}
              />
            ) : null}
            <span className="relative z-10 inline-flex items-center justify-center gap-2">
              {tab.label}
              {typeof tab.count === "number" ? (
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.5 border ${
                    isActive
                      ? "border-cream/40 text-cream"
                      : "border-ink bg-cream"
                  }`}
                >
                  {tab.count}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
