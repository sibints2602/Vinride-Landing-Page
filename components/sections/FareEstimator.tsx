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

/** Mirrors normalise() in lib/fare.ts (not exported there) so both same-location checks agree. */
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
  // True once submitted; kept separate from `result`, which clearing an input nulls.
  const [hasAttempted, setHasAttempted] = useState(false);

  /** Runs the pre-validated route through estimateFare; defensive catch keeps raw errors out of the DOM. */
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

  /** Shared by submit and ride-type select: validates first so field-specific messages beat the generic one. */
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
    // After a first attempt, re-validate/recompute so a ride-type change never leaves a stale quote.
    if (hasAttempted) {
      validateAndCompute(id, pickup, drop);
    }
  }

  function handlePickupChange(value: string) {
    setPickup(value);
    // Clear the result: it was computed from the old pickup value.
    setResult(null);
  }

  function handleDropChange(value: string) {
    setDrop(value);
    // Same as handlePickupChange: never leave a stale fare band under changed inputs.
    setResult(null);
  }

  const pickupInvalid = error?.field === "pickup" || error?.field === "both";
  const dropInvalid = error?.field === "drop" || error?.field === "both";

  // Borderless field in the pill: the global :focus-visible ring is the only focus marker.
  const fieldInput =
    "w-full rounded-sm border-0 bg-transparent p-0 text-sm leading-tight text-fg placeholder:text-fg-muted/70 focus:outline-none focus-visible:outline-none";

  // Small quiet uppercase caption over each value — the compact search-bar convention.
  const fieldLabel =
    "mb-0.5 block text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-fg-muted";

  // Horizontal rule between stacked segments, vertical once they sit in a row.
  const divider = "mx-4 h-px bg-line lg:mx-0 lg:h-7 lg:w-px";

  return (
    <div>
      <h2 className="sr-only">{ESTIMATOR.heading}</h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Rounded-3xl until segments sit on one row: a full pill would bow away from stacked fields. */}
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

            {/* Custom SelectMenu, not native <select>: the browser popup can't be themed. */}
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

            {/* Icon-only on the single-row bar; the label stays visible when the form is stacked. */}
            <button
              // Extension-stamped attributes (fdprocessedid) — see AutocompleteInput.
              suppressHydrationWarning
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

      {/* Always mounted so the aria-live region exists before content changes — else screen readers miss it. */}
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
