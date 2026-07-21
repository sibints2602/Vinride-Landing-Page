"use client";

import { useState, type ReactNode } from "react";
import {
  DISCLAIMER,
  RIDES_SECTION,
  VEHICLE_TYPES,
  type VehicleTypeId,
} from "@/content/site";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** "all" is a distinct literal from every VehicleTypeId, so it can never
 *  collide with a real vehicle id. */
type FilterId = "all" | VehicleTypeId;

/**
 * Inline SVG silhouettes, one per vehicle type — the project has no
 * photography, so every glyph is drawn from scratch. Purely decorative (the
 * card's own <h3> already names the vehicle), hence aria-hidden.
 */
const VEHICLE_GLYPH_PATHS: Record<VehicleTypeId, ReactNode> = {
  bike: (
    <>
      <circle cx="14" cy="30" r="7" />
      <circle cx="50" cy="30" r="7" />
      <path d="M14 30 L26 14 H38 M26 14 L34 30 M34 30 H50 M20 30 H34" />
      <circle cx="34" cy="14" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  auto: (
    <>
      <circle cx="16" cy="32" r="6" />
      <circle cx="48" cy="32" r="6" />
      <path d="M10 32 V20 Q10 12 20 12 H42 Q52 12 52 22 V32" />
      <path d="M20 12 V6 H44 V12" />
      <line x1="10" y1="26" x2="52" y2="26" />
    </>
  ),
  sedan: (
    <>
      <path d="M4 30 H60 M8 30 L14 18 Q18 12 26 12 H38 Q46 12 50 18 L56 30" />
      <circle cx="16" cy="32" r="6" />
      <circle cx="48" cy="32" r="6" />
      <line x1="24" y1="18" x2="24" y2="12" />
    </>
  ),
  suv: (
    <>
      <path d="M4 30 H60 M6 30 L10 14 Q12 10 18 10 H46 Q52 10 54 14 L58 30" />
      <circle cx="16" cy="32" r="6" />
      <circle cx="48" cy="32" r="6" />
      <line x1="10" y1="16" x2="54" y2="16" />
    </>
  ),
  outstation: (
    <>
      <path d="M4 30 H60 M8 30 L14 18 Q18 12 26 12 H38 Q46 12 50 18 L56 30" />
      <circle cx="16" cy="32" r="6" />
      <circle cx="48" cy="32" r="6" />
      <rect x="23" y="5" width="18" height="7" rx="2" />
    </>
  ),
};

function VehicleGlyph({ id }: { id: VehicleTypeId }) {
  return (
    <svg
      viewBox="0 0 64 40"
      className="h-10 w-16"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {VEHICLE_GLYPH_PATHS[id]}
    </svg>
  );
}

export function RideCategories() {
  // Constant initial value (never read from a browser API) so the very
  // first client render matches what the server already sent — required for
  // this statically prerendered page to hydrate cleanly.
  const [filter, setFilter] = useState<FilterId>("all");

  const visibleVehicles =
    filter === "all"
      ? VEHICLE_TYPES
      : VEHICLE_TYPES.filter((vehicle) => vehicle.id === filter);

  return (
    <section id="ride" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <SectionHeading
        eyebrow={RIDES_SECTION.eyebrow}
        heading={RIDES_SECTION.heading}
        subheading={RIDES_SECTION.subheading}
      />

      {/* The scroll container carries its own padding, cancelled by a matching
          negative margin, so a focus ring on the first/last chip (or on the
          top/bottom edge of any chip) has room to paint before overflow-x-auto
          clips the box — overflow-x alone would otherwise force overflow-y to
          an implicit "auto" and cut the ring. */}
      <div className="-mx-2 mt-8 overflow-x-auto p-2">
        <div
          role="group"
          aria-label={RIDES_SECTION.filterGroupLabel}
          className="flex w-max gap-2 sm:w-auto sm:flex-wrap"
        >
          <Chip selected={filter === "all"} onClick={() => setFilter("all")}>
            {RIDES_SECTION.allLabel}
          </Chip>
          {VEHICLE_TYPES.map((vehicle) => (
            <Chip
              key={vehicle.id}
              selected={filter === vehicle.id}
              onClick={() => setFilter(vehicle.id)}
            >
              {vehicle.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Visually hidden but announced to assistive tech whenever the filter
          changes the visible card count — present on every render (not
          conditionally mounted) so server and client markup agree on first
          paint. */}
      <p aria-live="polite" className="sr-only">
        {RIDES_SECTION.filterResultsLabel(visibleVehicles.length, VEHICLE_TYPES.length)}
      </p>

      <Reveal className="mt-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="flex h-full flex-col gap-4 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-surface-2 text-fg">
                <VehicleGlyph id={vehicle.id} />
              </div>

              <div>
                <h3 className="font-display text-lg text-fg">{vehicle.label}</h3>
                <p className="mt-1 text-sm text-fg-muted">{vehicle.tagline}</p>
              </div>

              <div className="mt-auto flex items-center justify-between text-sm text-fg-muted">
                <span>{RIDES_SECTION.seatsLabel(vehicle.seats)}</span>
                <span>{RIDES_SECTION.etaLabel(vehicle.etaMinutes)}</span>
              </div>

              {/* Emphasised, but never yellow — a fare figure is information,
                  not a call to action, so it stays on the same text-fg used
                  for ordinary copy. */}
              <p className="text-base font-semibold text-fg">
                {RIDES_SECTION.fromLabel} {vehicle.fromFare}
              </p>
            </Card>
          ))}
        </div>
      </Reveal>

      <p className="mt-8 text-xs text-fg-muted">{DISCLAIMER}</p>
    </section>
  );
}
