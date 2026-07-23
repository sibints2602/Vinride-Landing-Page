import type { ComponentType } from "react";
import {
  IconBolt,
  IconCalendarTime,
  IconGift,
  IconHeadset,
  IconReceipt2,
  IconSearch,
  IconShieldCheck,
  IconWallet,
} from "@tabler/icons-react";
import { WHY_VINRIDE } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LetterMark } from "@/components/ui/LetterMark";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type IconComponent = ComponentType<{
  className?: string;
  strokeWidth?: number | string;
}>;

// Tabler icons here, not the shared ICONS map: this hairline grid uses a lighter icon weight.
const FEATURE_ICONS: Record<string, IconComponent> = {
  receipt: IconReceipt2,
  "shield-check": IconShieldCheck,
  bolt: IconBolt,
  wallet: IconWallet,
  calendar: IconCalendarTime,
  search: IconSearch,
  headset: IconHeadset,
  gift: IconGift,
};

export function WhyVinride() {
  return (
    <section
      id="why"
      // Full-bleed so the wordmark anchors the viewport corner; overflow-hidden contains the type.
      className="relative overflow-hidden py-12 sm:py-14"
    >
      {/* Decorative giant VINRIDE wordmark, spelled out letter by letter with a dissolving tail. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[-0.04em] top-38 z-0 hidden select-none font-display text-[13vw] font-bold uppercase leading-none tracking-[-0.02em] text-fg/[0.05] lg:block"
      >
        <LetterMark text="Vinride" step={170} tailFade={0.2} />
      </span>

      {/* max-w-7xl (not the usual 6xl): the 4-across grid needs room for its px-10 gutters. */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          animate
          align="center"
          eyebrow={WHY_VINRIDE.eyebrow}
          heading={WHY_VINRIDE.heading}
          subheading={WHY_VINRIDE.subheading}
        />

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4">
          {WHY_VINRIDE.features.map((feature, index) => (
            // Frame shows from the start; baseDelay populates each cell's content after the heading.
            <Feature
              key={feature.title}
              {...feature}
              index={index}
              baseDelay={CELL_LEAD_MS + index * CELL_STAGGER_MS}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Heading leads, then cell after cell; within each cell icon → title → body land a beat apart.
const CELL_LEAD_MS = 300;
const CELL_STAGGER_MS = 180;
const CONTENT_STEP_MS = 130;

function Feature({
  title,
  body,
  icon,
  index,
  baseDelay,
}: {
  title: string;
  body: string;
  icon: string;
  index: number;
  baseDelay: number;
}) {
  const CellIcon = FEATURE_ICONS[icon];
  return (
    <div
      className={cn(
        "group/feature relative flex h-full flex-col border-line py-10 lg:border-r",
        // Hairline frame: only row starts re-add a left edge; only the top row draws the bottom rule.
        (index === 0 || index === 4) && "lg:border-l",
        index < 4 && "lg:border-b",
      )}
    >
      {/* Hover wash always bleeds toward the outer edge: rises on the top row, falls on the bottom. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100",
          index < 4
            ? "bg-gradient-to-t from-surface-2"
            : "bg-gradient-to-b from-surface-2",
        )}
      />
      <Reveal
        delay={baseDelay}
        className="relative z-10 mb-4 px-5 text-fg-muted sm:px-10"
      >
        <CellIcon />
      </Reveal>
      <Reveal
        delay={baseDelay + CONTENT_STEP_MS}
        className="relative z-10 mb-2 px-5 sm:px-10"
      >
        {/* Accent tick: neutral at rest, stretches and takes brand color as the title nudges right. */}
        <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-line transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-brand-yellow" />
        <h3 className="inline-block font-display text-lg font-semibold text-fg transition duration-200 group-hover/feature:translate-x-2">
          {title}
        </h3>
      </Reveal>
      <Reveal delay={baseDelay + 2 * CONTENT_STEP_MS} className="relative z-10">
        <p className="max-w-xs px-5 text-sm text-fg-muted sm:px-10">{body}</p>
      </Reveal>
    </div>
  );
}
