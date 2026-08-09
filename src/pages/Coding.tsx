import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, EmptyState } from "@/components/layout/Shell";
import { fetchCodingProblems, PAGE_SIZE } from "@/lib/data";

const TOPICS = ["All", "Arrays", "Strings", "Linked List", "Trees", "Dynamic Programming", "Graphs", "Binary Search", "Stack", "Heap", "Backtracking", "Hash Table", "Two Pointers", "Sorting", "Trie", "Design", "Bit Manipulation", "Sliding Window", "Recursion", "Greedy", "DFS", "BFS", "Divide and Conquer"];
const DIFFS = ["All", "easy", "medium", "hard"];
const DIFF_COLOR: Record<string, string> = { easy: "text-signal-green border-signal-green/30", medium: "text-signal-yellow border-signal-yellow/30", hard: "text-signal-red border-signal-red/30" };

export default function CodingPage() {
  const [topic, setTopic] = useState("All");
  const [diff, setDiff] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["coding", topic, diff, search, page],
    queryFn: () =>
      fetchCodingProblems({
        topic: topic === "All" ? undefined : topic,
        difficulty: diff === "All" ? undefined : diff,
        search: search || undefined,
        page,
      }),
  });

  const rows = data?.rows ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <>
      <PageHeader
        code="P / 004 — CODING TRACKER"
        title="Coding Problems"
        description="Real LeetCode-style problems tagged with company frequency data. The '×' count shows how many times a company has reportedly asked that problem."
      />

      {/* Search */}
      <div className="border-b border-border p-4">
        <input
          className="w-full border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          placeholder="Search problems…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        />
      </div>

      {/* Topic chips */}
      <div className="flex flex-wrap gap-1.5 border-b border-border p-4">
        <span className="label-xs pt-1 mr-1">TOPIC</span>
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => { setTopic(t); setPage(0); }}
            className={`border px-2 py-0.5 text-[10px] uppercase tracking-widest transition-colors ${topic === t ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <span className="label-xs mr-1">DIFFICULTY</span>
        {DIFFS.map((d) => (
          <button
            key={d}
            onClick={() => { setDiff(d); setPage(0); }}
            className={`border px-2 py-0.5 text-[10px] uppercase tracking-widest transition-colors ${diff === d ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {d}
          </button>
        ))}
        <span className="ml-auto label-xs tabular-nums">{count} PROBLEMS</span>
      </div>

      {/* Problems list */}
      {isLoading ? (
        <div className="flex flex-col gap-px bg-border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-card p-4">
              <div className="h-4 w-64 animate-pulse rounded bg-surface-2" />
              <div className="mt-2 h-3 w-40 animate-pulse rounded bg-surface-2" />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="p-5">
          <EmptyState title="No coding problems found" hint="Try adjusting your filters or seed the database from the Admin panel." />
        </div>
      ) : (
        <div className="flex flex-col gap-px bg-border">
          {rows.map((p: any) => {
            const companies = (p.problem_company ?? [])
              .filter((pc: any) => pc.companies)
              .sort((a: any, b: any) => (b.report_count ?? 0) - (a.report_count ?? 0));
            const maxReports = companies[0]?.report_count ?? 1;

            return (
              <div key={p.id} className="bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`border px-1.5 py-0.5 text-[10px] font-bold uppercase ${DIFF_COLOR[p.difficulty] ?? "text-muted-foreground border-border"}`}>
                        {p.difficulty}
                      </span>
                      <span className="text-sm font-medium text-foreground">{p.title}</span>
                    </div>
                    {p.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                    )}
                    {/* Topic tags */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.topics?.map((t: string) => (
                        <span key={t} className="border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">{t}</span>
                      ))}
                    </div>
                    {/* Company frequency bars */}
                    {companies.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {companies.slice(0, 6).map((pc: any, i: number) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <div className="relative h-3 w-16 bg-surface">
                              <div
                                className="absolute inset-y-0 left-0 bg-primary/40"
                                style={{ width: `${Math.max(10, (pc.report_count / maxReports) * 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-foreground">
                              {pc.companies?.name ?? "?"} <strong>{pc.report_count}×</strong>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="text-lg font-bold tabular-nums text-foreground">{p.total_reports ?? 0}</div>
                      <div className="label-xs">Reports</div>
                    </div>
                    <a
                      href={p.url || `https://leetcode.com/problems/${p.slug}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-primary px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      Solve →
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-border p-4">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="border border-border px-3 py-1 text-xs text-muted-foreground disabled:opacity-30 hover:text-foreground"
          >
            Prev
          </button>
          <span className="label-xs tabular-nums">{page + 1} / {totalPages}</span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="border border-border px-3 py-1 text-xs text-muted-foreground disabled:opacity-30 hover:text-foreground"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
