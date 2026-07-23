"use client";

import { useEffect, useState } from "react";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { MoveUp } from "@/components/animate-ui/icons/move-up";
import { cn } from "@/lib/utils";

/** Back-to-top anchor to #top (Lenis glides it); hidden and fully inert until ~1 viewport down. */
export function ScrollToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setShown(window.scrollY > window.innerHeight);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // asChild: the anchor is the hover surface, so the arrow nudges on hover anywhere on the button.
    <AnimateIcon asChild animateOnHover>
      <a
        href="#top"
        aria-label="Back to top"
        aria-hidden={!shown}
        tabIndex={shown ? undefined : -1}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-brand-yellow text-ink shadow-lift-lg",
          "transition-[opacity,transform] duration-200 ease-out active:scale-[0.97]",
          shown
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <MoveUp size={20} />
      </a>
    </AnimateIcon>
  );
}
