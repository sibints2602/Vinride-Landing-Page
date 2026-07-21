import Image from "next/image";
import { BRAND, CITIES, FOOTER, FOOTER_COLUMNS } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Visually hidden: gives the <h3> column headings and the "Cities
            we serve" <h3> below a proper <h2> ancestor of their own, instead
            of nesting under AppDownload's <h2> (the last visible heading
            before the footer in document order). */}
        <h2 className="sr-only">{FOOTER.heading}</h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-4">
            <Image src={BRAND.logoSrc} alt={BRAND.name} width={32} height={32} />
            <p className="max-w-xs text-sm text-fg-muted">{FOOTER.blurb}</p>

            <div className="flex items-center gap-3">
              {FOOTER.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-muted transition-colors duration-200 hover:border-brand-green hover:text-fg"
                >
                  <Icon name={social.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              {/* font-sans: these are 14px UI labels, not display type. The
                  serif has no bold cut, so leaving them on --font-display
                  would hand font-semibold to the browser to synthesise. */}
              <h3 className="font-sans text-sm font-semibold text-fg">
                {column.heading}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-fg-muted transition-colors duration-200 hover:text-fg"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div id="cities" className="mt-12 border-t border-line pt-10">
          <h3 className="font-sans text-sm font-semibold uppercase tracking-wide text-fg-muted">
            {FOOTER.citiesHeading}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-y-2 text-sm text-fg-muted">
            {CITIES.map((city, index) => (
              <li key={city} className="flex items-center">
                {city}
                {index < CITIES.length - 1 ? (
                  <span aria-hidden="true" className="mx-2 text-fg-muted/50">
                    &middot;
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 border-t border-line pt-8">
          <p className="text-sm text-fg-muted">{FOOTER.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
