"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export interface RevealProps {
  children?: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Single source of truth for the stagger step between sibling Reveal
 * delays, e.g. `delay={index * REVEAL_STAGGER_MS}` for a mapped list. Keeps
 * every staggered section (StatsStrip, WhyVinride, HowItWorks, Safety,
 * DriveWithUs) on the same rhythm instead of each picking its own number.
 */
export const REVEAL_STAGGER_MS = 80;

// useLayoutEffect warns when it runs during server rendering (it has no
// effect there, since there's no browser paint to run "before"). Static
// generation renders this "use client" component in Node, so window is
// undefined at module-eval time and we fall back to useEffect there; in the
// browser, window is defined and we get the real, pre-paint layout effect.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // A blank page is worse than a missing animation: skip straight to
    // visible when we can't observe, or when the user doesn't want motion.
    // This runs in a layout effect (synchronous, pre-paint) rather than a
    // passive effect, so these users never see a painted frame of hidden
    // content before it corrects.
    if (!node || typeof IntersectionObserver === "undefined" || prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className,
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
