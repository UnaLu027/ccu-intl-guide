/**
 * CampusMap — Wayfinding Signage System
 * Updated version:
 * 1. Uses a hybrid coordinate strategy:
 *    - Items with use_manual_coordinates: true use latitude / longitude from campusData directly.
 *    - Other items keep the original Google Places lookup behavior.
 * 2. Displays compact location format: Building · Floor Room.
 * 3. Adds a room/classroom-style icon for the floor + room row.
 * 4. Slightly separates markers that share the same resolved coordinate so users can click each unit.
 * 5. Adds location search for offices and departments on the map page.
 */

import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { offices, departments } from "@/data/campusData";
import { MapView } from "@/components/Map";
import {
  getGoogleMapsSearchUrlFromPosition,
  lookupPlaceLocation,
  shouldUseManualCoordinates,
} from "@/lib/mapTarget";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Building2,
  Briefcase,
  DoorOpen,
  Loader2,
  Locate,
  MapPin,
  Search,
  X,
} from "lucide-react";

type MarkerType = "office" | "department";

interface MapItem {
  id: string;
  type: MarkerType;
  name_en: string;
  name_zh: string;
  building_en: string;
  building_zh: string;
  floor: string;
  room_en?: string;
  room_zh?: string;
  detail_en: string;
  detail_zh: string;
  google_maps_query: string;
  latitude: number;
  longitude: number;
  use_manual_coordinates?: boolean;
  navLink: string;
}

interface SelectedItem extends MapItem {
  lat: number;
  lng: number;
}

interface MarkerEntry {
  marker: google.maps.marker.AdvancedMarkerElement;
  type: MarkerType;
  id: string;
  item: MapItem;
  position: google.maps.LatLngLiteral;
}

const filterOptions: { type: MarkerType | "all"; label_en: string; label_zh: string; icon: any }[] = [
  { type: "all", label_en: "All", label_zh: "全部", icon: MapPin },
  { type: "office", label_en: "Administrative Offices", label_zh: "行政單位", icon: Briefcase },
  { type: "department", label_en: "Departments & Colleges", label_zh: "系所與學院", icon: Building2 },
];

const markerColors: Record<MarkerType, string> = {
  office: "#1B2A4A",
  department: "#7A9E7E",
};

const allItems: MapItem[] = [
  ...offices.map(o => ({
    id: o.id,
    type: "office" as MarkerType,
    name_en: o.name_en,
    name_zh: o.name_zh,
    building_en: o.building_name_en,
    building_zh: o.building_name_zh,
    floor: o.floor,
    room_en: o.room_en,
    room_zh: o.room_zh,
    detail_en: o.function_desc_en,
    detail_zh: o.function_desc_zh,
    google_maps_query: o.google_maps_query,
    latitude: o.latitude,
    longitude: o.longitude,
    use_manual_coordinates: o.use_manual_coordinates,
    navLink: `/navigate/office/${o.id}`,
  })),
  ...departments.map(d => ({
    id: d.id,
    type: "department" as MarkerType,
    name_en: d.name_en,
    name_zh: d.name_zh,
    building_en: d.building_name_en,
    building_zh: d.building_name_zh,
    floor: d.floor,
    room_en: d.room_en,
    room_zh: d.room_zh,
    detail_en: d.function_desc_en,
    detail_zh: d.function_desc_zh,
    google_maps_query: d.google_maps_query,
    latitude: d.latitude,
    longitude: d.longitude,
    use_manual_coordinates: d.use_manual_coordinates,
    navLink: `/navigate/dept/${d.id}`,
  })),
];

function getGroupingKey(item: MapItem) {
  return shouldUseManualCoordinates(item)
    ? `manual:${item.latitude},${item.longitude}`
    : `query:${item.google_maps_query}`;
}

function getDisplayPosition(item: MapItem, indexWithinSameCoordinate: number, totalAtSameCoordinate: number) {
  if (totalAtSameCoordinate <= 1) {
    return { lat: item.latitude, lng: item.longitude };
  }

  // Keep markers near the correct building while making repeated offices/departments clickable.
  const radius = 0.000045 + Math.floor(indexWithinSameCoordinate / 12) * 0.000025;
  const angle = (Math.PI * 2 * indexWithinSameCoordinate) / Math.min(totalAtSameCoordinate, 12);

  return {
    lat: item.latitude + Math.sin(angle) * radius,
    lng: item.longitude + Math.cos(angle) * radius,
  };
}

function formatLocation(building: string, floor: string, room?: string) {
  return [building, floor ? `· ${floor}` : "", room ? ` ${room}` : ""].join("").replace(/\s+/g, " ").trim();
}

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

