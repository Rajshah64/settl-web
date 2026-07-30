import type { Transition, Variants } from "motion/react";

/** Snappy mechanical spring — brutalist, not floaty */
export const snapSpring: Transition = {
  type: "spring",
  mass: 0.8,
  stiffness: 420,
  damping: 28,
};

export const panelSnap: Transition = {
  type: "spring",
  mass: 1,
  stiffness: 380,
  damping: 26,
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: snapSpring,
  },
};

export const panelEnter: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: panelSnap,
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.15 },
  },
};
