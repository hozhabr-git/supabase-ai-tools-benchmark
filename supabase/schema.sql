-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.ai_tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  provider text not null,
  description text not null default '',
  website_url text,
  category text not null default 'general',
  pricing_model text not null default 'freemium',
  tags text[] not null default '{}',
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_tools_created_at_idx on public.ai_tools (created_at desc);
create index if not exists ai_tools_name_idx on public.ai_tools (name);
create index if not exists ai_tools_provider_idx on public.ai_tools (provider);

alter table public.ai_tools enable row level security;

create policy "Allow public read" on public.ai_tools
  for select using (true);

create policy "Allow public insert" on public.ai_tools
  for insert with check (true);

create policy "Allow public update" on public.ai_tools
  for update using (true);

create policy "Allow public delete" on public.ai_tools
  for delete using (true);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists ai_tools_updated_at on public.ai_tools;
create trigger ai_tools_updated_at
  before update on public.ai_tools
  for each row execute function public.set_updated_at();

-- Optional seed data
insert into public.ai_tools (name, provider, description, website_url, category, pricing_model, tags)
values
  ('ChatGPT', 'OpenAI', 'Conversational AI for writing, coding, and analysis.', 'https://chat.openai.com', 'chat', 'freemium', array['llm', 'chat', 'assistant']),
  ('Gemini', 'Google', 'Google multimodal AI for search, writing, and reasoning.', 'https://gemini.google.com', 'chat', 'freemium', array['llm', 'multimodal', 'google']),
  ('Claude', 'Anthropic', 'Helpful, harmless, and honest AI assistant with long context.', 'https://claude.ai', 'chat', 'freemium', array['llm', 'chat', 'anthropic']),
  ('Copilot', 'Microsoft', 'AI assistant integrated across Microsoft 365 and GitHub.', 'https://copilot.microsoft.com', 'productivity', 'paid', array['assistant', 'office', 'coding']),
  ('Midjourney', 'Midjourney', 'High-quality AI image generation from text prompts.', 'https://midjourney.com', 'image', 'paid', array['image', 'creative', 'art']);