function buildSearchText(item: MapItem) {
  return [
    item.name_zh,
    item.name_en,
    item.building_zh,
    item.building_en,
    item.floor,
    item.room_zh,
    item.room_en,
    item.detail_zh,
    item.detail_en,
    item.google_maps_query,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesFilter(type: MarkerType, filter: MarkerType | "all") {
  return filter === "all" || type === filter;
}

function matchesSearch(item: MapItem, query: string) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  return buildSearchText(item).includes(normalizedQuery);
}

export default function CampusMap() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<MarkerType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<MarkerEntry[]>([]);
  const filterRef = useRef<MarkerType | "all">("all");
  const searchQueryRef = useRef("");
  const userLocationMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const matchedItems = useMemo(() => {
    return allItems.filter(item =>
      matchesFilter(item.type, filter) && matchesSearch(item, searchQuery)
    );
  }, [filter, searchQuery]);

  const showSearchResults = searchQuery.trim().length > 0;
  const visibleSearchResults = matchedItems.slice(0, 10);

  useEffect(() => {
    filterRef.current = filter;
    searchQueryRef.current = searchQuery;

    markersRef.current.forEach(({ marker, type, item }) => {
      const shouldShow =
        matchesFilter(type, filter) && matchesSearch(item, searchQuery);
      marker.map = shouldShow ? mapRef.current : null;
    });
  }, [filter, searchQuery]);

  const openItemOnMap = useCallback((item: MapItem) => {
    const entry = markersRef.current.find(
      markerEntry => markerEntry.id === item.id && markerEntry.type === item.type
    );

    if (!entry || !mapRef.current) return;

    mapRef.current.panTo(entry.position);
    mapRef.current.setZoom(Math.max(mapRef.current.getZoom() || 16, 18));
    setSelected({ ...entry.item, lat: entry.position.lat, lng: entry.position.lng });
  }, []);

  const handleMapReady = useCallback(async (map: google.maps.Map) => {
    mapRef.current = map;
    markersRef.current.forEach(({ marker }) => {
      marker.map = null;
    });
    markersRef.current = [];

    map.setCenter({ lat: 23.5628, lng: 120.4724 });
    map.setZoom(16);

    const placesService = new google.maps.places.PlacesService(map);

    // Manual-coordinate items are grouped by exact coordinate.
    // Google-resolved items keep the original grouping by google_maps_query.
    const grouped = new Map<string, MapItem[]>();
    allItems.forEach(item => {
      const key = getGroupingKey(item);
      grouped.set(key, [...(grouped.get(key) || []), item]);
    });

    // Only query Google Places for items that are not manually positioned.
    const queryCache = new Map<string, google.maps.LatLng | null>();
    const uniqueQueries = Array.from(
      new Set(
        allItems
          .filter(item => !shouldUseManualCoordinates(item))
          .map(item => item.google_maps_query)
          .filter(Boolean)
      )
    );

    await Promise.all(
      uniqueQueries.map(async query => {
        const loc = await lookupPlaceLocation(placesService, query);
        queryCache.set(query, loc);
      })
    );

    allItems.forEach(item => {
      const groupKey = getGroupingKey(item);
      const sameGroupItems = grouped.get(groupKey) || [item];
      const indexWithinGroup = sameGroupItems.findIndex(
        u => u.id === item.id && u.type === item.type
      );

      const resolvedLoc = shouldUseManualCoordinates(item)
        ? null
        : queryCache.get(item.google_maps_query);

      const baseLat = resolvedLoc ? resolvedLoc.lat() : item.latitude;
      const baseLng = resolvedLoc ? resolvedLoc.lng() : item.longitude;

      const position = getDisplayPosition(
        { ...item, latitude: baseLat, longitude: baseLng },
        Math.max(indexWithinGroup, 0),
        sameGroupItems.length
      );

      const pin = new google.maps.marker.PinElement({
        background: markerColors[item.type],
        borderColor: "#ffffff",
        glyphColor: "#ffffff",
        scale: 0.9,
      });

      const shouldShow =
        matchesFilter(item.type, filterRef.current) &&
        matchesSearch(item, searchQueryRef.current);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: shouldShow ? map : null,
        position,
        title: t(item.name_en, item.name_zh),
        content: pin.element,
      });

      marker.addListener("click", () => {
        setSelected({ ...item, lat: position.lat, lng: position.lng });
        map.panTo(position);
      });

      markersRef.current.push({
        marker,
        type: item.type,
        id: item.id,
        item,
        position,
      });
    });
  }, [t]);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Location access denied. Please enable location in your browser settings.");
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;

        if (userLocationMarkerRef.current) {
          userLocationMarkerRef.current.map = null;
          userLocationMarkerRef.current = null;
        }

        if (mapRef.current) {
          const dot = document.createElement("div");
          dot.style.cssText =
            "width:16px;height:16px;border-radius:50%;background:#2563EB;border:3px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.35);";

          userLocationMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
            map: mapRef.current,
            position: { lat: latitude, lng: longitude },
            title: "Your Location",
            content: dot,
          });

          mapRef.current.panTo({ lat: latitude, lng: longitude });

          const inCampus =
            latitude >= 23.558 && latitude <= 23.568 &&
            longitude >= 120.468 && longitude <= 120.478;
          if (inCampus) mapRef.current.setZoom(18);
        }

        setLocating(false);
      },
      () => {
        setLocationError("Location access denied. Please enable location in your browser settings.");
        setLocating(false);
      }
    );
  }, []);

  const selectedGoogleMapsUrl = selected
    ? getGoogleMapsSearchUrlFromPosition({ lat: selected.lat, lng: selected.lng })
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="bg-navy/[0.03] border-b border-border">
        <div className="container py-3">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/" className="text-navy hover:text-amber transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <h1 className="font-display font-bold text-lg text-navy">
              {t("Campus Map", "校園地圖")}
            </h1>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filterOptions.map(opt => (
              <button
                key={opt.type}
                onClick={() => setFilter(opt.type)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  filter === opt.type
                    ? "bg-navy text-white"
                    : "bg-muted text-muted-foreground hover:bg-navy/10"
                }`}
              >
                <opt.icon className="w-3.5 h-3.5" />
                {t(opt.label_en, opt.label_zh)}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("Search locations", "搜尋地點")}
                className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelected(null);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={t("Clear search", "清除搜尋")}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {showSearchResults && (
              <div className="mt-2 rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <p className="text-xs font-semibold text-navy">
                    {t("Search Results", "搜尋結果")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {matchedItems.length} {t("matches", "筆結果")}
                  </p>
                </div>

                {matchedItems.length === 0 ? (
                  <p className="px-3 py-3 text-sm text-muted-foreground">
                    {t("No matching locations", "找不到符合的地點")}
                  </p>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {visibleSearchResults.map(item => (
                      <button
                        key={`${item.type}-${item.id}`}
                        type="button"
                        onClick={() => openItemOnMap(item)}
                        className="w-full border-b border-border last:border-b-0 px-3 py-2 text-left hover:bg-muted/60 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-navy truncate">
                              {t(item.name_en, item.name_zh)}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {formatLocation(
                                t(item.building_en, item.building_zh),
                                item.floor,
                                t(item.room_en || "", item.room_zh || "")
                              )}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            {item.type === "office"
                              ? t("Office", "行政單位")
                              : t("Department", "系所")}
                          </span>
                        </div>
                      </button>
                    ))}

                    {matchedItems.length > visibleSearchResults.length && (
                      <p className="px-3 py-2 text-xs text-muted-foreground bg-muted/30">
                        {t(
                          `Showing first ${visibleSearchResults.length} results. Please refine your search.`,
                          `目前顯示前 ${visibleSearchResults.length} 筆結果，請輸入更精準的關鍵字。`
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 relative" style={{ minHeight: "60vh" }}>
        <MapView onMapReady={handleMapReady} />

        <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-2">
          {locationError && (
            <p className="bg-white border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg shadow-md max-w-[240px] text-right leading-snug">
              {locationError}
            </p>
          )}
          <button
            onClick={handleLocate}
            disabled={locating}
            title={t("Show my location", "顯示我的位置")}
            className="bg-white border border-gray-200 rounded-full shadow-md p-2 hover:bg-gray-50 transition disabled:opacity-70"
          >
            {locating
              ? <Loader2 className="w-5 h-5 text-navy animate-spin" />
              : <Locate className="w-5 h-5 text-navy" />
            }
          </button>
        </div>

        {selected && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-10">
            <div className="h-1" style={{ backgroundColor: markerColors[selected.type] }} />

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-display font-bold text-base text-navy">
                    {t(selected.name_en, selected.name_zh)}
                  </h3>
                  <p className="text-xs text-muted-foreground">{t(selected.name_zh, selected.name_en)}</p>
                </div>

                <button onClick={() => setSelected(null)} className="p-1 hover:bg-muted rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                <DoorOpen className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  {formatLocation(
                    t(selected.building_en, selected.building_zh),
                    selected.floor,
                    t(selected.room_en || "", selected.room_zh || "")
                  )}
                </span>
              </div>

              {selected.detail_en && (
                <p className="text-sm text-foreground/80 mb-3">
                  {t(selected.detail_en, selected.detail_zh)}
                </p>
              )}

              <div className="flex gap-2">
                {selected.navLink && (
                  <Link
                    href={selected.navLink}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-navy text-white text-xs font-semibold rounded-md hover:bg-navy-light transition-colors"
                  >
                    {t("View Details", "查看詳情")}
                  </Link>
                )}

                <a
                  href={selectedGoogleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-sage text-white text-xs font-semibold rounded-md hover:opacity-90 transition-opacity"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Google Maps
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
