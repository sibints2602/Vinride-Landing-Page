"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ChipProps {
  selected: boolean;
  onClick: () => void;
  children?: ReactNode;
  className?: string;
}

export function Chip({ selected, onClick, children, className }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors duration-200",
        selected
          ? "border-transparent bg-brand-yellow text-ink"
          : "border-line bg-surface-2 text-fg-muted",
        className,
      )}
    >
      {children}
    </button>
  );
}
