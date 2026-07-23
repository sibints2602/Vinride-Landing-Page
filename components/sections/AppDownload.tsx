import Image from "next/image";
import { APP_DOWNLOAD } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Reveal, REVEAL_STAGGER_MS } from "@/components/ui/Reveal";
import orderRideImage from "@/public/ride/Order ride-pana.png";

/** Maps each store's platform name to its brand glyph in Icon.tsx. */
const STORE_ICON: Record<string, string> = {
  "Google Play": "google-play",
  "App Store": "apple",
};

/** No live store listing yet — deliberately an inert div (not a link/button) so it can't mislead. */
function StoreBadge({ platform, state }: { platform: string; state: string }) {
  const iconName = STORE_ICON[platform] ?? "pin";
  const stateLabel = APP_DOWNLOAD.stateLabels[state] ?? APP_DOWNLOAD.unknownStateFallback;

  return (
    <div
      aria-disabled="true"
      className="flex items-center gap-3 rounded-sm border border-ink/20 bg-ink/5 px-4 py-3"
    >
      <Icon name={iconName} className="h-7 w-7 text-ink" />
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-ink">{platform}</span>
        <span className="text-xs font-medium text-ink">{stateLabel}</span>
      </span>
    </div>
  );
}

/** Download banner on a yellow→amber gradient — all text must stay `text-ink` for AA contrast. */
export function AppDownload() {
  return (
    <section
      id="download"
      className="relative overflow-hidden bg-linear-to-br from-brand-yellow to-brand-amber"
    >
      {/* Soft light pooling in the top corner keeps the fill from reading flat; decorative only */}
      <div
        aria-hidden
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 sm:px-6 sm:pt-14 lg:grid-cols-2 lg:px-8">
        {/* Staggered entrance: heading → subheading → badges → illustration, same cadence as elsewhere */}
        <div className="relative flex flex-col items-start gap-6 pb-12 sm:pb-14">
          <Reveal variant="mask">
            <h2 className="font-display text-3xl text-ink sm:text-4xl lg:text-5xl">
              {APP_DOWNLOAD.heading}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-md text-base text-ink sm:text-lg">
              {APP_DOWNLOAD.subheading}
            </p>
          </Reveal>

          <div className="flex flex-wrap gap-4">
            {APP_DOWNLOAD.stores.map((store, index) => (
              <Reveal key={store.platform} delay={220 + index * REVEAL_STAGGER_MS}>
                <StoreBadge platform={store.platform} state={store.state} />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={220 + APP_DOWNLOAD.stores.length * REVEAL_STAGGER_MS} className="self-end">
          <Image
            src={orderRideImage}
            alt=""
            sizes="(min-width: 1024px) 28rem, 80vw"
            className="relative mx-auto w-full max-w-sm lg:max-w-md"
          />
        </Reveal>
      </div>
    </section>
  );
}
