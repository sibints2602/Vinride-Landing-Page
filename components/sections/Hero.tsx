import Image from "next/image";
import { HERO } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
/**
 * Trimmed to the car's alpha bounding box (606x191) from the supplied
 * Hero-Car.png (666x375), which carries 96px of transparent margin above the
 * roof and 88px below the tyres — 49% of its height. Untrimmed, half the
 * vertical space the image occupies in the layout is empty, which is what
 * made the car look small however large the element got. The crop is lossless
 * for every pixel kept and the original file is untouched; regenerate with
 * sharp .extract({left:44, top:96, width:606, height:191}).
 */
import heroCar from "@/public/hero-car-trimmed.png";

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
          above it. Centring splits the slack above and below the group. */}
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

          {/* The fare bar used to be the hero's call to action. With it gone
              the section had none at all, so the button pair it originally
              replaced comes back. */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={HERO.primaryCta.href} variant="primary" size="lg">
              {HERO.primaryCta.label}
            </Button>
            <Button href={HERO.secondaryCta.href} variant="secondary" size="lg">
              {HERO.secondaryCta.label}
            </Button>
          </div>
        </div>

        {/* shrink-0 because a flex item is shrinkable by default, and once the
            content is taller than the viewport the flex algorithm compresses
            this wrapper rather than letting the image's own caps decide.
            mx-[calc(50%-50vw)] cancels the page container so the car can run
            wider than max-w-6xl. Safe because the section is overflow-x-clip,
            which stops the 100vw breakout from widening the document when a
            classic scrollbar is present. */}
        <div className="relative shrink-0 mx-[calc(50%-50vw)]">
          {/* Contact shadow. The asset is a clean cutout with no ground plane
              of its own, so without this the car floats. Sits at the very foot
              now that the trimmed asset ends at the tyres. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-8 w-[62%] max-w-[46rem] rounded-[50%] opacity-25 blur-2xl dark:opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(closest-side, var(--color-ink) 0%, transparent 100%)",
            }}
          />
          {/* Decorative: the heading already names what this is. */}
          <Image
            src={heroCar}
            alt=""
            sizes="(min-width: 768px) 80rem, 100vw"
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
             * The three caps are: 80rem art direction, 100% to stay inside the
             * viewport, and a height limit re-expressed as a width via the
             * trimmed 606/191 = 3.173 aspect ratio.
             *
             * That height limit is `100dvh - 29rem`, not a flat `Nvh`: the
             * chrome above the car (nav, eyebrow, headline, subheading, CTA
             * buttons, scroll cue) is a fixed ~464px that does NOT scale with the
             * viewport, so a percentage cap over-allocates on short windows —
             * 46vh fit at 900px tall and overflowed by 55px at 720px. Giving
             * the car whatever is left over instead makes it as large as the
             * 80rem cap allows on a tall screen and shrink only when it
             * genuinely has to.
             *
             * 80rem is ~2.1x the trimmed asset's native 606px, so this is
             * heavily upscaled and will read soft on a high-density display.
             * That is the cost of the requested size at this source
             * resolution — a ~1300px-wide render of the same car removes it
             * entirely with no code change.
             */
            className="relative mx-auto h-auto w-full max-w-[min(80rem,100%,calc((100dvh-29rem)*3.173))]"
          />
        </div>

        {/* Positive margin, not negative: the untrimmed asset had ~88px of
            transparent band below the tyres that a negative margin could eat
            for free. The trimmed one ends at the rubber, so the same negative
            margin pulled the cue on top of the car. */}
        <div className="mt-3 flex shrink-0 justify-center pb-4">
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
