/**
 * RelatedSites — External resources related to international student campus life
 */

import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import {
  ArrowLeft,
  ExternalLink,
  Globe2,
  MapPin,
  Utensils,
} from "lucide-react";

const relatedSites = [
  {
    id: "halal-map",
    titleZh: "清真食刻 HalalMap",
    titleEn: "HalalMap",
    descriptionZh:
      "提供清真飲食與穆斯林友善餐飲資訊，適合國際學生查找校外飲食選擇。",
    descriptionEn:
      "A halal food and Muslim-friendly dining resource for international students looking for dining options.",
    url: "https://halal-web-j3od.onrender.com/",
    icon: Utensils,
  },
];

export default function RelatedSites() {
  const { t } = useLanguage();

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
                {t("Related Sites", "相關網站")}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t(
                  "Useful external resources for international students",
                  "提供國際學生參考的校園生活相關外部資源"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 flex-1 max-w-4xl">
        <div className="mb-5 bg-cream rounded-xl border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center shrink-0">
              <Globe2 className="w-5 h-5 text-navy" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-navy mb-1">
                {t("External Resources", "外部資源")}
              </h2>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {t(
                  "These links are provided as helpful references. Please check each website for the most up-to-date information.",
                  "以下連結作為實用參考，實際資訊請以各網站最新公告為準。"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relatedSites.map((site) => {
            const Icon = site.icon;

            return (
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:border-amber transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-amber" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold text-base text-navy">
                        {t(site.titleEn, site.titleZh)}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-amber shrink-0" />
                    </div>

                    <p className="text-sm text-foreground/70 leading-relaxed mb-3">
                      {t(site.descriptionEn, site.descriptionZh)}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{site.url}</span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
