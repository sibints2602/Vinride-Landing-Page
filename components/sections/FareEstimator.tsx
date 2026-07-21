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
import {
  estimateFare,
  InvalidRouteError,
  UnknownVehicleError,
  type FareEstimate,
} from "@/lib/fare";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";

type ErrorField = "pickup" | "drop" | "both";

interface EstimatorError {
  field: ErrorField;
  message: string;
}

const LOCALITIES_DATALIST_ID = "vinride-localities";

export function FareEstimator() {
  const uid = useId();
  const pickupInputId = `${uid}-pickup`;
  const dropInputId = `${uid}-drop`;
  const errorId = `${uid}-error`;

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [vehicleId, setVehicleId] = useState<VehicleTypeId>("sedan");
  const [result, setResult] = useState<FareEstimate | null>(null);
  const [error, setError] = useState<EstimatorError | null>(null);

  /**
   * Runs the (already-validated) route through estimateFare. The try/catch
   * here is defensive: our own validation above already rejects blank or
   * identical pickup/drop before this is ever called, so InvalidRouteError
   * should be unreachable, and vehicleId always comes from VEHICLE_TYPES so
   * UnknownVehicleError should be unreachable too. Still, estimateFare's
   * contract says it throws, and a raw Error/NaN must never reach the DOM.
   */
  function computeEstimate(vehicle: VehicleTypeId, from: string, to: string) {
    try {
      const estimate = estimateFare(vehicle, from, to);
      setResult(estimate);
      setError(null);
    } catch (err) {
      setResult(null);
      if (err instanceof InvalidRouteError || err instanceof UnknownVehicleError) {
        setError({ field: "both", message: ESTIMATOR.errors.generic });
      } else {
        setError({ field: "both", message: ESTIMATOR.errors.generic });
      }
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedPickup = pickup.trim();
    const trimmedDrop = drop.trim();

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
    if (trimmedPickup.toLowerCase() === trimmedDrop.toLowerCase()) {
      setResult(null);
      setError({ field: "both", message: ESTIMATOR.errors.sameLocation });
      return;
    }

    computeEstimate(vehicleId, pickup, drop);
  }

  function handleVehicleChange(id: VehicleTypeId) {
    setVehicleId(id);
    // Keep an already-displayed result in sync with the new vehicle choice
    // instead of leaving a stale quote for the previously selected ride type.
    if (result) {
      computeEstimate(id, pickup, drop);
    }
  }

  const pickupInvalid = error?.field === "pickup" || error?.field === "both";
  const dropInvalid = error?.field === "drop" || error?.field === "both";

  return (
    <div>
      <h2 className="font-display text-xl text-fg">{ESTIMATOR.heading}</h2>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-5">
        <div role="group" aria-label="Ride type" className="flex flex-wrap gap-2">
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
              list={LOCALITIES_DATALIST_ID}
              value={pickup}
              onChange={(event) => setPickup(event.target.value)}
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
              list={LOCALITIES_DATALIST_ID}
              value={drop}
              onChange={(event) => setDrop(event.target.value)}
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

        <datalist id={LOCALITIES_DATALIST_ID}>
          {LOCALITIES.map((locality) => (
            <option key={locality} value={locality} />
          ))}
        </datalist>

        {error && (
          <p id={errorId} role="alert" className="text-sm font-medium text-brand-amber">
            {error.message}
          </p>
        )}
      </form>

      {result && (
        <div aria-live="polite" className="mt-6 rounded-xl border border-line bg-surface-2 p-5">
          <p className="text-sm text-fg-muted">{ESTIMATOR.resultPrefix}</p>
          <p className="mt-1 font-display text-2xl text-fg">
            {BRAND.currencySymbol}
            {result.low} – {BRAND.currencySymbol}
            {result.high}
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            {result.distanceKm} km &middot; ~{result.etaMinutes} min
          </p>
          <p className="mt-4 text-xs text-fg-muted">{ESTIMATOR.demoNote}</p>
          <p className="mt-1 text-xs text-fg-muted">{DISCLAIMER}</p>
        </div>
      )}
    </div>
  );
}
