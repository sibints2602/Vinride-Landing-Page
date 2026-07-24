"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RIDE_OPTIONS } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, REVEAL_STAGGER_MS } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import carImage from "@/public/ride/Car.png";
import bikeImage from "@/public/ride/bike.png";
import shareImage from "@/public/ride/Car driving-bro.png";

const OPTIONS = RIDE_OPTIONS.options;

// One illustration per option, in RIDE_OPTIONS order; reorder here to remap.
const IMAGES = [carImage, bikeImage, shareImage];

const TILE_TINTS = [
  "bg-brand-yellow/15 text-fg",
  "bg-brand-green/15 text-fg",
  "bg-surface-2 text-fg",
] as const;

// Shared-release transform stacking (native sticky can't); STACK_TOP centers the deck on the preview.
const STACK_TOP_REM = 12;
// The preview pins here (matches its `top-24` = 6rem) but releases on the SAME frame as the deck,
// so image and cards let go together instead of the image clinging via native sticky.
const PREVIEW_TOP_REM = 6;
const CARD_STEP_REM = 1.5;
// Buried cards shrink `RECEDE` per covering card, easing in over `RECEDE_RAMP_PX` of scroll.
const RECEDE = 0.05;
const RECEDE_RAMP_PX = 160;
// Flow gap = dwell as each card leads. The last card gets the same-size tail so the
// finished stack settles and holds a beat before the whole deck releases.
const CARD_GAP_VH = 46;
const CARD_GAP = `${CARD_GAP_VH}vh`;

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
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  // Shared-release pinning; geometry measured once (not per frame) to avoid device-pixel wobble.
  useEffect(() => {
    const wrap = wrapRef.current;
    const cards = cardRefs.current;
    if (!wrap || cards.some((c) => !c)) return;

    const rootFontPx =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const n = cards.length;
    let pinStart: number[] = [];
    let previewPinStart = 0;
    let release = 0;
    let enabled = false;
    let ticking = false;

    const measure = () => {
      // The plain list handles < lg; this column is display:none there.
      enabled = window.innerWidth >= 1024;
      if (!enabled) return;
      const wrapTopAbs = wrap.getBoundingClientRect().top + window.scrollY;
      const stackTop = STACK_TOP_REM * rootFontPx;
      const step = CARD_STEP_REM * rootFontPx;
      pinStart = cards.map(
        (c, i) => wrapTopAbs + c!.offsetTop - (stackTop + i * step),
      );
      // Hold the fully-stacked deck for one more card-gap after the last card lands,
      // so it settles in place (and the cards behind it finish receding) before the
      // section scrolls on. The tail margin below gives this hold its scroll runway.
      release = pinStart[n - 1] + (CARD_GAP_VH / 100) * window.innerHeight;

      // Preview pin point, measured at its natural (untransformed) position so the
      // read isn't polluted by last frame's transform. Shares `release` with the deck.
      const preview = previewRef.current;
      if (preview) {
        const prevTransform = preview.style.transform;
        preview.style.transform = "";
        const previewTopAbs = preview.getBoundingClientRect().top + window.scrollY;
        preview.style.transform = prevTransform;
        previewPinStart = previewTopAbs - PREVIEW_TOP_REM * rootFontPx;
      }
    };

    const update = () => {
      ticking = false;
      if (!enabled) return;
      const scrollY = window.scrollY;
      let next = 0;
      cards.forEach((card, i) => {
        const el = card!;
        const pinned = scrollY >= pinStart[i];
        if (pinned) next = i;
        const ty = pinned ? Math.min(scrollY, release) - pinStart[i] : 0;
        // Recede once each later card has locked on top of this one.
        let depth = 0;
        for (let j = i + 1; j < n; j++) {
          depth += Math.min(1, Math.max(0, (scrollY - pinStart[j]) / RECEDE_RAMP_PX));
        }
        el.style.transform = `translate3d(0, ${ty}px, 0) scale(${1 - depth * RECEDE})`;
      });
      // Pin the preview to top-24 the same way, releasing on the exact frame the deck does.
      const preview = previewRef.current;
      if (preview) {
        const pty =
          scrollY <= previewPinStart
            ? 0
            : Math.min(scrollY, release) - previewPinStart;
        preview.style.transform = `translate3d(0, ${pty}px, 0)`;
      }
      setActive((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const remeasure = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      id="ride"
      // Bottom padding matches the stats-strip scale so the ride→why seam mirrors stats→ride.
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
    >
      <SectionHeading
        animate
        eyebrow={RIDE_OPTIONS.eyebrow}
        heading={RIDE_OPTIONS.heading}
        subheading={RIDE_OPTIONS.subheading}
      />

      {/* Mobile / tablet: plain cards (the scrollytelling needs desktop width). */}
      <PlainList className="lg:hidden" />

      {/* Desktop: cards translate-stack left; the sticky preview right swaps to the active card. */}
      <div className="mt-10 hidden lg:grid lg:grid-cols-2 lg:gap-12">
        <div ref={wrapRef} className="relative">
          {OPTIONS.map((option, i) => {
            const isActive = i === active;
            return (
              <article
                key={option.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={{
                  // Transform set per scroll frame; no `will-change` — it kills the glass blur.
                  // Every card carries the gap now, incl. the last — its tail is the settle-and-hold runway.
                  marginBottom: CARD_GAP,
                  zIndex: i,
                  transformOrigin: "top center",
                }}
                className={cn(
                  "rounded-sm border p-8 shadow-lift-lg backdrop-blur-xl transition-[border-color] duration-300 ease-out",
                  // Frosted glass; near-solid fallback where backdrop-filter is unsupported.
                  "bg-surface/85 supports-[backdrop-filter]:bg-surface/60",
                  "ring-1 ring-inset ring-white/15 dark:ring-white/5",
                  isActive ? "border-brand-yellow/50" : "border-line/70",
                )}
              >
                {/* Inner content reveals piece by piece — same cadence as SectionHeading. */}
                <Reveal>
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
                </Reveal>
                <Reveal variant="mask" delay={100}>
                  <h3 className="mt-6 font-display text-2xl text-fg">
                    {option.headline}
                  </h3>
                </Reveal>
                <Reveal delay={220}>
                  <p className="mt-2 text-fg-muted">{option.body}</p>
                </Reveal>
                <Reveal delay={340}>
                  <p className="mt-4 text-sm font-medium text-fg-muted">
                    {option.meta}
                  </p>
                </Reveal>
              </article>
            );
          })}
        </div>

        <div>
          {/* Illustration only, keyed to the active option so the new image fades in cleanly.
              Pinned via transform (not `sticky`) so it releases in lockstep with the card deck. */}
          <div
            ref={previewRef}
            className="flex h-[34rem] items-center justify-center"
          >
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
