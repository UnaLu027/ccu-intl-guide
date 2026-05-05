/**
 * SearchResults — Wayfinding Signage System
 * Core feature: Shows results based on user's typed need
 */
import Header from "@/components/Header";
import { OfficeCard, DeptCard } from "@/components/ResultCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { searchByNeed, tasks, type Task } from "@/data/campusData";
import { Link, useSearch, useLocation } from "wouter";
import { useState, useMemo } from "react";
import { Search, ArrowLeft, ClipboardList, ChevronRight, Building2, Briefcase, AlertCircle } from "lucide-react";

function TaskMiniCard({ task }: { task: Task }) {
  const { t } = useLanguage();
  return (
    <Link
      href={`/task/${task.id}`}
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

export default function SearchResults() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const searchParams = useSearch();
  const params = new URLSearchParams(searchParams);
  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    return searchByNeed(initialQuery);
  }, [initialQuery]);

  const totalResults = results.offices.length + results.departments.length + results.tasks.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Search bar */}
      <div className="bg-navy/[0.03] border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/" className="text-navy hover:text-amber transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display font-bold text-lg text-navy">
              {t("Search Results", "搜尋結果")}
            </h1>
          </div>
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-lg border border-border overflow-hidden shadow-sm">
            <div className="pl-3">
              <Search className="w-4 h-4 text-navy/40" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("What do you need?", "你需要什麼？")}
              className="flex-1 px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none bg-transparent"
            />
            <button type="submit" className="px-4 py-3 bg-amber text-navy font-display font-bold text-sm hover:bg-amber-light transition-colors">
              {t("Search", "搜尋")}
            </button>
          </form>
          {initialQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              {t(
                `Found ${totalResults} result${totalResults !== 1 ? "s" : ""} for "${initialQuery}"`,
                `找到 ${totalResults} 個「${initialQuery}」的結果`
              )}
            </p>
          )}
        </div>
      </div>

      <div className="container py-6 flex-1">
        {totalResults === 0 && initialQuery && (
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display font-bold text-xl text-navy mb-2">
              {t("No results found", "找不到結果")}
            </h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              {t(
                "Try different keywords, or browse by service category on the home page.",
                "試試不同的關鍵字，或回首頁依服務類別瀏覽。"
              )}
            </p>
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t("Back to Home", "回首頁")}
            </Link>
          </div>
        )}

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

        {/* Recommended Offices */}
        {results.offices.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-5 h-5 text-navy" />
              <h2 className="font-display font-bold text-lg text-navy">
                {t("Recommended Offices", "推薦單位")}
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

        {/* Related Departments */}
        {results.departments.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-sage" />
              <h2 className="font-display font-bold text-lg text-navy">
                {t("Related Departments", "相關系所")}
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
