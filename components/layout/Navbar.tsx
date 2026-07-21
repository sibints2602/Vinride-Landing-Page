import Image from "next/image";
import { BRAND, HERO, NAV_LINKS, NAV_PRIMARY_LABEL } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex shrink-0 items-center">
          <Image
            src={BRAND.logoSrc}
            alt={BRAND.name}
            width={32}
            height={32}
            loading="eager"
            fetchPriority="high"
          />
        </a>

        <nav aria-label={NAV_PRIMARY_LABEL} className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-fg-muted transition-colors duration-200 hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            href={HERO.primaryCta.href}
            variant="primary"
            size="md"
            className="hidden md:inline-flex"
          >
            {HERO.primaryCta.label}
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
