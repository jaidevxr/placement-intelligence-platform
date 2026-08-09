import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { EmptyState } from "@/components/layout/Shell";
import { fetchQuestions, type Filters, PAGE_SIZE } from "@/lib/data";

const VERIFICATION_DOT: Record<string, string> = {
  verified: "bg-signal-green",
  candidate_reported: "bg-signal-yellow",
  source_derived: "bg-primary",
  unverified: "bg-signal-red",
  ai_generated: "bg-signal-violet",
};

const DIFF_COLOR: Record<string, string> = {
  easy: "text-signal-green",
  medium: "text-signal-yellow",
  hard: "text-signal-red",
};

function QuestionCard({ q }: { q: any }) {
  const [expanded, setExpanded] = useState(false);
  const opts = q.options && typeof q.options === "object" ? Object.entries(q.options) : [];

  return (
    <article className="bg-card p-4">
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`size-1.5 rounded-full ${VERIFICATION_DOT[q.verification] ?? "bg-muted"}`} />
        <span className="border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">{q.question_type}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{q.category?.replace(/_/g, " ")}</span>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${DIFF_COLOR[q.difficulty] ?? "text-muted-foreground"}`}>{q.difficulty}</span>
        {q.topic && <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{q.topic}</span>}
        <span className="ml-auto label-xs tabular-nums">
          {q.report_count ?? 0} RPT · {q.source_count ?? 0} SRC
        </span>
      </div>

      {/* Question */}
      <p className="mt-3 text-sm leading-relaxed text-foreground">{q.title ?? q.question_text}</p>
      {q.title && <p className="mt-1 text-xs text-muted-foreground">{q.question_text}</p>}

      {/* MCQ options */}
      {opts.length > 0 && (
        <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {opts.map(([k, v]) => (
            <div
              key={k}
              className={`border px-3 py-1.5 text-xs ${
                expanded && k === q.answer
                  ? "border-signal-green bg-signal-green/10 text-signal-green"
                  : "border-border text-muted-foreground"
              }`}
            >
              <span className="font-bold">{k.toUpperCase()}.</span> {String(v)}
            </div>
          ))}
        </div>
      )}

      {/* SQL / code answer */}
      {q.answer && q.question_type === "sql" && expanded && (
        <pre className="mt-3 overflow-x-auto border border-border bg-surface p-3 text-xs text-foreground">{q.answer}</pre>
      )}

      {/* Company links */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(q.question_links ?? []).map((l: any, i: number) =>
          l.companies ? (
            <span key={i} className="border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              {l.companies.name}
              {l.year ? ` · ${l.year}` : ""}
              {l.round ? ` · ${l.round.replace(/_/g, " ")}` : ""}
            </span>
          ) : null,
        )}
      </div>

      {/* Expand / collapse */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="border border-border px-2 py-1 text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10 transition-colors"
        >
          {expanded ? "Hide Answer" : "Show Answer"}
        </button>
        {expanded && q.explanation && (
          <div className="min-w-0 flex-1 text-xs text-muted-foreground">
            <strong className="text-foreground">Explanation:</strong> {q.explanation}
          </div>
        )}
      </div>
    </article>
  );
}

export function QuestionList({ base }: { base: Filters }) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [year, setYear] = useState("");
  const [topic, setTopic] = useState(base.topic ?? "");

  const filters: Filters = {
    ...base,
    page,
    search: search || undefined,
    difficulty: difficulty || undefined,
    year: year ? Number(year) : base.year,
    topic: topic || base.topic || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["questions", filters],
    queryFn: () => fetchQuestions(filters),
  });

  const total = data?.count ?? 0;
  const pages = Math.ceil(total / PAGE_SIZE);

  // Extract unique topics from results for quick-filter chips
  const topics = [...new Set((data?.rows ?? []).map((q: any) => q.topic).filter(Boolean))].sort();

  return (
    <div className="p-5">
      {/* Filters row */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => { setPage(0); setSearch(e.target.value); }}
          placeholder="Search questions…"
          className="min-w-56 flex-1 border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <select
          value={difficulty}
          onChange={(e) => { setPage(0); setDifficulty(e.target.value); }}
          className="border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">ALL DIFFICULTY</option>
          <option value="easy">EASY</option>
          <option value="medium">MEDIUM</option>
          <option value="hard">HARD</option>
        </select>
        <input
          value={year}
          onChange={(e) => { setPage(0); setYear(e.target.value.replace(/\D/g, "").slice(0, 4)); }}
          placeholder="YEAR"
          className="w-24 border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      {/* Topic quick-filter chips (only when not already filtered by base) */}
      {!base.topic && topics.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          <button
            onClick={() => { setTopic(""); setPage(0); }}
            className={`border px-2 py-0.5 text-[10px] uppercase tracking-widest transition-colors ${!topic ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            All topics
          </button>
          {topics.slice(0, 15).map((t: string) => (
            <button
              key={t}
              onClick={() => { setTopic(t); setPage(0); }}
              className={`border px-2 py-0.5 text-[10px] uppercase tracking-widest transition-colors ${topic === t ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-px bg-border">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card p-4">
              <div className="h-3 w-40 animate-pulse rounded bg-surface-2" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-surface-2" />
              <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-surface-2" />
            </div>
          ))}
        </div>
      ) : total === 0 ? (
        <EmptyState
          title="No questions match this view yet"
          hint="Try adjusting your filters, or seed the database from the Admin panel."
        />
      ) : (
        <>
          <div className="label-xs mb-3 tabular-nums">{total} RECORDS</div>
          <div className="flex flex-col gap-px bg-border">
            {data!.rows.map((q) => (
              <QuestionCard key={q.id} q={q} />
            ))}
          </div>

          {pages > 1 && (
            <div className="mt-5 flex items-center gap-3">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="border border-border px-3 py-1.5 text-xs uppercase tracking-widest text-muted-foreground disabled:opacity-40 hover:text-foreground"
              >
                Prev
              </button>
              <span className="label-xs tabular-nums">
                PAGE {page + 1} / {pages}
              </span>
              <button
                disabled={page + 1 >= pages}
                onClick={() => setPage((p) => p + 1)}
                className="border border-border px-3 py-1.5 text-xs uppercase tracking-widest text-muted-foreground disabled:opacity-40 hover:text-foreground"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
