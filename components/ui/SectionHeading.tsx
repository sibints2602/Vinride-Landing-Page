import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Align = "left" | "center";
type HeadingLevel = "h2" | "h3";
type Size = "md" | "sm";

/** Heading type scale per size — "md" is the default; "sm" is for compact sections. */
const HEADING_SIZES: Record<Size, string> = {
  md: "text-3xl md:text-4xl lg:text-5xl",
  sm: "text-2xl md:text-3xl lg:text-4xl",
};

export interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: Align;
  as?: HeadingLevel;
  size?: Size;
  className?: string;
  /** Scroll-triggered entrance (eyebrow, masked heading, subheading); off by default. */
  animate?: boolean;
}

export function SectionHeading({
  eyebrow,
  heading,
  subheading,
  align = "left",
  as: HeadingTag = "h2",
  size = "md",
  className,
  animate = false,
}: SectionHeadingProps): ReactNode {
  const eyebrowEl = eyebrow ? (
    <span className="text-sm font-semibold uppercase tracking-wide text-link">
      {eyebrow}
    </span>
  ) : null;
  const headingEl = (
    <HeadingTag className={cn("font-display text-fg", HEADING_SIZES[size])}>
      {heading}
    </HeadingTag>
  );
  const subheadingEl = subheading ? (
    <p className="max-w-2xl text-fg-muted">{subheading}</p>
  ) : null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center"
          ? "items-center text-center"
          : "items-start text-left",
        className,
      )}
    >
      {animate ? (
        <>
          {eyebrowEl ? <Reveal>{eyebrowEl}</Reveal> : null}
          <Reveal variant="mask" delay={100}>
            {headingEl}
          </Reveal>
          {subheadingEl ? <Reveal delay={220}>{subheadingEl}</Reveal> : null}
        </>
      ) : (
        <>
          {eyebrowEl}
          {headingEl}
          {subheadingEl}
        </>
      )}
    </div>
  );
}
