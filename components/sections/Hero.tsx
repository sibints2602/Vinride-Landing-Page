import Image from "next/image";
import { HERO } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { FareEstimator } from "@/components/sections/FareEstimator";
import heroCar from "@/public/Hero-Car.png";

export function Hero() {
  return (
    // overflow-x-clip, not overflow-x-hidden: the glow below is inset past the
    // container and would otherwise widen the document on narrow screens.
    // `clip` contains it without creating a scroll container, so the y axis
    // stays visible.
    <section id="top" className="relative overflow-x-clip pt-28 sm:pt-32 lg:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-16 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl dark:opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-brand-yellow) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-fg-muted shadow-lift">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-brand-green"
            />
            {HERO.eyebrow}
          </span>

          <h1 className="mt-7 text-[2.6rem] font-display leading-[1.08] text-fg sm:text-6xl lg:text-7xl">
            {HERO.heading}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
            {HERO.subheading}
          </p>
        </div>

        {/* The bar floats over the car: z-10 here, and the car pulled up
            underneath it below. */}
        <div className="relative z-10 mx-auto mt-10 max-w-4xl">
          <Reveal>
            <FareEstimator />
          </Reveal>
        </div>

        <div className="relative">
          {/* Contact shadow. The asset is a clean cutout with no ground plane
              of its own, so without this the car floats. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-[9%] mx-auto h-10 w-[68%] max-w-[34rem] rounded-[50%] opacity-25 blur-2xl dark:opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(closest-side, var(--color-ink) 0%, transparent 100%)",
            }}
          />
          {/* Decorative: the heading already names what this is. Capped at the
              asset's native 666px — it has no 2x version, so any wider and it
              is upscaled and goes soft on retina displays. */}
          <Image
            src={heroCar}
            alt=""
            sizes="(min-width: 768px) 42rem, 100vw"
            loading="eager"
            fetchPriority="high"
            className="relative mx-auto -mt-6 h-auto w-full max-w-[42rem] sm:-mt-10"
          />
        </div>

        {/* -mt-2 closes the gap the asset's own transparent bottom margin
            leaves between the wheels and the cue. */}
        <div className="-mt-2 flex justify-center pb-16">
          <a
            href="#ride"
            aria-label={HERO.scrollCueLabel}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-fg-muted shadow-lift transition-colors duration-200 hover:text-fg"
          >
            <Icon name="arrow-down" />
          </a>
        </div>
      </div>
    </section>
  );
}
