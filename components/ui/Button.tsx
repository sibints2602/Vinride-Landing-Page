import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  // Near-black text on yellow. Never white — it fails contrast.
  primary:
    "bg-brand-yellow text-ink hover:bg-brand-amber hover:text-ink shadow-sm",
  secondary:
    "bg-surface text-fg border border-line hover:border-brand-green",
  ghost: "text-fg hover:text-link",
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
  };

// Discriminated on `href`: pass it and you get honest anchor props
// (target, rel, aria-label, onClick, ...); omit it and you get honest
// button props (type, disabled, onClick, ...) — no `any` involved.
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
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = rest as Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof ButtonOwnProps | "href"
  >;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
