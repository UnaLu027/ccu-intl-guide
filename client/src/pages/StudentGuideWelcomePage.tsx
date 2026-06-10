/**
 * StudentGuideWelcomePage — New Student Guide overview and entry point
 * Handbook cover / orientation hub for international students
 */
import Header from "@/components/Header";
import { Link } from "wouter";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Info,
  Plane,
} from "lucide-react";

const checklistBefore = [
  "Check your visa and entry requirements",
  "Prepare required documents",
  "Review housing and arrival information",
  "Save OIA contact information",
];

const checklistAfter = [
  "Complete registration or orientation",
  "Complete health check if required",
  "Apply for ARC if applicable",
  "Set up campus systems and student ID",
];

const checklistHelp = [
  "Search administrative procedures",
  "Find campus offices and departments",
  "Use the campus map",
  "Ask CCUGPT for guidance",
];

const reminders = [
  {
    icon: AlertTriangle,
    text: "Keep your passport, visa, ARC, and student ID safe.",
  },
  {
    icon: AlertTriangle,
    text: "Watch out for scam calls or messages asking for money or personal information.",
  },
  {
    icon: Info,
    text: "Follow Taiwan's entry, quarantine, and campus safety regulations.",
  },
  {
    icon: Info,
    text: "Contact OIA when your phone number, address, or email changes.",
  },
];

export default function StudentGuideWelcomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="container py-8 md:py-12 flex-1 max-w-5xl space-y-10">

        {/* Page header — compact; full handbook cover shown on first visit via overlay */}
        <div className="flex items-center gap-3 border-b border-border pb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/10">
            <BookOpen className="h-5 w-5 text-navy" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-navy leading-tight">
              New Student Guide
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Orientation handbook for international students at National Chung Cheng University
            </p>
          </div>
        </div>

        {/* Choose Your Guide */}
        <section>
          <h2 className="font-display mb-4 text-xl font-bold text-navy">
            Choose Your Guide
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Degree-seeking */}
            <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
              <div className="h-1.5 bg-navy" />
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/10">
                    <GraduationCap className="h-5 w-5 text-navy" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-navy">
                      Degree-seeking Students
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      For international students enrolled in a full degree program at CCU.
                    </p>
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {["Visa", "Registration", "ARC", "Health Check", "Housing", "Campus Life"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-navy/10 px-2 py-0.5 text-[11px] font-medium text-navy"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto">
                  <Link
                    href="/guides/degree"
                    className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
                  >
                    <BookOpen className="h-4 w-4" />
                    Open Degree Guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Exchange */}
            <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
              <div className="h-1.5 bg-sage" />
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage/10">
                    <Plane className="h-5 w-5 text-sage" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-navy">
                      Exchange Students
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      For students joining CCU through an exchange or visiting student program.
                    </p>
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {["Arrival", "Orientation", "Dormitory", "Course Selection", "Health Check", "Leaving Procedure"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-sage/10 px-2 py-0.5 text-[11px] font-medium text-sage"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto">
                  <Link
                    href="/guides/exchange"
                    className="inline-flex items-center gap-2 rounded-lg bg-sage px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
                  >
                    <BookOpen className="h-4 w-4" />
                    Open Exchange Guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Start Here Checklist */}
        <section>
          <h2 className="font-display mb-4 text-xl font-bold text-navy">
            Start Here
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-display mb-3 text-sm font-bold text-amber">
                Before Arrival
              </h3>
              <ul className="space-y-2">
                {checklistBefore.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/75">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-display mb-3 text-sm font-bold text-navy">
                After Arrival
              </h3>
              <ul className="space-y-2">
                {checklistAfter.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/75">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-display mb-3 text-sm font-bold text-sage">
                Need Help
              </h3>
              <ul className="space-y-2">
                {checklistHelp.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/75">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* Important Reminders */}
        <section>
          <h2 className="font-display mb-4 text-xl font-bold text-navy">
            Important Reminders
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {reminders.map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-amber/20 bg-amber/5 p-4"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                <p className="text-sm leading-relaxed text-foreground/80">{text}</p>
              </div>
            ))}
          </div>
        </section>


      </div>
    </div>
  );
}
