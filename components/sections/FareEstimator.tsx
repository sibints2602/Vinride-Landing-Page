"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import {
  BRAND,
  DISCLAIMER,
  ESTIMATOR,
  VEHICLE_TYPES,
  type VehicleTypeId,
} from "@/content/site";
import {
  estimateFare,
  fareForRoute,
  type FareEstimate,
} from "@/lib/fare";
import {
  MIN_QUERY_LENGTH,
  routeBetween,
  searchPlaces,
  type Place,
} from "@/lib/geo";
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

function normaliseForComparison(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * One address field: the typed text, the chosen Place (if any), live suggestions and a loading flag.
 * Selecting a suggestion pins `place`; typing again clears it so the next submit re-resolves.
 */
function usePlaceField() {
  const [text, setText] = useState("");
  const [place, setPlace] = useState<Place | null>(null);
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = text.trim();
    // A pinned place, or too-short input, means nothing to search.
    if (place || q.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    // Debounce so we hit Photon per pause, not per keystroke (also respects its rate limits).
    const timer = setTimeout(() => {
      searchPlaces(q, controller.signal)
        .then((results) => setSuggestions(results))
        .catch(() => setSuggestions([])) // network/abort → just show nothing
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [text, place]);

  return {
    text,
    place,
    suggestions,
    loading,
    type: (value: string) => {
      setPlace(null);
      setText(value);
    },
    select: (chosen: Place) => {
      setPlace(chosen);
      setText(chosen.label);
      setSuggestions([]);
    },
  };
}

export function FareEstimator() {
  const uid = useId();
  const pickupInputId = `${uid}-pickup`;
  const dropInputId = `${uid}-drop`;
  const vehicleSelectId = `${uid}-vehicle`;
  const errorId = `${uid}-error`;

  const pickup = usePlaceField();
  const drop = usePlaceField();
  const [vehicleId, setVehicleId] = useState<VehicleTypeId>("sedan");
  const [result, setResult] = useState<FareEstimate | null>(null);
  const [error, setError] = useState<EstimatorError | null>(null);
  const [computing, setComputing] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  /** Resolve a field to coordinates: use the pinned pick, else geocode the raw text and take the top hit. */
  async function resolvePlace(field: typeof pickup): Promise<Place | null> {
    if (field.place) return field.place;
    try {
      const [top] = await searchPlaces(field.text);
      return top ?? null;
    } catch {
      return null;
    }
  }

  /** Last resort when routing/geocoding is unavailable: the deterministic text-hash estimate. */
  function computeFallback(vehicle: VehicleTypeId, from: string, to: string) {
    try {
      setResult(estimateFare(vehicle, from, to));
      setError(null);
    } catch {
      setResult(null);
      setError({ field: "both", message: ESTIMATOR.errors.generic });
    }
  }

  /** Validate, then price a real OSRM route (falling back to the text estimate on any failure). */
  async function run(vehicle: VehicleTypeId) {
    const pickupText = pickup.text.trim();
    const dropText = drop.text.trim();

    if (!pickupText) {
      setResult(null);
      setError({ field: "pickup", message: ESTIMATOR.errors.pickupRequired });
      return;
    }
    if (!dropText) {
      setResult(null);
      setError({ field: "drop", message: ESTIMATOR.errors.dropRequired });
      return;
    }
    if (normaliseForComparison(pickupText) === normaliseForComparison(dropText)) {
      setResult(null);
      setError({ field: "both", message: ESTIMATOR.errors.sameLocation });
      return;
    }

    setError(null);
    setResult(null);
    setComputing(true);
    try {
      const [from, to] = await Promise.all([
        resolvePlace(pickup),
        resolvePlace(drop),
      ]);

      if (from && to) {
        const route = await routeBetween(from, to);
        setResult(fareForRoute(vehicle, route.distanceMiles, route.durationMinutes));
      } else {
        // Couldn't geocode one/both addresses — still give a stable estimate.
        computeFallback(vehicle, pickupText, dropText);
      }
    } catch {
      computeFallback(vehicle, pickupText, dropText);
    } finally {
      setComputing(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasAttempted(true);
    void run(vehicleId);
  }

  function handleVehicleChange(id: VehicleTypeId) {
    setVehicleId(id);
    // After a first attempt, re-price so a ride-type change never leaves a stale quote.
    if (hasAttempted) {
      void run(id);
    }
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
                value={pickup.text}
                onChange={(v) => {
                  pickup.type(v);
                  setResult(null);
                }}
                suggestions={pickup.suggestions}
                onSelect={(p) => {
                  pickup.select(p);
                  setResult(null);
                }}
                loading={pickup.loading}
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
                value={drop.text}
                onChange={(v) => {
                  drop.type(v);
                  setResult(null);
                }}
                suggestions={drop.suggestions}
                onSelect={(p) => {
                  drop.select(p);
                  setResult(null);
                }}
                loading={drop.loading}
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
              disabled={computing}
              aria-busy={computing}
              className="mt-1.5 flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-brand-yellow text-sm font-medium text-ink transition-colors duration-200 hover:bg-brand-amber disabled:opacity-70 lg:ml-1 lg:mt-0 lg:h-10 lg:w-10"
            >
              <Icon
                name="search"
                className={cn("h-[18px] w-[18px]", computing && "motion-safe:animate-spin")}
              />
              <span className="lg:sr-only">
                {computing ? ESTIMATOR.computingLabel : ESTIMATOR.submitLabel}
              </span>
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
          <div className="relative">
            {/* Dismiss the quote; clearing `result` collapses this card back to nothing. */}
            <button
              type="button"
              onClick={() => setResult(null)}
              aria-label={ESTIMATOR.dismissLabel}
              className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors duration-200 hover:bg-surface-2 hover:text-fg"
            >
              <Icon name="x" className="h-4 w-4" />
            </button>
            <p className="text-sm text-fg-muted">{ESTIMATOR.resultPrefix}</p>
            <p className="mt-1 font-display text-3xl text-fg">
              {formatCurrency(result.low, BRAND.currencySymbol)} – {formatCurrency(result.high, BRAND.currencySymbol)}
            </p>
            <p className="mt-1 text-sm text-fg-muted">
              {ESTIMATOR.distanceLabel(result.distanceMiles)} &middot; {ESTIMATOR.etaLabel(result.etaMinutes)}
            </p>
            <p className="mt-4 text-xs text-fg-muted">{ESTIMATOR.demoNote}</p>
            <p className="mt-1 text-xs text-fg-muted">{DISCLAIMER}</p>
            <p className="mt-1 text-xs text-fg-muted">{ESTIMATOR.attribution}</p>
          </div>
        )}
      </div>
    </div>
  );
}
