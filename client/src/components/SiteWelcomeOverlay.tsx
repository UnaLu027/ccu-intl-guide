import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Briefcase, Building2, ClipboardList, Map, Map as MapIcon, MessageCircle } from "lucide-react";

const SESSION_KEY = "site-welcome-shown";

const quickLinks = [
  { href: "/guides/welcome", label: "New Student Guide", icon: BookOpen },
  { href: "/tasks", label: "FAQ", icon: ClipboardList },
  { href: "/map", label: "Campus Map", icon: Map },
  { href: "/offices", label: "Offices", icon: Briefcase },
  { href: "/departments", label: "Departments", icon: Building2 },
];

export default function SiteWelcomeOverlay() {
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch { return false; }
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
    const t1 = setTimeout(() => setFading(true), 7000);
    const t2 = setTimeout(() => setDismissed(true), 7700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dismiss = () => {
    if (fading || dismissed) return;
    setFading(true);
    setTimeout(() => setDismissed(true), 700);
  };

  if (dismissed) return null;

  return (
    <div
      aria-modal
      role="dialog"
      aria-label="Welcome to CCU Campus Guide"
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-navy transition-opacity duration-700 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Decorative background circles */}
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber/5" />
      <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/[0.03]" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.015]" />

      {/* Site cover card */}
      <div className="relative mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center md:p-10">

        {/* Badge */}
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-amber/20 px-3 py-1 text-xs font-semibold text-amber">
          <MapIcon className="h-3.5 w-3.5" />
          National Chung Cheng University
        </span>

        {/* Title */}
        <h1 className="font-display mb-1 text-2xl font-bold leading-tight text-white md:text-3xl">
          Welcome to CCU Campus Guide
        </h1>
        <p className="font-display mb-4 text-base font-semibold text-amber md:text-lg">
          International Student Friendly
        </p>

        {/* Description */}
        <p className="mb-1 text-sm leading-relaxed text-white/65 md:text-[15px]">
          Find campus offices, administrative procedures, maps, and student support resources in one place.
        </p>
        <p className="mb-6 text-xs text-white/40">
          Start here to explore the guide, search for services, or open the New Student Guide.
        </p>

        {/* Primary CTA */}
        <button
          onClick={dismiss}
          className="mb-4 w-full rounded-lg bg-amber px-5 py-3 text-sm font-bold text-navy transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
        >
          Enter Site
        </button>

        {/* Quick access links */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/20 px-2.5 py-2 text-xs font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{label}</span>
              <ArrowRight className="h-3 w-3 shrink-0" />
            </Link>
          ))}
          <div className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 sm:col-span-1">
            <MessageCircle className="h-3.5 w-3.5 shrink-0 text-amber/60" />
            <span className="text-[11px] text-white/35">CCUGPT on every page</span>
          </div>
        </div>

        {/* Auto-dismiss hint */}
        {!fading && (
          <p className="mt-5 text-[11px] text-white/25">
            This welcome screen will close automatically in about 7 seconds.
          </p>
        )}
      </div>
    </div>
  );
}
