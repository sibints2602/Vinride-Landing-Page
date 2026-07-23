import { HERO } from "@/content/site";
import { FareEstimator } from "@/components/sections/FareEstimator";
import WorldMap from "@/components/ui/world-map";

/** Long intercontinental arcs read as a network (India-only routes knotted); map is decorative. */
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
    // isolate keeps the -z-10 map behind this section only; overflow-x-clip contains map overscan
    <section
      id="top"
      className="relative isolate flex min-h-[44rem] items-center overflow-x-clip py-28 sm:min-h-[48rem] sm:py-32"
    >
      {/* Map as hero backdrop; min width keeps it full-bleed on phones, its own mask fades into --bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <WorldMap dots={GLOBAL_ROUTES} className="min-w-[64rem]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Entrance as pure CSS (not Reveal): the h1 is the LCP and Reveal's opacity-0 stalled first paint */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="motion-safe:animate-hero-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-sm font-medium text-fg-muted shadow-lift backdrop-blur-sm">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-green" />
              {HERO.eyebrow}
            </span>
          </div>

          {/* Clip for the mask reveal; pb/-mb give descenders room (same trick as Reveal) */}
          <div className="-mb-2 mt-6 overflow-hidden pb-2">
            <h1 className="text-[2.5rem] font-display font-semibold leading-[1.05] text-fg [animation-delay:120ms] motion-safe:animate-hero-mask sm:text-6xl lg:text-7xl">
              {HERO.heading}
            </h1>
          </div>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fg-muted [animation-delay:260ms] motion-safe:animate-hero-rise">
            {HERO.subheading}
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-9 max-w-3xl">
          <div className="[animation-delay:380ms] motion-safe:animate-hero-rise">
            <FareEstimator />
          </div>
        </div>
      </div>
    </section>
  );
}
