/**
 * Offices — Wayfinding Signage System
 * Lists all administrative offices
 */
import Header from "@/components/Header";
import { OfficeCard } from "@/components/ResultCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { offices } from "@/data/campusData";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { ArrowLeft, Search, Briefcase } from "lucide-react";

export default function Offices() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return offices;
    const q = search.toLowerCase();
    return offices.filter(o =>
      o.name_en.toLowerCase().includes(q) ||
      o.name_zh.includes(q) ||
      o.function_desc_en.toLowerCase().includes(q) ||
      o.function_desc_zh.includes(q)
    );
  }, [search]);

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
              {t("Administrative Offices", "行政單位")}
            </h1>
            <span className="text-xs bg-navy/10 text-navy px-2 py-0.5 rounded-full font-semibold">
              {filtered.length}
            </span>
          </div>

          <div className="flex items-center bg-white rounded-lg border border-border overflow-hidden shadow-sm">
            <div className="pl-3">
              <Search className="w-4 h-4 text-navy/40" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search offices...", "搜尋行政單位...")}
              className="flex-1 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none bg-transparent"
            />
          </div>
        </div>
      </div>

      <div className="container py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(o => (
            <OfficeCard key={o.id} office={o} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">{t("No offices found.", "找不到行政單位。")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
