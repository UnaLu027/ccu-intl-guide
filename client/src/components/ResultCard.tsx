/**
 * ResultCard — Wayfinding Signage System
 * Displays office/department info in a card with navigation actions
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { MapPin, Navigation, ExternalLink, Clock, Phone, Mail, AlertTriangle, DoorOpen, ArrowRight } from "lucide-react";
import type { Office, Department } from "@/data/campusData";

interface OfficeCardProps {
  office: Office;
  reason?: string;
}

export function OfficeCard({ office, reason }: OfficeCardProps) {
  const { t } = useLanguage();
  const o = office;

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 bg-amber" />
      <div className="p-4 md:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-display font-bold text-base md:text-lg text-navy leading-tight">
              {t(o.name_en, o.name_zh)}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t(o.name_zh, o.name_en)}
            </p>
          </div>
          {o.needs_manual_review && (
            <span className="shrink-0 flex items-center gap-1 text-[10px] text-amber bg-amber/10 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" />
              {t("Needs verification", "待確認")}
            </span>
          )}
        </div>

        {/* Reason badge */}
        {reason && (
          <div className="mb-3 text-xs text-sage bg-sage/10 px-2 py-1 rounded inline-block">
            {reason}
          </div>
        )}

        {/* What is this office for? */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            {t("What is this office for?", "這個單位做什麼？")}
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {t(o.function_desc_en, o.function_desc_zh)}
          </p>
        </div>

        {/* Service scope */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            {t("Services provided", "服務範圍")}
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {t(o.service_scope_en, o.service_scope_zh)}
          </p>
        </div>

        {/* Who should go here? */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            {t("Who should go here?", "誰應該來這裡？")}
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {t(o.common_scenarios_en, o.common_scenarios_zh)}
          </p>
        </div>

        {/* Location info */}
        <div className="bg-cream rounded-md p-3 mb-3 space-y-1.5">
          {t(o.indoor_location_note_en, o.indoor_location_note_zh) && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <DoorOpen className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{t(o.indoor_location_note_en, o.indoor_location_note_zh)}</span>
            </div>
          )}
          {o.office_hours && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{o.office_hours}</span>
            </div>
          )}
          {o.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{o.phone}</span>
            </div>
          )}
          {o.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 shrink-0" />
              <a href={`mailto:${o.email}`} className="underline hover:text-navy">{o.email}</a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/navigate/office/${o.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-navy text-white text-xs font-semibold rounded-md hover:bg-navy-light transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            {t("Navigate", "導航")}
          </Link>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.google_maps_query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-sage text-white text-xs font-semibold rounded-md hover:opacity-90 transition-opacity"
          >
            <MapPin className="w-3.5 h-3.5" />
            Google Maps
          </a>
          {o.official_url && (
            <a
              href={o.official_url}
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
    </div>
  );
}

interface DeptCardProps {
  dept: Department;
}

export function DeptCard({ dept }: DeptCardProps) {
  const { t } = useLanguage();
  const d = dept;

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="h-1 bg-sage" />
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-display font-bold text-base text-navy leading-tight">
              {t(d.name_en, d.name_zh)}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t(d.name_zh, d.name_en)}
            </p>
          </div>
          {d.needs_manual_review && (
            <span className="shrink-0 flex items-center gap-1 text-[10px] text-amber bg-amber/10 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" />
            </span>
          )}
        </div>

        <p className="text-xs text-sage font-medium mb-2">
          {t(d.college_en, d.college_zh)}
        </p>

        <p className="text-sm text-foreground/80 mb-3 leading-relaxed">
          {t(d.function_desc_en, d.function_desc_zh)}
        </p>

        <div className="bg-cream rounded-md p-3 mb-3 space-y-1.5">
          {t(d.indoor_location_note_en, d.indoor_location_note_zh) && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <DoorOpen className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{t(d.indoor_location_note_en, d.indoor_location_note_zh)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/navigate/dept/${d.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-navy text-white text-xs font-semibold rounded-md hover:bg-navy-light transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            {t("Navigate", "導航")}
          </Link>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.google_maps_query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-sage text-white text-xs font-semibold rounded-md hover:opacity-90 transition-opacity"
          >
            <MapPin className="w-3.5 h-3.5" />
            Google Maps
          </a>
          {d.official_url && (
            <a
              href={d.official_url}
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
    </div>
  );
}
