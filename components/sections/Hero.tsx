import Image from "next/image";
import { HERO, STATS } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { FareEstimator } from "@/components/sections/FareEstimator";
import appScreen from "@/public/iPhone 12.png";

export function Hero() {
  return (
    // overflow-x-clip contains the yellow field's -right-[100vw] bleed without
    // creating a scroll container, so the y axis stays visible.
    //
    // min-h-[86vh], not 100dvh: a hero pinned to exactly one viewport leaves
    // no hint that anything follows it. Stopping just short lets the next
    // section peek, and `min-` means content still governs when it needs more.
    <section
      id="top"
      className="relative overflow-x-clip pt-28 lg:min-h-[86vh] lg:pt-32"
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-center lg:gap-10 lg:px-8">
        <div className="lg:py-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-fg-muted shadow-lift">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-brand-green"
            />
            {HERO.eyebrow}
          </span>

          {/* Left-aligned and oversized. The previous centred stack put the
              eyebrow, headline, copy, buttons and image on a single axis,
              which is the template default and reads as such. */}
          <h1 className="mt-6 text-[2.6rem] font-display font-semibold leading-[1.05] text-fg sm:text-6xl lg:text-[4.25rem]">
            {HERO.heading}
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-fg-muted">
            {HERO.subheading}
          </p>

          <div className="mt-9">
            <Reveal>
              <FareEstimator />
            </Reveal>
          </div>

          {/* Proof under the primary action, where the sector puts it. Sourced
              from STATS so the hero can't drift out of sync with the stats
              section further down. */}
          <ul className="mt-9 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-7">
            {STATS.slice(0, 3).map((stat) => (
              <li key={stat.label}>
                {/* srText is a complete sentence, so the split value/suffix/
                    label spans are hidden rather than read as fragments. */}
                <span className="sr-only">{stat.srText}</span>
                <span
                  aria-hidden="true"
                  className="block font-display text-2xl font-semibold text-fg"
                >
                  {stat.value}
                  {stat.suffix}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-0.5 block text-sm text-fg-muted"
                >
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:py-10">
          {/*
           * The brand colour as an actual field rather than one button's
           * background. It runs off the right edge of the viewport
           * (-right-[100vw], trimmed by the section's overflow-x-clip) so the
           * composition reads as cropped by the frame instead of politely
           * contained — and it gives the phone an environment to sit in,
           * which is what a cutout with no background of its own needs.
           */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 top-10 rounded-[2rem] bg-brand-yellow lg:-right-[100vw] lg:bottom-8 lg:top-16 lg:rounded-r-none lg:rounded-l-[2.5rem]"
          />

          {/* Overlaps the field's top edge. Occlusion is the strongest depth
              cue available and costs nothing. Rendered at ~240px against a
              243px-wide source, so unlike the car this one is not upscaled. */}
          <Image
            src={appScreen}
            alt=""
            aria-hidden="true"
            sizes="15rem"
            loading="eager"
            fetchPriority="high"
            className="relative z-10 mx-auto h-auto w-[58%] max-w-[15rem] drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
