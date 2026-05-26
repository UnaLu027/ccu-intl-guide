import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TaskStep } from "@/data/campusData";
import { buildTaskLinks, extractUrlsFromText } from "@/lib/taskLinks";

interface TaskStepContentProps {
  step: TaskStep;
  index?: number;
  className?: string;
  textClassName?: string;
}

export default function TaskStepContent({ step, className, textClassName }: TaskStepContentProps) {
  const { t } = useLanguage();
  const stepText = t(step.en, step.zh);
  const { cleanedText, urls } = extractUrlsFromText(stepText);
  const links = buildTaskLinks(urls, step.links, t);

  return (
    <div className={`min-w-0 flex-1 ${className ?? ""}`}>
      <p className={textClassName ?? "text-sm text-foreground/80 leading-relaxed pt-0.5"}>
        {cleanedText || stepText}
      </p>

      {links.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {links.map((link, linkIndex) => (
            <a
              key={`${link.url}-${linkIndex}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full min-h-9 min-w-0 items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-left text-xs font-semibold leading-snug text-navy transition-colors hover:bg-muted"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span className="min-w-0 break-words">{link.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
