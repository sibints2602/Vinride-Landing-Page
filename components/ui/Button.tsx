import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "contrast";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  // Near-black text on yellow. Never white — it fails contrast.
  primary:
    "bg-brand-yellow text-ink hover:bg-brand-amber hover:text-ink shadow-sm",
  secondary:
    "bg-surface text-fg border border-line hover:border-brand-green",
  // bg-fg/text-bg inverts with the theme — the Uber-style solid button without hardcoded colours.
  contrast: "bg-fg text-bg hover:bg-fg/90 shadow-sm",
};

const SIZES: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

interface ButtonOwnProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
}

type AnchorButtonProps = ButtonOwnProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps> & {
    href: string;
  };

type NativeButtonProps = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> & {
    href?: undefined;
    // Anchor-only attrs rejected so the weak-union hole can't attach them to a <button>.
    target?: never;
    rel?: never;
    download?: never;
    hrefLang?: never;
    ping?: never;
    referrerPolicy?: never;
  };

// Discriminated on `href`: anchor props with it, button props without — no `any` involved.
export type ButtonProps = AnchorButtonProps | NativeButtonProps;

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  if (href) {
    const anchorProps = rest as Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      keyof ButtonOwnProps | "href"
    >;
    return (
      // suppressHydrationWarning: extensions stamp attrs like fdprocessedid before hydration.
      <a suppressHydrationWarning href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = rest as Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof ButtonOwnProps | "href"
  >;
  return (
    <button suppressHydrationWarning type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
