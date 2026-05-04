/**
 * Header — Wayfinding Signage System
 * Deep navy bar with amber accents, persistent navigation
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "wouter";
import { Search, Map, Building2, Briefcase, ClipboardList, Menu, X, Globe } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", labelEn: "Home", labelZh: "首頁", icon: Search },
  { href: "/tasks", labelEn: "Tasks", labelZh: "常見任務", icon: ClipboardList },
  { href: "/map", labelEn: "Map", labelZh: "地圖", icon: Map },
  { href: "/offices", labelEn: "Offices", labelZh: "行政單位", icon: Briefcase },
  { href: "/departments", labelEn: "Departments", labelZh: "系所", icon: Building2 },

];

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-navy text-white sticky top-0 z-50 shadow-lg">
      <div className="container flex items-center justify-between h-14 md:h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center">
            <Map className="w-4 h-4 text-navy" />
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-bold text-sm leading-tight text-white">CCU Campus Guide</div>
            <div className="text-[10px] text-amber-light leading-tight opacity-80">
              {t("International Student Friendly", "國際生友善導引")}
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber text-navy"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {t(item.labelEn, item.labelZh)}
              </Link>
            );
          })}
        </nav>

        {/* Language + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === "en" ? "中文" : "EN"}
          </button>
          <button
            className="md:hidden p-1.5 rounded-md hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-white/10 pb-3">
          {navItems.map(item => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium ${
                  isActive
                    ? "bg-amber text-navy"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {t(item.labelEn, item.labelZh)}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
