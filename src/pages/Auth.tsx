import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } },
      });
      setBusy(false);
      setMsg(error ? error.message : "Check your email to confirm your account.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMsg(error.message);
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setMsg("Google sign-in failed. Try again.");
  }

  const field = "w-full border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="text-lg font-bold tracking-[0.18em] text-foreground">PLACEMENT</div>
        <div className="label-xs mt-1">UNIVERSAL PLACEMENT INTELLIGENCE</div>

        <div className="panel mt-8">
          <div className="flex border-b border-border">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 px-4 py-3 text-xs uppercase tracking-widest ${mode === m ? "text-primary" : "text-muted-foreground"}`}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="grid gap-3 p-4">
            {mode === "signup" ? (
              <input className={field} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="FULL NAME" />
            ) : null}
            <input className={field} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="EMAIL" />
            <input className={field} type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="PASSWORD" />
            {msg ? <div className="text-xs text-muted-foreground">{msg}</div> : null}
            <button disabled={busy} className="border border-primary px-4 py-2 text-xs uppercase tracking-widest text-primary disabled:opacity-40">
              {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
            <button type="button" onClick={googleSignIn} className="border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
