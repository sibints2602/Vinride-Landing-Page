import { WHY_VINRIDE } from "@/content/site";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, REVEAL_STAGGER_MS } from "@/components/ui/Reveal";

/**
 * One tone per card, in the order the copy is authored: yellow, then a
 * neutral surface, then green. Card.tsx keeps every tone's body text on
 * text-fg (never a tinted or muted color), so the wash never has to fight
 * contrast — measured at ~17.1:1 (yellow wash), ~18.9:1 (surface), and
 * ~16.5:1 (green wash) against text-fg, all far past the 4.5:1 AA floor.
 */
const CARD_TONES = ["yellow", "surface", "green"] as const;

export function WhyVinride() {
  return (
    <section
      id="why"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <SectionHeading
        align="center"
        eyebrow={WHY_VINRIDE.eyebrow}
        heading={WHY_VINRIDE.heading}
        subheading={WHY_VINRIDE.subheading}
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {WHY_VINRIDE.features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * REVEAL_STAGGER_MS}>
            <Card tone={CARD_TONES[index]} className="flex h-full flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-fg">
                <Icon name={feature.icon} className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg text-fg">{feature.title}</h3>
                <p className="mt-2 text-fg-muted">{feature.body}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
