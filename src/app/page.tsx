import { Header } from "@/components/Header";
import { SearchHero } from "@/components/SearchHero";
import { getRecentTools } from "@/lib/tools";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const recentTools = await getRecentTools(12);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-950">
        <SearchHero initialTools={recentTools} />
        <footer className="border-t border-white/10 py-8 text-center text-sm text-zinc-500">
          AI Tools Benchmark — compare and catalog AI products
        </footer>
      </main>
    </>
  );
}
