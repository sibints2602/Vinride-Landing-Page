import Image from "next/image";
import { HERO, STATS } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { FareEstimator } from "@/components/sections/FareEstimator";
import carsImage from "@/public/Cars Pics.png";
import appImage from "@/public/iPhone 12.png";

/**
 * The dark showroom plate the hero vehicles sit on.
 *
 * `Cars Pics.png` is not a cutout — it ships with an opaque rgb(42, 42, 42)
 * rounded rectangle baked in. Rather than fight that, the panel adopts the
 * exact same colour (`--color-stage`) so the asset's own background extends
 * into the panel with no visible seam, and the composition treats it as a
 * deliberate dark plate. That is also why nothing decorative may sit *behind*
 * the car image: it is opaque, so any glow underneath would be clipped along
 * the asset's straight top edge. All glow is layered above the flat plate but
 * confined to the empty region above the image.
 */
function HeroStage() {
  return (
    <div className="relative">
      {/* Brand glow bleeding out from behind the plate, softening its edges
          against the page canvas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[3.5rem] opacity-50 blur-3xl dark:opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(55% 55% at 50% 45%, var(--color-brand-yellow) 0%, transparent 70%)",
        }}
      />

      <div className="relative overflow-hidden rounded-[2rem] border border-stage-line bg-stage shadow-lift-lg">
        {/* Overhead spotlight, filling the empty plate above the vehicles. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-2/3"
          style={{
            backgroundImage:
              "radial-gradient(80% 100% at 50% -10%, color-mix(in srgb, var(--color-brand-yellow) 26%, transparent) 0%, transparent 65%)",
          }}
        />

        <div className="pt-10 sm:pt-14">
          {/* Decorative: the heading and subheading beside it already say the
              fleet covers bikes through SUVs. */}
          <Image
            src={carsImage}
            alt=""
            sizes="(min-width: 1024px) 34rem, (min-width: 640px) 90vw, 100vw"
            loading="eager"
            fetchPriority="high"
            className="h-auto w-full"
          />
        </div>
      </div>

      {/* The app, overlapping the plate's lower-left corner so the two assets
          read as one layered composition instead of two stacked pictures.
          Offsets stay under the 1rem page gutter so nothing can push the
          document wider than the viewport at 320px. */}
      <Image
        src={appImage}
        alt=""
        aria-hidden="true"
        sizes="(min-width: 1024px) 12rem, 26vw"
        className="absolute -bottom-6 -left-3 h-auto w-[30%] max-w-[12rem] drop-shadow-2xl sm:-bottom-8 lg:-left-16 lg:w-[13rem] lg:max-w-none"
      />
    </div>
  );
}

export function Hero() {
  return (
    // overflow-x-clip, not overflow-x-hidden: the stage's glow is inset by
    // -2rem and would otherwise widen the document past the viewport on
    // narrow screens. `clip` contains it without creating a scroll container,
    // so the estimator card below can still overhang the section vertically
    // (`hidden` would force the y axis to `auto` and cut it off).
    <section id="top" className="relative overflow-x-clip pt-28 sm:pt-32 lg:pt-40">
      {/* Isolated in its own overflow-hidden layer so it never clips the
          fare-estimator card's negative bottom offset below. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute right-0 top-1/3 h-[28rem] w-[28rem] translate-x-1/4 rounded-full opacity-[0.12] blur-3xl dark:opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-brand-green) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-40">
        <div className="grid gap-16 lg:grid-cols-[1fr_minmax(0,34rem)] lg:items-center lg:gap-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-fg-muted shadow-lift">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-brand-green"
              />
              {HERO.eyebrow}
            </span>

            <h1 className="mt-7 text-[2.75rem] font-display leading-[1.05] text-fg sm:text-6xl lg:text-7xl">
              {/*
               * The brand yellow sits at roughly 2.5:1 on both canvases, so it
               * can never carry the headline text itself. It is used here as a
               * rule *below* the baseline with no overlap, which keeps the
               * text at the full --fg contrast in both themes.
               */}
              <span className="relative inline-block">
                Your city,
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-[0.09em] w-full rounded-full bg-brand-yellow"
                />
              </span>
              <br />
              one tap away.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-fg-muted">
              {HERO.subheading}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={HERO.primaryCta.href} variant="primary" size="lg">
                {HERO.primaryCta.label}
              </Button>
              <Button href={HERO.secondaryCta.href} variant="secondary" size="lg">
                {HERO.secondaryCta.label}
              </Button>
            </div>

            {/* Reuses the STATS placeholders rather than restating the numbers,
                so the hero can never drift out of sync with the stats strip. */}
            <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-line pt-8">
              {STATS.slice(0, 3).map((stat) => (
                <li key={stat.label}>
                  {/* srText is a complete sentence ("4 million plus rides
                      completed"), so the split value/suffix/label spans below
                      are hidden rather than announced as three fragments. */}
                  <span className="sr-only">{stat.srText}</span>
                  <span
                    aria-hidden="true"
                    className="block font-display text-2xl text-fg"
                  >
                    {stat.value}
                    {stat.suffix}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 block text-sm text-fg-muted"
                  >
                    {stat.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <HeroStage />
        </div>

        <div className="relative z-10 mt-20 lg:mt-24 lg:-mb-24">
          <Reveal>
            <div className="rounded-[1.75rem] border border-line bg-surface/80 p-6 shadow-lift-lg backdrop-blur-xl md:p-8">
              <FareEstimator />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
