"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, type ReactNode } from "react";
import { snapSpring } from "@/lib/motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  children: ReactNode;
  loading?: boolean;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-accent text-cream border-2 border-ink shadow-hard hover:bg-accent-hover",
  secondary:
    "bg-cream text-ink border-2 border-ink shadow-hard hover:bg-canvas",
  ghost: "bg-transparent text-ink border-2 border-transparent hover:border-ink",
  danger: "bg-ink text-cream border-2 border-ink shadow-hard hover:bg-accent",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      children,
      loading,
      disabled,
      className = "",
      ...props
    },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        whileHover={disabled || loading ? undefined : { x: -1, y: -1 }}
        whileTap={disabled || loading ? undefined : { scale: 0.98, x: 1, y: 1 }}
        transition={snapSpring}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${styles[variant]} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="font-mono text-xs tracking-widest">WAIT…</span>
        ) : (
          children
        )}
      </motion.button>
    );
  },
);
