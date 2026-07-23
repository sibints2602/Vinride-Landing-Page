"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Counter } from "@/components/ui/Counter";
import { REVEAL_STAGGER_MS } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { Stat } from "@/content/site";

// Same isomorphic-layout-effect guard as the other scroll-reveal components (no pre-paint flash).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** One stats-band figure (count-up + rule + caption); `srText` is what assistive tech announces. */
export function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!node || typeof IntersectionObserver === "undefined" || reduced) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const delay = index * REVEAL_STAGGER_MS;

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center text-center transition-[opacity,transform] duration-700 ease-out",
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p
        aria-hidden="true"
        className="font-display text-4xl font-semibold tabular-nums tracking-[-0.02em] text-fg md:text-5xl"
      >
        <Counter value={stat.value} />
        <span className="ml-0.5 text-fg-muted">{stat.suffix}</span>
      </p>
      <span
        aria-hidden="true"
        className={cn(
          "mt-4 h-[2px] w-10 origin-center rounded-full bg-gradient-to-r from-brand-yellow to-brand-green transition-transform duration-700 ease-out",
          shown ? "scale-x-100" : "scale-x-0",
        )}
        style={{ transitionDelay: `${delay + 160}ms` }}
      />
      <p
        aria-hidden="true"
        className="mt-4 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-fg-muted"
      >
        {stat.label}
      </p>
      <span className="sr-only">{stat.srText}</span>
    </div>
  );
}
