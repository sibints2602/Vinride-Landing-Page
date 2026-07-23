"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
// Lenis' stylesheet flips the root's `scroll-behavior: smooth` to `auto` so the two don't fight.
import "lenis/dist/lenis.css";

/** Lenis smooth scroll — steadies the scroll-linked Ride cards; off under reduced motion. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [smooth, setSmooth] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSmooth(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!smooth) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
