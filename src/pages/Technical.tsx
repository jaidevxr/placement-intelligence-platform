import { useState } from "react";
import { PageHeader } from "@/components/layout/Shell";
import { QuestionList } from "@/components/questions/QuestionList";

const SUBJECTS = ["C","C++","Java","Python","JavaScript","OOP","DSA","DBMS","SQL","Operating Systems","Computer Networks","Computer Architecture","Compiler Design","Software Engineering","Web Development","Git","Linux","Cloud","Cyber Security","AI","Machine Learning","Data Science"];

export default function TechnicalPage() {
  const [topic, setTopic] = useState("");
  return (
    <>
      <PageHeader
        code="T / 006 — TECHNICAL SUBJECTS"
        title="Technical"
        description="Subject-level technical intelligence. Each company's most-asked subjects are derived from actual linked records, not assumptions."
      />
      <div className="flex flex-wrap gap-2 border-b border-border p-5">
        <button onClick={() => setTopic("")} className={`border px-2 py-1 text-[10px] uppercase tracking-widest ${topic === "" ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
          All
        </button>
        {SUBJECTS.map((s) => (
          <button key={s} onClick={() => setTopic(s)} className={`border px-2 py-1 text-[10px] uppercase tracking-widest ${topic === s ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
            {s}
          </button>
        ))}
      </div>
      <QuestionList base={{ category: "technical", topic: topic || undefined }} />
    </>
  );
}
