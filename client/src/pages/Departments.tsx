/**
 * Departments — Wayfinding Signage System
 * Lists all departments grouped by college
 */
import Header from "@/components/Header";
import { DeptCard } from "@/components/ResultCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { departments, getColleges } from "@/data/campusData";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { ArrowLeft, Search, Building2 } from "lucide-react";

export default function Departments() {
  const { t } = useLanguage();
  const colleges = useMemo(() => getColleges(), []);
  const [search, setSearch] = useState("");
  const [activeCollege, setActiveCollege] = useState<string | "all">("all");

  const filtered = useMemo(() => {
    let depts = departments;
    if (activeCollege !== "all") {
      depts = depts.filter(d => d.college_en === activeCollege);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      depts = depts.filter(d =>
        d.name_en.toLowerCase().includes(q) ||
        d.name_zh.includes(q) ||
        d.college_en.toLowerCase().includes(q) ||
        d.college_zh.includes(q)
      );
    }
    return depts;
  }, [search, activeCollege]);

  // Group by college
  const grouped = useMemo(() => {
    const map = new Map<string, typeof departments>();
    filtered.forEach(d => {
      const key = d.college_en;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    });
    return map;
  }, [filtered]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="bg-navy/[0.03] border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/" className="text-navy hover:text-amber transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display font-bold text-lg text-navy">
              {t("Departments", "系所")}
            </h1>
            <span className="text-xs bg-sage/10 text-sage px-2 py-0.5 rounded-full font-semibold">
              {filtered.length}
            </span>
          </div>

          {/* Search */}
          <div className="flex items-center bg-white rounded-lg border border-border overflow-hidden shadow-sm mb-3">
            <div className="pl-3">
              <Search className="w-4 h-4 text-navy/40" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search departments...", "搜尋系所...")}
              className="flex-1 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none bg-transparent"
            />
          </div>

          {/* College filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCollege("all")}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeCollege === "all" ? "bg-navy text-white" : "bg-muted text-muted-foreground hover:bg-navy/10"
              }`}
            >
              {t("All Colleges", "全部學院")}
            </button>
            {colleges.map(c => (
              <button
                key={c.en}
                onClick={() => setActiveCollege(c.en)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  activeCollege === c.en ? "bg-navy text-white" : "bg-muted text-muted-foreground hover:bg-navy/10"
                }`}
              >
                {t(c.en, c.zh)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-6 flex-1">
        {Array.from(grouped.entries()).map(([college, depts]) => (
          <div key={college} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-sage" />
              <h2 className="font-display font-bold text-lg text-navy">
                {t(college, depts[0]?.college_zh || college)}
              </h2>
              <span className="text-xs bg-sage/10 text-sage px-2 py-0.5 rounded-full font-semibold">
                {depts.length}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {depts.map(d => (
                <DeptCard key={d.id} dept={d} />
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">{t("No departments found.", "找不到系所。")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
