import Header from "@/components/Header";
import { useCampusData } from "@/contexts/CampusDataContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getCategoryName,
  getStudentGuideById,
  type HandbookBlock,
  type LocalizedTableValue,
  type StudentGuide,
  type StudentGuideCategoryId,
  type StudentGuideSection,
} from "@/data/studentGuideData";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckSquare,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";

type FilterId = "all" | StudentGuideCategoryId;

function localized(value: LocalizedTableValue | undefined, lang: "en" | "zh") {
  if (!value) return "";
  if (typeof value === "string") return value;
  return lang === "en" ? value.en : value.zh;
}

function blockSearchText(block: HandbookBlock) {
  return JSON.stringify(block).toLowerCase();
}

function sectionMatches(section: StudentGuideSection, query: string, filter: FilterId) {
  if (filter !== "all" && section.categoryId !== filter) return false;
  if (!query.trim()) return true;

  const needle = query.trim().toLowerCase();
  return [
    section.title_en,
    section.title_zh,
    section.summary_en,
    section.summary_zh,
    section.tags_en.join(" "),
    section.tags_zh.join(" "),
    ...(section.sourceReferences ?? []).flatMap((source) => [
      source.documentTitle_en,
      source.documentTitle_zh,
      source.pages,
    ]),
    ...section.blocks.map(blockSearchText),
  ]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

function SourceBadge({ section }: { section: StudentGuideSection }) {
  const { lang } = useLanguage();
  if (!section.sourceReferences?.length) return null;

  const label =
    lang === "en"
      ? `Source: ${section.sourceReferences
          .map((source) => `${source.documentTitle_en}, ${source.pages}`)
          .join("; ")}`
      : `來源：${section.sourceReferences
          .map((source) => `${source.documentTitle_zh}，${source.pages}`)
          .join("；")}`;

  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
      {label}
    </span>
  );
}

