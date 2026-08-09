import { useState, useEffect, useCallback } from "react";

export type MockQuestion = {
  id: string;
  title: string | null;
  question_text: string;
  options: any;
  answer: string | null;
  explanation: string | null;
  question_type: string;
  category: string;
  topic: string | null;
  difficulty: string;
};

type MockState = "idle" | "running" | "review";

export function MockEngine({
  questions,
  onClose,
  testLabel,
}: {
  questions: MockQuestion[];
  onClose: () => void;
  testLabel: string;
}) {
  const [state, setState] = useState<MockState>("idle");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [elapsed, setElapsed] = useState(0);
  const timeLimit = questions.length * 60; // 1 min per question

  // Timer
  useEffect(() => {
    if (state !== "running") return;
    const t = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= timeLimit) {
          setState("review");
          return timeLimit;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [state, timeLimit]);

  const selectAnswer = useCallback(
    (key: string) => {
      setAnswers((a) => ({ ...a, [current]: key }));
    },
    [current],
  );

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // ── IDLE ──
  if (state === "idle") {
    return (
      <div className="panel mx-auto max-w-xl p-8 text-center">
        <div className="label-xs">{testLabel}</div>
        <h2 className="mt-4 text-xl font-bold text-foreground">Mock Test</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {questions.length} questions · {formatTime(timeLimit)} time limit · No negative marking
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setState("running")}
            className="border border-primary px-6 py-2 text-sm uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Start Test
          </button>
          <button
            onClick={onClose}
            className="border border-border px-6 py-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── REVIEW ──
  if (state === "review") {
    let correct = 0;
    let attempted = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i]) {
        attempted++;
        if (answers[i] === questions[i]!.answer) correct++;
      }
    }
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const score = Math.round((correct / questions.length) * 100);

    return (
      <div className="p-5">
        <div className="panel mx-auto max-w-2xl p-8 text-center">
          <div className="label-xs">RESULTS</div>
          <h2 className="mt-4 text-2xl font-bold text-foreground">Test Complete</h2>
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="panel p-4">
              <div className="text-2xl font-bold text-foreground tabular-nums">{score}%</div>
              <div className="label-xs mt-1">Score</div>
            </div>
            <div className="panel p-4">
              <div className="text-2xl font-bold text-signal-green tabular-nums">{correct}</div>
              <div className="label-xs mt-1">Correct</div>
            </div>
            <div className="panel p-4">
              <div className="text-2xl font-bold text-signal-red tabular-nums">{attempted - correct}</div>
              <div className="label-xs mt-1">Wrong</div>
            </div>
            <div className="panel p-4">
              <div className="text-2xl font-bold text-muted-foreground tabular-nums">{questions.length - attempted}</div>
              <div className="label-xs mt-1">Skipped</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Accuracy: {accuracy}% · Time: {formatTime(elapsed)}
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-2xl">
          <div className="label-xs mb-3">DETAILED REVIEW</div>
          <div className="flex flex-col gap-3">
            {questions.map((q, i) => {
              const userAns = answers[i];
              const isCorrect = userAns === q.answer;
              const opts = q.options && typeof q.options === "object" ? Object.entries(q.options) : [];
              return (
                <div
                  key={i}
                  className={`panel p-4 ${!userAns ? "opacity-60" : isCorrect ? "border-signal-green/30" : "border-signal-red/30"}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="label-xs shrink-0 pt-0.5">Q{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-foreground">{q.question_text}</div>
                      {opts.length > 0 && (
                        <div className="mt-2 grid gap-1 sm:grid-cols-2">
                          {opts.map(([k, v]) => (
                            <div
                              key={k}
                              className={`border px-2 py-1 text-xs ${
                                k === q.answer
                                  ? "border-signal-green text-signal-green"
                                  : k === userAns && k !== q.answer
                                  ? "border-signal-red text-signal-red"
                                  : "border-border text-muted-foreground"
                              }`}
                            >
                              <span className="font-bold">{k.toUpperCase()}.</span> {String(v)}
                            </div>
                          ))}
                        </div>
                      )}
                      {q.explanation && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                    <span className={`shrink-0 text-xs font-bold ${isCorrect ? "text-signal-green" : userAns ? "text-signal-red" : "text-muted-foreground"}`}>
                      {isCorrect ? "✓" : userAns ? "✗" : "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={onClose}
            className="mt-6 border border-border px-6 py-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // ── RUNNING ──
  const q = questions[current]!;
  const opts = q.options && typeof q.options === "object" ? Object.entries(q.options) : [];
  const remaining = timeLimit - elapsed;

  return (
    <div className="p-5">
      {/* Header bar */}
      <div className="mb-4 flex items-center gap-4">
        <div className="label-xs">{testLabel}</div>
        <div className="flex-1" />
        <div className={`text-sm font-bold tabular-nums ${remaining < 60 ? "text-signal-red animate-pulse" : "text-foreground"}`}>
          {formatTime(remaining)}
        </div>
        <button
          onClick={() => setState("review")}
          className="border border-border px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          Submit
        </button>
      </div>

      {/* Question nav dots */}
      <div className="mb-4 flex flex-wrap gap-1">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`size-7 border text-[10px] font-bold tabular-nums ${
              i === current
                ? "border-primary bg-primary text-primary-foreground"
                : answers[i]
                ? "border-signal-green/40 bg-signal-green/10 text-signal-green"
                : "border-border text-muted-foreground"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="panel p-6">
        <div className="flex items-start gap-3">
          <span className="label-xs shrink-0 pt-1">Q{current + 1}/{questions.length}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase ${q.difficulty === "easy" ? "text-signal-green" : q.difficulty === "hard" ? "text-signal-red" : "text-signal-yellow"}`}>
                {q.difficulty}
              </span>
              {q.topic && <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{q.topic}</span>}
            </div>
            <div className="mt-3 text-sm leading-relaxed text-foreground">{q.question_text}</div>
          </div>
        </div>

        {opts.length > 0 && (
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {opts.map(([k, v]) => (
              <button
                key={k}
                onClick={() => selectAnswer(k)}
                className={`border px-4 py-3 text-left text-sm transition-all ${
                  answers[current] === k
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground hover:border-primary/50"
                }`}
              >
                <span className="font-bold">{k.toUpperCase()}.</span> {String(v)}
              </button>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex gap-3">
          <button
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
            className="border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground disabled:opacity-30 hover:text-foreground"
          >
            Previous
          </button>
          {current < questions.length - 1 ? (
            <button
              onClick={() => setCurrent(current + 1)}
              className="border border-primary px-4 py-2 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => setState("review")}
              className="border border-signal-green px-4 py-2 text-xs uppercase tracking-widest text-signal-green hover:bg-signal-green hover:text-primary-foreground"
            >
              Submit Test
            </button>
          )}
          {answers[current] && (
            <button
              onClick={() => setAnswers((a) => { const n = { ...a }; delete n[current]; return n; })}
              className="ml-auto text-xs text-muted-foreground hover:text-foreground"
            >
              Clear answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
