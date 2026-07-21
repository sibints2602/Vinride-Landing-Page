import { DRIVE } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, REVEAL_STAGGER_MS } from "@/components/ui/Reveal";

/**
 * The one section that stays dark in both themes: a solid brand-forest fill
 * with data-theme="dark" pinned locally, so every theme-aware token used
 * below (text-fg, text-fg-muted, text-link, bg-surface, border-line)
 * resolves to its dark-theme value regardless of the page's active theme:
 * the dark-theme fg color for body text, the dark-theme link color for
 * accents. Never use these tokens here expecting the light-theme values;
 * they'd be wrong on this fill.
 *
 * The brand-forest fill sits close in luminance to the dark-theme page
 * background — a plain edge would nearly vanish there. The brand-green top/
 * bottom border keeps the section's boundary visible in both themes
 * (measured contrast: 4.79:1 against forest, 7.37:1 against the dark page
 * background).
 */
export function DriveWithUs() {
  return (
    <section
      id="drive"
      data-theme="dark"
      className="border-y border-brand-green bg-brand-forest"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <Reveal>
            <div className="flex flex-col items-start gap-8">
              <SectionHeading
                eyebrow={DRIVE.eyebrow}
                heading={DRIVE.heading}
                subheading={DRIVE.subheading}
              />

              <ul className="flex flex-col gap-4">
                {DRIVE.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-fg">
                    <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-green/15 text-link">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button href={DRIVE.cta.href} size="lg">
                {DRIVE.cta.label}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={REVEAL_STAGGER_MS}>
            <Card
              tone="surface"
              className="ring-1 ring-brand-green/30 shadow-xl shadow-ink/30"
            >
              <p className="font-display text-4xl text-fg sm:text-5xl">
                {DRIVE.earningsValue}
              </p>
              <p className="mt-2 text-fg-muted">{DRIVE.earningsLabel}</p>
              {/* Placeholder figure — must never read as a guaranteed income. */}
              <p className="mt-4 text-sm text-fg-muted">
                {DRIVE.earningsQualifier}
              </p>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
