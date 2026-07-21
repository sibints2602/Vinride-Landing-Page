import { HOW_IT_WORKS } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function HowItWorks() {
  const { steps } = HOW_IT_WORKS;

  return (
    <section
      id="how"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <SectionHeading eyebrow={HOW_IT_WORKS.eyebrow} heading={HOW_IT_WORKS.heading} />

      {/* A real <ol> so the sequence (set destination -> get matched -> ride
          and pay) reaches assistive tech as an ordered list, not just as
          three visually-numbered divs. */}
      <ol className="mt-12 grid list-none gap-10 md:grid-cols-3 md:gap-8">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <li key={step.title} className="relative">
              {/* Decorative connector between this step and the next: a
                  vertical rule on mobile, a horizontal rule on md+. Sized to
                  exactly the grid's own gap (h-10 matches gap-10, w-8 matches
                  md:gap-8) and positioned to start at this item's edge, so it
                  only ever occupies space the grid already reserved for the
                  gap — it can't overflow the container at any width. */}
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className="absolute left-6 top-full h-10 w-px bg-line md:left-full md:top-8 md:h-px md:w-8"
                />
              ) : null}

              <Reveal delay={index * 80}>
                <div className="flex items-baseline gap-3">
                  {/* Large numeral, low opacity, purely decorative — order is
                      conveyed to screen readers by the <ol>/<li> structure
                      above, not by this glyph. */}
                  <span
                    aria-hidden="true"
                    className="select-none font-display text-5xl text-fg/15 md:text-6xl"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg text-fg">{step.title}</h3>
                </div>
                <p className="mt-2 text-fg-muted">{step.body}</p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
