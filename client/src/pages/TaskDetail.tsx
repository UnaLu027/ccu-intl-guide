/**
 * TaskDetail — Shows one selected task and its target office / department info
 */

import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { tasks, offices, departments } from "@/data/campusData";
import { Link, useParams } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock,
  DoorOpen,
  ExternalLink,
  Mail,
  MapPin,
  Navigation as NavIcon,
  Phone,
} from "lucide-react";

export default function TaskDetail() {
  const { t, lang } = useLanguage();
  const { id } = useParams<{ id: string }>();

  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <div className="container py-16 text-center flex-1">
          <h1 className="font-display font-bold text-xl text-navy mb-4">
            {t("Task not found", "找不到此任務")}
          </h1>

          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("Back to Tasks", "返回常見任務")}
          </Link>
        </div>
      </div>
    );
  }

  const targetUnit =
    task.target_unit_type === "office"
      ? offices.find((office) => office.id === task.target_unit_id)
      : departments.find((department) => department.id === task.target_unit_id);

  const requiredDocuments =
    lang === "en" ? task.required_documents_en : task.required_documents_zh;

  const targetName = targetUnit
    ? t(targetUnit.name_en, targetUnit.name_zh)
    : "";

  const targetBuilding = targetUnit
    ? `${t(targetUnit.building_name_en, targetUnit.building_name_zh)} · ${
        targetUnit.floor
      }${targetUnit.room_en || targetUnit.room_zh ? ` ${t(targetUnit.room_en || "", targetUnit.room_zh || "")}` : ""}`
    : "";

  const targetIndoorLocation = targetUnit
    ? t(targetUnit.indoor_location_note_en, targetUnit.indoor_location_note_zh)
    : "";

  const targetFunction = targetUnit
    ? t(targetUnit.function_desc_en, targetUnit.function_desc_zh)
    : "";

  const targetService = targetUnit
    ? t(targetUnit.service_scope_en, targetUnit.service_scope_zh)
    : "";

  const officialUrl = targetUnit?.official_url || "";
  const googleMapsQuery =
    targetUnit && "google_maps_query" in targetUnit
      ? targetUnit.google_maps_query
      : "";

  const isOffice = targetUnit && "office_hours" in targetUnit;

  const officeHours = isOffice ? targetUnit.office_hours : "";
  const phone = isOffice ? targetUnit.phone : "";
  const email = isOffice ? targetUnit.email : "";

  const navigateType = task.target_unit_type === "office" ? "office" : "dept";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="bg-navy/[0.03] border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="text-navy hover:text-amber transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="font-display font-bold text-lg text-navy">
                {t("Task Guide", "任務指引")}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t("Selected task and related office information", "你點選的任務與相關單位資訊")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 flex-1 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Task detail */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList className="w-5 h-5 text-amber" />
                <h2 className="font-display font-bold text-xl text-navy">
                  {t(task.task_name_en, task.task_name_zh)}
                </h2>
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed mb-5">
                {t(task.scenario_en, task.scenario_zh)}
              </p>

              {requiredDocuments.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    {t("Required Documents / Items", "所需文件／物品")}
                  </p>

                  <div className="bg-amber/5 border border-amber/20 rounded-lg p-3 space-y-2">
                    {requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {doc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {t("Steps", "步驟")}
                </p>

                <div className="space-y-2">
                  {task.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-navy">
                          {index + 1}
                        </span>
                      </div>

                      <p className="text-sm text-foreground/80 leading-relaxed pt-0.5">
                        {t(step.en, step.zh)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related office / department */}
          <div className="lg:col-span-2 space-y-5">
            {targetUnit && (
              <div className="bg-card rounded-xl border border-border p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {t("Related Office / Department", "相關處室／系所")}
                </p>

                <h2 className="font-display font-bold text-base text-navy mb-2">
                  {targetName}
                </h2>

                <div className="space-y-2.5 mb-4">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{targetBuilding}</span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <DoorOpen className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{targetIndoorLocation}</span>
                  </div>

                  {officeHours && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>{officeHours}</span>
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

                {targetFunction && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      {t("Function", "單位功能")}
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {targetFunction}
                    </p>
                  </div>
                )}

                {targetService && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      {t("Services", "服務內容")}
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {targetService}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {googleMapsQuery && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        googleMapsQuery
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-sage text-white text-xs font-semibold rounded-md hover:opacity-90 transition-opacity"
                    >
                      <NavIcon className="w-3.5 h-3.5" />
                      Google Maps
                    </a>
                  )}

                  {officialUrl && (
                    <a
                      href={officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-border text-foreground text-xs font-semibold rounded-md hover:bg-muted transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {t("Official Page", "官方頁面")}
                    </a>
                  )}

                  <Link
                    href={`/navigate/${navigateType}/${task.target_unit_id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-border text-foreground text-xs font-semibold rounded-md hover:bg-muted transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {t("View full location", "查看完整位置")}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}