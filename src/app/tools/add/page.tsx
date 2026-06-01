import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { AddToolForm } from "@/components/AddToolForm";

export const metadata = {
  title: "Add AI Tool | AI Tools Benchmark",
};

export default function AddToolPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-950 px-4 pt-24 pb-16">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-violet-600/20 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-white">Add an AI tool</h1>
          <p className="mb-10 text-zinc-400">
            Share OpenAI, Gemini, Claude, or any tool with the community benchmark.
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
            <AddToolForm />
          </div>
        </div>
      </main>
    </>
  );
}
