/// <reference types="@types/google.maps" />

export interface MapTargetInput {
  google_maps_query?: string;
  latitude?: number;
  longitude?: number;
  use_manual_coordinates?: boolean;
}

export type MapPositionSource = "manual_coordinates" | "google_places" | "fallback_coordinates";

export interface ResolvedMapPosition {
  lat: number;
  lng: number;
  source: MapPositionSource;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function hasValidCoordinates(item: MapTargetInput): boolean {
  return (
    isFiniteNumber(item.latitude) &&
    isFiniteNumber(item.longitude) &&
    (item.latitude as number) >= -90 &&
    (item.latitude as number) <= 90 &&
    (item.longitude as number) >= -180 &&
    (item.longitude as number) <= 180 &&
    !(item.latitude === 0 && item.longitude === 0)
  );
}

export function shouldUseManualCoordinates(item: MapTargetInput): boolean {
  return item.use_manual_coordinates === true && hasValidCoordinates(item);
}

export function getGoogleMapsQuery(item: MapTargetInput): string {
  return (item.google_maps_query || "").trim();
}

export function getCoordinateSearchQuery(position: { lat: number; lng: number }): string {
  return `${position.lat},${position.lng}`;
}

export function getGoogleMapsSearchUrlFromPosition(position: { lat: number; lng: number }): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    getCoordinateSearchQuery(position)
  )}`;
}

export function getGoogleMapsSearchUrl(item: MapTargetInput): string {
  if (shouldUseManualCoordinates(item)) {
    return getGoogleMapsSearchUrlFromPosition({
      lat: item.latitude as number,
      lng: item.longitude as number,
    });
  }

  const query = getGoogleMapsQuery(item);
  if (query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  if (hasValidCoordinates(item)) {
    return getGoogleMapsSearchUrlFromPosition({
      lat: item.latitude as number,
      lng: item.longitude as number,
    });
  }

  return "";
}

/**
 * Looks up a place's coordinates using the new Places API (Place.searchByText).
 *
 * Uses the importLibrary("places") dynamic loader — no PlacesService, no findPlaceFromQuery.
 * Results are cached in sessionStorage under the key "ccu_place_v2_<query>" so repeated
 * page loads do not re-query the API.
 *
 * Returns null (does NOT throw) if the lookup fails, so callers can fall back gracefully.
 *
 * Debug: to clear cache run in browser console:
 *   Object.keys(sessionStorage).filter(k=>k.startsWith('ccu_place_v2_')).forEach(k=>sessionStorage.removeItem(k))
 */
export async function lookupPlaceLocation(
  query: string,
): Promise<google.maps.LatLngLiteral | null> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return null;

  const cacheKey = "ccu_place_v2_" + normalizedQuery;

  // --- sessionStorage cache ---
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { lat, lng } = JSON.parse(cached) as { lat: unknown; lng: unknown };
        if (isFiniteNumber(lat) && isFiniteNumber(lng)) {
          return { lat, lng };
        }
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }
  } catch {
    // sessionStorage may be unavailable in restricted browsing modes.
  }

  // --- New Places API: Place.searchByText ---
  try {
    // google.maps.importLibrary returns a union of library types; cast to any
    // to access Place.searchByText without depending on the exact @types/google.maps version.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lib = (await google.maps.importLibrary("places")) as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = (await lib.Place.searchByText({
      textQuery: normalizedQuery,
      fields: ["location", "displayName"],
      maxResultCount: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const location = response?.places?.[0]?.location as any;
    if (!location) return null;

    // LatLng objects expose .lat() / .lng() as functions; plain objects expose .lat / .lng directly.
    const lat: unknown =
      typeof location.lat === "function" ? location.lat() : Number(location.lat);
    const lng: unknown =
      typeof location.lng === "function" ? location.lng() : Number(location.lng);

    if (!isFiniteNumber(lat) || !isFiniteNumber(lng)) return null;

    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ lat, lng }));
    } catch {
      // Ignore cache write failures.
    }

    return { lat, lng };
  } catch (error) {
    console.warn("Google Places lookup failed for query", normalizedQuery, error);
    return null;
  }
}

/**
 * Resolves the map position for a MapTargetInput using the following priority:
 *
 * 1. use_manual_coordinates === true + valid lat/lng  →  source: "manual_coordinates"
 * 2. google_maps_query present                        →  Place.searchByText lookup
 *                                                         source: "google_places"
 *                                                         (falls through if lookup fails)
 * 3. valid lat/lng as fallback                        →  source: "fallback_coordinates"
 * 4. none of the above                                →  null (caller should skip marker)
 */
export async function resolveMapPosition(
  item: MapTargetInput,
): Promise<ResolvedMapPosition | null> {
  if (shouldUseManualCoordinates(item)) {
    return {
      lat: item.latitude as number,
      lng: item.longitude as number,
      source: "manual_coordinates",
    };
  }

  const query = getGoogleMapsQuery(item);
  if (query) {
    const loc = await lookupPlaceLocation(query);
    if (loc) {
      return {
        lat: loc.lat,
        lng: loc.lng,
        source: "google_places",
      };
    }
  }

  if (hasValidCoordinates(item)) {
    return {
      lat: item.latitude as number,
      lng: item.longitude as number,
      source: "fallback_coordinates",
    };
  }

  return null;
}
