/**
 * CampusMap — Wayfinding Signage System
 * Updated version:
 * 1. Uses latitude / longitude from campusData directly, so every office / department in campusData appears on the map.
 * 2. Displays compact location format: Building · Floor Room.
 * 3. Adds a room/classroom-style icon for the floor + room row.
 * 4. Slightly separates markers that share the same building coordinate so users can click each unit.
 */

import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { offices, departments } from "@/data/campusData";
import { MapView } from "@/components/Map";
import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Building2, Briefcase, DoorOpen, MapPin, X } from "lucide-react";

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
  navLink: string;
}

interface SelectedItem extends MapItem {
  lat: number;
  lng: number;
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
    navLink: `/navigate/dept/${d.id}`,
  })),
];

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

function lookupPlaceLocation(
  service: google.maps.places.PlacesService,
  query: string
): Promise<google.maps.LatLng | null> {
  const cacheKey = "ccu_place_" + query;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    const { lat, lng } = JSON.parse(cached);
    return Promise.resolve(new google.maps.LatLng(lat, lng));
  }
  return new Promise(resolve => {
    service.findPlaceFromQuery(
      { query, fields: ["geometry.location"] },
      (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results && results[0]?.geometry?.location
        ) {
          const loc = results[0].geometry.location;
          sessionStorage.setItem(cacheKey, JSON.stringify({ lat: loc.lat(), lng: loc.lng() }));
          resolve(loc);
        } else {
          resolve(null);
        }
      }
    );
  });
}

export default function CampusMap() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<MarkerType | "all">("all");
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ marker: google.maps.marker.AdvancedMarkerElement; type: MarkerType }[]>([]);
  const filterRef = useRef<MarkerType | "all">("all");

  useEffect(() => {
    filterRef.current = filter;
    markersRef.current.forEach(({ marker, type }) => {
      marker.map = filter === "all" || type === filter ? mapRef.current : null;
    });
  }, [filter]);

  const handleMapReady = useCallback(async (map: google.maps.Map) => {
    mapRef.current = map;
    map.setCenter({ lat: 23.5628, lng: 120.4724 });
    map.setZoom(16);

    const placesService = new google.maps.places.PlacesService(map);

    // Group by google_maps_query so items in the same building cluster together.
    const grouped = new Map<string, MapItem[]>();
    allItems.forEach(item => {
      const key = item.google_maps_query;
      grouped.set(key, [...(grouped.get(key) || []), item]);
    });

    // Query each unique google_maps_query exactly once.
    const queryCache = new Map<string, google.maps.LatLng | null>();
    const uniqueQueries = [...new Set(allItems.map(i => i.google_maps_query))];

    await Promise.all(
      uniqueQueries.map(async query => {
        const loc = await lookupPlaceLocation(placesService, query);
        queryCache.set(query, loc);
      })
    );

    allItems.forEach(item => {
      const sameQueryItems = grouped.get(item.google_maps_query) || [item];
      const indexWithinGroup = sameQueryItems.findIndex(
        u => u.id === item.id && u.type === item.type
      );

      const resolvedLoc = queryCache.get(item.google_maps_query);
      const baseLat = resolvedLoc ? resolvedLoc.lat() : item.latitude;
      const baseLng = resolvedLoc ? resolvedLoc.lng() : item.longitude;

      const position = getDisplayPosition(
        { ...item, latitude: baseLat, longitude: baseLng },
        Math.max(indexWithinGroup, 0),
        sameQueryItems.length
      );

      const pin = new google.maps.marker.PinElement({
        background: markerColors[item.type],
        borderColor: "#ffffff",
        glyphColor: "#ffffff",
        scale: 0.9,
      });

      const shouldShow = filterRef.current === "all" || filterRef.current === item.type;

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

      markersRef.current.push({ marker, type: item.type });
    });
  }, [t]);

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
        </div>
      </div>

      <div className="flex-1 relative" style={{ minHeight: "60vh" }}>
        <MapView onMapReady={handleMapReady} />

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
                  href={`https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`}
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
