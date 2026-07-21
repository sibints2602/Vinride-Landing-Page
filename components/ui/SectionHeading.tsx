import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Align = "left" | "center";
type HeadingLevel = "h2" | "h3";

export interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: Align;
  as?: HeadingLevel;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  subheading,
  align = "left",
  as: HeadingTag = "h2",
  className,
}: SectionHeadingProps): ReactNode {
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
      {eyebrow ? (
        <span className="text-sm font-semibold uppercase tracking-wide text-link">
          {eyebrow}
        </span>
      ) : null}
      <HeadingTag className="font-display text-3xl text-fg md:text-4xl lg:text-5xl">
        {heading}
      </HeadingTag>
      {subheading ? (
        <p className="max-w-2xl text-fg-muted">{subheading}</p>
      ) : null}
    </div>
  );
}
