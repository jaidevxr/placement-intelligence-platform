import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { globalSearch } from "@/lib/data";

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Awaited<ReturnType<typeof globalSearch>> | null>(null);
  const navigate = useNavigate();

  // Keyboard shortcut: Ctrl+K or /
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      return;
    }
    const t = setTimeout(async () => {
      const r = await globalSearch(query);
      setResults(r);
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const go = useCallback(
    (path: string) => {
      setOpen(false);
      setQuery("");
      setResults(null);
      navigate(path);
    },
    [navigate],
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="ml-auto flex items-center gap-2 border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <span>SEARCH</span>
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">Ctrl K</kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg gap-0 overflow-hidden border border-border bg-card p-0 shadow-2xl">
          <Command className="bg-transparent" shouldFilter={false}>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Search companies, questions, problems…"
              className="border-b border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <CommandList className="max-h-80 overflow-y-auto">
              <CommandEmpty className="p-6 text-center text-xs text-muted-foreground">
                {query.length < 2 ? "Type at least 2 characters…" : "No results found."}
              </CommandEmpty>

              {results?.companies?.length ? (
                <CommandGroup heading="Companies" className="px-2 pb-2">
                  {results.companies.map((c) => (
                    <CommandItem
                      key={c.id}
                      onSelect={() => go(`/companies/${c.slug}`)}
                      className="flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm hover:bg-surface-2"
                    >
                      <span className="font-medium text-foreground">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.sector}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {results?.coding?.length ? (
                <CommandGroup heading="Coding Problems" className="px-2 pb-2">
                  {results.coding.map((p) => (
                    <CommandItem
                      key={p.id}
                      onSelect={() => go("/coding")}
                      className="flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm hover:bg-surface-2"
                    >
                      <span className="font-medium text-foreground">{p.title}</span>
                      <span className={`text-xs font-bold uppercase ${p.difficulty === "easy" ? "text-signal-green" : p.difficulty === "hard" ? "text-signal-red" : "text-signal-yellow"}`}>{p.difficulty}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {results?.questions?.length ? (
                <CommandGroup heading="Questions" className="px-2 pb-2">
                  {results.questions.map((q) => (
                    <CommandItem
                      key={q.id}
                      onSelect={() => go("/questions")}
                      className="flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm hover:bg-surface-2"
                    >
                      <span className="truncate text-foreground">{q.title || q.question_text?.slice(0, 60)}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{q.category?.replace(/_/g, " ")}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
