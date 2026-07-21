import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "surface" | "yellow" | "green";

// Tinted washes stay on text-fg — never tint the copy itself, only the fill.
const TONES: Record<Tone, string> = {
  surface: "bg-surface text-fg",
  yellow: "bg-brand-yellow/10 text-fg",
  green: "bg-brand-green/10 text-fg",
};

export interface CardProps {
  className?: string;
  tone?: Tone;
  children?: ReactNode;
}

export function Card({ className, tone = "surface", children }: CardProps) {
  return (
    <div
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
