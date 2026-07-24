import { FARE_RATES, type FareRate, type VehicleTypeId } from "@/content/site";

export class UnknownVehicleError extends Error {
  constructor(vehicleId: string) {
    super(`Unknown vehicle type: ${vehicleId}`);
    this.name = "UnknownVehicleError";
  }
}

export class InvalidRouteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidRouteError";
  }
}

export interface FareEstimate {
  distanceMiles: number;
  etaMinutes: number;
  low: number;
  high: number;
}

const MIN_MI = 1.2;
const MAX_MI = 18;
/** Average city speed in mph, used to derive a trip duration when we only have a distance. */
const AVG_SPEED_MPH = 14;
/** The quote is presented as a ±8% band rather than a single false-precision number. */
const BAND = 0.08;

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Fallback only: a deterministic route hash so free-typed quotes stay stable when routing is unavailable. */
function pseudoDistanceMiles(pickup: string, drop: string): number {
  const route = `${normalise(pickup)}->${normalise(drop)}`;
  let hash = 2166136261;
  for (let i = 0; i < route.length; i += 1) {
    hash ^= route.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const span = MAX_MI - MIN_MI;
  const offset = Math.abs(hash) % Math.round(span * 10);
  return MIN_MI + offset / 10;
}

function findRate(vehicleId: VehicleTypeId): FareRate {
  const rate = FARE_RATES.find((entry) => entry.vehicleId === vehicleId);
  if (!rate) {
    throw new UnknownVehicleError(vehicleId);
  }
  return rate;
}

/** Turn a distance/duration into a banded fare — the single pricing formula both paths share. */
function buildEstimate(
  rate: FareRate,
  distanceMiles: number,
  etaMinutes: number,
): FareEstimate {
  const raw =
    rate.baseFare + distanceMiles * rate.perMile + etaMinutes * rate.perMinute;
  const fare = Math.max(raw, rate.minimumFare);

  return {
    distanceMiles: Math.round(distanceMiles * 10) / 10,
    etaMinutes,
    low: Math.max(rate.minimumFare, Math.round(fare * (1 - BAND))),
    high: Math.round(fare * (1 + BAND)),
  };
}

/** Real path: price a genuine driving distance + duration from OSRM. */
export function fareForRoute(
  vehicleId: VehicleTypeId,
  distanceMiles: number,
  durationMinutes: number,
): FareEstimate {
  const rate = findRate(vehicleId);
  const etaMinutes = Math.max(3, Math.round(durationMinutes));
  return buildEstimate(rate, distanceMiles, etaMinutes);
}

/** Fallback path: no coordinates available, so derive a stable pseudo-distance from the text. */
export function estimateFare(
  vehicleId: VehicleTypeId,
  pickup: string,
  drop: string,
): FareEstimate {
  const from = normalise(pickup);
  const to = normalise(drop);

  if (!from) {
    throw new InvalidRouteError("Pickup location is required.");
  }
  if (!to) {
    throw new InvalidRouteError("Drop location is required.");
  }
  if (from === to) {
    throw new InvalidRouteError("Pickup and drop must be different.");
  }

  const rate = findRate(vehicleId);
  const distanceMiles = pseudoDistanceMiles(pickup, drop);
  const etaMinutes = Math.max(3, Math.round((distanceMiles / AVG_SPEED_MPH) * 60));
  return buildEstimate(rate, distanceMiles, etaMinutes);
}
