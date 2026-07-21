import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "surface" | "yellow" | "green" | "forest";

// Tinted washes stay on text-fg — never tint the copy itself, only the fill.
// `forest` is a solid brand-constant background (same dark shade in both
// themes), so it locally pins data-theme="dark". That makes every
// theme-aware token used inside (text-fg, border-line, etc.) resolve to its
// dark-theme value regardless of the page's active theme, giving reliably
// light text/borders on the dark forest fill without inventing a new color.
const TONES: Record<Tone, string> = {
  surface: "bg-surface text-fg",
  yellow: "bg-brand-yellow/10 text-fg",
  green: "bg-brand-green/10 text-fg",
  forest: "bg-brand-forest text-fg",
};

export interface CardProps {
  className?: string;
  tone?: Tone;
  children?: ReactNode;
}

export function Card({ className, tone = "surface", children }: CardProps) {
  const isForest = tone === "forest";

  return (
    <div
      data-theme={isForest ? "dark" : undefined}
      className={cn(
        "rounded-2xl border border-line p-6",
        TONES[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
