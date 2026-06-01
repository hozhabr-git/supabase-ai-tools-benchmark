export type PricingModel = "free" | "freemium" | "paid" | "enterprise";

export type AiTool = {
  id: string;
  name: string;
  provider: string;
  description: string;
  website_url: string | null;
  category: string;
  pricing_model: PricingModel;
  tags: string[];
  logo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type AiToolInsert = Omit<
  AiTool,
  "id" | "created_at" | "updated_at"
> & {
  id?: string;
};
