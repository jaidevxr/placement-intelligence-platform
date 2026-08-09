import { useState } from "react";
import { PageHeader } from "@/components/layout/Shell";
import { QuestionList } from "@/components/questions/QuestionList";

const KINDS = [
  { label: "TECHNICAL", value: "interview_technical" },
  { label: "HR", value: "interview_hr" },
  { label: "MANAGERIAL", value: "interview_managerial" },
  { label: "BEHAVIORAL", value: "interview_behavioral" },
  { label: "CASE STUDY", value: "case_study" },
];

export default function InterviewsPage() {
  const [kind, setKind] = useState(KINDS[0]!.value);
  return (
    <>
      <PageHeader
        code="I / 007 — INTERVIEW INTELLIGENCE"
        title="Interviews"
        description="Public interview experiences are parsed into rounds, questions, companies, roles and years — with the original source always retained."
      />
      <div className="flex flex-wrap gap-px border-b border-border bg-border">
        {KINDS.map((k) => (
          <button
            key={k.value}
            onClick={() => setKind(k.value)}
            className={`flex-1 bg-card px-4 py-3 text-xs uppercase tracking-widest ${kind === k.value ? "text-primary" : "text-muted-foreground"}`}
          >
            {k.label}
          </button>
        ))}
      </div>
      <QuestionList base={{ category: kind }} />
    </>
  );
}
