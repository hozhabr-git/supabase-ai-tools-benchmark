import type { AiTool, AiToolInsert, PricingModel } from "@/types/ai-tool";
import { createServerSupabase } from "@/lib/supabase/server";

export async function getRecentTools(limit = 8): Promise<AiTool[]> {
  const supabase = createServerSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("ai_tools")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentTools:", error.message);
    return [];
  }
  return (data ?? []) as AiTool[];
}

export async function searchTools(query: string, limit = 24): Promise<AiTool[]> {
  const supabase = createServerSupabase();
  if (!supabase) return [];
  const q = query.trim();
  if (!q) return getRecentTools(limit);

  const safe = q.replace(/,/g, " ").trim();
  const pattern = `%${safe}%`;
  const { data, error } = await supabase
    .from("ai_tools")
    .select("*")
    .or(
      `name.ilike.${pattern},provider.ilike.${pattern},description.ilike.${pattern},category.ilike.${pattern}`
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("searchTools:", error.message);
    return [];
  }
  return (data ?? []) as AiTool[];
}

export async function getToolById(id: string): Promise<AiTool | null> {
  const supabase = createServerSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("ai_tools")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as AiTool;
}

export async function createTool(
  input: Omit<AiToolInsert, "logo_url"> & { logo_url?: string | null }
): Promise<{ tool: AiTool | null; error: string | null }> {
  const supabase = createServerSupabase();
  if (!supabase) {
    return { tool: null, error: "Supabase is not configured on the server." };
  }
  const { data, error } = await supabase
    .from("ai_tools")
    .insert({
      name: input.name.trim(),
      provider: input.provider.trim(),
      description: input.description.trim(),
      website_url: input.website_url?.trim() || null,
      category: input.category.trim() || "general",
      pricing_model: input.pricing_model,
      tags: input.tags ?? [],
      logo_url: input.logo_url ?? null,
    })
    .select()
    .single();

  if (error) return { tool: null, error: error.message };
  return { tool: data as AiTool, error: null };
}

export async function deleteTool(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createServerSupabase();
  if (!supabase) {
    return { success: false, error: "Supabase is not configured on the server." };
  }
  const { error } = await supabase.from("ai_tools").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

export const PRICING_OPTIONS: { value: PricingModel; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
  { value: "enterprise", label: "Enterprise" },
];

export const CATEGORY_SUGGESTIONS = [
  "chat",
  "image",
  "code",
  "audio",
  "video",
  "productivity",
  "research",
  "general",
];
