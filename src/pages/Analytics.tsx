import { useQuery } from "@tanstack/react-query";
import { PageHeader, Stat, EmptyState } from "@/components/layout/Shell";
import { fetchCoverage, fetchCategoryBreakdown, fetchDifficultyBreakdown, fetchTopicHeatmap } from "@/lib/data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const CHART_COLORS = [
  "oklch(0.79 0.19 145)", // green
  "oklch(0.86 0.13 200)", // cyan/primary
  "oklch(0.85 0.16 95)",  // yellow
  "oklch(0.65 0.2 285)",  // violet
  "oklch(0.65 0.19 18)",  // red
  "oklch(0.7 0.15 160)",
  "oklch(0.75 0.12 230)",
  "oklch(0.8 0.14 60)",
  "oklch(0.6 0.18 310)",
  "oklch(0.72 0.16 120)",
  "oklch(0.68 0.14 250)",
  "oklch(0.82 0.1 180)",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <div className="font-bold text-foreground">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="text-muted-foreground">
          {p.name}: <span className="font-bold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { data: coverage } = useQuery({ queryKey: ["coverage"], queryFn: fetchCoverage });
  const { data: categories } = useQuery({ queryKey: ["category-breakdown"], queryFn: fetchCategoryBreakdown });
  const { data: difficulties } = useQuery({ queryKey: ["difficulty-breakdown"], queryFn: fetchDifficultyBreakdown });
  const { data: topics } = useQuery({ queryKey: ["topic-heatmap"], queryFn: fetchTopicHeatmap });

  const totalQuestions = (coverage?.questions ?? 0) + (coverage?.coding_problems ?? 0);

  return (
    <>
      <PageHeader
        code="X / 009 — COVERAGE REPORTING"
        title="Analytics"
        description="Every number here is counted from stored records. Empty means genuinely empty — never padded with generated content."
      />

      {/* Coverage stats */}
      <div className="grid gap-px bg-border md:grid-cols-3 xl:grid-cols-6">
        <Stat value={coverage?.companies ?? 0} label="Companies" />
        <Stat value={coverage?.colleges ?? 0} label="Colleges" />
        <Stat value={coverage?.questions ?? 0} label="Questions" />
        <Stat value={coverage?.coding_problems ?? 0} label="Coding Problems" />
        <Stat value={coverage?.placement_drives ?? 0} label="Drives" />
        <Stat value={coverage?.question_links ?? 0} label="Question Links" />
      </div>

      {totalQuestions === 0 ? (
        <div className="p-5">
          <EmptyState
            title="No data to chart yet"
            hint="Seed the database from the Admin panel to see analytics visualizations."
          />
        </div>
      ) : (
        <div className="grid gap-5 p-5 lg:grid-cols-2">
          {/* Category breakdown pie chart */}
          {categories && categories.length > 0 && (
            <div className="panel p-4">
              <div className="label-xs mb-3">QUESTION CATEGORIES</div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    strokeWidth={1}
                    stroke="oklch(0.28 0.004 260)"
                  >
                    {categories.map((_: any, i: number) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Difficulty breakdown */}
          {difficulties && difficulties.length > 0 && (
            <div className="panel p-4">
              <div className="label-xs mb-3">DIFFICULTY DISTRIBUTION</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={difficulties} barGap={2}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "oklch(0.62 0.006 260)", fontSize: 10, textTransform: "uppercase" } as any}
                    axisLine={{ stroke: "oklch(0.28 0.004 260)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "oklch(0.62 0.006 260)", fontSize: 10 }}
                    axisLine={{ stroke: "oklch(0.28 0.004 260)" }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="questions" name="Questions" fill="oklch(0.86 0.13 200)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="problems" name="Coding Problems" fill="oklch(0.79 0.19 145)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Topic heatmap */}
          {topics && topics.length > 0 && (
            <div className="panel col-span-full p-4">
              <div className="label-xs mb-3">TOP TOPICS BY QUESTION COUNT</div>
              <ResponsiveContainer width="100%" height={Math.max(280, topics.length * 28)}>
                <BarChart data={topics} layout="vertical" barSize={16}>
                  <XAxis
                    type="number"
                    tick={{ fill: "oklch(0.62 0.006 260)", fontSize: 10 }}
                    axisLine={{ stroke: "oklch(0.28 0.004 260)" }}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={140}
                    tick={{ fill: "oklch(0.93 0.004 260)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Questions" fill="oklch(0.86 0.13 200)" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Verification legend */}
      <div className="border-t border-border p-5">
        <div className="label-xs mb-3">VERIFICATION STATUS LEGEND</div>
        <div className="flex flex-col gap-px bg-border">
          {[
            ["Verified", "Confirmed by multiple independent sources or staff review", "bg-signal-green"],
            ["Candidate reported", "Submitted by a student, awaiting corroboration", "bg-signal-yellow"],
            ["Source derived", "Extracted from a public repository or dataset", "bg-primary"],
            ["Unverified", "Present but unconfirmed", "bg-signal-red"],
            ["AI generated", "Practice-only, always labelled, never shown as real", "bg-signal-violet"],
          ].map(([k, v, color]) => (
            <div key={k} className="flex items-center gap-3 bg-card p-3">
              <span className={`size-2 rounded-full ${color}`} />
              <div>
                <div className="text-xs font-bold text-foreground">{k}</div>
                <div className="text-[11px] text-muted-foreground">{v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
