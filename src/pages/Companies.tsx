import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, EmptyState } from "@/components/layout/Shell";
import { fetchCompanies } from "@/lib/data";

const SECTORS = ["All", "Technology", "IT Services", "E-Commerce", "Fintech", "Consulting", "Banking", "Core", "PSU", "SaaS", "Startup"];
const TYPES = ["All", "Product", "Service", "Hybrid", "Consulting", "BFSI", "Core", "PSU", "Startup"];

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [type, setType] = useState("All");

  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies", "all"],
    queryFn: () => fetchCompanies(undefined, 500),
  });

  const filtered = (companies ?? []).filter((c: any) => {
    if (search && !c.name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (sector !== "All" && !c.sector?.toLowerCase().includes(sector.toLowerCase())) return false;
    if (type !== "All" && c.company_type !== type) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        code="C / 002 — COMPANY INDEX"
        title="Companies"
        description="150+ real Indian placement companies. Each company page shows linked questions, coding problems, drive history and topic frequency analysis."
      />

      {/* Search */}
      <div className="border-b border-border p-4">
        <input
          className="w-full border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          placeholder="Search companies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Sector filter */}
      <div className="flex flex-wrap gap-2 border-b border-border p-4">
        <span className="label-xs pt-1">SECTOR</span>
        {SECTORS.map((s) => (
          <button
            key={s}
            onClick={() => setSector(s)}
            className={`border px-2 py-1 text-[10px] uppercase tracking-widest transition-colors ${sector === s ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2 border-b border-border p-4">
        <span className="label-xs pt-1">TYPE</span>
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`border px-2 py-1 text-[10px] uppercase tracking-widest transition-colors ${type === t ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-2">
        <span className="label-xs">{filtered.length} COMPANIES</span>
      </div>

      {/* Company grid */}
      {isLoading ? (
        <div className="grid gap-px bg-border md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card p-4">
              <div className="h-4 w-32 animate-pulse rounded bg-surface-2" />
              <div className="mt-3 h-3 w-full animate-pulse rounded bg-surface-2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-5">
          <EmptyState title="No companies match your filters" hint="Try adjusting the sector, type or search query." />
        </div>
      ) : (
        <div className="grid gap-px bg-border md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c: any) => (
            <Link
              key={c.id}
              to={`/companies/${c.slug}`}
              className="flex gap-3 bg-card p-4 transition-colors hover:bg-surface"
            >
              <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-surface text-sm font-bold text-primary">
                {c.name?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-foreground">{c.name}</div>
                <div className="mt-0.5 flex flex-wrap gap-2">
                  {c.sector && (
                    <span className="text-[10px] uppercase tracking-widest text-primary">{c.sector}</span>
                  )}
                  {c.company_type && (
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.company_type}</span>
                  )}
                </div>
                {c.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
