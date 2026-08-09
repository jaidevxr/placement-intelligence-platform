import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Stat } from "@/components/layout/Shell";
import { QuestionList } from "@/components/questions/QuestionList";
import { fetchCompanies } from "@/lib/data";
import { Link } from "react-router-dom";

const YEARS = [2026, 2025, 2024];

export default function PYQPage() {
  const [year, setYear] = useState(2026);
  const [companySlug, setCompanySlug] = useState("");
  const { data: companies } = useQuery({
    queryKey: ["companies", "all"],
    queryFn: () => fetchCompanies(undefined, 500),
  });

  return (
    <>
      <PageHeader
        code="P / 003 — PREVIOUS YEAR QUESTIONS"
        title="PYQ Database"
        description="Filter by year and company to see exactly what was asked in past placement seasons. Every question is linked to the company, year, and round it appeared in."
      />

      {/* Year selector */}
      <div className="flex gap-px border-b border-border bg-border">
        {YEARS.map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`flex-1 bg-card px-4 py-3 text-sm font-bold tabular-nums ${year === y ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Company filter */}
      <div className="border-b border-border p-4">
        <div className="label-xs mb-2">FILTER BY COMPANY</div>
        <select
          className="w-full max-w-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          value={companySlug}
          onChange={(e) => setCompanySlug(e.target.value)}
        >
          <option value="">All Companies</option>
          {companies?.map((c: any) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Info bar */}
      <div className="flex items-center gap-4 border-b border-border px-5 py-3">
        <span className="label-xs">SHOWING: {year} PYQs</span>
        {companySlug && (
          <span className="border border-primary px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">
            {companies?.find((c: any) => c.slug === companySlug)?.name ?? companySlug}
          </span>
        )}
      </div>

      <QuestionList base={{ year }} />

      <div className="border-t border-border p-5">
        <div className="label-xs mb-2">PYQ TIPS</div>
        <div className="grid gap-3 text-xs text-muted-foreground md:grid-cols-3">
          <div className="panel p-3">
            <div className="font-bold text-foreground">Focus on repeat patterns</div>
            <p className="mt-1">Questions that appear across multiple years are highly likely to appear again.</p>
          </div>
          <div className="panel p-3">
            <div className="font-bold text-foreground">Company-specific prep</div>
            <p className="mt-1">Each company has a preferred question pool. Use the company filter to see their patterns.</p>
          </div>
          <div className="panel p-3">
            <div className="font-bold text-foreground">Round awareness</div>
            <p className="mt-1">OA questions differ from interview questions. Check the round tags on each question.</p>
          </div>
        </div>
      </div>
    </>
  );
}
