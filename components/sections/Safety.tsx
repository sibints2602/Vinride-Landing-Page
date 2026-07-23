"use client";

import type { ComponentType } from "react";
import { SAFETY } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, REVEAL_STAGGER_MS } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { BellRing } from "@/components/animate-ui/icons/bell-ring";
import { Send } from "@/components/animate-ui/icons/send";
import { Fingerprint } from "@/components/animate-ui/icons/fingerprint";
import { CircleCheck } from "@/components/animate-ui/icons/circle-check";

/** Safety tab of DriveSafety, light sibling of DrivePanel; "use client" is load-bearing for AnimateIcon's Slot. */

/** Shared shell for every bento cell — sharp corners, hairline border. */
const CELL = "h-full overflow-hidden rounded-sm border border-line bg-surface";

/** Resolves SAFETY.tiles icon keys — see the note on the SAFETY block. */
const TILE_ICONS: Record<string, ComponentType<{ size?: number }>> = {
  send: Send,
  fingerprint: Fingerprint,
};

export function SafetyPanel() {
  return (
    <div>
      <SectionHeading
        animate
        size="sm"
        eyebrow={SAFETY.eyebrow}
        heading={SAFETY.heading}
        subheading={SAFETY.subheading}
      />

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {/* Hero cell — One-tap SOS, mirrored right; the bell loops in view, hover replays it */}
          <Reveal className="lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <AnimateIcon asChild animateOnView animateOnHover loop loopDelay={2000}>
              <div
                className={cn(
                  CELL,
                  "flex flex-col gap-6 bg-linear-to-bl from-surface to-surface-2 p-6 sm:flex-row sm:items-center",
                )}
              >
                <div className="flex flex-col gap-8 sm:flex-1">
                  <div>
                    <h3 className="max-w-md font-display text-2xl text-fg sm:text-3xl">
                      {SAFETY.hero.title}
                    </h3>
                    <p className="mt-3 max-w-md text-fg-muted">
                      {SAFETY.hero.body}
                    </p>
                  </div>
                  {/* One tap reaches all of these. */}
                  <ul className="flex flex-wrap gap-3">
                    {SAFETY.hero.reaches.map((who) => (
                      <li
                        key={who}
                        className="flex items-center gap-2 rounded-sm border border-line bg-surface px-3 py-1.5 text-sm text-fg"
                      >
                        <span className="h-2 w-2 rounded-full bg-brand-green" />
                        {who}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-none flex-col items-center gap-6 self-center sm:px-6">
                  <div className="relative flex items-center justify-center text-link">
                    {/* Soft glow so the bell sits in light, like the drive pin. */}
                    <div
                      aria-hidden
                      className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-brand-green/15 blur-3xl"
                    />
                    <BellRing size={96} className="relative sm:h-28 sm:w-28" />
                  </div>
                  {/* Decorative mock of the in-app emergency button. */}
                  <span
                    aria-hidden
                    className="rounded-sm border border-danger/30 bg-danger/10 px-6 py-2 font-display text-lg tracking-widest text-danger"
                  >
                    {SAFETY.hero.pill}
                  </span>
                </div>
              </div>
            </AnimateIcon>
          </Reveal>

          {/* Icon tiles — stack in the first column beside the hero. */}
          {SAFETY.tiles.map((tile, index) => {
            const TileIcon = TILE_ICONS[tile.icon];
            return (
              <Reveal key={tile.title} delay={(index + 1) * REVEAL_STAGGER_MS}>
                <AnimateIcon asChild animateOnView animateOnHover>
                  <div className={cn(CELL, "flex flex-col gap-4 p-5")}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-brand-green/10 text-link">
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

          {/* Wide insurance cell closes the grid. */}
          <Reveal delay={3 * REVEAL_STAGGER_MS} className="lg:col-span-3">
            <AnimateIcon asChild animateOnView animateOnHover>
              <div
                className={cn(
                  CELL,
                  "flex flex-col items-start justify-between gap-6 p-5 sm:flex-row sm:items-center",
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-sm bg-brand-green/10 text-link">
                    <CircleCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-fg">
                      {SAFETY.wide.title}
                    </h3>
                    <p className="mt-2 text-fg-muted">{SAFETY.wide.body}</p>
                  </div>
                </div>
                <ul className="flex flex-wrap gap-3">
                  {SAFETY.wide.badges.map((badge) => (
                    <li
                      key={badge}
                      className="flex items-center gap-2 rounded-sm border border-line bg-surface-2 px-3 py-1.5 text-sm text-fg"
                    >
                      <span className="h-2 w-2 rounded-full bg-brand-green" />
                      {badge}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIcon>
          </Reveal>
      </div>
    </div>
  );
}
