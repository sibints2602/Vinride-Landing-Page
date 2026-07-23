import { HOW_IT_WORKS } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Steps staged as a trip: a route rail draws across, each stop populating as the line reaches it. */
const STEP_BASE_MS = 300;
const STEP_STAGGER_MS = 500;
const SEGMENT_DELAY_MS = 50;
const CONTENT_STEP_MS = 130;

// Route markers: hollow current-location ring, brand waypoint, filled green destination with glow.
const DOT_CLASSES = [
  "border-2 border-brand-green bg-bg",
  "bg-brand-yellow",
  "bg-brand-green ring-4 ring-brand-green/15",
] as const;

export function HowItWorks() {
  const { steps } = HOW_IT_WORKS;

  return (
    <section
      id="how"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
    >
      <SectionHeading
        animate
        align="center"
        eyebrow={HOW_IT_WORKS.eyebrow}
        heading={HOW_IT_WORKS.heading}
        className="md:items-start md:text-left"
      />

      {/* A real <ol> so the sequence reaches assistive tech as an ordered list. */}
      <ol className="mt-14 grid list-none gap-12 md:grid-cols-3 md:gap-8">
        {steps.map((step, index) => {
          const base = STEP_BASE_MS + index * STEP_STAGGER_MS;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.title}
              className="group/step relative text-center md:text-left"
            >
              {/* Route rail (md+, decorative): stop marker + segment spanning column width + grid gap. */}
              <div aria-hidden="true" className="relative mb-8 hidden h-2.5 md:block">
                {/* No static underlay: the rail exists only by being drawn, never pre-completed. */}
                {!isLast ? (
                  <Reveal
                    variant="draw"
                    delay={base + SEGMENT_DELAY_MS}
                    className={cn(
                      "absolute left-0 top-[4px] h-px w-[calc(100%+2rem)]",
                      // The final segment shades from brand yellow into the arrival dot's green.
                      index === steps.length - 2
                        ? "bg-gradient-to-r from-brand-yellow/70 to-brand-green/70"
                        : "bg-brand-yellow/70",
                    )}
                  />
                ) : null}
                <Reveal variant="pop" delay={base} className="absolute left-0 top-0">
                  <span className="relative block h-2.5 w-2.5">
                    {/* Pickup marker breathes like a live-location dot. */}
                    {index === 0 ? (
                      <span className="absolute inset-0 rounded-full bg-brand-green/50 motion-safe:animate-location-pulse" />
                    ) : null}
                    {/* Hovering anywhere in this step swells its stop marker. */}
                    <span
                      className={cn(
                        "relative block h-2.5 w-2.5 rounded-full transition-transform duration-300 group-hover/step:scale-[1.4]",
                        DOT_CLASSES[index] ?? DOT_CLASSES[1],
                      )}
                    />
                  </span>
                </Reveal>
              </div>

              {/* Decorative low-opacity numeral — order reaches screen readers via the <ol>, not this glyph. */}
              <Reveal delay={base}>
                {/* On hover the ghost numeral takes brand ink and swells from its baseline corner. */}
                <span
                  aria-hidden="true"
                  className="inline-block origin-bottom-left select-none font-display text-6xl font-bold leading-none text-fg/[0.08] transition-[color,transform] duration-300 group-hover/step:scale-105 group-hover/step:text-brand-yellow/45 md:text-7xl"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Reveal>
              <Reveal delay={base + CONTENT_STEP_MS}>
                <h3 className="mt-3 font-display text-lg font-semibold text-fg">
                  {step.title}
                </h3>
              </Reveal>
              <Reveal delay={base + 2 * CONTENT_STEP_MS}>
                <p className="mt-2 max-w-xs mx-auto text-fg-muted md:mx-0">
                  {step.body}
                </p>
              </Reveal>
              <Reveal delay={base + 3 * CONTENT_STEP_MS}>
                <p className="mt-4 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-fg-muted">
                  {step.meta}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
