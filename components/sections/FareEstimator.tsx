"use client";

import { useId, useState, type FormEvent } from "react";
import {
  BRAND,
  DISCLAIMER,
  ESTIMATOR,
  LOCALITIES,
  VEHICLE_TYPES,
  type VehicleTypeId,
} from "@/content/site";
import { estimateFare, type FareEstimate } from "@/lib/fare";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { AutocompleteInput } from "@/components/ui/AutocompleteInput";

type ErrorField = "pickup" | "drop" | "both";

interface EstimatorError {
  field: ErrorField;
  message: string;
}

/**
 * Mirrors normalise() in lib/fare.ts (trim, lowercase, collapse internal
 * whitespace) so the same-location check here agrees with the check
 * estimateFare performs internally. Duplicated rather than imported because
 * lib/fare.ts does not currently export it; if that ever changes, prefer
 * importing the shared helper instead of keeping this in sync by hand.
 */
function normaliseForComparison(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function FareEstimator() {
  const uid = useId();
  const pickupInputId = `${uid}-pickup`;
  const dropInputId = `${uid}-drop`;
  const vehicleSelectId = `${uid}-vehicle`;
  const errorId = `${uid}-error`;

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [vehicleId, setVehicleId] = useState<VehicleTypeId>("sedan");
  const [result, setResult] = useState<FareEstimate | null>(null);
  const [error, setError] = useState<EstimatorError | null>(null);
  // True once the user has submitted the form at least once. Deliberately
  // independent of `result`/`error`: clearing an input nulls `result` (see
  // handlePickupChange/handleDropChange below), so gating the ride-type
  // recompute on `result` being truthy would silently stop working the
  // moment a field is cleared — exactly the scenario (get an estimate, clear
  // Pickup, change the ride type) that recompute needs to keep validating.
  const [hasAttempted, setHasAttempted] = useState(false);

  /**
   * Runs the (already-validated) route through estimateFare. validateAndCompute
   * below is the only caller, so blank/identical pickup/drop is always
   * rejected with the specific field-level message before this ever runs. The
   * try/catch here is defensive: estimateFare's own InvalidRouteError should
   * be unreachable given that upstream validation, and vehicleId always comes
   * from VEHICLE_TYPES so its UnknownVehicleError should be unreachable too.
   * Every thrown value — including anything unexpected — deliberately
   * resolves to the same friendly fallback message, so no raw error message
   * or NaN can ever reach the DOM.
   */
  function computeEstimate(vehicle: VehicleTypeId, from: string, to: string) {
    try {
      const estimate = estimateFare(vehicle, from, to);
      setResult(estimate);
      setError(null);
    } catch {
      setResult(null);
      setError({ field: "both", message: ESTIMATOR.errors.generic });
    }
  }

  /**
   * Shared by both the submit button and the ride-type select: validates
   * pickup/drop first and only calls computeEstimate once the route is
   * well-formed. Without this, a path that skipped straight to
   * computeEstimate would fall through to estimateFare's own generic
   * InvalidRouteError instead of surfacing the specific "Add a pickup
   * point." / "Add a drop location." / same-location message.
   */
  function validateAndCompute(vehicle: VehicleTypeId, from: string, to: string) {
    const trimmedPickup = from.trim();
    const trimmedDrop = to.trim();

    if (!trimmedPickup) {
      setResult(null);
      setError({ field: "pickup", message: ESTIMATOR.errors.pickupRequired });
      return;
    }
    if (!trimmedDrop) {
      setResult(null);
      setError({ field: "drop", message: ESTIMATOR.errors.dropRequired });
      return;
    }
    if (normaliseForComparison(trimmedPickup) === normaliseForComparison(trimmedDrop)) {
      setResult(null);
      setError({ field: "both", message: ESTIMATOR.errors.sameLocation });
      return;
    }

    computeEstimate(vehicle, from, to);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasAttempted(true);
    validateAndCompute(vehicleId, pickup, drop);
  }

  function handleVehicleChange(id: VehicleTypeId) {
    setVehicleId(id);
    // Keep the form in sync with the new vehicle choice once the user has
    // tried to get an estimate at least once — recomputing (or re-validating)
    // instead of leaving a stale quote for the previously selected ride type.
    // Routed through the same validation handleSubmit uses, so e.g. clearing
    // Pickup and then changing the ride type surfaces the specific "Add a pickup
    // point." message rather than estimateFare's generic fallback, even
    // though clearing Pickup already nulled out any prior `result`.
    if (hasAttempted) {
      validateAndCompute(id, pickup, drop);
    }
  }

  function handlePickupChange(value: string) {
    setPickup(value);
    // Clear any previously displayed result: it was computed from the old
    // pickup value and no longer describes the route currently in the form.
    setResult(null);
  }

  function handleDropChange(value: string) {
    setDrop(value);
    // Same reasoning as handlePickupChange: a stale fare band left on screen
    // beneath inputs that didn't produce it is exactly the "no surprises"
    // pitch this site is undermining if left in place.
    setResult(null);
  }

  const pickupInvalid = error?.field === "pickup" || error?.field === "both";
  const dropInvalid = error?.field === "drop" || error?.field === "both";

  // Borderless field inside the bar. No focus:outline-none — the pill has no
  // per-field border, so the global :focus-visible ring is the only thing
  // marking which segment has focus. leading-tight + a lighter placeholder
  // keep the value line close under its micro-label.
  const fieldInput =
    "w-full rounded-sm border-0 bg-transparent p-0 text-sm leading-tight text-fg placeholder:text-fg-muted/70";

  // Small, quiet uppercase caption over each value — the compact search-bar
  // convention, and much tidier than a full-size label stacked on the input.
  const fieldLabel =
    "mb-0.5 block text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-fg-muted";

  // Horizontal rule between stacked segments, vertical once they sit in a row.
  const divider = "mx-4 h-px bg-line lg:mx-0 lg:h-7 lg:w-px";

  return (
    <div>
      <h2 className="sr-only">{ESTIMATOR.heading}</h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Rounded-3xl until the segments can sit on one row: a fully rounded
            pill around a stacked column would bow its own edges away from the
            fields inside it. */}
        <div className="rounded-3xl border border-line bg-surface p-1.5 shadow-lift-lg lg:rounded-full">
          <div className="flex flex-col lg:flex-row lg:items-center">
            <div className="min-w-0 flex-1 px-4 py-2 lg:px-5">
              <label htmlFor={pickupInputId} className={fieldLabel}>
                {ESTIMATOR.pickupLabel}
              </label>
              <AutocompleteInput
                id={pickupInputId}
                value={pickup}
                onChange={handlePickupChange}
                options={LOCALITIES}
                placeholder={ESTIMATOR.pickupPlaceholder}
                ariaInvalid={pickupInvalid}
                ariaDescribedBy={pickupInvalid ? errorId : undefined}
                className={fieldInput}
              />
            </div>

            <div aria-hidden="true" className={divider} />

            <div className="min-w-0 flex-1 px-4 py-2 lg:px-5">
              <label htmlFor={dropInputId} className={fieldLabel}>
                {ESTIMATOR.dropLabel}
              </label>
              <AutocompleteInput
                id={dropInputId}
                value={drop}
                onChange={handleDropChange}
                options={LOCALITIES}
                placeholder={ESTIMATOR.dropPlaceholder}
                ariaInvalid={dropInvalid}
                ariaDescribedBy={dropInvalid ? errorId : undefined}
                className={fieldInput}
              />
            </div>

            <div aria-hidden="true" className={divider} />

            {/*
             * A custom SelectMenu, not a native <select>: the browser's option
             * popup can't be themed and looked out of place. onChange still
             * routes through handleVehicleChange, so the recompute-on-change
             * behaviour and its validation are unchanged.
             */}
            <div className="min-w-0 px-4 py-2 lg:px-5">
              <label htmlFor={vehicleSelectId} className={fieldLabel}>
                {ESTIMATOR.rideTypeGroupLabel}
              </label>
              <SelectMenu
                id={vehicleSelectId}
                value={vehicleId}
                onChange={(v) => handleVehicleChange(v as VehicleTypeId)}
                options={VEHICLE_TYPES.map((vehicle) => ({
                  value: vehicle.id,
                  label: vehicle.label,
                }))}
              />
            </div>

            {/* Icon-only once the bar is a single row, where the labelled
                fields beside it make the intent obvious; below that the label
                is visible, since a lone circle at the foot of a stacked form
                reads as decoration. */}
            <button
              type="submit"
              className="mt-1.5 flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-brand-yellow text-sm font-medium text-ink transition-colors duration-200 hover:bg-brand-amber lg:ml-1 lg:mt-0 lg:h-10 lg:w-10"
            >
              <Icon name="search" className="h-[18px] w-[18px]" />
              <span className="lg:sr-only">{ESTIMATOR.submitLabel}</span>
            </button>
          </div>
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-4 text-center text-sm font-medium text-danger"
          >
            {error.message}
          </p>
        )}
      </form>

      {/* Always mounted (not conditionally rendered) so the aria-live region
          already exists in the DOM before its content ever changes — a
          region created at the same moment its content appears is exactly
          the case most screen readers fail to announce (see
          RideCategories.tsx for the same pattern). Un-styled and empty until
          a result exists, so nothing is visible when there's nothing to
          show. */}
      <div
        aria-live="polite"
        className={cn(
          "rounded-2xl",
          result && "mx-auto mt-6 max-w-md border border-line bg-surface p-5 text-center shadow-lift",
        )}
      >
        {result && (
          <>
            <p className="text-sm text-fg-muted">{ESTIMATOR.resultPrefix}</p>
            <p className="mt-1 font-display text-3xl text-fg">
              {formatCurrency(result.low, BRAND.currencySymbol)} – {formatCurrency(result.high, BRAND.currencySymbol)}
            </p>
            <p className="mt-1 text-sm text-fg-muted">
              {ESTIMATOR.distanceLabel(result.distanceKm)} &middot; {ESTIMATOR.etaLabel(result.etaMinutes)}
            </p>
            <p className="mt-4 text-xs text-fg-muted">{ESTIMATOR.demoNote}</p>
            <p className="mt-1 text-xs text-fg-muted">{DISCLAIMER}</p>
          </>
        )}
      </div>
    </div>
  );
}
