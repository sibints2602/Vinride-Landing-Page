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
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";

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
  const errorId = `${uid}-error`;
  const localitiesDatalistId = `${uid}-localities`;

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [vehicleId, setVehicleId] = useState<VehicleTypeId>("sedan");
  const [result, setResult] = useState<FareEstimate | null>(null);
  const [error, setError] = useState<EstimatorError | null>(null);
  // True once the user has submitted the form at least once. Deliberately
  // independent of `result`/`error`: clearing an input nulls `result` (see
  // handlePickupChange/handleDropChange below), so gating the vehicle-chip
  // recompute on `result` being truthy would silently stop working the
  // moment a field is cleared — exactly the scenario (get an estimate, clear
  // Pickup, click a chip) that recompute needs to keep validating.
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
   * Shared by both the submit button and the ride-type chips: validates
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
    // Pickup and then clicking a chip surfaces the specific "Add a pickup
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

  return (
    <div>
      <h2 className="font-display text-xl text-fg">{ESTIMATOR.heading}</h2>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-5">
        <div role="group" aria-label={ESTIMATOR.rideTypeGroupLabel} className="flex flex-wrap gap-2">
          {VEHICLE_TYPES.map((vehicle) => (
            <Chip
              key={vehicle.id}
              selected={vehicleId === vehicle.id}
              onClick={() => handleVehicleChange(vehicle.id)}
            >
              {vehicle.label}
            </Chip>
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label htmlFor={pickupInputId} className="block text-sm font-medium text-fg">
              {ESTIMATOR.pickupLabel}
            </label>
            <input
              id={pickupInputId}
              type="text"
              list={localitiesDatalistId}
              value={pickup}
              onChange={(event) => handlePickupChange(event.target.value)}
              placeholder={ESTIMATOR.pickupPlaceholder}
              aria-invalid={pickupInvalid || undefined}
              aria-describedby={pickupInvalid ? errorId : undefined}
              className="mt-1.5 h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-fg placeholder:text-fg-muted"
            />
          </div>

          <div className="flex-1">
            <label htmlFor={dropInputId} className="block text-sm font-medium text-fg">
              {ESTIMATOR.dropLabel}
            </label>
            <input
              id={dropInputId}
              type="text"
              list={localitiesDatalistId}
              value={drop}
              onChange={(event) => handleDropChange(event.target.value)}
              placeholder={ESTIMATOR.dropPlaceholder}
              aria-invalid={dropInvalid || undefined}
              aria-describedby={dropInvalid ? errorId : undefined}
              className="mt-1.5 h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-fg placeholder:text-fg-muted"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full lg:w-auto">
            {ESTIMATOR.submitLabel}
          </Button>
        </div>

        <datalist id={localitiesDatalistId}>
          {LOCALITIES.map((locality) => (
            <option key={locality} value={locality} />
          ))}
        </datalist>

        {error && (
          <p id={errorId} role="alert" className="text-sm font-medium text-danger">
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
        className={cn("rounded-xl", result && "mt-6 border border-line bg-surface-2 p-5")}
      >
        {result && (
          <>
            <p className="text-sm text-fg-muted">{ESTIMATOR.resultPrefix}</p>
            <p className="mt-1 font-display text-2xl text-fg">
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
