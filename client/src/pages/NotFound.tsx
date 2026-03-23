/**
 * NotFound — Wayfinding Signage System
 * 404 page with bilingual support
 */
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { ArrowLeft, MapPin } from "lucide-react";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-4 py-16">
          <div className="w-20 h-20 rounded-full bg-navy/10 flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-navy/40" />
          </div>
          <h1 className="font-display font-bold text-5xl text-navy mb-2">404</h1>
          <h2 className="font-display font-semibold text-xl text-navy mb-3">
            {t("Page Not Found", "找不到此頁面")}
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto leading-relaxed">
            {t(
              "Sorry, the page you are looking for doesn't exist. It may have been moved or deleted.",
              "抱歉，您尋找的頁面不存在。它可能已被移動或刪除。"
            )}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-lg text-sm font-display font-semibold hover:bg-navy-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("Back to Home", "回首頁")}
          </Link>
        </div>
      </div>
    </div>
  );
}
