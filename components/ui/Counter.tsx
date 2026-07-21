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

// useLayoutEffect warns when it runs during server rendering (it has no
// effect there, since there's no browser paint to run "before"). Static
// generation renders this "use client" component in Node, so window is
// undefined at module-eval time and we fall back to useEffect there; in the
// browser, window is defined and we get the real, pre-paint layout effect.
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

    // A "0" reading is worse than a missing count-up animation: jump
    // straight to the final value when we can't observe, or when the user
    // doesn't want motion. This runs in a layout effect (synchronous,
    // pre-paint) rather than a passive effect, so these users never see a
    // painted "0" frame before it corrects.
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
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
