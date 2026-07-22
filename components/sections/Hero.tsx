import { HERO } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { FareEstimator } from "@/components/sections/FareEstimator";
import WorldMap from "@/components/ui/world-map";

/**
 * Domestic routes between Vinride's launch cities — the map is decorative, so
 * these carry no text, but choosing Indian metros over the source component's
 * intercontinental "nomad" routes keeps it honest to a 12-city cab service and
 * to the Outstation (city-to-city) ride type. Delhi and Mumbai act as hubs so
 * the arcs read as a network rather than a line.
 */
const CITY_ROUTES = [
  { start: { lat: 28.61, lng: 77.21 }, end: { lat: 19.08, lng: 72.88 } }, // Delhi → Mumbai
  { start: { lat: 28.61, lng: 77.21 }, end: { lat: 13.08, lng: 80.27 } }, // Delhi → Chennai
  { start: { lat: 28.61, lng: 77.21 }, end: { lat: 22.57, lng: 88.36 } }, // Delhi → Kolkata
  { start: { lat: 19.08, lng: 72.88 }, end: { lat: 12.97, lng: 77.59 } }, // Mumbai → Bengaluru
  { start: { lat: 19.08, lng: 72.88 }, end: { lat: 26.91, lng: 75.79 } }, // Mumbai → Jaipur
  { start: { lat: 17.38, lng: 78.49 }, end: { lat: 22.57, lng: 88.36 } }, // Hyderabad → Kolkata
];

export function Hero() {
  return (
    // overflow-x-clip is a cheap guard against any child (the map's arcs at the
    // viewBox edge) nudging the document wider on narrow screens.
    <section id="top" className="relative overflow-x-clip pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-fg-muted shadow-lift">
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

      {/* Full-bleed: the map is the hero's visual field, so it spans the
          viewport rather than sitting inside the 6xl content column. The map's
          own top/bottom mask fades it into the page. */}
      <div className="mt-6 w-full sm:-mt-4">
        <WorldMap dots={CITY_ROUTES} />
      </div>
    </section>
  );
}
