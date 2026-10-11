import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Play, Settings } from "lucide-react";
import { Shell, Verified, Wave } from "@/components/sukhan/Shell";
import { coupletsData, moods } from "@/components/sukhan/data";
import { ThemeToggle } from "@/components/sukhan/ThemeToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sukhan — Urdu poetry for late nights" },
      { name: "description", content: "Discover Urdu poetry by mood, hear recitations, and share aesthetic couplet cards." },
    ],
  }),
  component: Home,
});

function Home() {
  const [mode, setMode] = useState<"mood" | "poet">("mood");
  const [mood, setMood] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const feed = coupletsData.filter(
    (c) =>
      (!mood || c.mood.includes(mood)) &&
      (!query ||
        (mode === "poet"
          ? c.poet.toLowerCase().includes(query)
          : c.mood.some((m) => m.toLowerCase().includes(query)) || c.tashreeh.toLowerCase().includes(query) || c.english.toLowerCase().includes(query))),
  );
  const daily = coupletsData[0]!;
  
  return (
    <Shell>
      <header className="flex items-center justify-between px-5 pt-8">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-primary">Sukhan</h1>
          <p className="text-xs text-muted-foreground">سخن · poetry for the quiet hours</p>
        </div>
        <div className="flex gap-2">
          {/* Yahan sirf Settings ka Link hona chahiye */}
          <Link to="/settings" aria-label="Settings" className="grid h-10 w-10 place-items-center rounded-full bg-secondary transition-transform hover:scale-105">
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <div className="px-5 pt-5">
        <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={mode === "mood" ? "How are you feeling tonight?" : "Ghalib, Faiz, Jaun…"}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mt-3 inline-flex rounded-full bg-card p-1 text-xs font-semibold">
          {(["mood", "poet"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-1.5 transition ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              {m === "mood" ? "Mood Search" : "Poet Search"}
            </button>
          ))}
        </div>
      </div>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5">
        {moods.map((m) => (
          <button
            key={m}
            onClick={() => setMood(mood === m ? null : m)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
              mood === m ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <section className="px-5 pt-6">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Couplet of the day</p>
        <Link to="/read" search={{ id: daily.id }} className="block rounded-3xl border border-border bg-card-grad p-6 shadow-glow">
          <div className="urdu text-center text-xl text-foreground">
            {daily.urdu.map((l) => <p key={l}>{l}</p>)}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{daily.poet}</p>
              <Verified />
            </div>
            <span className="flex items-center gap-2 rounded-full bg-amber-grad px-4 py-2 text-xs font-bold text-primary-foreground">
              <Play className="h-3.5 w-3.5 fill-current" /> Play recitation
            </span>
          </div>
        </Link>
      </section>

      <section className="px-5 pb-6 pt-7">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {mood ?? "All couplets"} · {feed.length}
        </p>
        <div className="space-y-3">
          {feed.length === 0 && <p className="rounded-2xl bg-card p-4 text-sm text-muted-foreground">No couplets match yet — try another mood or poet.</p>}
          {feed.map((c) => (
            <div key={c.id} className="rounded-2xl bg-card p-4">
              <Link to="/read" search={{ id: c.id }} className="block">
                <div className="urdu text-center text-base leading-[2.1]">{c.urdu.map((l) => <p key={l}>{l}</p>)}</div>
                <p className="mt-1 text-sm font-semibold">{c.poet}</p>
                <p className="text-[11px] text-muted-foreground">{c.mood.join(" · ")}</p>
              </Link>
              <div className="mt-2 flex items-center justify-between">
                <Verified label="Verified poet" />
                <Link to="/player" search={{ id: c.id }} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Wave bars={6} playing={false} /> <Play className="h-3.5 w-3.5 fill-current text-primary" /> {c.len}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}