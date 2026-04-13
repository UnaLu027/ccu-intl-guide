/**
 * Home Page — Wayfinding Signage System
 * Core: Search by need + Browse by service category as PRIMARY features
 * Secondary: Task cards + Map link
 */
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { serviceCategories, tasks } from "@/data/campusData";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  Search, ArrowRight, MapPin, ClipboardCheck, CreditCard, Globe,
  Building2, Home as HomeIcon, Heart, BookOpen, Users, GraduationCap,
  Coffee, FileText, Wallet, Map, Briefcase, ClipboardList, ChevronRight
} from "lucide-react";

const iconMap: Record<string, any> = {
  ClipboardCheck, CreditCard, Globe, Building2, Home: HomeIcon, Heart,
  BookOpen, Users, GraduationCap, Coffee, FileText, Wallet,
};

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663396652016/g6LMxGSA2rgtuUprCFszqV/hero-campus-FU8kH2V5cadGmTgQdDgRbz.webp";
const SEARCH_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663396652016/g6LMxGSA2rgtuUprCFszqV/search-illustration-2rkisfcPztftcobiw54YW8.webp";
const INDOOR_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663396652016/g6LMxGSA2rgtuUprCFszqV/indoor-nav-YLrbaXmBfWpxLkGtwnCFMb.webp";
const CAMPUS_LIFE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663396652016/g6LMxGSA2rgtuUprCFszqV/campus-life-8shYtMUQpmFKEekGPQmTo2.webp";

const searchExamples = [
  "registration", "student ID", "dormitory", "department office",
  "international office", "library", "health center", "transcript",
  "course selection", "tuition"
];

