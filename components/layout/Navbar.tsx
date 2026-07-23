import { Fragment } from "react";
import Image from "next/image";
import { BRAND, HERO, NAV_LINKS, NAV_PRIMARY_LABEL } from "@/content/site";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Navbar() {
  return (
    // Borderless nav on the page canvas — unconditional, so no scroll listener needed.
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Fading gradient scrim keeps nav labels legible; mask feathers the blur to avoid a seam. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-bg from-35% via-bg/75 to-transparent backdrop-blur-sm [mask-image:linear-gradient(to_bottom,black_35%,transparent)]"
      />
      {/* Load animation lives on this inner row so the gradient scrim above stays put. */}
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 motion-safe:animate-nav-in sm:px-6 lg:px-8">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5 rounded-full transition-opacity duration-200 hover:opacity-80"
        >
          {/* Decorative: the wordmark already names the link, so alt="" avoids double announcement. */}
          <Image
            src={BRAND.logoSrc}
            alt=""
            width={36}
            height={36}
            loading="eager"
            fetchPriority="high"
            className="h-9 w-9"
          />
          <span className="font-display text-xl font-semibold tracking-tight text-fg">
            {BRAND.name}
          </span>
        </a>

        {/* Logo left, nav + actions right (the Uber arrangement), not a centred nav. */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
          {/* Divider is a sibling element per gap (not a border) so the first link has none. */}
          <nav
            aria-label={NAV_PRIMARY_LABEL}
            className="hidden items-center md:flex"
          >
            {NAV_LINKS.map((link, i) => (
              <Fragment key={link.href}>
                {i > 0 && (
                  <span aria-hidden="true" className="h-3.5 w-px bg-line" />
                )}
                <a
                  href={link.href}
                  className="px-4 text-sm font-semibold text-fg-muted transition-colors duration-200 hover:text-fg"
                >
                  {link.label}
                </a>
              </Fragment>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            {/* Transparent border reserves hover-pill space; hover:bg-ink keeps white text legible. */}
            <a
              href={HERO.primaryCta.href}
              className="hidden h-10 items-center justify-center rounded-full border border-transparent px-4 text-sm font-semibold text-brand-yellow transition-colors duration-200 hover:border-brand-yellow hover:bg-ink hover:text-white md:inline-flex"
            >
              {HERO.primaryCta.label}
            </a>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
