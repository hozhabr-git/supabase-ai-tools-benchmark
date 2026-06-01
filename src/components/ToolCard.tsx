import Link from "next/link";
import { Calendar, ExternalLink, Tag } from "lucide-react";
import { ToolHoverActions } from "@/components/ToolHoverActions";
import { formatPublishedAt } from "@/lib/format-date";
import type { AiTool } from "@/types/ai-tool";

const pricingColors: Record<string, string> = {
  free: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  freemium: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  paid: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  enterprise: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
};

type ToolCardProps = {
  tool: AiTool;
  onDeleted?: () => void;
};

export function ToolCard({ tool, onDeleted }: ToolCardProps) {
  const pricingClass =
    pricingColors[tool.pricing_model] ?? pricingColors.freemium;

  const detailHref = `/tools/${tool.id}`;

  return (
    <article
      data-tool-card
      className="group relative flex flex-col cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-5 pb-5 pt-10 backdrop-blur-md transition-[transform,border-color,background-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-violet-950/25"
    >
      <Link
        href={detailHref}
        className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        aria-label={`View details for ${tool.name}`}
      />
      <ToolHoverActions
        toolId={tool.id}
        toolName={tool.name}
        onDeleted={onDeleted}
      />
      <div className="relative z-[1] pointer-events-none flex flex-1 flex-col">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-violet-100">
              {tool.name}
            </h3>
            <p className="text-sm text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">
              {tool.provider}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-zinc-500">
              <Calendar className="h-3 w-3 shrink-0" />
              Published {formatPublishedAt(tool.created_at)}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${pricingClass}`}
          >
            {tool.pricing_model}
          </span>
        </div>

        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-300">
          {tool.description || "No description yet."}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-xs capitalize text-zinc-300">
            {tool.category}
          </span>
          {tool.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-zinc-800/50 px-2 py-0.5 text-xs text-zinc-400"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>

        {tool.website_url && (
          <a
            href={tool.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto relative z-[2] mt-4 inline-flex w-fit items-center gap-1 text-sm text-violet-300 transition-colors duration-300 hover:text-violet-200"
            onClick={(e) => e.stopPropagation()}
          >
            Visit website
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
