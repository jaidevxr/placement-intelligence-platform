import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Panel, EmptyState, Stat } from "@/components/layout/Shell";
import { fetchCompanyBySlug, fetchCompanyQuestions, fetchCompanyCoding, fetchCompanyDrives } from "@/lib/data";

const DIFF_COLOR: Record<string, string> = {
  easy: "text-signal-green",
  medium: "text-signal-yellow",
  hard: "text-signal-red",
};

export default function CompanyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: company, isLoading } = useQuery({
    queryKey: ["company", slug],
    queryFn: () => fetchCompanyBySlug(slug!),
    enabled: !!slug,
  });
  const { data: questions } = useQuery({
    queryKey: ["company-questions", company?.id],
    queryFn: () => fetchCompanyQuestions(company!.id),
    enabled: !!company,
  });
  const { data: coding } = useQuery({
    queryKey: ["company-coding", company?.id],
    queryFn: () => fetchCompanyCoding(company!.id),
    enabled: !!company,
  });
  const { data: drives } = useQuery({
    queryKey: ["company-drives", company?.id],
    queryFn: () => fetchCompanyDrives(company!.id),
    enabled: !!company,
  });

  if (isLoading) return <div className="p-8 label-xs">LOADING…</div>;
  if (!company) return <EmptyState title="Company not found" hint="Check the URL or browse all companies." />;

  const topicCounts: Record<string, number> = {};
  for (const q of questions ?? []) {
    const topic = (q as any).questions?.topic ?? "Other";
    topicCounts[topic] = (topicCounts[topic] ?? 0) + 1;
  }
  const topTopics = Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <>
      <PageHeader
        code={`C / ${company.slug?.toUpperCase()}`}
        title={company.name ?? ""}
        description={company.description ?? `Placement intelligence for ${company.name}.`}
      />

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
        {company.sector && <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">{company.sector}</span>}
        {company.company_type && <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">{company.company_type}</span>}
        {(company.hiring_roles as string[] | null)?.map((r) => (
          <span key={r} className="text-[10px] uppercase tracking-widest text-muted-foreground">{r}</span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid gap-px bg-border md:grid-cols-4">
        <Stat value={questions?.length ?? 0} label="Linked Questions" />
        <Stat value={coding?.length ?? 0} label="Coding Problems" />
        <Stat value={drives?.length ?? 0} label="Placement Drives" />
        <Stat value={topTopics.length} label="Topics Covered" />
      </div>

      {/* Topic Frequency */}
      {topTopics.length > 0 && (
        <div className="border-b border-border p-5">
          <div className="label-xs mb-3">MOST ASKED TOPICS</div>
          <div className="flex flex-col gap-2">
            {topTopics.map(([topic, count]) => {
              const maxCount = topTopics[0]?.[1] ?? 1;
              return (
                <div key={topic} className="flex items-center gap-3">
                  <div className="w-32 truncate text-xs text-foreground">{topic}</div>
                  <div className="relative h-4 flex-1 bg-surface">
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/30"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <div className="w-8 text-right text-xs font-bold tabular-nums text-foreground">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Placement Drives */}
      <div className="border-b border-border p-5">
        <div className="label-xs mb-3">PLACEMENT DRIVES</div>
        {!drives?.length ? (
          <EmptyState title="No drive records yet" hint="Submit or import campus drive data for this company." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left label-xs">
                  <th className="px-3 py-2">Year</th>
                  <th className="px-3 py-2">College</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Package (LPA)</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {drives.slice(0, 20).map((d: any, i: number) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-surface">
                    <td className="px-3 py-2 font-bold text-foreground">{d.year}</td>
                    <td className="px-3 py-2 text-foreground">{d.colleges?.name ?? "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{d.role ?? "—"}</td>
                    <td className="px-3 py-2 text-foreground tabular-nums">{d.package_lpa ? `₹${Number(d.package_lpa).toFixed(1)}L` : "—"}</td>
                    <td className="px-3 py-2">
                      <span className="border border-border px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground">
                        {d.verification ?? "unverified"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Coding Problems */}
      <div className="border-b border-border p-5">
        <div className="label-xs mb-3">MOST ASKED CODING PROBLEMS</div>
        {!coding?.length ? (
          <EmptyState title="No coding problems linked" hint="Problems are linked when company-tagged data is imported." />
        ) : (
          <div className="flex flex-col gap-px bg-border">
            {coding.slice(0, 15).map((pc: any, i: number) => {
              const p = pc.coding_problems;
              if (!p) return null;
              return (
                <div key={i} className="flex items-center gap-3 bg-card px-4 py-3">
                  <div className="w-8 text-right text-xs font-bold tabular-nums text-muted-foreground">{pc.report_count}×</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{p.title}</div>
                    <div className="flex gap-2 mt-0.5">
                      {p.topics?.slice(0, 3).map((t: string) => (
                        <span key={t} className="text-[10px] uppercase tracking-widest text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </div>
                  <span className={`text-xs font-bold uppercase ${DIFF_COLOR[p.difficulty] ?? "text-muted-foreground"}`}>{p.difficulty}</span>
                  <a
                    href={p.url || `https://leetcode.com/problems/${p.slug || p.id}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-primary px-2.5 py-1 text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Solve →
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="p-5">
        <div className="label-xs mb-3">LINKED QUESTIONS</div>
        {!questions?.length ? (
          <EmptyState title="No questions linked" hint="Questions are linked when company-tagged data is imported." />
        ) : (
          <div className="flex flex-col gap-px bg-border">
            {questions.slice(0, 20).map((ql: any, i: number) => {
              const q = ql.questions;
              if (!q) return null;
              return (
                <div key={i} className="bg-card px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-foreground">{q.title || q.question_text?.slice(0, 120)}</div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{q.category?.replace(/_/g, " ")}</span>
                        {q.topic && <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{q.topic}</span>}
                        {ql.year && <span className="text-[10px] uppercase tracking-widest text-primary">{ql.year}</span>}
                        {ql.round && <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{ql.round?.replace(/_/g, " ")}</span>}
                      </div>
                    </div>
                    <span className={`shrink-0 text-xs font-bold uppercase ${DIFF_COLOR[q.difficulty] ?? "text-muted-foreground"}`}>{q.difficulty}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-border p-5">
        <Link to="/companies" className="text-xs uppercase tracking-widest text-primary">← All companies</Link>
      </div>
    </>
  );
}
