/**
 * CampusMap — Wayfinding Signage System
 * Interactive Google Maps with all campus locations
 */
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { offices, departments, campusResources } from "@/data/campusData";
import { MapView } from "@/components/Map";
import { useState, useCallback, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, Building2, Briefcase, MapPin, Coffee, X } from "lucide-react";

type MarkerType = "office" | "department" | "resource";

interface MapMarker {
  id: string;
  type: MarkerType;
  name_en: string;
  name_zh: string;
  building_en: string;
  building_zh: string;
  floor: string;
  lat: number;
  lng: number;
  detail_en: string;
  detail_zh: string;
  navLink: string;
}

function buildMarkers(): MapMarker[] {
  const markers: MapMarker[] = [];
  offices.forEach(o => {
    markers.push({
      id: o.id,
      type: "office",
      name_en: o.name_en,
      name_zh: o.name_zh,
      building_en: o.building_name_en,
      building_zh: o.building_name_zh,
      floor: o.floor,
      lat: o.latitude,
      lng: o.longitude,
      detail_en: o.function_desc_en,
      detail_zh: o.function_desc_zh,
      navLink: `/navigate/office/${o.id}`,
    });
  });
  departments.forEach(d => {
    markers.push({
      id: d.id,
      type: "department",
      name_en: d.name_en,
      name_zh: d.name_zh,
      building_en: d.building_name_en,
      building_zh: d.building_name_zh,
      floor: d.floor,
      lat: d.latitude,
      lng: d.longitude,
      detail_en: d.function_desc_en,
      detail_zh: d.function_desc_zh,
      navLink: `/navigate/dept/${d.id}`,
    });
  });
  campusResources.forEach(r => {
    markers.push({
      id: r.id,
      type: "resource",
      name_en: r.name_en,
      name_zh: r.name_zh,
      building_en: r.building_name_en,
      building_zh: r.building_name_zh,
      floor: r.floor,
      lat: r.latitude,
      lng: r.longitude,
      detail_en: "",
      detail_zh: "",
      navLink: "",
    });
  });
  return markers;
}

const allMarkers = buildMarkers();

const filterOptions: { type: MarkerType | "all"; label_en: string; label_zh: string; icon: any }[] = [
  { type: "all", label_en: "All", label_zh: "全部", icon: MapPin },
  { type: "office", label_en: "Offices", label_zh: "行政單位", icon: Briefcase },
  { type: "department", label_en: "Departments", label_zh: "系所", icon: Building2 },
  { type: "resource", label_en: "Campus Life", label_zh: "校園生活", icon: Coffee },
];

const markerColors: Record<MarkerType, string> = {
  office: "#1B2A4A",
  department: "#7A9E7E",
  resource: "#E8A838",
};

export default function CampusMap() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<MarkerType | "all">("all");
  const [selected, setSelected] = useState<MapMarker | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const visibleMarkers = filter === "all" ? allMarkers : allMarkers.filter(m => m.type === filter);

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.setCenter({ lat: 23.5640, lng: 120.4710 });
    map.setZoom(16);

    // Create markers
    visibleMarkers.forEach(m => {
      const pinColor = markerColors[m.type];
      const pin = new google.maps.marker.PinElement({
        background: pinColor,
        borderColor: "#ffffff",
        glyphColor: "#ffffff",
        scale: 0.9,
      });
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: m.lat, lng: m.lng },
        title: m.name_en,
        content: pin.element,
      });
      marker.addListener("click", () => {
        setSelected(m);
        map.panTo({ lat: m.lat, lng: m.lng });
      });
      markersRef.current.push(marker);
    });
  }, []);

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

        {/* Selected marker info panel */}
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
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>{t(selected.building_en, selected.building_zh)} · {selected.floor}</span>
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
