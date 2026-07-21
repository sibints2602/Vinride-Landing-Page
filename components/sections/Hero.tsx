import { HERO } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { FareEstimator } from "@/components/sections/FareEstimator";

/**
 * Inline SVG silhouette of a car, built entirely from brand-gradient fills —
 * there is no photography in this project. Purely decorative, hence
 * aria-hidden; the surrounding heading/subheading already carry the meaning.
 */
function HeroVehicle() {
  return (
    <svg
      viewBox="0 0 400 220"
      className="h-auto w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="vinride-hero-car-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--color-brand-yellow)" }} />
          <stop offset="100%" style={{ stopColor: "var(--color-brand-amber)" }} />
        </linearGradient>
        <linearGradient id="vinride-hero-car-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={{ stopColor: "var(--color-brand-green-strong)" }} />
          <stop offset="100%" style={{ stopColor: "var(--color-brand-green)" }} />
        </linearGradient>
      </defs>

      <ellipse cx="200" cy="192" rx="155" ry="14" className="fill-fg" opacity="0.08" />

      <path
        d="M40 150 L55 110 Q70 85 100 85 L150 85 Q170 55 210 55 L260 55 Q290 55 305 85
           L350 90 Q375 92 378 115 L378 150 Z"
        fill="url(#vinride-hero-car-body)"
      />

      {/* Cabin windows, cut out in the page background color so they read as glass. */}
      <path
        d="M115 83 L155 83 Q172 60 205 60 L255 60 Q280 60 293 83 Z"
        className="fill-bg"
      />
      <line x1="205" y1="60" x2="205" y2="83" className="stroke-line" strokeWidth="3" />

      <rect x="40" y="140" width="338" height="10" rx="4" fill="url(#vinride-hero-car-accent)" />

      <circle cx="110" cy="152" r="30" className="fill-ink" />
      <circle cx="110" cy="152" r="12" className="fill-surface" />
      <circle cx="310" cy="152" r="30" className="fill-ink" />
      <circle cx="310" cy="152" r="12" className="fill-surface" />
    </svg>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative pt-32 md:pt-40">
      {/* Decorative glow, isolated in its own overflow-hidden layer so it never
          clips the fare-estimator card's negative bottom offset below. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40 blur-3xl dark:opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-brand-yellow) 0%, var(--color-brand-amber) 35%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-0 top-1/3 h-[28rem] w-[28rem] translate-x-1/4 rounded-full opacity-20 blur-3xl dark:opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-brand-green) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <span className="inline-flex items-center rounded-full border border-line bg-surface-2 px-4 py-1.5 text-sm font-medium text-fg-muted">
              {HERO.eyebrow}
            </span>

            <h1 className="mt-6 text-4xl font-display text-fg sm:text-5xl lg:text-6xl">
              {HERO.heading}
            </h1>

            <p className="mt-6 max-w-xl text-lg text-fg-muted">{HERO.subheading}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={HERO.primaryCta.href} variant="primary" size="lg">
                {HERO.primaryCta.label}
              </Button>
              <Button href={HERO.secondaryCta.href} variant="secondary" size="lg">
                {HERO.secondaryCta.label}
              </Button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <HeroVehicle />
          </div>
        </div>

        <div className="relative z-10 mt-12 lg:mt-16 lg:-mb-24">
          <Reveal>
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-xl md:p-8">
              <FareEstimator />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
