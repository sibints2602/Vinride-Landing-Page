import Image from "next/image";
import { IconStarFilled, IconStarHalfFilled } from "@tabler/icons-react";
import { CUSTOMER_STORIES } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Hand-placed feel: each card leans a touch and drifts off the row's baseline, kept subtle. */
const CARD_TILTS = [
  "rotate-[4.0deg] -translate-y-4",
  "-rotate-[1.0deg] translate-y-1",
  "rotate-[1.1deg] -translate-y-2",
  "-rotate-[1.3deg] translate-y-2",
] as const;

function StarRow({ rating, srText }: { rating: number; srText: string }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <p className="flex items-center gap-1.5 text-fg-muted">
      <span className="sr-only">{srText}</span>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <IconStarFilled key={i} aria-hidden className="h-4 w-4" />;
        if (i === full && hasHalf)
          return <IconStarHalfFilled key={i} aria-hidden className="h-4 w-4" />;
        return (
          <IconStarFilled key={i} aria-hidden className="h-4 w-4 opacity-25" />
        );
      })}
    </p>
  );
}

export function CustomerStories() {
  return (
    <section
      id="stories"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <SectionHeading
          animate
          align="center"
          heading={CUSTOMER_STORIES.heading}
          subheading={CUSTOMER_STORIES.subheading}
        />
        <Reveal delay={320}>
          <StarRow
            rating={CUSTOMER_STORIES.rating}
            srText={CUSTOMER_STORIES.ratingSrText}
          />
        </Reveal>
      </div>

      {/* Clip wrapper hides the fly-in path; -mx/px slack keeps tilted corners from being shaved */}
      <div className="-mx-4 overflow-x-clip px-4">
        <ul className="mt-14 grid list-none gap-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
          {CUSTOMER_STORIES.stories.map((story, index) => (
            <li key={story.name} className={cn(CARD_TILTS[index % 4])}>
              {/* Dealt one by one; the long stagger keeps the deals clearly sequential */}
              <Reveal variant="deal" delay={index * 300} className="h-full">
              <figure className="flex h-full flex-col border border-line bg-surface/40 p-6 transition-colors duration-300 hover:border-brand-yellow/50">
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-fg-muted">
                  {story.city}
                </p>
                <figcaption className="mt-5">
                  <span className="flex items-center gap-2.5">
                    {/* Decorative: alt="" keeps screen readers from hearing the adjacent name twice */}
                    <Image
                      src={story.avatar}
                      alt=""
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="font-display text-sm font-semibold text-fg">
                      {story.name}
                    </span>
                  </span>
                  <span className="mt-2 block text-sm text-fg-muted">
                    {story.role}
                  </span>
                </figcaption>
                <blockquote className="mt-4 text-sm leading-relaxed text-fg-muted">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
              </figure>
            </Reveal>
          </li>
        ))}
        </ul>
      </div>

      {/* Lands as the last card settles (deal 3 starts at 900ms). */}
      <Reveal delay={1250} className="mt-10 text-center">
        <a
          href={CUSTOMER_STORIES.linkHref}
          className="text-sm text-fg-muted underline underline-offset-4 transition-colors duration-200 hover:text-fg"
        >
          {CUSTOMER_STORIES.linkLabel}
        </a>
      </Reveal>
    </section>
  );
}
