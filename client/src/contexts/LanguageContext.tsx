import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Lang = "en" | "zh";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, zh: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (en) => en,
});

function detectDefaultLang(): Lang {
  try {
    const stored = localStorage.getItem("ccu-guide-lang");
    if (stored === "en" || stored === "zh") return stored;
  } catch {}
  // Auto-detect from browser
  const browserLang = navigator.language || "";
  if (browserLang.startsWith("zh")) return "zh";
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectDefaultLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("ccu-guide-lang", l);
    } catch {}
  };

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-TW" : "en";
  }, [lang]);

  const t = (en: string, zh: string) => (lang === "en" ? en : zh);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
