"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  IconChevronLeft,
  IconChevronRight,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import { CUSTOMER_STORIES } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Hand-placed feel (sm+ only): each card leans a touch and drifts off the row's baseline, kept subtle. */
const CARD_TILTS = [
  "sm:rotate-[4.0deg] sm:-translate-y-4",
  "sm:-rotate-[1.0deg] sm:translate-y-1",
  "sm:rotate-[1.1deg] sm:-translate-y-2",
  "sm:-rotate-[1.3deg] sm:translate-y-2",
] as const;

/** Deal stagger, sm+ only — the mobile carousel deals each card as it's swiped into view. */
const CARD_DEAL_DELAYS = [
  "",
  "sm:[transition-delay:300ms]",
  "sm:[transition-delay:600ms]",
  "sm:[transition-delay:900ms]",
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
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Track scroll edges so the arrows can dim when there's nothing left to reveal.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setAtStart(track.scrollLeft <= 4);
      setAtEnd(track.scrollLeft >= track.scrollWidth - track.clientWidth - 4);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (!cards.length) return;
    const trackLeft = track.getBoundingClientRect().left;
    // Each card's target scrollLeft, aligned to the px-4 (16px) scroll padding.
    // Scrolling to explicit card offsets (vs. scrollBy a fixed step) matters at the
    // ends, where the container rests off the snap grid and a fixed step re-snaps back.
    const offsets = cards.map(
      (card) =>
        card.getBoundingClientRect().left - trackLeft + track.scrollLeft - 16,
    );
    const current = offsets.reduce(
      (best, offset, i) =>
        Math.abs(offset - track.scrollLeft) < Math.abs(offsets[best] - track.scrollLeft)
          ? i
          : best,
      0,
    );
    const next = Math.min(Math.max(current + direction, 0), cards.length - 1);
    track.scrollTo({ left: offsets[next], behavior: "smooth" });
  };

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

      {/* Mobile-only carousel controls, tucked into the section's top-right corner */}
      <div className="mt-8 flex justify-end gap-2 sm:hidden">
        <button
          type="button"
          aria-label="Previous story"
          onClick={() => scrollByCard(-1)}
          disabled={atStart}
          // Form-filler extensions stamp fdprocessedid on buttons pre-hydration
          suppressHydrationWarning
          className="flex h-9 w-9 items-center justify-center border border-line text-fg-muted transition-colors duration-200 hover:border-brand-yellow/50 hover:text-fg disabled:opacity-30"
        >
          <IconChevronLeft aria-hidden className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next story"
          onClick={() => scrollByCard(1)}
          disabled={atEnd}
          suppressHydrationWarning
          className="flex h-9 w-9 items-center justify-center border border-line text-fg-muted transition-colors duration-200 hover:border-brand-yellow/50 hover:text-fg disabled:opacity-30"
        >
          <IconChevronRight aria-hidden className="h-4 w-4" />
        </button>
      </div>

      {/* sm+: clip wrapper hides the fly-in path; -mx/px slack keeps tilted corners from being shaved.
          Mobile: the ul is its own snap carousel and clips itself, so the wrapper stays inert. */}
      <div className="sm:-mx-4 sm:overflow-x-clip sm:px-4">
        <ul ref={trackRef} className="-mx-4 mt-4 flex sm:mt-14 snap-x snap-mandatory list-none gap-5 overflow-x-auto scroll-px-4 px-4 py-4 scrollbar-none sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:scroll-px-0 sm:px-0 lg:grid-cols-4">
          {CUSTOMER_STORIES.stories.map((story, index) => (
            <li
              key={story.name}
              className={cn(
                "w-[85%] max-w-sm shrink-0 snap-start sm:w-auto sm:max-w-none",
                CARD_TILTS[index % 4],
              )}
            >
              {/* Dealt one by one on sm+; the long stagger keeps the deals clearly sequential */}
              <Reveal
                variant="deal"
                className={cn("h-full", CARD_DEAL_DELAYS[index % 4])}
              >
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
