"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Search, Loader2, Plus } from "lucide-react";
import type { AiTool } from "@/types/ai-tool";
import { ToolCard } from "./ToolCard";

type SearchHeroProps = {
  initialTools: AiTool[];
  initialQuery?: string;
};

export function SearchHero({
  initialTools,
  initialQuery = "",
}: SearchHeroProps) {
  const [query, setQuery] = useState(initialQuery);
  const [tools, setTools] = useState(initialTools);
  const [isPending, startTransition] = useTransition();

  const runSearch = useCallback((q: string) => {
    startTransition(async () => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`/api/tools?${params.toString()}`);
      const json = await res.json();
      setTools(json.tools ?? []);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      runSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, runSearch]);

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 pt-24 pb-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/30 blur-[120px]" />
        <div className="absolute top-1/3 right-0 h-[280px] w-[400px] rounded-full bg-fuchsia-600/20 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[240px] w-[360px] rounded-full bg-cyan-600/15 blur-[90px]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-violet-300/90">
          AI Tools Benchmark
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Discover & compare
          <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
            AI tools
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-base text-zinc-400 sm:text-lg">
          Search OpenAI, Gemini, Claude, and hundreds more. Add your favorites and
          keep a living benchmark of the AI landscape.
        </p>

        <div className="relative mx-auto w-full max-w-3xl">
          <div className="absolute inset-0 rounded-3xl bg-violet-500/20 blur-2xl" />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="flex flex-1 items-center rounded-3xl border border-white/15 bg-white/10 p-2 shadow-2xl shadow-violet-950/50 backdrop-blur-2xl">
              <Search className="ml-4 h-6 w-6 shrink-0 text-zinc-400" />
              <input
                type="text"
                role="searchbox"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, provider, category…"
                className="w-full bg-transparent px-4 py-5 text-lg text-white placeholder:text-zinc-500 focus:outline-none"
                aria-label="Search AI tools"
              />
              {isPending && (
                <Loader2 className="mr-4 h-5 w-5 animate-spin text-violet-400" />
              )}
            </div>
            <Link
              href="/tools/add"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-3xl border border-violet-400/30 bg-violet-600 px-6 py-5 text-base font-medium text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-500 sm:px-8"
            >
              <Plus className="h-5 w-5" />
              Add tool
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-16 w-full max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-4 px-2">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {query.trim() ? "Search results" : "Recently added"}
            </h2>
            <p className="text-sm text-zinc-500">
              {tools.length} tool{tools.length === 1 ? "" : "s"}
              {query.trim() ? ` for “${query.trim()}”` : ""}
            </p>
          </div>
        </div>

        {tools.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-16 text-center backdrop-blur-md">
            <p className="text-zinc-400">
              {query.trim()
                ? "No tools match your search. Try another term or add a new tool."
                : "No tools yet. Run the Supabase schema SQL, or add your first tool."}
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool) => (
              <li key={tool.id}>
                <ToolCard
                  tool={tool}
                  onDeleted={() =>
                    setTools((prev) => prev.filter((t) => t.id !== tool.id))
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
