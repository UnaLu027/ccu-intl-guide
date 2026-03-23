/**
 * CategoryResults — Wayfinding Signage System
 * Core feature: Shows offices/departments filtered by service category
 */
import Header from "@/components/Header";
import { OfficeCard, DeptCard } from "@/components/ResultCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { filterByCategory, serviceCategories, type Task } from "@/data/campusData";
import { Link, useParams, useLocation } from "wouter";
import { useMemo } from "react";
import {
  ArrowLeft, ClipboardList, ChevronRight, Building2, Briefcase,
  ClipboardCheck, CreditCard, Globe, Home as HomeIcon, Heart,
  BookOpen, Users, GraduationCap, Coffee, FileText, Wallet
} from "lucide-react";

const iconMap: Record<string, any> = {
  ClipboardCheck, CreditCard, Globe, Building2, Home: HomeIcon, Heart,
  BookOpen, Users, GraduationCap, Coffee, FileText, Wallet,
};

function TaskMiniCard({ task }: { task: Task }) {
  const { t } = useLanguage();
  return (
    <Link
      href={task.target_unit_id ? `/navigate/${task.target_unit_type === "office" ? "office" : "dept"}/${task.target_unit_id}` : "/tasks"}
      className="group flex items-center gap-3 p-3 bg-card rounded-lg border border-border hover:border-amber hover:shadow-md transition-all"
    >
      <div className="w-9 h-9 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
        <ClipboardList className="w-4 h-4 text-amber" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-sm text-navy truncate">
          {t(task.task_name_en, task.task_name_zh)}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {t(task.scenario_en, task.scenario_zh)}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-amber shrink-0" />
    </Link>
  );
}

export default function CategoryResults() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();

  const category = useMemo(() => serviceCategories.find(c => c.id === id), [id]);
  const results = useMemo(() => filterByCategory(id || ""), [id]);
  const totalResults = results.offices.length + results.departments.length + results.tasks.length;

  const Icon = category ? (iconMap[category.icon] || Globe) : Globe;

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="container py-16 text-center flex-1">
          <h1 className="font-display font-bold text-xl text-navy mb-4">
            {t("Category not found", "找不到此類別")}
          </h1>
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            {t("Back to Home", "回首頁")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Category header */}
      <div className="bg-navy text-white">
        <div className="container py-6 md:py-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-white/70 hover:text-amber transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-white/50 text-sm">{t("Service Category", "服務類別")}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-amber/20 flex items-center justify-center">
              <Icon className="w-7 h-7 text-amber" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
                {t(category.name_en, category.name_zh)}
              </h1>
              <p className="text-white/70 text-sm mt-1">
                {t(category.description_en, category.description_zh)}
              </p>
              <p className="text-white/50 text-xs mt-1">
                {t(`${totalResults} results`, `${totalResults} 個結果`)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Other categories quick nav */}
      <div className="border-b border-border bg-card">
        <div className="container py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {serviceCategories.map(cat => {
              const CatIcon = iconMap[cat.icon] || Globe;
              const isActive = cat.id === id;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-navy text-white"
                      : "bg-muted text-muted-foreground hover:bg-navy/10 hover:text-navy"
                  }`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  {t(cat.name_en, cat.name_zh)}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container py-6 flex-1">
        {/* Related Tasks */}
        {results.tasks.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-5 h-5 text-amber" />
              <h2 className="font-display font-bold text-lg text-navy">
                {t("Related Tasks", "相關任務")}
              </h2>
              <span className="text-xs bg-amber/10 text-amber px-2 py-0.5 rounded-full font-semibold">
                {results.tasks.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.tasks.map(task => (
                <TaskMiniCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {/* Offices */}
        {results.offices.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-5 h-5 text-navy" />
              <h2 className="font-display font-bold text-lg text-navy">
                {t("Offices", "行政單位")}
              </h2>
              <span className="text-xs bg-navy/10 text-navy px-2 py-0.5 rounded-full font-semibold">
                {results.offices.length}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {results.offices.map(office => (
                <OfficeCard key={office.id} office={office} />
              ))}
            </div>
          </div>
        )}

        {/* Departments */}
        {results.departments.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-sage" />
              <h2 className="font-display font-bold text-lg text-navy">
                {t("Departments", "系所")}
              </h2>
              <span className="text-xs bg-sage/10 text-sage px-2 py-0.5 rounded-full font-semibold">
                {results.departments.length}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {results.departments.map(dept => (
                <DeptCard key={dept.id} dept={dept} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
