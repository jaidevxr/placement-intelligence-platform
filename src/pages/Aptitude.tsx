import { useState } from "react";
import { PageHeader } from "@/components/layout/Shell";
import { QuestionList } from "@/components/questions/QuestionList";

const GROUPS = {
  QUANTITATIVE: ["Number System","Percentages","Profit & Loss","Ratio","Average","Mixture","Alligation","Time & Work","Pipes","Time Speed Distance","Trains","Boats","Simple Interest","Compound Interest","Partnership","Ages","Probability","Permutation","Combination","Algebra","Geometry","Mensuration","Data Interpretation","Clocks","Calendars"],
  LOGICAL: ["Series","Coding-Decoding","Blood Relations","Directions","Ranking","Seating Arrangement","Puzzles","Syllogism","Statements","Assumptions","Conclusions","Data Sufficiency","Venn Diagrams","Analogy","Classification"],
  VERBAL: ["Reading Comprehension","Vocabulary","Synonyms","Antonyms","Grammar","Sentence Correction","Error Detection","Fill in the Blanks","Para Jumbles","Sentence Completion"],
} as const;

const CATEGORY: Record<keyof typeof GROUPS, string> = {
  QUANTITATIVE: "aptitude_quant",
  LOGICAL: "aptitude_logical",
  VERBAL: "aptitude_verbal",
};

export default function AptitudePage() {
  const [group, setGroup] = useState<keyof typeof GROUPS>("QUANTITATIVE");
  const [topic, setTopic] = useState<string>("");

  return (
    <>
      <PageHeader
        code="A / 005 — APTITUDE TAXONOMY"
        title="Aptitude"
        description="Fifty topics across quantitative, logical and verbal reasoning, each linked to the companies and years where the topic was reported."
      />
      <div className="flex gap-px border-b border-border bg-border">
        {(Object.keys(GROUPS) as (keyof typeof GROUPS)[]).map((g) => (
          <button
            key={g}
            onClick={() => {
              setGroup(g);
              setTopic("");
            }}
            className={`flex-1 bg-card px-4 py-3 text-xs uppercase tracking-widest ${group === g ? "text-primary" : "text-muted-foreground"}`}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-b border-border p-5">
        <button
          onClick={() => setTopic("")}
          className={`border px-2 py-1 text-[10px] uppercase tracking-widest ${topic === "" ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
        >
          All
        </button>
        {GROUPS[group].map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`border px-2 py-1 text-[10px] uppercase tracking-widest ${topic === t ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <QuestionList base={{ category: CATEGORY[group], topic: topic || undefined }} />
    </>
  );
}
