import { PageHeader } from "@/components/layout/Shell";
import { QuestionList } from "@/components/questions/QuestionList";

export default function QuestionsPage() {
  return (
    <>
      <PageHeader
        code="Q / 002 — UNIVERSAL QUESTION MODEL"
        title="Questions"
        description="Every question is one canonical record with many source references and many company / college / year / round links."
      />
      <QuestionList base={{}} />
    </>
  );
}
