"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RIDE_OPTIONS } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, REVEAL_STAGGER_MS } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import carImage from "@/public/ride/Car driving-bro.png";
import bikeImage from "@/public/ride/Order ride-bro.png";
import shareImage from "@/public/ride/Order ride-pana.png";

const OPTIONS = RIDE_OPTIONS.options;

// One illustration per option, in the same order as RIDE_OPTIONS. Reorder here
// to remap. (There is no bike-specific illustration, so Bike ride borrows the
// "order a ride" scene.)
const IMAGES = [carImage, bikeImage, shareImage];

const TILE_TINTS = [
  "bg-brand-yellow/15 text-fg",
  "bg-brand-green/15 text-fg",
  "bg-surface-2 text-fg",
] as const;

// Cards stick just below the fixed nav; each one 1.5rem lower than the last so
// the pile shows a peeking edge. The active card is the lowest one that has
// reached its sticky position, i.e. the last whose top has crossed this line.
const STICKY_TOP_REM = 7;
const CARD_STEP_REM = 1.5;
const ACTIVE_LINE_PX = (STICKY_TOP_REM + (OPTIONS.length - 1) * CARD_STEP_REM) * 16 + 24;

/** The plain-list rendering, shared by mobile and the reduced-motion path. */
function PlainList({ className }: { className?: string }) {
  return (
    <div className={cn("mt-10 grid gap-6 sm:grid-cols-2", className)}>
      {OPTIONS.map((option, index) => (
        <Reveal key={option.id} delay={index * REVEAL_STAGGER_MS}>
          <Card className="flex h-full flex-col gap-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                TILE_TINTS[index],
              )}
            >
              <Icon name={option.icon} className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-link">{option.title}</p>
              <h3 className="mt-1 font-display text-lg text-fg">
                {option.headline}
              </h3>
              <p className="mt-2 text-sm text-fg-muted">{option.body}</p>
            </div>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

export function RideOptions() {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Scrollspy: on each frame the scroll changes, find the last card whose top
  // has crossed the active line and mark it current. rAF-throttled and it only
  // ever sets a small integer, so there are no per-frame transforms to
  // jitter — the stacking itself is pure CSS `position: sticky`.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      let next = 0;
      cardRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= ACTIVE_LINE_PX) next = i;
      });
      setActive((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="ride"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <SectionHeading
        eyebrow={RIDE_OPTIONS.eyebrow}
        heading={RIDE_OPTIONS.heading}
        subheading={RIDE_OPTIONS.subheading}
      />

      {/* Mobile / tablet: plain cards (the sticky two-column scrollytelling
          needs desktop width). */}
      <PlainList className="lg:hidden" />

      {/* Desktop: content cards stack up on the left (CSS sticky), a sticky
          preview on the right swaps to whichever card is active. */}
      <div className="mt-10 hidden lg:grid lg:grid-cols-2 lg:gap-12">
        <div>
          {OPTIONS.map((option, i) => {
            const isActive = i === active;
            return (
              <article
                key={option.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={{
                  top: `${STICKY_TOP_REM + i * CARD_STEP_REM}rem`,
                  marginBottom: i < OPTIONS.length - 1 ? "46vh" : undefined,
                  // Cards already behind the active one recede a touch. Driven
                  // by `active` (state), not the raw scroll, so it changes once
                  // per step — never every frame.
                  transform: i < active ? `scale(${1 - (active - i) * 0.04})` : undefined,
                  transformOrigin: "top center",
                }}
                className={cn(
                  "sticky rounded-[2rem] border bg-surface p-8 shadow-lift-lg transition-[transform,border-color] duration-300 ease-out",
                  isActive ? "border-brand-yellow/40" : "border-line",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      TILE_TINTS[i],
                    )}
                  >
                    <Icon name={option.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-link">
                    {option.title}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl text-fg">
                  {option.headline}
                </h3>
                <p className="mt-2 text-fg-muted">{option.body}</p>
                <p className="mt-4 text-sm font-medium text-fg-muted">
                  {option.meta}
                </p>
              </article>
            );
          })}
          {/* Tail room so the last card, once stuck, stays the active one for a
              scroll beat instead of the section ending the moment it pins. */}
          <div aria-hidden="true" className="h-[44vh]" />
        </div>

        <div>
          {/* Just the illustration — no card, no text — swapping to the active
              option. Keyed so the new image fades in cleanly (motion-safe)
              rather than cross-fading over the old one. */}
          <div className="sticky top-24 flex h-[34rem] items-center justify-center">
            <Image
              key={active}
              src={IMAGES[active]}
              alt=""
              sizes="(min-width: 1024px) 30rem, 90vw"
              className="h-auto w-full max-w-lg motion-safe:animate-preview-in"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
