import { APP_DOWNLOAD } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Maps each store's platform name to its brand glyph in Icon.tsx.
 */
const STORE_ICON: Record<string, string> = {
  "Google Play": "google-play",
  "App Store": "apple",
};

/**
 * Display text for each store's lifecycle state, derived from the content
 * model's `state` field rather than invented copy. Today only "coming-soon"
 * exists in content/site.ts; the fallback keeps this from silently rendering
 * nothing if a future state is added there.
 */
const STATE_LABEL: Record<string, string> = {
  "coming-soon": "Coming soon",
};

/**
 * Vinride has no live App Store or Play Store listing yet, so this can never
 * be an <a> or <button> — a dead `href="#"` styled as a store button would
 * mislead riders into thinking the app already exists. It's a plain, inert
 * div: no tabindex (not focusable), aria-disabled to tell assistive tech it's
 * inactive, and a visible "Coming soon" label so sighted users get the same
 * signal.
 */
function StoreBadge({ platform, state }: { platform: string; state: string }) {
  const iconName = STORE_ICON[platform] ?? "pin";
  const stateLabel = STATE_LABEL[state] ?? state;

  return (
    <div
      aria-disabled="true"
      className="flex items-center gap-3 rounded-2xl border border-ink/20 bg-ink/5 px-4 py-3"
    >
      <Icon name={iconName} className="h-7 w-7 text-ink" />
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-ink">{platform}</span>
        <span className="text-xs font-medium text-ink">{stateLabel}</span>
      </span>
    </div>
  );
}

/**
 * Abstract booking-screen phone mockup, built entirely from brand-gradient
 * and token fills — the project has no screenshots or photography. Purely
 * decorative (aria-hidden); the heading/subheading/badges beside it already
 * carry the section's meaning.
 */
function PhoneMockup() {
  return (
    <svg
      viewBox="0 0 300 420"
      className="mx-auto h-auto w-full max-w-[260px]"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="10" y="10" width="280" height="400" rx="36" className="fill-ink" />
      <rect x="130" y="26" width="40" height="6" rx="3" className="fill-surface" opacity="0.5" />
      <rect x="22" y="40" width="256" height="346" rx="20" fill="var(--color-brand-forest)" />

      <g stroke="var(--color-brand-green)" strokeOpacity="0.35" strokeWidth="1">
        <line x1="22" y1="130" x2="278" y2="130" />
        <line x1="22" y1="190" x2="278" y2="190" />
        <line x1="94" y1="40" x2="94" y2="386" />
        <line x1="194" y1="40" x2="194" y2="386" />
      </g>

      <path
        d="M60 320 Q120 220 150 200 T230 100"
        fill="none"
        stroke="var(--color-brand-yellow)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="230" cy="100" r="9" fill="var(--color-brand-yellow)" />
      <circle cx="60" cy="320" r="7" fill="var(--color-brand-green-strong)" />

      <rect x="38" y="330" width="224" height="72" rx="14" className="fill-surface" opacity="0.96" />
      <rect x="54" y="346" width="96" height="10" rx="5" className="fill-ink" opacity="0.75" />
      <rect x="54" y="364" width="144" height="8" rx="4" className="fill-ink" opacity="0.35" />
      <rect x="204" y="346" width="42" height="28" rx="14" fill="var(--color-brand-yellow)" />
    </svg>
  );
}

/**
 * Download banner. This is the highest-risk contrast spot on the page: the
 * fill is `bg-gradient-to-br from-brand-yellow to-brand-amber`, so every
 * text element must be `text-ink` (near-black) — measured against both
 * gradient endpoints (#F5B301 and #EF7D00) at >= 10.2:1 and >= 6.8:1
 * respectively, well past the 4.5:1 AA floor. White text here would fail. No
 * Card is used for the badges: Card's tones keep text-fg/text-link, which
 * are theme-dependent and not guaranteed to stay ink-safe on this fill.
 */
export function AppDownload() {
  return (
    <section id="download" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="grid items-center gap-12 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-yellow to-brand-amber p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          <div className="flex flex-col items-start gap-6">
            <h2 className="font-display text-3xl text-ink sm:text-4xl lg:text-5xl">
              {APP_DOWNLOAD.heading}
            </h2>
            <p className="max-w-md text-base text-ink sm:text-lg">
              {APP_DOWNLOAD.subheading}
            </p>

            <div className="flex flex-wrap gap-4">
              {APP_DOWNLOAD.stores.map((store) => (
                <StoreBadge key={store.platform} platform={store.platform} state={store.state} />
              ))}
            </div>
          </div>

          <PhoneMockup />
        </div>
      </Reveal>
    </section>
  );
}
