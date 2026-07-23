"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// useLayoutEffect warns during SSR; fall back to useEffect there (same guard as Reveal/Counter).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface LetterMarkProps {
  text: string;
  className?: string;
  /** ms between one letter starting and the next. */
  step?: number;
  /** Final opacity of the LAST letter (first is 1); in-between letters interpolate linearly. */
  tailFade?: number;
}

/** Splits `text` into letters that fade-and-rise on scroll-in; callers own styling/aria-hidden. */
export function LetterMark({
  text,
  className,
  step = 150,
  tailFade = 0.2,
}: LetterMarkProps) {
  const ref = useRef<HTMLSpanElement>(null);
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
      { threshold: 0.2 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const letters = Array.from(text);
  const last = Math.max(1, letters.length - 1);

  return (
    <span ref={ref} className={className}>
      {letters.map((letter, i) => (
        <span
          key={`${letter}-${i}`}
          className="inline-block transition-[opacity,transform] duration-[900ms] ease-out"
          style={{
            opacity: shown ? 1 - (i / last) * (1 - tailFade) : 0,
            transform: shown ? "translateY(0)" : "translateY(0.12em)",
            transitionDelay: `${i * step}ms`,
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
