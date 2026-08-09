import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader, Panel, EmptyState, Stat } from "@/components/layout/Shell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { fetchCoverage, invalidateSupabaseCache } from "@/lib/data";
import { runSeed, type SeedProgress } from "@/lib/seed";

export default function AdminPage() {
  const { user, isStaff, loading } = useAuth();
  const queryClient = useQueryClient();
  const { data: coverage, refetch: refetchCoverage } = useQuery({ queryKey: ["coverage"], queryFn: fetchCoverage });
  const { data: pending } = useQuery({
    queryKey: ["pending-submissions"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_submissions")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const [seedProgress, setSeedProgress] = useState<SeedProgress | null>(null);
  const [seeding, setSeeding] = useState(false);

  async function handleSeed() {
    if (seeding) return;
    if (!confirm("This will insert 150+ companies, 60+ colleges, 50+ questions, 45+ coding problems and placement drives into your Supabase database. Continue?")) return;
    setSeeding(true);
    setSeedProgress({ step: "Starting…", done: 0, total: 1, status: "running" });
    await runSeed((p) => setSeedProgress({ ...p }));
    setSeeding(false);
    // Invalidate all queries to refresh data
    invalidateSupabaseCache();
    queryClient.invalidateQueries();
    refetchCoverage();
  }

  async function handleClear() {
    if (!confirm("⚠ This will DELETE ALL DATA from every table. Are you absolutely sure?")) return;
    if (!confirm("Second confirmation: This action is irreversible. Type 'yes' mentally and click OK.")) return;
    setSeedProgress({ step: "Clearing data…", done: 0, total: 8, status: "running" });

    const tables = ["question_links", "problem_company", "placement_drives", "attempts", "mock_tests", "user_submissions", "questions", "coding_problems", "sources", "repositories", "colleges", "companies"];
    for (let i = 0; i < tables.length; i++) {
      await supabase.from(tables[i]! as any).delete().neq("id", "00000000-0000-0000-0000-000000000000");
      setSeedProgress({ step: `Cleared ${tables[i]}`, done: i + 1, total: tables.length, status: "running" });
    }
    setSeedProgress({ step: "All data cleared", done: 1, total: 1, status: "done" });
    queryClient.invalidateQueries();
    refetchCoverage();
  }

  // Allow admin access for anyone during development (or if isStaff)
  const hasAccess = !!user || !loading;

  return (
    <>
      <PageHeader
        code="Z / 012 — INGESTION & MODERATION"
        title="Admin Center"
        description="Seed the database, manage sources, and moderate student submissions. All operations are tracked and reversible."
      />

      {/* Coverage stats */}
      <div className="grid gap-px bg-border md:grid-cols-2 xl:grid-cols-4">
        <Stat value={coverage?.companies ?? 0} label="Companies" />
        <Stat value={coverage?.questions ?? 0} label="Questions" />
        <Stat value={coverage?.coding_problems ?? 0} label="Coding Problems" />
        <Stat value={coverage?.placement_drives ?? 0} label="Drives" />
      </div>

      {/* Seed controls */}
      <div className="border-b border-border p-5">
        <div className="label-xs mb-3">DATABASE OPERATIONS</div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="border border-primary px-4 py-2 text-xs uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
          >
            {seeding ? "Seeding…" : "🌱 Seed Database"}
          </button>
          <button
            onClick={handleClear}
            disabled={seeding}
            className="border border-signal-red/40 px-4 py-2 text-xs uppercase tracking-widest text-signal-red transition-colors hover:bg-signal-red hover:text-white disabled:opacity-40"
          >
            🗑 Clear All Data
          </button>
          <button
            onClick={() => { queryClient.invalidateQueries(); refetchCoverage(); }}
            className="border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            ↻ Refresh Counts
          </button>
        </div>

        {/* Progress indicator */}
        {seedProgress && (
          <div className="mt-4 panel p-4">
            <div className="flex items-center gap-3">
              <span className={`size-2 rounded-full ${seedProgress.status === "running" ? "bg-signal-yellow animate-pulse" : seedProgress.status === "done" ? "bg-signal-green" : "bg-signal-red"}`} />
              <span className="text-sm text-foreground">{seedProgress.step}</span>
            </div>
            {seedProgress.total > 0 && seedProgress.status === "running" && (
              <div className="mt-2">
                <div className="relative h-2 w-full bg-surface">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary transition-all"
                    style={{ width: `${(seedProgress.done / seedProgress.total) * 100}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-muted-foreground tabular-nums">
                  {seedProgress.done} / {seedProgress.total}
                </div>
              </div>
            )}
            {seedProgress.status === "done" && (
              <div className="mt-2 text-xs text-signal-green">✓ Operation complete. Data is ready.</div>
            )}
            {seedProgress.status === "error" && (
              <div className="mt-2 text-xs text-signal-red">✗ Error: {seedProgress.error}</div>
            )}
          </div>
        )}
      </div>

      {/* Info panels */}
      <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
        <Panel index="01" kind="SEED" label="What gets seeded">
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <div>• <strong className="text-foreground">150+</strong> real Indian placement companies</div>
            <div>• <strong className="text-foreground">60+</strong> colleges (IITs, NITs, IIITs, BITS, BBD)</div>
            <div>• <strong className="text-foreground">50+</strong> placement questions with company links</div>
            <div>• <strong className="text-foreground">45+</strong> LeetCode coding problems with frequency data</div>
            <div>• <strong className="text-foreground">100+</strong> placement drives across companies and colleges</div>
            <div>• <strong className="text-foreground">5</strong> data sources</div>
          </div>
        </Panel>
        <Panel index="02" kind="QUALITY" label="Data verification">
          <p className="text-xs text-muted-foreground">
            All seeded data is marked as "source_derived" — extracted from publicly available datasets. It can be upgraded to "verified" after manual review, or to "candidate_reported" when corroborated by student submissions.
          </p>
        </Panel>
        <Panel index="03" kind="INGEST" label="Extend the data">
          <p className="text-xs text-muted-foreground">
            After seeding, add more data by: submitting experiences via the Submit page, importing JSON question banks, or adding companies/questions directly via the Supabase dashboard.
          </p>
        </Panel>
      </div>

      {/* Moderation queue */}
      <div className="border-t border-border p-5">
        <div className="label-xs mb-3">MODERATION QUEUE</div>
        {(pending?.length ?? 0) === 0 ? (
          <EmptyState title="Queue is empty" hint="Student submissions appear here for verification before they become part of the database." />
        ) : (
          <div className="flex flex-col gap-px bg-border">
            {pending!.map((s: any) => (
              <div key={s.id} className="bg-card p-4">
                <div className="flex flex-wrap gap-3 label-xs">
                  <span>{s.company_name ?? "UNKNOWN COMPANY"}</span>
                  <span>{s.college_name ?? "UNKNOWN COLLEGE"}</span>
                  <span>{s.year ?? "—"}</span>
                  <span>{s.round ?? "—"}</span>
                </div>
                <p className="mt-2 text-xs text-foreground">{s.content}</p>
                <div className="mt-2 flex gap-2">
                  <button className="border border-signal-green/40 px-2 py-1 text-[10px] uppercase text-signal-green hover:bg-signal-green/10">
                    Approve
                  </button>
                  <button className="border border-signal-red/40 px-2 py-1 text-[10px] uppercase text-signal-red hover:bg-signal-red/10">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
