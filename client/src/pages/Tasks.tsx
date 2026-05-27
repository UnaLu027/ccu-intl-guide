/**
 * FAQ page
 * Category-based answers for common administrative and campus life questions.
 */

import Header from "@/components/Header";
import TaskStepContent from "@/components/TaskStepContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCampusData } from "@/contexts/CampusDataContext";
import type { Task } from "@/data/campusData";
import { Link } from "wouter";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  Navigation,
  ClipboardList,
  Building2,
  CheckCircle2,
  Search,
  AlertCircle,
} from "lucide-react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function pushGtmEvent(eventName: string, params: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[_\-–—/+.,:;|＋+()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function taskMatchesQuery(task: Task, query: string) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) return true;

  const searchableText = normalizeSearchText(
    [
      task.id,
      task.task_name_en,
      task.task_name_zh,
      task.scenario_en,
      task.scenario_zh,
      task.category_id,
      ...task.required_documents_en,
      ...task.required_documents_zh,
      ...task.steps.flatMap((step) => [step.en, step.zh]),
    ].join(" ")
  );

  return searchableText.includes(normalizedQuery);
}

export default function Tasks() {
  const { t, lang } = useLanguage();
  const { tasks, offices, departments, serviceCategories } = useCampusData();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | string>("all");

  const categoriesWithTasks = useMemo(() => {
    return serviceCategories.filter((category) =>
      tasks.some((task) => task.category_id === category.id)
    );
  }, [serviceCategories, tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesCategory =
        activeCategory === "all" || task.category_id === activeCategory;
      return matchesCategory && taskMatchesQuery(task, query);
    });
  }, [activeCategory, query, tasks]);

  const groupedTasks = useMemo(() => {
    const visibleCategories =
      activeCategory === "all"
        ? categoriesWithTasks
        : categoriesWithTasks.filter((category) => category.id === activeCategory);

    return visibleCategories
      .map((category) => ({
        category,
        tasks: filteredTasks.filter((task) => task.category_id === category.id),
      }))
      .filter((group) => group.tasks.length > 0);
  }, [activeCategory, categoriesWithTasks, filteredTasks]);

  const uncategorizedTasks = useMemo(() => {
    if (activeCategory !== "all") return [];
    const knownCategoryIds = new Set(categoriesWithTasks.map((category) => category.id));
    return filteredTasks.filter((task) => !knownCategoryIds.has(task.category_id));
  }, [activeCategory, categoriesWithTasks, filteredTasks]);

  const hasActiveFilter = query.trim() !== "" || activeCategory !== "all";

  const toggle = (id: string) => {
    const task = tasks.find((item) => item.id === id);
    const isOpening = expandedId !== id;

    if (task && isOpening) {
      pushGtmEvent("select_task", {
        task_id: task.id,
        task_name_zh: task.task_name_zh,
        task_name_en: task.task_name_en,
        category_id: task.category_id,
        target_unit_id: task.target_unit_id,
        page_path: window.location.pathname,
      });
    }

    setExpandedId((prev) => (prev === id ? null : id));
  };

  const resetFilters = () => {
    setQuery("");
    setActiveCategory("all");
    setExpandedId(null);
  };

  const renderTaskCard = (task: Task) => {
    const isExpanded = expandedId === task.id;

    let targetName = "";
    let targetBuilding = "";
    let navLink = "";

    if (task.target_unit_id) {
      if (task.target_unit_type === "office") {
        const office = offices.find((item) => item.id === task.target_unit_id);

        if (office) {
          targetName = t(office.name_en, office.name_zh);
          targetBuilding = `${t(office.building_name_en, office.building_name_zh)} ${office.floor}`;
          navLink = `/navigate/office/${office.id}`;
        }
      } else {
        const dept = departments.find((item) => item.id === task.target_unit_id);

        if (dept) {
          targetName = t(dept.name_en, dept.name_zh);
          targetBuilding = `${t(dept.building_name_en, dept.building_name_zh)} ${dept.floor}`;
          navLink = `/navigate/dept/${dept.id}`;
        }
      }
    }

    const requiredDocuments =
      lang === "en" ? task.required_documents_en : task.required_documents_zh;

    return (
      <div key={task.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <button
          onClick={() => toggle(task.id)}
          className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/30"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber/10">
            <ClipboardList className="h-5 w-5 text-amber" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold text-navy">
              {t(task.task_name_en, task.task_name_zh)}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {t(task.scenario_en, task.scenario_zh)}
            </p>
          </div>

          {isExpanded ? (
            <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
          )}
        </button>

        {isExpanded && (
          <div className="border-t border-border px-4 pb-4">
            <div className="mb-4 mt-3">
              <p className="text-sm leading-relaxed text-foreground/80">
                {t(task.scenario_en, task.scenario_zh)}
              </p>
            </div>

            {targetName && (
              <div className="mb-4 rounded-lg bg-cream p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("Related unit", "相關單位")}
                </p>

                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-navy" />
                  <span className="font-display text-sm font-semibold text-navy">
                    {targetName}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{targetBuilding}</span>
                </div>
              </div>
            )}

            {requiredDocuments.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("Required Documents / Items", "所需文件／項目")}
                </p>

                <div className="space-y-2 rounded-lg border border-amber/20 bg-amber/5 p-3">
                  {requiredDocuments.map((doc, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                      <p className="text-sm leading-relaxed text-foreground/80">{doc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("Steps", "辦理步驟")}
              </p>

              <div className="space-y-2">
                {task.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy/10">
                      <span className="text-xs font-bold text-navy">{index + 1}</span>
                    </div>

                    <TaskStepContent step={step} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/task/${task.id}`}
                className="inline-flex items-center gap-1.5 rounded-md bg-amber px-3 py-2 text-xs font-semibold text-navy transition-colors hover:bg-amber-light"
              >
                <ClipboardList className="h-3.5 w-3.5" />
                {t("View full answer", "查看完整說明")}
              </Link>

              {navLink && (
                <Link
                  href={navLink}
                  className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-light"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  {t("View related unit", "查看相關單位")}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <div className="border-b border-border bg-navy/[0.03]">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-navy transition-colors hover:text-amber">
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <h1 className="font-display text-lg font-bold text-navy">
                {t("FAQ", "常見問題")}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t(
                  "Find answers to common administrative and campus life questions.",
                  "依分類查找常見行政與校園生活問題。"
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center overflow-hidden rounded-lg border border-border bg-white shadow-sm">
            <div className="pl-3">
              <Search className="h-4 w-4 text-navy/40" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t(
                "Search FAQ, documents, offices, or procedures...",
                "搜尋問題、文件、單位或辦理流程..."
              )}
              className="flex-1 bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="px-4 py-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-navy"
              >
                {t("Clear", "清除")}
              </button>
            )}
          </div>

          <div className="-mx-4 mt-4 flex max-w-full snap-x gap-2 overflow-x-auto overscroll-x-contain scroll-smooth scroll-px-4 px-4 pb-2 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setExpandedId(null);
              }}
              className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                activeCategory === "all"
                  ? "border-amber bg-amber text-navy"
                  : "border-border bg-card text-muted-foreground hover:text-navy"
              }`}
            >
              {t("All", "全部")}
            </button>

            {categoriesWithTasks.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setActiveCategory(category.id);
                  setExpandedId(null);
                }}
                className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                  activeCategory === category.id
                    ? "border-amber bg-amber text-navy"
                    : "border-border bg-card text-muted-foreground hover:text-navy"
                }`}
              >
                {t(category.name_en, category.name_zh)}
              </button>
            ))}
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {hasActiveFilter
              ? t(
                  `Showing ${filteredTasks.length} of ${tasks.length} FAQ items`,
                  `顯示 ${filteredTasks.length} / ${tasks.length} 個常見問題`
                )
              : t(
                  `${tasks.length} FAQ items available`,
                  `目前共有 ${tasks.length} 個常見問題`
                )}
          </p>
        </div>
      </div>

      <div className="container max-w-5xl flex-1 py-6">
        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 font-display text-xl font-bold text-navy">
              {t("No FAQ items found", "找不到符合的常見問題")}
            </h2>
            <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
              {t(
                "Try another keyword, such as student ID, course selection, leave, dormitory, password, or health insurance.",
                "請改用其他關鍵字，例如學生證、選課、請假、宿舍、密碼或健康保險。"
              )}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
            >
              {t("Show all FAQ items", "顯示所有常見問題")}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedTasks.map((group) => (
              <section key={group.category.id} className="space-y-3">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <h2 className="font-display text-lg font-bold text-navy">
                    {t(group.category.name_en, group.category.name_zh)}
                  </h2>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t(`${group.tasks.length} FAQ items`, `${group.tasks.length} 個常見問題`)}
                  </span>
                </div>
                <div className="space-y-3">{group.tasks.map(renderTaskCard)}</div>
              </section>
            ))}

            {uncategorizedTasks.length > 0 && (
              <section className="space-y-3">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <h2 className="font-display text-lg font-bold text-navy">
                    {t("Other", "其他")}
                  </h2>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t(
                      `${uncategorizedTasks.length} FAQ items`,
                      `${uncategorizedTasks.length} 個常見問題`
                    )}
                  </span>
                </div>
                <div className="space-y-3">{uncategorizedTasks.map(renderTaskCard)}</div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
