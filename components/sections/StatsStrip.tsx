import { STATS } from "@/content/site";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Short divider band between the hero and the content sections. Deliberately
 * shorter than a full content section (py-12/16 vs the usual py-20+) so it
 * reads as a seam rather than its own chapter.
 */
export function StatsStrip() {
  return (
    <section id="stats" className="border-y border-line bg-surface-2 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 75} className="text-center">
              <p className="font-display text-4xl tabular-nums text-fg md:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              {/* Visible label is aria-hidden: stat.srText below is the
                  complete sentence a screen reader should announce instead,
                  so this text isn't also read out and duplicated. */}
              <p aria-hidden="true" className="mt-2 text-sm text-fg-muted">
                {stat.label}
              </p>
              <span className="sr-only">{stat.srText}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
