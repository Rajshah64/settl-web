"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className = "", ...props },
  ref,
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="flex flex-col gap-1.5 w-full" htmlFor={inputId}>
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
        {label}
      </span>
      <input
        ref={ref}
        id={inputId}
        className={`w-full border-2 border-ink bg-cream px-3 py-2.5 font-mono text-sm text-ink outline-none transition-[box-shadow,background-color] focus:bg-white focus:shadow-hard-sm placeholder:text-muted ${error ? "border-accent" : ""} ${className}`}
        {...props}
      />
      {error ? (
        <span className="font-mono text-xs text-accent">{error}</span>
      ) : hint ? (
        <span className="font-mono text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
});
