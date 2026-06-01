import { NextRequest, NextResponse } from "next/server";
import { createTool, searchTools } from "@/lib/tools";
import type { PricingModel } from "@/types/ai-tool";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const tools = await searchTools(q);
  return NextResponse.json({ tools });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const name = String(data.name ?? "").trim();
  const provider = String(data.provider ?? "").trim();
  const description = String(data.description ?? "").trim();

  if (!name || !provider) {
    return NextResponse.json(
      { error: "Name and provider are required" },
      { status: 400 }
    );
  }

  const tagsRaw = data.tags;
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw.map(String)
    : String(tagsRaw ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

  const pricing = String(data.pricing_model ?? "freemium") as PricingModel;

  const { tool, error } = await createTool({
    name,
    provider,
    description,
    website_url: data.website_url ? String(data.website_url) : null,
    category: String(data.category ?? "general"),
    pricing_model: pricing,
    tags,
    logo_url: data.logo_url ? String(data.logo_url) : null,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ tool }, { status: 201 });
}
