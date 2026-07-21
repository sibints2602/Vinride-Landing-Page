"use client";

import { useEffect, useRef, useState } from "react";

export interface CounterProps {
  value: number;
  suffix?: string;
}

const DURATION_MS = 1200;

/** Keeps one decimal place for fractional targets (4.8 must never show as 5). */
function formatValue(current: number, fractional: boolean): string {
  return fractional ? current.toFixed(1) : String(Math.round(current));
}

export function Counter({ value, suffix = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const fractional = !Number.isInteger(value);
  const [display, setDisplay] = useState(() => formatValue(0, fractional));

  useEffect(() => {
    const node = ref.current;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Deferred through a timeout callback (rather than called inline here) so
    // the effect body only ever sets up a subscription, never calls setState
    // synchronously itself.
    if (!node || typeof IntersectionObserver === "undefined" || prefersReducedMotion) {
      const timeoutId = window.setTimeout(() => {
        setDisplay(formatValue(value, fractional));
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);

          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / DURATION_MS, 1);
            setDisplay(formatValue(value * progress, fractional));
            if (progress < 1) {
              rafRef.current = requestAnimationFrame(tick);
            }
          };
          rafRef.current = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, fractional]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
