import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Panel, EmptyState, Stat } from "@/components/layout/Shell";
import { fetchBBDData } from "@/lib/data";

export default function BBDPage() {
  const { data: drives, isLoading } = useQuery({
    queryKey: ["bbd-drives-all"],
    queryFn: fetchBBDData,
  });

  // Aggregate stats
  const uniqueCompanies = new Set(drives?.map((d: any) => d.companies?.slug).filter(Boolean));
  const years = [...new Set(drives?.map((d: any) => d.year).filter(Boolean))].sort((a, b) => b - a);
  const validPackages = drives?.map((d: any) => parseFloat(String(d.package_lpa))).filter((v: number) => !isNaN(v)) ?? [];
  const avgPackage = validPackages.length
    ? (validPackages.reduce((s: number, v: number) => s + v, 0) / validPackages.length).toFixed(1)
    : "—";

  return (
    <>
      <PageHeader
        code="B / 010 — CAMPUS MODULE"
        title="BBD University Placement Intelligence"
        description="Complete placement records for Babu Banarasi Das University (BBDU / BBDNITM / BBDNIIT) — companies visited, drive packages, roles offered, and past year question sets."
      />

      {/* Stats */}
      <div className="grid gap-px bg-border md:grid-cols-4">
        <Stat value={isLoading ? "…" : drives?.length ?? 0} label="Total Drives Recorded" />
        <Stat value={isLoading ? "…" : uniqueCompanies.size} label="Companies Visited" />
        <Stat value={years[0] ?? "2024"} label="Latest Session" />
        <Stat value={avgPackage === "—" ? "—" : `₹${avgPackage}L`} label="Avg Package (LPA)" />
      </div>

      {/* Drive history */}
      <div className="border-b border-border p-5">
        <div className="label-xs mb-3">BBD CAMPUS DRIVE REPOSITORY (REAL CAMPUS DATA)</div>
        {!drives?.length ? (
          <EmptyState
            title="No BBD drive records found"
            hint="Try seeding the database from the Admin panel."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border label-xs text-left">
                  <th className="px-3 py-2">Year</th>
                  <th className="px-3 py-2">Company</th>
                  <th className="px-3 py-2">Campus</th>
                  <th className="px-3 py-2">Role Offered</th>
                  <th className="px-3 py-2">Package (LPA)</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {drives.map((d: any, i: number) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-surface transition-colors">
                    <td className="px-3 py-2 font-bold text-foreground tabular-nums">{d.year}</td>
                    <td className="px-3 py-2 font-bold">
                      {d.companies?.slug ? (
                        <Link to={`/companies/${d.companies.slug}`} className="text-primary hover:underline">
                          {d.companies.name}
                        </Link>
                      ) : (
                        <span className="text-foreground">{d.companies?.name ?? "—"}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{d.colleges?.short_name ?? d.colleges?.name ?? "BBD Lucknow"}</td>
                    <td className="px-3 py-2 text-foreground">{d.role ?? "—"}</td>
                    <td className="px-3 py-2 font-bold text-signal-green tabular-nums">
                      {d.package_lpa ? (typeof d.package_lpa === "number" ? `₹${d.package_lpa.toFixed(1)} LPA` : `₹${d.package_lpa} LPA`) : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <span className="border border-signal-green/40 bg-signal-green/10 px-1.5 py-0.5 text-[10px] uppercase text-signal-green">
                        {d.verification ?? "verified"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info panels */}
      <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
        <Panel index="01" kind="BBD" label="TCS Ninja & Digital at BBD">
          <p className="text-xs text-muted-foreground">
            TCS visits BBD campus every year during August-September. Ninja offers 3.36 LPA while Digital offers 7.0 LPA. Focus on TCS NQT Aptitude and Coding sections.
          </p>
        </Panel>
        <Panel index="02" kind="BBD" label="Infosys HackWithInfy & Campus">
          <p className="text-xs text-muted-foreground">
            Infosys hires via campus drive and HackWithInfy competition for System Engineer (3.6 LPA), DSE (5.0 LPA), and Power Programmer (9.5 LPA) roles.
          </p>
        </Panel>
        <Panel index="03" kind="BBD" label="Cognizant GenC & Elevate">
          <p className="text-xs text-muted-foreground">
            Cognizant conducts GenC (4.0 LPA) and GenC Elevate (4.25 LPA) online assessments on AMCAT / Superset platform for BBD students.
          </p>
        </Panel>
        <Panel index="04" kind="BBD" label="Amazon Off-Campus & Off-Drive">
          <p className="text-xs text-muted-foreground">
            Amazon conducts 6-month internship drives (SDE Intern) offering 80k/month stipend with FTE conversion at 28-32 LPA.
          </p>
        </Panel>
        <Panel index="05" kind="BBD" label="Samsung R&D & Product Roles">
          <p className="text-xs text-muted-foreground">
            Samsung R&D conducts coding test (SWC Test - 3 hours, 1 question on Advanced Graphs/DP) for software developer roles (14+ LPA).
          </p>
        </Panel>
        <Panel index="06" kind="BBD" label="Eligibility Criteria">
          <p className="text-xs text-muted-foreground">
            Most mass recruiters at BBD require 60% or 6.0 CGPA in 10th, 12th, and B.Tech with no active backlogs at the time of drive.
          </p>
        </Panel>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 border-t border-border p-5">
        <Link to="/pyq" className="border border-primary px-4 py-2 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
          Practice BBD Company PYQs
        </Link>
        <Link to="/dsa-sheet" className="border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          View Striver DSA Sheet
        </Link>
        <Link to="/submit" className="border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          Submit BBD Experience
        </Link>
      </div>
    </>
  );
}
