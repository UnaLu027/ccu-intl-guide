import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "wouter";
import {
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  Globe,
  Map,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";

const guideChildren = [
  {
    href: "/guides/degree",
    labelEn: "Degree-Seeking Student Guide",
    labelZh: "學位生新生指南",
  },
  {
    href: "/guides/exchange",
    labelEn: "Exchange Student Guide",
    labelZh: "交換生新生指南",
  },
];

const navItems = [
  { href: "/", labelEn: "Home", labelZh: "首頁", icon: Search },
  { href: "/guides/degree", labelEn: "New Student Guide", labelZh: "新生指南", icon: BookOpen, children: guideChildren },
  { href: "/tasks", labelEn: "FAQ", labelZh: "常見問題", icon: ClipboardList },
  { href: "/map", labelEn: "Map", labelZh: "地圖", icon: Map },
  { href: "/offices", labelEn: "Offices", labelZh: "行政單位", icon: Briefcase },
  { href: "/departments", labelEn: "Departments", labelZh: "系所", icon: Building2 },
  { href: "/related-sites", labelEn: "Related Sites", labelZh: "相關網站", icon: ExternalLink },
];

function isActivePath(location: string, href: string, hasChildren?: boolean) {
  if (href === "/") return location === "/";
  if (hasChildren && href.startsWith("/guides")) return location.startsWith("/guides") || location === "/handbook";
  return location === href;
}

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGuidesOpen, setMobileGuidesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy text-white shadow-lg">
      <div className="container flex h-14 items-center justify-between md:h-16">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber">
            <Map className="h-4 w-4 text-navy" />
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-sm font-bold leading-tight text-white">CCU Campus Guide</div>
            <div className="text-[10px] leading-tight text-amber-light opacity-80">
              {t("International Student Friendly", "國際生友善導引")}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(location, item.href, Boolean(item.children));

            if (item.children) {
              return (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      active ? "bg-amber text-navy" : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.labelEn, item.labelZh)}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-0 top-full min-w-[230px] pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="rounded-lg border border-white/10 bg-navy p-1.5 shadow-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                            location === child.href ? "bg-amber text-navy" : "text-white/85 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {t(child.labelEn, child.labelZh)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active ? "bg-amber text-navy" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t(item.labelEn, item.labelZh)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
            className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs font-semibold transition-colors hover:bg-white/20"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "en" ? "中" : "EN"}
          </button>
          <button
            className="rounded-md p-1.5 hover:bg-white/10 xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("Close menu", "關閉選單") : t("Open menu", "開啟選單")}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/10 pb-3 xl:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(location, item.href, Boolean(item.children));

            if (item.children) {
              return (
                <div key={item.href}>
                  <div className={`flex items-center ${active ? "bg-amber text-navy" : "text-white/80"}`}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex min-w-0 flex-1 items-center gap-2 px-4 py-2.5 text-sm font-medium"
                    >
                      <Icon className="h-4 w-4" />
                      {t(item.labelEn, item.labelZh)}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileGuidesOpen((open) => !open)}
                      className="mr-2 rounded-md p-2 hover:bg-white/10"
                      aria-label={t("Show guide options", "顯示指南選項")}
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileGuidesOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  {mobileGuidesOpen && (
                    <div className="bg-black/10 py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block px-10 py-2 text-sm font-semibold transition-colors ${
                            location === child.href ? "text-amber" : "text-white/75 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {t(child.labelEn, child.labelZh)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium ${
                  active ? "bg-amber text-navy" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t(item.labelEn, item.labelZh)}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
