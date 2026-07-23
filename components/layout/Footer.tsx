import Image from "next/image";
import { BRAND, CITIES, FOOTER, FOOTER_COLUMNS } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { LetterMark } from "@/components/ui/LetterMark";
import { Reveal, REVEAL_STAGGER_MS } from "@/components/ui/Reveal";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="mx-auto max-w-6xl px-4 pb-6 pt-12 sm:px-6 sm:pt-14 lg:px-8">
        <h2 className="sr-only">{FOOTER.heading}</h2>
        {/* Per-line reveals offset per column so the grid cascades down-and-across. */}
        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Mobile: the stacked columns leave the right rail empty, so the wordmark
              runs vertically down it instead of bleeding off the page bottom. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 flex select-none items-center overflow-hidden sm:hidden"
          >
            <p className="whitespace-nowrap font-display text-[52vw] font-bold leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_var(--color-line)] [writing-mode:vertical-rl]">
              <LetterMark text={BRAND.name.toLowerCase()} step={250} tailFade={1} />
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Reveal>
              <div className="flex items-center gap-2.5">
                <Image src={BRAND.logoSrc} alt="" width={32} height={32} className="h-8 w-8" />
                <span className="font-display text-xl font-semibold tracking-tight text-fg">
                  {BRAND.name}
                </span>
              </div>
            </Reveal>

            <Reveal delay={REVEAL_STAGGER_MS}>
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
            </Reveal>
          </div>

          {FOOTER_COLUMNS.map((column, index) => {
            const base = (index + 1) * REVEAL_STAGGER_MS;
            return (
              <nav key={column.heading} aria-label={column.heading}>
                <Reveal delay={base}>
                  <h3 className="text-sm font-semibold text-fg">{column.heading}</h3>
                </Reveal>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={link.label}>
                      <Reveal delay={base + (linkIndex + 1) * REVEAL_STAGGER_MS}>
                        <a
                          href={link.href}
                          className="text-sm text-fg-muted transition-colors duration-200 hover:text-fg"
                        >
                          {link.label}
                        </a>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </nav>
            );
          })}
        </div>

        <div id="cities" className="mt-12 border-t border-line pt-10">
          <Reveal>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-fg-muted">
              {FOOTER.citiesHeading}
            </h3>
          </Reveal>
          <Reveal delay={REVEAL_STAGGER_MS}>
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
          </Reveal>
        </div>

        <Reveal delay={REVEAL_STAGGER_MS}>
          <div className="mt-10 border-t text-center border-line pt-8">
            <p className="text-sm text-fg-muted">{FOOTER.copyright}</p>
          </div>
        </Reveal>
      </div>

      {/* Decorative giant outline wordmark bleeding off the page bottom; full-bleed on purpose.
          Hidden on mobile, where the vertical right-rail copy above replaces it. */}
      <div aria-hidden className="pointer-events-none hidden h-[14vw] select-none overflow-hidden sm:block">
        {/* Negative top margin swallows the line box's ascent so letter tops hug the copyright row. */}
        <p className="-mt-[3.5vw] whitespace-nowrap text-center font-display text-[24vw] font-bold leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_var(--color-line)]">
          {/* tailFade 1 = uniform stroke, no dissolving tail; 250ms step so letters land one by one. */}
          <LetterMark text={BRAND.name.toLowerCase()} step={250} tailFade={1} />
        </p>
      </div>
    </footer>
  );
}
