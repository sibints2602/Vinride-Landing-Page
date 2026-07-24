// Real geocoding + routing, entirely client-side — no backend, no API key.
//   • Autocomplete  → Photon (photon.komoot.io), CORS-enabled, built for search-as-you-type.
//   • Driving route → OSRM demo (router.project-osrm.org), CORS-enabled, keyless.
// Both are best-effort public OSM services: callers MUST tolerate failure (fall back gracefully)
// and the UI MUST show OSM/OSRM attribution. See ESTIMATOR.attribution.

const PHOTON_URL = "https://photon.komoot.io/api";
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";
const METERS_PER_MILE = 1609.344;

/** The minimum query length before we hit Photon — shorter strings are noise, not addresses. */
export const MIN_QUERY_LENGTH = 3;

export interface Place {
  /** Stable-enough key for React lists and de-duping (OSM id when present, else coordinates). */
  id: string;
  label: string;
  lat: number;
  lon: number;
}

export interface RouteResult {
  distanceMiles: number;
  durationMinutes: number;
}

/** Photon feature properties we read; everything is optional in the upstream schema. */
interface PhotonProps {
  osm_id?: number;
  osm_type?: string;
  name?: string;
  housenumber?: string;
  street?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  country?: string;
}

/** Condense a Photon result into a short, human "Name, City, Region" label (max three parts). */
function toLabel(p: PhotonProps): string {
  const primary =
    p.name ||
    [p.housenumber, p.street].filter(Boolean).join(" ") ||
    p.street ||
    "";
  const locality = p.city || p.town || p.village || p.county;
  const parts = [primary, locality, p.state, p.country].filter(
    (part): part is string => Boolean(part),
  );
  // Drop consecutive duplicates (e.g. name === city) so labels don't read "Paris, Paris".
  const deduped = parts.filter((part, i) => part !== parts[i - 1]);
  return deduped.slice(0, 3).join(", ");
}

/**
 * Address autocomplete. Returns [] for blank/too-short queries; throws on network/HTTP errors
 * so callers can distinguish "no matches" from "service down".
 */
export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<Place[]> {
  const q = query.trim();
  if (q.length < MIN_QUERY_LENGTH) return [];

  const url = `${PHOTON_URL}?q=${encodeURIComponent(q)}&limit=5&lang=en`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Photon responded ${res.status}`);

  const data: { features?: Array<{ properties?: PhotonProps; geometry?: { coordinates?: [number, number] } }> } =
    await res.json();

  const places: Place[] = [];
  for (const feature of data.features ?? []) {
    const coords = feature.geometry?.coordinates;
    const props = feature.properties;
    if (!coords || !props) continue;
    const label = toLabel(props);
    if (!label) continue;
    const [lon, lat] = coords;
    places.push({
      id: props.osm_id ? `${props.osm_type ?? ""}${props.osm_id}` : `${lat},${lon}`,
      label,
      lat,
      lon,
    });
  }
  return places;
}

/**
 * Driving distance + duration between two places, via the OSRM demo server.
 * Throws if the service is unreachable or no route exists (e.g. across an ocean).
 */
export async function routeBetween(
  from: Place,
  to: Place,
  signal?: AbortSignal,
): Promise<RouteResult> {
  const coords = `${from.lon},${from.lat};${to.lon},${to.lat}`;
  const url = `${OSRM_URL}/${coords}?overview=false`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`OSRM responded ${res.status}`);

  const data: { routes?: Array<{ distance: number; duration: number }> } =
    await res.json();
  const route = data.routes?.[0];
  if (!route) throw new Error("No drivable route between those points");

  return {
    distanceMiles: route.distance / METERS_PER_MILE,
    durationMinutes: route.duration / 60,
  };
}
