import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface LocationPhoto {
  src?: string;
  label_en: string;
  label_zh: string;
  fit?: "cover" | "contain";
}

function PhotoCard({
  src,
  label,
  alt,
  fit = "cover",
}: {
  src: string;
  label: string;
  alt: string;
  fit?: "cover" | "contain";
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <figure className="min-w-0">
      <figcaption className="text-xs font-medium text-muted-foreground mb-1">
        {label}
      </figcaption>
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-cream">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      </div>
    </figure>
  );
}

interface LocationPhotosProps {
  photos: LocationPhoto[];
  className?: string;
}

export function LocationPhotos({ photos, className }: LocationPhotosProps) {
  const { t } = useLanguage();
  const available = photos.filter((p) => Boolean(p.src));

  if (available.length === 0) return null;

  return (
    <div className={className ?? "mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3"}>
      {available.map((photo) => {
        const label = t(photo.label_en, photo.label_zh);
        return (
          <PhotoCard
            key={`${photo.label_en}-${photo.src}`}
            src={photo.src!}
            label={label}
            alt={label}
            fit={photo.fit}
          />
        );
      })}
    </div>
  );
}
