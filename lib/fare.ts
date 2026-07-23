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
  distanceKm: number;
  etaMinutes: number;
  low: number;
  high: number;
}

const MIN_KM = 2;
const MAX_KM = 30;
/** Average city speed in km/h, used to derive a trip duration from distance. */
const AVG_SPEED_KMH = 22;
/** The quote is presented as a ±8% band rather than a single false-precision number. */
const BAND = 0.08;

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/** No geocoding in this build: distance is a deterministic route hash so quotes stay stable. */
function pseudoDistanceKm(pickup: string, drop: string): number {
  const route = `${normalise(pickup)}->${normalise(drop)}`;
  let hash = 2166136261;
  for (let i = 0; i < route.length; i += 1) {
    hash ^= route.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const span = MAX_KM - MIN_KM;
  const offset = Math.abs(hash) % (span * 10);
  return MIN_KM + offset / 10;
}

function findRate(vehicleId: VehicleTypeId): FareRate {
  const rate = FARE_RATES.find((entry) => entry.vehicleId === vehicleId);
  if (!rate) {
    throw new UnknownVehicleError(vehicleId);
  }
  return rate;
}

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
  const distanceKm = pseudoDistanceKm(pickup, drop);
  const etaMinutes = Math.max(5, Math.round((distanceKm / AVG_SPEED_KMH) * 60));

  const raw =
    rate.baseFare + distanceKm * rate.perKm + etaMinutes * rate.perMinute;
  const fare = Math.max(raw, rate.minimumFare);

  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    etaMinutes,
    low: Math.max(rate.minimumFare, Math.round(fare * (1 - BAND))),
    high: Math.round(fare * (1 + BAND)),
  };
}