function GuideBlockView({ block }: { block: HandbookBlock }) {
  const { lang, t } = useLanguage();

  if (block.type === "paragraph") {
    return <p className="text-sm leading-7 text-foreground/85 md:text-base">{t(block.content_en, block.content_zh)}</p>;
  }

  if (block.type === "note") {
    const isWarning = block.tone === "warning";
    return (
      <div className={`flex gap-3 rounded-lg border p-4 text-sm leading-6 ${isWarning ? "border-amber/40 bg-amber/10 text-navy" : "border-navy/15 bg-navy/[0.04] text-foreground/85"}`}>
        <AlertCircle className={`mt-0.5 h-4 w-4 shrink-0 ${isWarning ? "text-amber" : "text-navy"}`} />
        <p>{t(block.content_en, block.content_zh)}</p>
      </div>
    );
  }

  if (block.type === "checklist") {
    return (
      <ul className="space-y-3">
        {block.items.map((item, index) => (
          <li key={`${item.en}-${index}`} className="flex gap-3 rounded-lg border border-border bg-card p-3">
            <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
            <div>
              <p className="text-sm leading-6 text-foreground/90">{t(item.en, item.zh)}</p>
              {(item.note_en || item.note_zh) && (
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{t(item.note_en ?? "", item.note_zh ?? "")}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "timeline") {
    return (
      <div className="space-y-3">
        {block.items.map((item, index) => (
          <div key={`${item.date}-${index}`} className="grid gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-[170px_1fr]">
            <div className="inline-flex w-fit items-center gap-2 rounded-md bg-navy/[0.06] px-2.5 py-1 text-xs font-bold text-navy">
              <CalendarDays className="h-3.5 w-3.5" />
              {item.date}
            </div>
            <p className="text-sm leading-6 text-foreground/90">{t(item.event_en, item.event_zh)}</p>
          </div>
        ))}
      </div>
    );
  }

  if (block.type === "table") {
    return (
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-muted/70 text-xs font-bold text-muted-foreground">
            <tr>
              {block.columns.map((column) => (
                <th key={column.key} className="px-4 py-3">{t(column.label_en, column.label_zh)}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {block.columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 align-top leading-6 text-foreground/85">
                    {localized(row[column.key], lang)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === "links") {
    return (
      <div className="flex flex-wrap gap-2">
        {block.links.map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-border px-3 py-2 text-left text-xs font-semibold text-navy transition-colors hover:bg-muted">
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <span className="break-words">{t(link.label_en, link.label_zh)}</span>
          </a>
        ))}
      </div>
    );
  }

  if (block.type === "contact") {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="font-display text-base font-bold text-navy">{t(block.name_en, block.name_zh)}</h3>
        <div className="mt-3 grid gap-2 text-sm text-foreground/80">
          {block.location_en && block.location_zh && (
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-amber" />{t(block.location_en, block.location_zh)}</div>
          )}
          {block.email && (
            <a href={`mailto:${block.email}`} className="flex items-center gap-2 hover:text-amber"><Mail className="h-4 w-4 text-amber" />{block.email}</a>
          )}
          {block.phone && (
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-amber" />{block.phone}</div>
          )}
        </div>
        {block.links && block.links.length > 0 && (
          <div className="mt-4"><GuideBlockView block={{ type: "links", links: block.links }} /></div>
        )}
      </div>
    );
  }

  return null;
}

function GuideToc({ sections, activeId }: { sections: StudentGuideSection[]; activeId: string }) {
  const { t } = useLanguage();

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-lg border border-border bg-card p-4">
        <h2 className="font-display text-sm font-bold text-muted-foreground">
          {t("Contents", "目錄")}
        </h2>
        <nav className="mt-3 space-y-1">
          {sections.map((section, index) => (
            <button key={section.id} type="button" onClick={() => scrollToSection(section.id)} className={`flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors ${activeId === section.id ? "bg-amber/15 font-bold text-navy" : "text-muted-foreground hover:bg-muted hover:text-navy"}`}>
              <span className="mt-0.5 text-xs font-bold">{String(index + 1).padStart(2, "0")}</span>
              <span>{t(section.title_en, section.title_zh)}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function GuideArticle({
  guide,
  section,
  previous,
  next,
}: {
  guide: StudentGuide;
  section: StudentGuideSection;
  previous?: StudentGuideSection;
  next?: StudentGuideSection;
}) {
  const { t } = useLanguage();
  const { tasks } = useCampusData();
  const category = getCategoryName(guide, section.categoryId);
  const relatedTasks = (section.relatedTaskIds ?? [])
    .map((taskId) => tasks.find((task) => task.id === taskId))
    .filter(Boolean);

  return (
    <article id={section.id} className="min-w-0 scroll-mt-28 rounded-xl border border-border bg-card p-5 shadow-sm md:p-7">
      <div className="mb-5">
        <div className="flex flex-wrap gap-2">
          <SourceBadge section={section} />
          {category && (
            <span className="rounded-full border border-amber/40 bg-amber/10 px-2.5 py-1 text-xs font-bold text-navy">
              {t(category.name_en, category.name_zh)}
            </span>
          )}
          <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-bold text-muted-foreground">
            {guide.id === "degree" ? t("Degree-Seeking Student", "學位生") : t("Exchange Student", "交換生")}
          </span>
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-navy md:text-3xl">
          {t(section.title_en, section.title_zh)}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t(section.summary_en, section.summary_zh)}
        </p>
      </div>

      <div className="space-y-5">
        {section.blocks.map((block, blockIndex) => (
          <GuideBlockView key={`${section.id}-${block.type}-${blockIndex}`} block={block} />
        ))}
      </div>

      {relatedTasks.length > 0 && (
        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-navy">
            <BookOpen className="h-4 w-4 text-amber" />
            {t("Related task guides", "相關任務指引")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedTasks.map((task) => task && (
              <Link key={task.id} href={`/task/${task.id}`} className="rounded-md border border-border bg-card px-3 py-2 text-xs font-bold text-navy transition-colors hover:bg-muted">
                {t(task.task_name_en, task.task_name_zh)}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        {previous ? (
          <button type="button" onClick={() => scrollToSection(previous.id)} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-bold text-navy transition-colors hover:bg-muted">
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("Previous", "上一章")}：{t(previous.title_en, previous.title_zh)}
          </button>
        ) : <span />}
        {next && (
          <button type="button" onClick={() => scrollToSection(next.id)} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-bold text-navy transition-colors hover:bg-muted">
            {t("Next", "下一章")}：{t(next.title_en, next.title_zh)}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </article>
  );
}

export default function StudentGuidePage() {
  const { t } = useLanguage();
  const { guideId } = useParams<{ guideId: string }>();
  const guide = getStudentGuideById(guideId);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeId, setActiveId] = useState("");
  const [progress, setProgress] = useState(0);

  const filteredSections = useMemo(
    () => (guide ? guide.sections.filter((section) => sectionMatches(section, query, filter)) : []),
    [guide, query, filter]
  );
  const showContents = filter === "all";

  useEffect(() => {
    setFilter("all");
    setQuery("");
    setActiveId("");
  }, [guideId]);

  useEffect(() => {
    if (filteredSections[0] && !filteredSections.some((section) => section.id === activeId)) {
      setActiveId(filteredSections[0].id);
    }
  }, [filteredSections, activeId]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-120px 0px -55% 0px", threshold: [0.1, 0.25, 0.5] }
    );
    filteredSections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [filteredSections]);

  if (!guide) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-navy">{t("Guide not found", "找不到指南")}</h1>
          <Link href="/guides/degree" className="mt-4 inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-bold text-white">
            <ArrowLeft className="h-4 w-4" />
            {t("Back to New Student Guide", "回到新生指南")}
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="sticky top-14 z-40 h-1 bg-muted md:top-16">
        <div className="h-full bg-amber transition-all" style={{ width: `${progress}%` }} />
      </div>

      <main className="container py-8 md:py-10">
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-navy">{t("Home", "首頁")}</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-navy">{t("New Student Guide", "新生指南")}</Link>
          <span>/</span>
          <span className="text-navy">{t(guide.title_en, guide.title_zh)}</span>
        </nav>

        <section className="mb-8">
          <h1 className="font-display text-3xl font-bold leading-tight text-navy md:text-5xl">
            {t(guide.title_en, guide.title_zh)}
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground md:text-base">
            {t(guide.description_en, guide.description_zh)}
          </p>
        </section>

        <section className="mb-6 space-y-4">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Search this guide, e.g. ARC, dormitory, payment...", "搜尋此指南，例如 ARC、宿舍、繳費...")}
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-amber"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <button type="button" onClick={() => setFilter("all")} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${filter === "all" ? "border-amber bg-amber text-navy" : "border-border bg-card text-muted-foreground hover:text-navy"}`}>
              {t("All", "全部")}
            </button>
            {guide.filters.map((option) => (
              <button key={option.id} type="button" onClick={() => setFilter(option.id)} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${filter === option.id ? "border-amber bg-amber text-navy" : "border-border bg-card text-muted-foreground hover:text-navy"}`}>
                {t(option.name_en, option.name_zh)}
              </button>
            ))}
          </div>

          {showContents && (
            <select value={activeId} onChange={(event) => scrollToSection(event.target.value)} className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm font-semibold text-navy outline-none focus:border-amber lg:hidden">
              {filteredSections.map((section) => (
                <option key={section.id} value={section.id}>{t(section.title_en, section.title_zh)}</option>
              ))}
            </select>
          )}
        </section>

        {filteredSections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <p className="font-display text-lg font-bold text-navy">{t("No matching sections", "沒有符合條件的章節")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("Try another keyword or category.", "請改用其他關鍵字或分類。")}</p>
          </div>
        ) : (
          <div className={showContents ? "grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]" : "mx-auto max-w-5xl"}>
            {showContents && <GuideToc sections={filteredSections} activeId={activeId} />}
            <div className="min-w-0 space-y-8">
              {filteredSections.map((section, index) => (
                <GuideArticle
                  key={section.id}
                  guide={guide}
                  section={section}
                  previous={filteredSections[index - 1]}
                  next={filteredSections[index + 1]}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
