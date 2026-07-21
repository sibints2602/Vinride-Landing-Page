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
    // min-h, not h: the hero targets exactly one viewport, but on a short
    // window (or with large text) the content still needs room to grow rather
    // than be clipped. dvh so mobile browser chrome collapsing doesn't leave a
    // gap. pt clears the 5rem fixed nav.
    <section
      id="top"
      className="relative flex min-h-dvh flex-col overflow-x-clip pt-24 sm:pt-28"
    >
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

      {/* justify-center, not an mt-auto on the car: on a tall window that
          parked the car at the foot and pooled every spare pixel into one gap
          between it and the fare bar. Centring splits the slack above and
          below the group instead. */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-fg-muted shadow-lift">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-brand-green"
            />
            {HERO.eyebrow}
          </span>

          <h1 className="mt-6 text-[2.4rem] font-display leading-[1.08] text-fg sm:text-5xl lg:text-6xl">
            {HERO.heading}
          </h1>

          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-fg-muted sm:text-lg">
            {HERO.subheading}
          </p>
        </div>

        {/* The bar floats over the car: z-10 here, and the car pulled up
            underneath it below. */}
        <div className="relative z-10 mx-auto mt-8 w-full max-w-2xl">
          <Reveal>
            <FareEstimator />
          </Reveal>
        </div>

        {/* shrink-0: as a flex item this wrapper is shrinkable by default, and
            once the content is taller than the viewport the flex algorithm
            compresses it — which quietly overrode the image's own max-h and
            rendered the car smaller than asked for. */}
        <div className="relative shrink-0">
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
          {/* Decorative: the heading already names what this is. */}
          <Image
            src={heroCar}
            alt=""
            sizes="(min-width: 768px) 54rem, 100vw"
            loading="eager"
            fetchPriority="high"
            /*
             * Width is the ONLY size constraint; height follows from the
             * intrinsic aspect ratio via h-auto. Do not reach for `w-auto` +
             * `max-h` here: with width auto the used size comes from the
             * natural size of whichever srcset candidate the browser happened
             * to pick (a 640w entry decoding to 532px), not from the 666px
             * width attribute — so the car silently rendered at 80% and no
             * amount of raising max-h moved it.
             *
             * The three caps are: 54rem art direction, 100% to stay inside
             * the gutters, and the viewport-height limit re-expressed as a
             * width via the 666/375 = 1.776 aspect ratio, which is what keeps
             * the hero inside one screen on a short window.
             *
             * 54rem is ~1.3x the asset's native 666px, so this is deliberately
             * upscaled — the brief was a big car and there is no 2x version.
             * Drop in a ~1700px render and it sharpens for free.
             */
            className="relative mx-auto -mt-4 h-auto w-full max-w-[min(54rem,100%,calc(44vh*1.776))] sm:-mt-10"
          />
        </div>

        {/* The negative margin eats the asset's own transparent bottom band,
            which is otherwise dead space between the wheels and the cue. */}
        <div className="-mt-8 flex shrink-0 justify-center pb-4">
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
