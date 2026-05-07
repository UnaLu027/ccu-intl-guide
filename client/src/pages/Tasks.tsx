/**
 * Tasks — Wayfinding Signage System
 * Task-oriented navigation: step-by-step guides
 */

import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { tasks, offices, departments, type Task } from "@/data/campusData";
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
    .replace(/[_\-–—/.,:;|＋+()[\]{}]/g, " ")
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => taskMatchesQuery(task, query));
  }, [query]);

  const toggle = (id: string) => {
    const task = tasks.find(t => t.id === id);
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

    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="bg-navy/[0.03] border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-navy hover:text-amber transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <h1 className="font-display font-bold text-lg text-navy">
                {t("Common Tasks", "常見任務")}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t("Step-by-step guides for common needs", "常見需求的逐步指引")}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center bg-white rounded-lg border border-border overflow-hidden shadow-sm">
            <div className="pl-3">
              <Search className="w-4 h-4 text-navy/40" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(
                "Search tasks, documents, or procedures...",
                "搜尋任務、文件或辦理流程..."
              )}
              className="flex-1 px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none bg-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="px-4 py-3 text-xs font-semibold text-muted-foreground hover:text-navy transition-colors"
              >
                {t("Clear", "清除")}
              </button>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            {query
              ? t(
                  `Showing ${filteredTasks.length} of ${tasks.length} tasks`,
                  `顯示 ${filteredTasks.length} / ${tasks.length} 個任務`
                )
              : t(
                  `${tasks.length} task guides available`,
                  `目前共有 ${tasks.length} 個任務指引`
                )}
          </p>
        </div>
      </div>

      <div className="container py-6 flex-1 max-w-3xl">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display font-bold text-xl text-navy mb-2">
              {t("No tasks found", "找不到任務")}
            </h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              {t(
                "Try another keyword, such as student ID, course selection, leave, dormitory, password, or health insurance.",
                "請試試其他關鍵字，例如學生證、選課、請假、宿舍、密碼或健保。"
              )}
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
            >
              {t("Show all tasks", "顯示所有任務")}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const isExpanded = expandedId === task.id;

              let targetName = "";
              let targetBuilding = "";
              let navLink = "";

              if (task.target_unit_id) {
                if (task.target_unit_type === "office") {
                  const office = offices.find((o) => o.id === task.target_unit_id);

                  if (office) {
                    targetName = t(office.name_en, office.name_zh);
                    targetBuilding =
                      t(office.building_name_en, office.building_name_zh) +
                      " · " +
                      office.floor;
                    navLink = `/navigate/office/${office.id}`;
                  }
                } else {
                  const dept = departments.find((d) => d.id === task.target_unit_id);

                  if (dept) {
                    targetName = t(dept.name_en, dept.name_zh);
                    targetBuilding =
                      t(dept.building_name_en, dept.building_name_zh) +
                      " · " +
                      dept.floor;
                    navLink = `/navigate/dept/${dept.id}`;
                  }
                }
              }

              const requiredDocuments =
                lang === "en"
                  ? task.required_documents_en
                  : task.required_documents_zh;

              return (
                <div
                  key={task.id}
                  className="bg-card rounded-xl border border-border overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggle(task.id)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-5 h-5 text-amber" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm text-navy">
                        {t(task.task_name_en, task.task_name_zh)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {t(task.scenario_en, task.scenario_zh)}
                      </p>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-border">
                      <div className="mt-3 mb-4">
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {t(task.scenario_en, task.scenario_zh)}
                        </p>
                      </div>

                      {targetName && (
                        <div className="bg-cream rounded-lg p-3 mb-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                            {t("Go to", "前往")}
                          </p>

                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-navy shrink-0" />
                            <span className="font-display font-semibold text-sm text-navy">
                              {targetName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {targetBuilding}
                            </span>
                          </div>
                        </div>
                      )}

                      {requiredDocuments.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                            {t("Required Documents / Items", "所需文件／物品")}
                          </p>

                          <div className="bg-amber/5 border border-amber/20 rounded-lg p-3 space-y-2">
                            {requiredDocuments.map((doc, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                  {doc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          {t("Steps", "步驟")}
                        </p>

                        <div className="space-y-2">
                          {task.steps.map((step, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-navy">
                                  {i + 1}
                                </span>
                              </div>

                              <p className="text-sm text-foreground/80 leading-relaxed pt-0.5">
                                {t(step.en, step.zh)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/task/${task.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber text-navy text-xs font-semibold rounded-md hover:bg-amber-light transition-colors"
                        >
                          <ClipboardList className="w-3.5 h-3.5" />
                          {t("View full task guide", "查看完整任務指引")}
                        </Link>

                        {navLink && (
                          <Link
                            href={navLink}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-navy text-white text-xs font-semibold rounded-md hover:bg-navy-light transition-colors"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            {t("Navigate to this office", "導航至此單位")}
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
