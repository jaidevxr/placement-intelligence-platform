import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, EmptyState } from "@/components/layout/Shell";
import { fetchMockQuestions } from "@/lib/data";
import { MockEngine, type MockQuestion } from "@/components/mock/MockEngine";

const MOCK_CONFIGS = [
  { code: "M01", label: "Aptitude — Quantitative", category: "aptitude_quant", count: 15 },
  { code: "M02", label: "Aptitude — Logical", category: "aptitude_logical", count: 15 },
  { code: "M03", label: "Aptitude — Verbal", category: "aptitude_verbal", count: 10 },
  { code: "M04", label: "Technical — All Subjects", category: "technical", count: 20 },
  { code: "M05", label: "SQL Challenges", category: "sql", count: 10 },
  { code: "M06", label: "Mixed Placement Mock", category: undefined, count: 25 },
];

export default function MocksPage() {
  const [active, setActive] = useState<string | null>(null);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);

  const activeConfig = MOCK_CONFIGS.find((m) => m.code === active);

  async function startMock(code: string) {
    const cfg = MOCK_CONFIGS.find((m) => m.code === code);
    if (!cfg) return;
    try {
      const qs = await fetchMockQuestions(undefined, cfg.category, cfg.count);
      if (qs.length === 0) {
        alert("No questions available for this category. Seed the database first from the Admin panel.");
        return;
      }
      setQuestions(qs);
      setActive(code);
    } catch (e) {
      console.error(e);
      alert("Failed to load mock questions.");
    }
  }

  function closeMock() {
    setActive(null);
    setQuestions([]);
  }

  if (active && questions.length > 0) {
    return (
      <MockEngine
        questions={questions}
        testLabel={activeConfig?.label ?? "Mock Test"}
        onClose={closeMock}
      />
    );
  }

  return (
    <>
      <PageHeader
        code="M / 008 — MOCK ENGINE"
        title="Mock Tests"
        description="Timed, category-based mocks assembled from real linked records. Select a category, start the test, answer questions, and review your performance."
      />

      <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
        {MOCK_CONFIGS.map((m) => (
          <div key={m.code} className="panel flex flex-col">
            <div className="flex-1 p-4">
              <div className="text-sm font-bold text-foreground">{m.label}</div>
              <p className="mt-2 text-xs text-muted-foreground">
                {m.count} questions · {m.count} minutes · No negative marking
              </p>
            </div>
            <div className="flex items-center gap-3 border-t border-border px-3 py-2">
              <span className="label-xs">{m.code}</span>
              <span className="label-xs">{m.category?.replace(/_/g, " ").toUpperCase() ?? "MIXED"}</span>
              <button
                onClick={() => startMock(m.code)}
                className="ml-auto border border-primary px-3 py-1 text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Start
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-5">
        <EmptyState
          title="More mock types coming soon"
          hint="Company-specific mocks, full simulation (OA + interview), and topic-focused drills will unlock as more data is seeded."
        />
      </div>
    </>
  );
}
