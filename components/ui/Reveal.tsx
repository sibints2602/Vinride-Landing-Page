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
  /** rise = fade-up (default), mask = clip slide, draw = scale-x, pop = scale-in, deal = card deal. */
  variant?: "rise" | "mask" | "draw" | "pop" | "deal";
}

/** Shared stagger step for sibling Reveals; 160ms so items land one-by-one against the 700ms ease. */
export const REVEAL_STAGGER_MS = 160;

// useLayoutEffect warns during SSR (static generation runs this in Node), so fall back to useEffect.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Reveal({
  children,
  delay = 0,
  className,
  variant = "rise",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // No observer or reduced motion: show immediately, pre-paint, so hidden content never flashes.
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

  if (variant === "deal") {
    return (
      <div
        ref={ref}
        className={cn(
          "transition-[transform,opacity] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          visible
            ? "translate-x-0 rotate-0 opacity-100"
            : "translate-x-28 rotate-6 opacity-0",
          className,
        )}
        style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      >
        {children}
      </div>
    );
  }

  if (variant === "draw") {
    return (
      <div
        ref={ref}
        className={cn(
          "origin-left transition-transform duration-[450ms] ease-out",
          visible ? "scale-x-100" : "scale-x-0",
          className,
        )}
        style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      >
        {children}
      </div>
    );
  }

  if (variant === "pop") {
    return (
      <div
        ref={ref}
        className={cn(
          "transition-[transform,opacity] duration-500 ease-out",
          visible ? "scale-100 opacity-100" : "scale-0 opacity-0",
          className,
        )}
        style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      >
        {children}
      </div>
    );
  }

  if (variant === "mask") {
    return (
      // The clip; pb/-mb give descenders room so they aren't sheared off once text settles.
      <div ref={ref} className={cn("-mb-2 overflow-hidden pb-2", className)}>
        <div
          className={cn(
            "transition-[transform,opacity] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
            visible ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0",
          )}
          style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
          {children}
        </div>
      </div>
    );
  }

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
