import Image from "next/image";
import { BRAND, HERO, NAV_LINKS, NAV_PRIMARY_LABEL } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Navbar() {
  return (
    // A floating pill rather than a full-bleed bar: the page canvas runs
    // behind and past it on both sides, which is what makes the blur read as
    // glass instead of as a solid header. Stays a Server Component — the
    // translucency is unconditional, so there is no scroll listener.
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 rounded-full border border-line bg-bg/70 pl-4 pr-2 shadow-lift backdrop-blur-xl sm:pl-5 sm:pr-3">
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
          <span className="font-display text-xl tracking-tight text-fg">
            {BRAND.name}
          </span>
        </a>

        <nav
          aria-label={NAV_PRIMARY_LABEL}
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-fg-muted transition-colors duration-200 hover:bg-surface-2 hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {/*
           * Hidden via a wrapper, not `className="hidden"` on the Button.
           * `cn` is a plain join with no conflict resolution, so a `hidden`
           * passed through className loses to the `inline-flex` in the
           * Button's own base classes and the CTA stays visible — which is
           * what pushed this pill wider than a 390px viewport.
           */}
          <div className="hidden md:block">
            <Button href={HERO.primaryCta.href} variant="primary" size="md">
              {HERO.primaryCta.label}
            </Button>
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
