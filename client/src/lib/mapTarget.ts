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
    item.latitude >= -90 &&
    item.latitude <= 90 &&
    item.longitude >= -180 &&
    item.longitude <= 180 &&
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

export function lookupPlaceLocation(
  service: google.maps.places.PlacesService,
  query: string
): Promise<google.maps.LatLng | null> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return Promise.resolve(null);

  const cacheKey = "ccu_place_" + normalizedQuery;

  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { lat, lng } = JSON.parse(cached);
        if (isFiniteNumber(lat) && isFiniteNumber(lng)) {
          return Promise.resolve(new google.maps.LatLng(lat, lng));
        }
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }
  } catch {
    // sessionStorage may be unavailable in restricted browsing modes.
  }

  return new Promise(resolve => {
    service.findPlaceFromQuery(
      { query: normalizedQuery, fields: ["geometry.location"] },
      (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results &&
          results[0]?.geometry?.location
        ) {
          const loc = results[0].geometry.location;

          try {
            sessionStorage.setItem(
              cacheKey,
              JSON.stringify({ lat: loc.lat(), lng: loc.lng() })
            );
          } catch {
            // Ignore cache failures.
          }

          resolve(loc);
        } else {
          resolve(null);
        }
      }
    );
  });
}

export async function resolveMapPosition(
  service: google.maps.places.PlacesService,
  item: MapTargetInput
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
    const loc = await lookupPlaceLocation(service, query);
    if (loc) {
      return {
        lat: loc.lat(),
        lng: loc.lng(),
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
