import { RIDE_OPTIONS } from "@/content/site";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, REVEAL_STAGGER_MS } from "@/components/ui/Reveal";

/**
 * Icon-tile tint per card, in authored order. Only the small tile is tinted —
 * the card body stays on surface — so this section reads lighter than the
 * full-wash WhyVinride cards that follow it, instead of looking like a repeat.
 */
const TILE_TINTS = [
  "bg-brand-yellow/15 text-fg",
  "bg-brand-green/15 text-fg",
  "bg-surface-2 text-fg",
] as const;

export function RideOptions() {
  return (
    <section
      id="ride"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <SectionHeading
        eyebrow={RIDE_OPTIONS.eyebrow}
        heading={RIDE_OPTIONS.heading}
        subheading={RIDE_OPTIONS.subheading}
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {RIDE_OPTIONS.options.map((option, index) => (
          <Reveal key={option.title} delay={index * REVEAL_STAGGER_MS}>
            <Card className="flex h-full flex-col gap-5 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${TILE_TINTS[index]}`}
              >
                <Icon name={option.icon} className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-display text-xl text-fg">{option.title}</h3>
                <p className="mt-2 text-fg-muted">{option.body}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
