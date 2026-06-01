import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/30">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">AI Tools Benchmark</span>
          <span className="sm:hidden">AI Tools</span>
        </Link>
      </div>
    </header>
  );
}
