import { BRAND, DISCLAIMER, FARES_SECTION, FARE_RATES, VEHICLE_TYPES } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const VEHICLE_LABELS = new Map(VEHICLE_TYPES.map((vehicle) => [vehicle.id, vehicle.label]));

/**
 * Defensive lookup: a FARE_RATES entry whose vehicleId has no match in
 * VEHICLE_TYPES is dropped rather than rendered with an "undefined" label.
 * Every current entry matches; this only guards against future drift between
 * the two lists.
 */
const FARE_ROWS = FARE_RATES.flatMap((rate) => {
  const label = VEHICLE_LABELS.get(rate.vehicleId);
  return label ? [{ ...rate, label }] : [];
});

function formatAmount(value: number): string {
  return `${BRAND.currencySymbol}${value}`;
}

const NUMERIC_HEADER_CLASS =
  "border-b border-line px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted sm:text-right";
const NUMERIC_CELL_CLASS = "px-4 py-3 text-left tabular-nums text-fg sm:text-right";

export function FareTable() {
  return (
    <section id="fares" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <SectionHeading
        align="center"
        eyebrow={FARES_SECTION.eyebrow}
        heading={FARES_SECTION.heading}
        subheading={FARES_SECTION.subheading}
        className="mx-auto"
      />

      <Reveal className="mt-12">
        {/*
          The table's natural width can exceed a 320-375px viewport. Rather
          than let that overflow the page, this div is the sole horizontal
          scroll container (overflow-x-auto) and is independently focusable
          (role="region" + tabIndex) so keyboard users without a trackpad can
          still reach the scrolled-off columns. Its own focus ring is drawn
          outside its border box and is not clipped by its own overflow —
          only an *ancestor* with overflow-hidden could clip it, and none
          exists here.
        */}
        <div
          role="region"
          aria-label={FARES_SECTION.heading}
          tabIndex={0}
          className="overflow-x-auto rounded-2xl border border-line bg-surface"
        >
          <table className="w-full min-w-[640px] border-collapse text-sm sm:text-base">
            <caption className="sr-only">{FARES_SECTION.heading}</caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="border-b border-line px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted"
                >
                  {FARES_SECTION.columns.vehicle}
                </th>
                <th scope="col" className={NUMERIC_HEADER_CLASS}>
                  {FARES_SECTION.columns.base}
                </th>
                <th scope="col" className={NUMERIC_HEADER_CLASS}>
                  {FARES_SECTION.columns.perKm}
                </th>
                <th scope="col" className={NUMERIC_HEADER_CLASS}>
                  {FARES_SECTION.columns.perMinute}
                </th>
                <th scope="col" className={NUMERIC_HEADER_CLASS}>
                  {FARES_SECTION.columns.minimum}
                </th>
              </tr>
            </thead>
            <tbody>
              {FARE_ROWS.map((row, index) => (
                <tr key={row.vehicleId} className={index % 2 === 1 ? "bg-surface-2" : undefined}>
                  <th scope="row" className="px-4 py-3 text-left font-medium text-fg">
                    {row.label}
                  </th>
                  <td className={NUMERIC_CELL_CLASS}>{formatAmount(row.baseFare)}</td>
                  <td className={NUMERIC_CELL_CLASS}>{formatAmount(row.perKm)}</td>
                  <td className={NUMERIC_CELL_CLASS}>{formatAmount(row.perMinute)}</td>
                  <td className={NUMERIC_CELL_CLASS}>{formatAmount(row.minimumFare)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <p className="mt-4 flex items-center gap-2 text-sm text-fg-muted">
        <Icon name="check" className="h-4 w-4 shrink-0 text-brand-green" />
        {FARES_SECTION.noSurgeNote}
      </p>
      <p className="mt-2 text-xs text-fg-muted">{DISCLAIMER}</p>
    </section>
  );
}
