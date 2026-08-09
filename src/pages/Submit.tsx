import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, EmptyState } from "@/components/layout/Shell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { fetchCompanies, fetchColleges } from "@/lib/data";

const ROUNDS = [
  { value: "online_assessment", label: "Online Assessment (OA)" },
  { value: "aptitude", label: "Aptitude Round" },
  { value: "coding", label: "Coding Round" },
  { value: "technical_interview", label: "Technical Interview" },
  { value: "hr_interview", label: "HR Interview" },
  { value: "managerial", label: "Managerial Interview" },
  { value: "group_discussion", label: "Group Discussion" },
  { value: "other", label: "Other" },
];

const QUESTION_TYPES = [
  { value: "mcq", label: "MCQ" },
  { value: "coding", label: "Coding Problem" },
  { value: "interview", label: "Interview Question" },
  { value: "sql", label: "SQL Query" },
  { value: "subjective", label: "Subjective / Descriptive" },
];

export default function SubmitPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"experience" | "question">("experience");
  const [companyName, setCompanyName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [round, setRound] = useState("online_assessment");
  const [body, setBody] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionType, setQuestionType] = useState("mcq");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(0);

  const { data: companies } = useQuery({ queryKey: ["companies", "all"], queryFn: () => fetchCompanies(undefined, 500) });
  const { data: colleges } = useQuery({ queryKey: ["colleges"], queryFn: fetchColleges });

  async function submitExperience(e: React.FormEvent) {
    e.preventDefault();
    if (body.trim().length < 30) {
      setStatus("Please describe the round in at least 30 characters.");
      return;
    }
    setBusy(true);
    setStatus(null);

    const payload: any = {
      company_name: companyName || null,
      college_name: collegeName || null,
      year: Number(year),
      round,
      content: body.trim(),
      status: "pending",
    };
    if (user) payload.user_id = user.id;

    const { error } = await supabase.from("user_submissions").insert(payload);
    setBusy(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    setBody("");
    setSubmitted((s) => s + 1);
    setStatus("✓ Submitted successfully! It will appear once a moderator verifies it.");
  }

  async function submitQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (body.trim().length < 20) {
      setStatus("Question text must be at least 20 characters.");
      return;
    }
    setBusy(true);
    setStatus(null);

    const payload: any = {
      company_name: companyName || null,
      college_name: collegeName || null,
      year: Number(year),
      round,
      content: JSON.stringify({
        type: "question_submission",
        question_text: body.trim(),
        question_type: questionType,
        difficulty,
      }),
      status: "pending",
    };
    if (user) payload.user_id = user.id;

    const { error } = await supabase.from("user_submissions").insert(payload);
    setBusy(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    setBody("");
    setSubmitted((s) => s + 1);
    setStatus("✓ Question submitted! It will be reviewed and added to the database.");
  }

  const field = "w-full border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <>
      <PageHeader
        code="S / 011 — CONTRIBUTION"
        title="Submit Data"
        description="Everything you submit enters a moderation queue. Nothing is published as verified without review. Your contributions make the platform stronger."
      />

      {/* Tab selector */}
      <div className="flex gap-px border-b border-border bg-border">
        <button
          onClick={() => setTab("experience")}
          className={`flex-1 bg-card px-4 py-3 text-xs uppercase tracking-widest ${tab === "experience" ? "text-primary" : "text-muted-foreground"}`}
        >
          Submit Experience
        </button>
        <button
          onClick={() => setTab("question")}
          className={`flex-1 bg-card px-4 py-3 text-xs uppercase tracking-widest ${tab === "question" ? "text-primary" : "text-muted-foreground"}`}
        >
          Submit Question
        </button>
      </div>

      {/* Submission stats */}
      {submitted > 0 && (
        <div className="flex items-center gap-2 border-b border-border bg-signal-green/5 px-5 py-2">
          <span className="size-1.5 rounded-full bg-signal-green" />
          <span className="text-xs text-signal-green font-bold">{submitted} submission{submitted > 1 ? "s" : ""} this session</span>
        </div>
      )}

      {!user && (
        <div className="flex items-center gap-2 border-b border-border bg-signal-yellow/5 px-5 py-2">
          <span className="size-1.5 rounded-full bg-signal-yellow" />
          <span className="text-xs text-signal-yellow">Submitting anonymously. Sign in to track your contributions.</span>
        </div>
      )}

      <form
        onSubmit={tab === "experience" ? submitExperience : submitQuestion}
        className="grid max-w-3xl gap-4 p-5"
      >
        {/* Company & College */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="label-xs">Company *</span>
            <select className={field} value={companyName} onChange={(e) => setCompanyName(e.target.value)}>
              <option value="">— select company —</option>
              {companies?.map((c: any) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            <span className="label-xs">College</span>
            <select className={field} value={collegeName} onChange={(e) => setCollegeName(e.target.value)}>
              <option value="">— select college —</option>
              {colleges?.map((c: any) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Year & Round */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="label-xs">Year *</span>
            <input className={field} value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="2024" />
          </label>
          <label className="grid gap-1">
            <span className="label-xs">Round *</span>
            <select className={field} value={round} onChange={(e) => setRound(e.target.value)}>
              {ROUNDS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Question-specific fields */}
        {tab === "question" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="label-xs">Question Type</span>
              <select className={field} value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                {QUESTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="label-xs">Difficulty</span>
              <select className={field} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
          </div>
        )}

        {/* Content */}
        <label className="grid gap-1">
          <span className="label-xs">
            {tab === "experience" ? "Describe the experience *" : "Question text *"}
          </span>
          <textarea
            className={`${field} min-h-40`}
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, 5000))}
            placeholder={tab === "experience"
              ? "Describe the round, questions asked, timing, difficulty, result, and any tips for future candidates…"
              : "Write the full question text. Include options for MCQs in the format A) ... B) ... etc."
            }
          />
          <span className="text-right text-[10px] text-muted-foreground tabular-nums">{body.length} / 5000</span>
        </label>

        {status && (
          <div className={`text-xs ${status.startsWith("✓") ? "text-signal-green" : "text-signal-red"}`}>
            {status}
          </div>
        )}

        <button
          disabled={busy}
          className="justify-self-start border border-primary px-6 py-2 text-xs uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
        >
          {busy ? "Submitting…" : tab === "experience" ? "Submit Experience" : "Submit Question"}
        </button>
      </form>

      {/* Guidelines */}
      <div className="border-t border-border p-5">
        <div className="label-xs mb-3">SUBMISSION GUIDELINES</div>
        <div className="grid gap-3 text-xs text-muted-foreground md:grid-cols-2">
          <div className="panel p-3">
            <div className="font-bold text-foreground">What to include</div>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Exact questions or topics asked</li>
              <li>Time limits and number of questions</li>
              <li>Difficulty level and any patterns noticed</li>
              <li>Your overall experience and tips</li>
            </ul>
          </div>
          <div className="panel p-3">
            <div className="font-bold text-foreground">What NOT to include</div>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Personal information (name, roll number)</li>
              <li>Confidential company information</li>
              <li>Copy-pasted content from paid platforms</li>
              <li>Inaccurate or fabricated experiences</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
