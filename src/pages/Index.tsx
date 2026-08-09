import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCoverage, fetchCompanies, fetchCodingProblems } from "@/lib/data";
import { Stat } from "@/components/layout/Shell";
import { useEffect, useRef, useState } from "react";

// Animated counter
function AnimCounter({ target, label }: { target: number; label: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const duration = 1200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);

  return (
    <div ref={ref} className="panel p-4">
      <div className="text-2xl font-bold text-foreground tabular-nums">{val.toLocaleString()}</div>
      <div className="label-xs mt-1">{label}</div>
    </div>
  );
}

const MODULES = [
  { to: "/companies", code: "C", label: "COMPANY INDEX", body: "150+ real Indian placement companies with sector, type, roles, drive history and question links.", tag: "COMPANY" },
  { to: "/questions", code: "Q", label: "QUESTION BANK", body: "Aptitude, technical, interview and SQL questions with company links, year tags and difficulty levels.", tag: "INTEL" },
  { to: "/coding", code: "P", label: "CODING TRACKER", body: "LeetCode-style problems with company frequency data — know exactly what each company asks.", tag: "CODING" },
  { to: "/pyq", code: "Y", label: "PREVIOUS YEARS", body: "Company-wise PYQ collections — filter by year, round and topic to find exact past questions.", tag: "PYQ" },
  { to: "/aptitude", code: "A", label: "APTITUDE TAXONOMY", body: "Quantitative, logical and verbal reasoning with topic breakdown and company mapping.", tag: "APTITUDE" },
  { to: "/technical", code: "T", label: "TECHNICAL SUBJECTS", body: "OOP, DBMS, OS, CN, DSA, SQL — every subject tagged to the companies that test it.", tag: "TECHNICAL" },
  { to: "/interviews", code: "I", label: "INTERVIEW BANK", body: "Technical, HR, behavioral and managerial interview questions from real experiences.", tag: "INTERVIEW" },
  { to: "/mocks", code: "M", label: "MOCK ENGINE", body: "Timed tests assembled from real questions with scoring, review and performance tracking.", tag: "MOCK" },
  { to: "/analytics", code: "X", label: "COVERAGE ANALYTICS", body: "Live metrics on database coverage, topic distribution and verification breakdown.", tag: "ANALYTICS" },
  { to: "/bbd", code: "B", label: "CAMPUS MODULE", body: "BBD-specific placement data — drives, eligibility, questions and senior experiences.", tag: "BBD" },
];

export default function Index() {
  const { data } = useQuery({ queryKey: ["coverage"], queryFn: fetchCoverage });
  const { data: topCompanies } = useQuery({
    queryKey: ["top-companies"],
    queryFn: () => fetchCompanies(undefined, 12),
  });

  return (
    <>
      <div className="border-b border-border px-5 py-10 grid-noise">
        <div className="label-xs">P / 001 — UNIVERSAL DASHBOARD</div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Placement Intelligence
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          The largest structured placement-preparation knowledge base. Every record is linked to real companies, years and rounds — never generated, always sourced.
        </p>
      </div>

      {/* Animated Stats */}
      <div className="grid gap-px bg-border md:grid-cols-3 xl:grid-cols-6">
        <AnimCounter target={data?.companies ?? 0} label="Companies" />
        <AnimCounter target={data?.colleges ?? 0} label="Colleges" />
        <AnimCounter target={data?.questions ?? 0} label="Questions" />
        <AnimCounter target={data?.coding_problems ?? 0} label="Coding Problems" />
        <AnimCounter target={data?.placement_drives ?? 0} label="Drives" />
        <AnimCounter target={data?.question_links ?? 0} label="Question Links" />
      </div>

      {/* Featured Companies */}
      {topCompanies && topCompanies.length > 0 && (
        <div className="border-b border-border p-5">
          <div className="label-xs mb-3">FEATURED COMPANIES</div>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {topCompanies.map((c: any) => (
              <Link
                key={c.id}
                to={`/companies/${c.slug}`}
                className="panel flex items-center gap-3 p-3 transition-colors hover:border-primary/40"
              >
                <div className="flex size-9 items-center justify-center border border-border bg-surface text-xs font-bold text-primary">
                  {c.name?.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">{c.name}</div>
                  <div className="truncate text-[10px] uppercase tracking-widest text-muted-foreground">
                    {c.sector ?? ""} · {c.company_type ?? ""}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/companies" className="mt-3 inline-block text-xs uppercase tracking-widest text-primary">
            View all companies →
          </Link>
        </div>
      )}

      {/* Module Grid */}
      <div className="p-5">
        <div className="label-xs mb-3">PLATFORM MODULES</div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((m) => (
            <Link key={m.to} to={m.to} className="panel group flex flex-col transition-colors hover:border-primary/40">
              <div className="px-3 pt-3">
                <span className="border border-border bg-surface-2 px-2 py-0.5 label-xs">{m.tag}</span>
              </div>
              <div className="min-h-28 flex-1 p-4">
                <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{m.label}</div>
                <p className="mt-2 text-xs text-muted-foreground">{m.body}</p>
              </div>
              <div className="flex items-center gap-3 border-t border-border px-3 py-2 text-xs">
                <span className="text-muted-foreground">{m.code}</span>
                <span className="text-foreground">{m.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 border-t border-border p-5">
        <Link to="/submit" className="border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          Submit an experience
        </Link>
        <Link to="/mocks" className="border border-primary px-4 py-2 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground">
          Take a mock test
        </Link>
        <Link to="/admin" className="border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          Seed database (admin)
        </Link>
      </div>
    </>
  );
}
