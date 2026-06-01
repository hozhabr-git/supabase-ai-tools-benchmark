import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Tag } from "lucide-react";
import { ToolHoverActions } from "@/components/ToolHoverActions";
import { Header } from "@/components/Header";
import { formatPublishedAt } from "@/lib/format-date";
import { getToolById } from "@/lib/tools";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const tool = await getToolById(id);
  return {
    title: tool ? `${tool.name} | AI Tools Benchmark` : "Tool not found",
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const { id } = await params;
  const tool = await getToolById(id);

  if (!tool) notFound();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-950 px-4 pt-24 pb-16">
        <div className="relative mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>

          <article
            data-tool-card
            className="group relative rounded-2xl border border-white/10 bg-white/5 px-8 pb-8 pt-12 backdrop-blur-xl"
          >
            <ToolHoverActions
              toolId={tool.id}
              toolName={tool.name}
              redirectTo="/"
            />
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">{tool.name}</h1>
                <p className="mt-1 text-lg text-zinc-400">{tool.provider}</p>
              </div>
              <span className="rounded-full bg-violet-500/15 px-3 py-1 text-sm capitalize text-violet-300 ring-1 ring-violet-500/30">
                {tool.pricing_model}
              </span>
            </div>

            <p className="mb-8 text-lg leading-relaxed text-zinc-300">
              {tool.description || "No description provided."}
            </p>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Category
                </dt>
                <dd className="mt-1 capitalize text-white">{tool.category}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Published
                </dt>
                <dd className="mt-1 text-white">
                  {formatPublishedAt(tool.created_at)}
                </dd>
              </div>
              {tool.updated_at !== tool.created_at && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Last updated
                  </dt>
                  <dd className="mt-1 text-white">
                    {formatPublishedAt(tool.updated_at)}
                  </dd>
                </div>
              )}
            </dl>

            {tool.tags?.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Tags
                </p>
                <ul className="flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <li
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-lg bg-zinc-800/80 px-3 py-1 text-sm text-zinc-300"
                    >
                      <Tag className="h-3.5 w-3.5" />
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tool.website_url && (
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-medium text-white hover:bg-violet-500"
              >
                Open website
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </article>
        </div>
      </main>
    </>
  );
}
