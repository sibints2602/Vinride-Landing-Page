"use client";

import type { ComponentType } from "react";
import { DRIVE } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, REVEAL_STAGGER_MS } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { BadgeCheck } from "@/components/animate-ui/icons/badge-check";
import { MapPin } from "@/components/animate-ui/icons/map-pin";
import { PhoneCall } from "@/components/animate-ui/icons/phone-call";
import { Route } from "@/components/animate-ui/icons/route";
import { EvCharger } from "@/components/animate-ui/icons/ev-charger";

/** Drive tab of DriveSafety, always dark-pinned; "use client" is load-bearing for AnimateIcon's Slot. */

/** Shared shell for every bento cell — sharp corners, hairline border. */
const CELL = "h-full overflow-hidden rounded-sm border border-line";

/** Resolves DRIVE.tiles icon keys — see the note on DRIVE.tiles. */
const TILE_ICONS: Record<string, ComponentType<{ size?: number }>> = {
  "badge-check": BadgeCheck,
  "phone-call": PhoneCall,
};

export function DrivePanel() {
  return (
    <div>
      <SectionHeading
        animate
        size="sm"
        eyebrow={DRIVE.eyebrow}
        heading={DRIVE.heading}
        subheading={DRIVE.subheading}
      />

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {/* Hero cell (2×2 on desktop): loop + loopDelay keep the pin pulsing; hover replays it */}
          <Reveal className="lg:col-span-2 lg:row-span-2">
            <AnimateIcon asChild animateOnView animateOnHover loop loopDelay={2000}>
              <div
                className={cn(
                  CELL,
                  "flex flex-col gap-6 bg-linear-to-br from-surface to-surface-2 p-6 sm:flex-row sm:items-center",
                )}
              >
                <div className="flex flex-col gap-8 sm:flex-1">
                  <div>
                    <h3 className="max-w-md font-display text-2xl text-fg sm:text-3xl">
                      {DRIVE.hero.title}
                    </h3>
                    <p className="mt-3 max-w-md text-fg-muted">
                      {DRIVE.hero.body}
                    </p>
                  </div>
                  {/* Toggle-style chips — the "when" is a choice, not a shift. */}
                  <ul className="flex flex-wrap gap-3">
                    {DRIVE.hero.slots.map((slot) => (
                      <li
                        key={slot}
                        className="flex items-center gap-2 rounded-sm border border-line bg-surface-2 px-3 py-1.5 text-sm text-fg"
                      >
                        <span className="h-2 w-2 rounded-full bg-brand-yellow" />
                        {slot}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative flex flex-none items-center justify-center self-center text-brand-yellow sm:px-6">
                  {/* Soft glow so the gold pin sits in light, not on flat black. */}
                  <div
                    aria-hidden
                    className="absolute inset-0 m-auto h-28 w-28 rounded-full bg-brand-yellow/10 blur-3xl"
                  />
                  <MapPin size={120} className="relative sm:h-36 sm:w-36" />
                </div>
              </div>
            </AnimateIcon>
          </Reveal>

          {/* Icon tiles — fill the third column beside the hero. */}
          {DRIVE.tiles.map((tile, index) => {
            const TileIcon = TILE_ICONS[tile.icon];
            return (
              <Reveal key={tile.title} delay={(index + 1) * REVEAL_STAGGER_MS}>
                <AnimateIcon asChild animateOnView animateOnHover>
                  <div
                    className={cn(CELL, "flex flex-col gap-4 bg-surface p-5")}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-brand-yellow/10 text-brand-yellow">
                      {TileIcon ? <TileIcon size={24} /> : null}
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-fg">
                        {tile.title}
                      </h3>
                      <p className="mt-2 text-fg-muted">{tile.body}</p>
                    </div>
                  </div>
                </AnimateIcon>
              </Reveal>
            );
          })}

          {/* How to join — compact numbered steps. */}
          <Reveal delay={3 * REVEAL_STAGGER_MS}>
            <AnimateIcon asChild animateOnView animateOnHover>
              <div className={cn(CELL, "flex flex-col gap-4 bg-surface p-5")}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-brand-yellow/10 text-brand-yellow">
                    <Route size={24} />
                  </div>
                  <h3 className="font-display text-lg text-fg">
                    {DRIVE.steps.title}
                  </h3>
                </div>
                <ol className="flex flex-col gap-3">
                  {DRIVE.steps.items.map((step, index) => (
                    <li key={step} className="flex items-center gap-3 text-fg">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-sm bg-brand-yellow/10 text-sm text-brand-yellow">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </AnimateIcon>
          </Reveal>

          {/* Wide perks + CTA cell closes the grid. */}
          <Reveal delay={4 * REVEAL_STAGGER_MS} className="lg:col-span-2">
            <AnimateIcon asChild animateOnView animateOnHover>
              <div
                className={cn(
                  CELL,
                  "flex flex-col items-start justify-between gap-6 bg-surface p-5 sm:flex-row sm:items-center",
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-sm bg-brand-yellow/10 text-brand-yellow">
                    <EvCharger size={24} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-fg">
                      {DRIVE.perks.title}
                    </h3>
                    <p className="mt-2 text-fg-muted">{DRIVE.perks.body}</p>
                  </div>
                </div>
                <Button href={DRIVE.cta.href} size="lg" className="flex-none rounded-sm">
                  {DRIVE.cta.label}
                </Button>
              </div>
            </AnimateIcon>
          </Reveal>
      </div>
    </div>
  );
}