export default function Home() {
  const { t, lang } = useLanguage();
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleExampleClick = (example: string) => {
    navigate(`/search?q=${encodeURIComponent(example)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ===== HERO SECTION — SEARCH AS PRIMARY ===== */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/75 to-navy/90" />
        </div>

        <div className="relative container py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white mb-3 leading-tight">
              {t(
                "Find the Right Office for Your Need",
                "從你的需求出發，找到正確的單位"
              )}
            </h1>
            <p className="text-white/80 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {t(
                "Don't know where to go? Just type what you need — we'll guide you to the right office, show you what they do, and help you get there.",
                "不知道該去哪裡？只要輸入你的需求，我們會推薦正確的單位、說明服務內容，並帶你到達目的地。"
              )}
            </p>

            {/* ===== MAIN SEARCH BAR ===== */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6">
              <div className="flex items-center bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="pl-4">
                  <Search className="w-5 h-5 text-navy/40" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t(
                    "What do you need? e.g. registration, student ID, dormitory...",
                    "你需要什麼？例如：註冊、學生證、宿舍..."
                  )}
                  className="flex-1 px-3 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="px-5 py-4 bg-amber text-navy font-display font-bold text-sm hover:bg-amber-light transition-colors"
                >
                  {t("Search", "搜尋")}
                </button>
              </div>
            </form>

            {/* Search examples */}
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              <span className="text-white/50 text-xs mt-1">{t("Try:", "試試：")}</span>
              {searchExamples.slice(0, 6).map(ex => (
                <button
                  key={ex}
                  onClick={() => handleExampleClick(ex)}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white/80 hover:bg-white/25 hover:text-white transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICE CATEGORIES — SECOND PRIMARY FEATURE ===== */}
      <section className="container py-10 md:py-14">
        <div className="text-center mb-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-navy mb-2">
            {t("Browse by Service Category", "依服務類別瀏覽")}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            {t(
              "Select a category below to find the offices and departments that can help you.",
              "選擇下方的服務類別，找到能幫助你的單位。"
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
          {serviceCategories.map(cat => {
            const Icon = iconMap[cat.icon] || Globe;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="group flex flex-col items-center gap-2 p-4 md:p-5 bg-card rounded-xl border border-border hover:border-amber hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-navy/5 group-hover:bg-amber/15 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-navy group-hover:text-amber transition-colors" />
                </div>
                <span className="font-display font-semibold text-sm text-center text-navy leading-tight">
                  {t(cat.name_en, cat.name_zh)}
                </span>
                <span className="text-[11px] text-muted-foreground text-center leading-snug line-clamp-2">
                  {t(cat.description_en, cat.description_zh)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== COMMON TASKS — TASK-ORIENTED NAVIGATION ===== */}
      <section className="bg-navy/[0.03] py-10 md:py-14">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-navy mb-1">
                {t("Common Tasks", "常見任務")}
              </h2>
              <p className="text-muted-foreground text-sm">
                {t("Quick access to frequently needed services", "快速存取常用服務")}
              </p>
            </div>
            <Link
              href="/tasks"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-amber hover:text-navy transition-colors"
            >
              {t("View all", "查看全部")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tasks.slice(0, 6).map(task => (
              <Link
                key={task.id}
                href={task.target_unit_id ? `/navigate/${task.target_unit_type === "office" ? "office" : "dept"}/${task.target_unit_id}` : "/tasks"}
                className="group flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-amber hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-amber" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm text-navy truncate">
                    {t(task.task_name_en, task.task_name_zh)}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {t(task.scenario_en, task.scenario_zh)}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-amber transition-colors shrink-0" />
              </Link>
            ))}
          </div>

          <div className="sm:hidden mt-4 text-center">
            <Link
              href="/tasks"
              className="inline-flex items-center gap-1 text-sm font-semibold text-amber"
            >
              {t("View all tasks", "查看所有任務")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== QUICK ACCESS CARDS ===== */}
      <section className="container py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Campus Map */}
          <Link
            href="/map"
            className="group relative overflow-hidden rounded-xl h-48 md:h-56"
          >
            <img src={SEARCH_IMG} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-navy/20 group-hover:from-navy/90 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center gap-2 mb-1">
                <Map className="w-5 h-5 text-amber" />
                <h3 className="font-display font-bold text-lg text-white">
                  {t("Campus Map", "校園地圖")}
                </h3>
              </div>
              <p className="text-white/70 text-sm">
                {t("Browse all locations on the interactive map", "在互動地圖上瀏覽所有地點")}
              </p>
            </div>
          </Link>

          {/* Departments */}
          <Link
            href="/departments"
            className="group relative overflow-hidden rounded-xl h-48 md:h-56"
          >
            <img src={CAMPUS_LIFE_IMG} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-navy/20 group-hover:from-navy/90 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-5 h-5 text-amber" />
                <h3 className="font-display font-bold text-lg text-white">
                  {t("Departments", "系所")}
                </h3>
              </div>
              <p className="text-white/70 text-sm">
                {t("Find your department office by college", "依學院找到你的系辦")}
              </p>
            </div>
          </Link>

          {/* Offices */}
          <Link
            href="/offices"
            className="group relative overflow-hidden rounded-xl h-48 md:h-56"
          >
            <img src={INDOOR_IMG} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-navy/20 group-hover:from-navy/90 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-5 h-5 text-amber" />
                <h3 className="font-display font-bold text-lg text-white">
                  {t("Administrative Offices", "行政單位")}
                </h3>
              </div>
              <p className="text-white/70 text-sm">
                {t("View all administrative offices and services", "查看所有行政單位與服務")}
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-navy text-white/70 py-8 mt-auto">
        <div className="container text-center">
          <p className="text-sm mb-2">
            {t(
              "CCU International Student Friendly Campus Guide",
              "國立中正大學國際生友善校園導引系統"
            )}
          </p>
          <p className="text-xs text-white/40">
            {t(
              "Data sourced from official CCU websites. Some information may need manual verification.",
              "資料來源為中正大學官方網站。部分資訊可能需要人工確認。"
            )}
          </p>
          <p className="text-xs text-white/30 mt-2">
            National Chung Cheng University · Chiayi, Taiwan
          </p>
        </div>
      </footer>
    </div>
  );
}
