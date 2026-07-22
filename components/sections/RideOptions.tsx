"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { RIDE_OPTIONS } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, REVEAL_STAGGER_MS } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const OPTIONS = RIDE_OPTIONS.options;

// Icon-tile tint and preview wash per card, in authored order.
const TILE_TINTS = [
  "bg-brand-yellow/15 text-fg",
  "bg-brand-green/15 text-fg",
  "bg-surface-2 text-fg",
] as const;
const PREVIEW_WASH = [
  "from-brand-yellow/30 via-brand-amber/10",
  "from-brand-green/30 via-brand-green-strong/10",
  "from-brand-green/20 via-brand-yellow/10",
] as const;

/**
 * Fanned-deck transform for card `i` in a stack of `total`, given which card
 * is active. Cascades each card down-and-right with a shared 3D tilt (the
 * parent supplies the perspective); the active card is pulled forward on the
 * Z axis and lifted, so it reads as "popped out" of the stack.
 */
function cardTransform(i: number, active: number, total: number): CSSProperties {
  const isActive = i === active;
  const x = i * 40;
  const y = i * 74 - (isActive ? 16 : 0);
  const z = isActive ? 60 : i * -60;
  return {
    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(6deg) rotateY(-18deg)`,
    zIndex: isActive ? total + 1 : i,
    opacity: isActive ? 1 : 0.55,
  };
}

export function RideOptions() {
  const [active, setActive] = useState(OPTIONS.length - 1);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = "ride-option";

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, i: number) {
    let next: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (i + 1) % OPTIONS.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (i - 1 + OPTIONS.length) % OPTIONS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = OPTIONS.length - 1;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

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

      {/* ---- Mobile / tablet: plain cards, no stack, no preview. The 3D deck
             and side-by-side preview only make sense with the room a desktop
             gives. ---- */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:hidden">
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

      {/* ---- Desktop: stacked deck (tablist) on the left, preview on the
             right. ---- */}
      <div className="mt-14 hidden lg:grid lg:grid-cols-2 lg:items-center lg:gap-6">
        <div
          role="tablist"
          aria-label={RIDE_OPTIONS.heading}
          aria-orientation="vertical"
          className="relative h-[26rem] [perspective:1600px]"
        >
          {OPTIONS.map((option, i) => {
            const isActive = i === active;
            return (
              <button
                key={option.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${i}`}
                tabIndex={isActive ? 0 : -1}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onKeyDown={(event) => onTabKeyDown(event, i)}
                style={cardTransform(i, active, OPTIONS.length)}
                className={cn(
                  "absolute left-0 top-0 w-[82%] origin-top-left rounded-2xl border bg-surface p-5 text-left shadow-lift-lg transition-[transform,opacity,box-shadow] duration-300 ease-out focus:outline-none",
                  isActive ? "border-brand-yellow/40" : "border-line",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      TILE_TINTS[i],
                    )}
                  >
                    <Icon name={option.icon} className="h-5 w-5" />
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isActive ? "text-link" : "text-fg-muted",
                    )}
                  >
                    {option.title}
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-4 font-display text-lg",
                    isActive ? "text-fg" : "text-fg-muted",
                  )}
                >
                  {option.headline}
                </p>
                <p className="mt-3 text-sm text-fg-muted">{option.meta}</p>
              </button>
            );
          })}
        </div>

        <div className="relative h-[26rem]">
          {OPTIONS.map((option, i) => {
            const isActive = i === active;
            return (
              <div
                key={option.id}
                role="tabpanel"
                id={`${baseId}-panel-${i}`}
                aria-labelledby={`${baseId}-tab-${i}`}
                aria-hidden={!isActive}
                className={cn(
                  "absolute inset-0 flex flex-col justify-end overflow-hidden rounded-3xl border border-line bg-gradient-to-br to-transparent p-8 transition-opacity duration-500",
                  PREVIEW_WASH[i],
                  isActive
                    ? "opacity-100"
                    : "pointer-events-none opacity-0",
                )}
              >
                {/* Placeholder visual: a large glyph watermark standing in for
                    per-feature photography, which the project doesn't have. */}
                <Icon
                  name={option.icon}
                  className="absolute -right-6 -top-6 h-52 w-52 text-fg/10"
                />
                <p className="text-sm font-semibold text-link">{option.title}</p>
                <h3 className="mt-2 max-w-sm font-display text-3xl text-fg">
                  {option.headline}
                </h3>
                <p className="mt-3 max-w-md text-fg-muted">{option.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
