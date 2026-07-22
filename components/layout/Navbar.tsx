import { Fragment } from "react";
import Image from "next/image";
import { BRAND, HERO, NAV_LINKS, NAV_PRIMARY_LABEL } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Navbar() {
  return (
    // Borderless: no pill, no rule, no shadow — the nav sits directly on the
    // page canvas. Stays a Server Component; the treatment is unconditional,
    // so there is no scroll listener.
    <header className="fixed inset-x-0 top-0 z-50">
      {/*
       * The one concession to legibility. Without it, page content scrolls
       * underneath and collides with the nav labels. This is a gradient that
       * starts at the page background colour — so at rest it is invisible and
       * the nav reads as borderless — and fades to nothing well before its
       * lower edge, so there is never a visible boundary line. The mask
       * feathers the blur out on the same curve, otherwise backdrop-blur
       * terminates in a hard horizontal seam.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-bg from-35% via-bg/75 to-transparent backdrop-blur-sm [mask-image:linear-gradient(to_bottom,black_35%,transparent)]"
      />
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5 rounded-full transition-opacity duration-200 hover:opacity-80"
        >
          {/* Decorative: the wordmark beside it already names the link, and a
              second "Vinride" would make screen readers say it twice. */}
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

        {/* Everything but the logo lives in this right-aligned group (logo
            left, nav + actions right — the Uber arrangement), rather than the
            nav floating in the centre. */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
          {/* Plain bold text links separated by thin vertical rules rather
              than hover pills. The divider is a sibling element per gap (not a
              border) so the first link has none. */}
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
            {/*
             * Hidden via a wrapper, not `className="hidden"` on the Button.
             * `cn` is a plain join with no conflict resolution, so a `hidden`
             * passed through className loses to the `inline-flex` in the
             * Button's own base classes and the CTA stays visible.
             *
             * `contrast` (near-black in light mode, near-white in dark) instead
             * of the yellow primary, matching the reference's solid dark nav
             * button. The brand yellow still leads inside the hero.
             */}
            <div className="hidden md:block">
              <Button href={HERO.primaryCta.href} variant="contrast" size="md">
                {HERO.primaryCta.label}
              </Button>
            </div>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
