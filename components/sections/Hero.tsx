import { HERO } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { FareEstimator } from "@/components/sections/FareEstimator";
import WorldMap from "@/components/ui/world-map";

/**
 * The source component's intercontinental spread — kept because a scattered
 * set of long arcs reads as a network, where the earlier India-only cluster
 * collapsed into a knot of overlapping loops (short routes + the fixed 50px
 * arc height). Delhi stays a hub, which keeps a thread of relevance to an
 * Indian service; the map is decorative (aria-hidden), so it carries no claim.
 */
const GLOBAL_ROUTES = [
  { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: 34.0522, lng: -118.2437 } }, // Alaska → LA
  { start: { lat: 64.2008, lng: -149.4937 }, end: { lat: -15.7975, lng: -47.8919 } }, // Alaska → Brazil
  { start: { lat: -15.7975, lng: -47.8919 }, end: { lat: 38.7223, lng: -9.1393 } }, // Brazil → Lisbon
  { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: 28.6139, lng: 77.209 } }, // London → Delhi
  { start: { lat: 28.6139, lng: 77.209 }, end: { lat: 43.1332, lng: 131.9113 } }, // Delhi → Vladivostok
  { start: { lat: 28.6139, lng: 77.209 }, end: { lat: -1.2921, lng: 36.8219 } }, // Delhi → Nairobi
];

export function Hero() {
  return (
    // isolate creates a stacking context so the -z-10 map sits behind this
    // section's own content but never behind the page. overflow-x-clip
    // contains the map's min-width overscan on narrow screens without
    // creating a scroll container.
    <section
      id="top"
      className="relative isolate flex min-h-[44rem] items-center overflow-x-clip py-28 sm:min-h-[48rem] sm:py-32"
    >
      {/* The map is now the hero's backdrop, not a band below it. Centred and
          given a min width so it stays a full-bleed field even on phones,
          where a 2:1 box would otherwise shrink to a thin strip. Its own
          top/bottom mask fades it into --bg. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <WorldMap dots={GLOBAL_ROUTES} className="min-w-[64rem]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-sm font-medium text-fg-muted shadow-lift backdrop-blur-sm">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-green" />
            {HERO.eyebrow}
          </span>

          <h1 className="mt-6 text-[2.5rem] font-display font-semibold leading-[1.05] text-fg sm:text-6xl lg:text-7xl">
            {HERO.heading}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
            {HERO.subheading}
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-9 max-w-3xl">
          <Reveal>
            <FareEstimator />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
