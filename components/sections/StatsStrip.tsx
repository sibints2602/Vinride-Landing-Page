import { STATS, STATS_SECTION } from "@/content/site";
import { StatItem } from "@/components/ui/StatItem";

/** Divider band between hero and content — border-y + surface-2 make it read as a seam. */
export function StatsStrip() {
  return (
    <section
      id="stats"
      className="border-y border-line bg-surface-2 py-12 sm:py-14"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">{STATS_SECTION.heading}</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-12">
          {STATS.map((stat, index) => (
            <StatItem key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
