import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CcuGptOpenChangeEvent extends Event {
  detail?: {
    isOpen?: boolean;
  };
}

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCcugptOpen, setIsCcugptOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleCcugptOpenChange = (event: Event) => {
      const customEvent = event as CcuGptOpenChangeEvent;
      setIsCcugptOpen(Boolean(customEvent.detail?.isOpen));
    };

    window.addEventListener("ccugpt-open-change", handleCcugptOpenChange);
    return () => window.removeEventListener("ccugpt-open-change", handleCcugptOpenChange);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed z-40 flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white shadow-lg",
        "transition-all duration-200 hover:bg-amber hover:text-navy focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2",
        isCcugptOpen ? "bottom-6 left-4 md:left-auto md:right-[27rem]" : "bottom-24 right-4 md:right-6",
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
