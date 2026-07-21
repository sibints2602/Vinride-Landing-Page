import { SAFETY } from "@/content/site";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, REVEAL_STAGGER_MS } from "@/components/ui/Reveal";

export function Safety() {
  return (
    <section
      id="safety"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <SectionHeading
        align="center"
        eyebrow={SAFETY.eyebrow}
        heading={SAFETY.heading}
        subheading={SAFETY.subheading}
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SAFETY.features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * REVEAL_STAGGER_MS}>
            <Card tone="surface" className="flex h-full flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 text-link">
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
