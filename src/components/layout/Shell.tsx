import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CommandSearch } from "@/components/search/CommandSearch";

const NAV = [
  { to: "/", label: "Library" },
  { to: "/companies", label: "Companies" },
  { to: "/questions", label: "Questions" },
  { to: "/pyq", label: "PYQs" },
  { to: "/coding", label: "Coding" },
  { to: "/dsa-sheet", label: "DSA A2Z Sheet" },
  { to: "/aptitude", label: "Aptitude" },
  { to: "/technical", label: "Technical" },
  { to: "/interviews", label: "Interviews" },
  { to: "/mocks", label: "Mocks" },
  { to: "/analytics", label: "Analytics" },
  { to: "/bbd", label: "BBD Campus" },
] as const;

export function Shell() {
  const { user, isStaff } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-sidebar p-4 lg:flex">
        <Link to="/" className="block">
          <div className="text-lg font-bold tracking-[0.18em] text-foreground">PLACEMENT</div>
          <div className="label-xs mt-1">UNIVERSAL PLACEMENT INTELLIGENCE</div>
        </Link>

        <nav className="mt-8 flex flex-col gap-0.5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `rounded-sm border border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground ${
                  isActive ? "border-border bg-surface-2 text-foreground" : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 border-t border-border pt-4">
          <div className="label-xs mb-2">COLLEGE LAYER</div>
          <NavLink
            to="/bbd"
            className={({ isActive }) =>
              `block rounded-sm border border-transparent px-3 py-2 text-sm text-muted-foreground hover:bg-surface-2 hover:text-foreground ${
                isActive ? "border-border bg-surface-2 text-foreground" : ""
              }`
            }
          >
            BBD Placements
          </NavLink>
          <NavLink
            to="/submit"
            className={({ isActive }) =>
              `block rounded-sm border border-transparent px-3 py-2 text-sm text-muted-foreground hover:bg-surface-2 hover:text-foreground ${
                isActive ? "border-border bg-surface-2 text-foreground" : ""
              }`
            }
          >
            Submit Data
          </NavLink>
          {isStaff ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `block rounded-sm border border-transparent px-3 py-2 text-sm text-muted-foreground hover:bg-surface-2 hover:text-foreground ${
                  isActive ? "border-border bg-surface-2 text-foreground" : ""
                }`
              }
            >
              Data Center
            </NavLink>
          ) : null}
        </div>

        <div className="mt-auto pt-6">
          {user ? (
            <>
              <div className="label-xs truncate">{user.email}</div>
              <button
                onClick={signOut}
                className="mt-2 w-full border border-border-strong px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="block w-full bg-primary px-3 py-3 text-center text-xs font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-border bg-background/95 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-4 overflow-x-auto lg:hidden">
            {NAV.slice(0, 5).map((i) => (
              <NavLink key={i.to} to={i.to} className="whitespace-nowrap text-xs text-muted-foreground">
                {i.label}
              </NavLink>
            ))}
          </div>
          <div className="hidden items-center gap-5 lg:flex">
            <span className="flex items-center gap-2 label-xs">
              <span className="size-1.5 rounded-full bg-signal-red" /> UNVERIFIED
            </span>
            <span className="flex items-center gap-2 label-xs">
              <span className="size-1.5 rounded-full bg-signal-yellow" /> CANDIDATE REPORTED
            </span>
            <span className="flex items-center gap-2 label-xs">
              <span className="size-1.5 rounded-full bg-signal-green" /> VERIFIED
            </span>
          </div>
          <CommandSearch />
        </header>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  code,
  title,
  description,
}: {
  code: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-border px-5 py-8 grid-noise">
      <div className="label-xs">{code}</div>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function Panel({
  index,
  kind,
  label,
  children,
  tag,
}: {
  index: string;
  kind: string;
  label: string;
  children: ReactNode;
  tag?: string;
}) {
  return (
    <div className="panel flex flex-col">
      {tag ? (
        <div className="px-3 pt-3">
          <span className="border border-border bg-surface-2 px-2 py-0.5 label-xs">{tag}</span>
        </div>
      ) : null}
      <div className="min-h-40 flex-1 p-4">{children}</div>
      <div className="flex items-center gap-3 border-t border-border px-3 py-2 text-xs">
        <span className="text-muted-foreground">{kind}</span>
        <span className="text-muted-foreground">{index}</span>
        <span className="truncate text-foreground">{label}</span>
      </div>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="panel p-8 text-center">
      <div className="text-sm text-foreground">{title}</div>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="panel p-4">
      <div className="text-2xl font-bold text-foreground tabular-nums">{value}</div>
      <div className="label-xs mt-1">{label}</div>
    </div>
  );
}
