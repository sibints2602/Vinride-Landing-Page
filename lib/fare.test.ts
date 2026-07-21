import { describe, expect, it } from "vitest";
import {
  estimateFare,
  InvalidRouteError,
  UnknownVehicleError,
} from "./fare";

describe("estimateFare", () => {
  it("is deterministic for the same inputs", () => {
    const a = estimateFare("sedan", "City Centre", "Tech Park");
    const b = estimateFare("sedan", "City Centre", "Tech Park");
    expect(a).toEqual(b);
  });

  it("normalises casing and surrounding whitespace", () => {
    const a = estimateFare("sedan", "City Centre", "Tech Park");
    const b = estimateFare("sedan", "  city centre ", "TECH PARK");
    expect(a).toEqual(b);
  });

  it("produces a plausible distance between 2 and 30 km", () => {
    const { distanceKm } = estimateFare("auto", "Old Town", "Riverside Mall");
    expect(distanceKm).toBeGreaterThanOrEqual(2);
    expect(distanceKm).toBeLessThanOrEqual(30);
  });

  it("returns a low bound below the high bound", () => {
    const { low, high } = estimateFare("suv", "Airport Terminal 1", "Stadium Road");
    expect(low).toBeLessThan(high);
  });

  it("never quotes below the vehicle's minimum fare", () => {
    const { low } = estimateFare("bike", "A", "B");
    expect(low).toBeGreaterThanOrEqual(29);
  });

  it("prices an SUV above a bike for the same route", () => {
    const bike = estimateFare("bike", "City Centre", "Tech Park");
    const suv = estimateFare("suv", "City Centre", "Tech Park");
    expect(suv.low).toBeGreaterThan(bike.low);
  });

  it("returns whole-rupee values", () => {
    const { low, high } = estimateFare("sedan", "Old Town", "Tech Park");
    expect(Number.isInteger(low)).toBe(true);
    expect(Number.isInteger(high)).toBe(true);
  });

  it("throws InvalidRouteError on a blank pickup", () => {
    expect(() => estimateFare("sedan", "   ", "Tech Park")).toThrow(InvalidRouteError);
  });

  it("throws InvalidRouteError on a blank drop", () => {
    expect(() => estimateFare("sedan", "City Centre", "")).toThrow(InvalidRouteError);
  });

  it("throws InvalidRouteError when pickup and drop match", () => {
    expect(() => estimateFare("sedan", "Tech Park", " tech park ")).toThrow(InvalidRouteError);
  });

  it("throws UnknownVehicleError for an unrecognised vehicle", () => {
    expect(() =>
      // @ts-expect-error deliberately testing an invalid id at runtime
      estimateFare("hovercraft", "City Centre", "Tech Park"),
    ).toThrow(UnknownVehicleError);
  });
});
