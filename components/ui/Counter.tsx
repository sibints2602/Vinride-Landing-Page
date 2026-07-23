"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface CounterProps {
  value: number;
  suffix?: string;
}

const DURATION_MS = 1200;

/** Keeps one decimal place for fractional targets (4.8 must never show as 5). */
function formatValue(current: number, fractional: boolean): string {
  return fractional ? current.toFixed(1) : String(Math.round(current));
}

// useLayoutEffect warns during SSR (static generation runs this in Node), so fall back to useEffect.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Counter({ value, suffix = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const fractional = !Number.isInteger(value);
  const [display, setDisplay] = useState(() => formatValue(0, fractional));

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // No observer or reduced motion: jump to the final value pre-paint so no "0" frame flashes.
    if (!node || typeof IntersectionObserver === "undefined" || prefersReducedMotion) {
      setDisplay(formatValue(value, fractional));
      return;
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
    // Decorative for assistive tech; callers provide the real announcement as static text.
    <span ref={ref} aria-hidden="true">
      {display}
      {suffix}
    </span>
  );
}
