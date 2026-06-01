"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  CATEGORY_SUGGESTIONS,
  PRICING_OPTIONS,
} from "@/lib/tools";
import type { PricingModel } from "@/types/ai-tool";

export function AddToolForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      provider: form.get("provider"),
      description: form.get("description"),
      website_url: form.get("website_url"),
      category: form.get("category"),
      pricing_model: form.get("pricing_model"),
      tags: form.get("tags"),
    };

    const res = await fetch("/api/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Failed to save tool");
      return;
    }

    router.push("/");
    router.refresh();
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block sm:col-span-1">
          <span className="mb-1.5 block text-sm font-medium text-zinc-300">
            Tool name *
          </span>
          <input
            name="name"
            required
            placeholder="e.g. ChatGPT"
            className={inputClass}
          />
        </label>
        <label className="block sm:col-span-1">
          <span className="mb-1.5 block text-sm font-medium text-zinc-300">
            Provider *
          </span>
          <input
            name="provider"
            required
            placeholder="e.g. OpenAI"
            className={inputClass}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-zinc-300">
          Description
        </span>
        <textarea
          name="description"
          rows={4}
          placeholder="What does this tool do?"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-zinc-300">
          Website URL
        </span>
        <input
          name="website_url"
          type="url"
          placeholder="https://..."
          className={inputClass}
        />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-300">
            Category
          </span>
          <input
            name="category"
            list="categories"
            defaultValue="general"
            className={inputClass}
          />
          <datalist id="categories">
            {CATEGORY_SUGGESTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-300">
            Pricing
          </span>
          <select
            name="pricing_model"
            defaultValue="freemium"
            className={inputClass}
          >
            {PRICING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-zinc-300">
          Tags (comma-separated)
        </span>
        <input
          name="tags"
          placeholder="llm, chat, coding"
          className={inputClass}
        />
      </label>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/30">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 font-medium text-white transition hover:bg-violet-500 disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Save tool
      </button>
    </form>
  );
}
