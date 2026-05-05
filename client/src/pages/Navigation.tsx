/**
 * Navigation — Wayfinding Signage System
 * Detailed view of a single office or department with map
 */

import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { offices, departments, tasks } from "@/data/campusData";
import { MapView } from "@/components/Map";
import { Link, useParams } from "wouter";
import { useMemo, useCallback } from "react";
import {
  ArrowLeft,
  ArrowRight,
  DoorOpen,
  MapPin,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  Navigation as NavIcon,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

export default function Navigation() {
  const { t, lang } = useLanguage();
  const { type, id } = useParams<{ type: string; id: string }>();

  const item = useMemo(() => {
    if (type === "office") return offices.find((o) => o.id === id);
    if (type === "dept") return departments.find((d) => d.id === id);
    return null;
  }, [type, id]);

  const relatedTasks = useMemo(() => {
    if (!item) return [];

    if (type === "office") {
      return tasks.filter((t) => t.target_unit_id === id);
    }

    return tasks.filter((t) => t.target_unit_type === "department");
  }, [item, type, id]);

  const handleMapReady = useCallback(
    (map: google.maps.Map) => {
      if (!item) return;

      const lat = "latitude" in item ? item.latitude : 0;
      const lng = "longitude" in item ? item.longitude : 0;

      map.setCenter({ lat, lng });
      map.setZoom(17);

      const pin = new google.maps.marker.PinElement({
        background: type === "office" ? "#1B2A4A" : "#7A9E7E",
        borderColor: "#ffffff",
        glyphColor: "#ffffff",
        scale: 1.2,
      });

      new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat, lng },
        title: "name_en" in item ? item.name_en : "",
        content: pin.element,
      });
    },
    [item, type]
  );

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <div className="container py-16 text-center flex-1">
          <h1 className="font-display font-bold text-xl text-navy mb-4">
            {t("Location not found", "找不到此地點")}
          </h1>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("Back to Home", "回首頁")}
          </Link>
        </div>
      </div>
    );
  }

  const isOffice = type === "office";

  const name_en = item.name_en;
  const name_zh = item.name_zh;
  const building_en = item.building_name_en;
  const building_zh = item.building_name_zh;
  const floor = item.floor;
  const indoor_en = item.indoor_location_note_en;
  const indoor_zh = item.indoor_location_note_zh;
  const func_en = item.function_desc_en;
  const func_zh = item.function_desc_zh;
  const service_en = item.service_scope_en;
  const service_zh = item.service_scope_zh;
  const google_query = "google_maps_query" in item ? item.google_maps_query : "";
  const official_url = item.official_url;
  const needs_review = item.needs_manual_review;

  const office_hours = isOffice && "office_hours" in item ? item.office_hours : "";
  const phone = isOffice && "phone" in item ? item.phone : "";
  const email = isOffice && "email" in item ? item.email : "";
  const scenarios_en =
    isOffice && "common_scenarios_en" in item ? item.common_scenarios_en : "";
  const scenarios_zh =
    isOffice && "common_scenarios_zh" in item ? item.common_scenarios_zh : "";

  const college_en = !isOffice && "college_en" in item ? item.college_en : "";
  const college_zh = !isOffice && "college_zh" in item ? item.college_zh : "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Top bar */}
      <div className="bg-navy text-white">
        <div className="container py-5 md:py-6">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => window.history.back()}
              className="text-white/70 hover:text-amber transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <span className="text-white/50 text-sm">
              {isOffice ? t("Office", "行政單位") : t("Department", "系所")}
            </span>
          </div>

          <h1 className="font-display font-bold text-xl md:text-2xl text-white mb-1">
            {t(name_en, name_zh)}
          </h1>

          <p className="text-white/60 text-sm">{t(name_zh, name_en)}</p>

          {college_en && (
            <p className="text-amber text-sm mt-1">
              {t(college_en, college_zh)}
            </p>
          )}

          {needs_review && (
            <div className="flex items-center gap-1.5 mt-2 text-amber text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              {t("Some information may need verification", "部分資訊可能需要確認")}
            </div>
          )}
        </div>
      </div>

      <div className="container py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Info */}
          <div className="lg:col-span-3 space-y-5">
            {/* What is this for? */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="font-display font-bold text-base text-navy mb-2">
                {isOffice
                  ? t("What is this office for?", "這個單位做什麼？")
                  : t("About this department", "關於此系所")}
              </h2>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {t(func_en, func_zh)}
              </p>
            </div>

            {/* Services */}
            {service_en && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h2 className="font-display font-bold text-base text-navy mb-2">
                  {t("Services Provided", "服務範圍")}
                </h2>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {t(service_en, service_zh)}
                </p>
              </div>
            )}

            {/* Who should go here? */}
            {scenarios_en && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h2 className="font-display font-bold text-base text-navy mb-2">
                  {t("Who should go here?", "誰應該來這裡？")}
                </h2>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {t(scenarios_en, scenarios_zh)}
                </p>
              </div>
            )}

            {/* Related Tasks */}
            {relatedTasks.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h2 className="font-display font-bold text-base text-navy mb-3">
                  {t("Related Tasks", "相關任務")}
                </h2>

                <div className="space-y-3">
                  {relatedTasks.map((task) => {
                    const requiredDocuments =
                      lang === "en"
                        ? task.required_documents_en
                        : task.required_documents_zh;

                    return (
                      <div
                        key={task.id}
                        className="border border-border rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <ClipboardList className="w-4 h-4 text-amber" />
                          <span className="font-display font-semibold text-sm text-navy">
                            {t(task.task_name_en, task.task_name_zh)}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground mb-2">
                          {t(task.scenario_en, task.scenario_zh)}
                        </p>

                        {/* Required Documents */}
                        {requiredDocuments.length > 0 && (
                          <div className="mb-3">
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                              {t("Required Documents / Items", "所需文件／物品")}
                            </p>

                            <div className="space-y-1">
                              {requiredDocuments.map((doc, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-amber shrink-0 mt-0.5" />
                                  <p className="text-xs text-foreground/70 leading-relaxed">
                                    {doc}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          {task.steps.map((step, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-[10px] font-bold text-navy">
                                  {i + 1}
                                </span>
                              </div>

                              <p className="text-xs text-foreground/70 leading-relaxed">
                                {t(step.en, step.zh)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {task.target_unit_id && (
                          <Link
                            href={`/navigate/${
                              task.target_unit_type === "office" ? "office" : "dept"
                            }/${task.target_unit_id}`}
                            className="mt-2 inline-flex items-center gap-1.5 text-xs text-sage font-semibold hover:underline"
                          >
                            <ArrowRight className="w-3 h-3" />
                            {t("View office info", "查看單位資訊")}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Location & Map */}
          <div className="lg:col-span-2 space-y-5">
            {/* Location card */}
            {indoor_en && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h2 className="font-display font-bold text-base text-navy mb-3">
                  {t("Location", "位置")}
                </h2>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <DoorOpen className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{t(indoor_en, indoor_zh)}</span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      {t(building_en, building_zh)} · {floor}
                    </span>
                  </div>

                  {office_hours && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>{office_hours}</span>
                    </div>
                  )}

                  {phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{phone}</span>
                    </div>
                  )}

                  {email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 shrink-0" />
                      <a href={`mailto:${email}`} className="underline hover:text-navy">
                        {email}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      google_query
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-sage text-white text-xs font-semibold rounded-md hover:opacity-90 transition-opacity"
                  >
                    <NavIcon className="w-3.5 h-3.5" />
                    Google Maps
                  </a>

                  {official_url && (
                    <a
                      href={official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-border text-foreground text-xs font-semibold rounded-md hover:bg-muted transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {t("Official Page", "官方頁面")}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Map */}
            <div
              className="bg-card rounded-xl border border-border overflow-hidden"
              style={{ height: "300px" }}
            >
              <MapView onMapReady={handleMapReady} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}