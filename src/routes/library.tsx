import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Volume2, Trash2 } from "lucide-react";
import { Shell, Verified } from "@/components/sukhan/Shell";
import { coupletsData } from "@/components/sukhan/data";
import { getVocab, setVocab as storeVocab, getSavedCouplets, setSavedCouplets, speakUrdu, type SavedWord } from "@/components/sukhan/store";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Your Library — Sukhan" },
      { name: "description", content: "Your saved couplets and personal Urdu vocabulary in one place." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const [tab, setTab] = useState<"couplets" | "vocab">("couplets");
  const [vocab, setVocab] = useState<SavedWord[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  useEffect(() => { setVocab(getVocab()); setIds(getSavedCouplets()); }, []);
  const saved = coupletsData.filter((c) => ids.includes(c.id));
  const removeWord = (k: string) => { const n = vocab.filter((v) => v.key !== k); setVocab(n); storeVocab(n); };
  const removeCouplet = (id: number) => { const n = ids.filter((x) => x !== id); setIds(n); setSavedCouplets(n); };

  return (
    <Shell>
      <div className="relative px-5 pt-8">
        <h1 className="font-display text-2xl font-semibold">Library</h1>
        <div className="mt-5 grid grid-cols-2 rounded-full bg-card p-1 text-xs font-semibold">
          {([["couplets", "Saved Couplets"], ["vocab", "My Vocabulary"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-full py-2 ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {l} · {k === "couplets" ? saved.length : vocab.length}
            </button>
          ))}
        </div>
      </div>

      <section className="space-y-3 px-5 py-6">
        {tab === "couplets" && (saved.length === 0 ? (
          <p className="rounded-2xl bg-card p-5 text-center text-sm text-muted-foreground">No couplets saved yet. Tap "Save couplet" while reading to keep it here.</p>
        ) : saved.map((c) => (
          <div key={c.id} className="flex items-start gap-2 rounded-2xl bg-card p-4">
            <Link to="/read" search={{ id: c.id }} className="flex-1">
              <p className="urdu text-lg leading-loose">{c.urdu[0]}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">{c.poet} <Verified /></div>
            </Link>
            <button aria-label="Remove couplet" onClick={() => removeCouplet(c.id)} className="grid h-8 w-8 place-items-center rounded-full bg-secondary"><Trash2 className="h-4 w-4" /></button>
          </div>
        )))}

        {tab === "vocab" && (vocab.length === 0 ? (
          <p className="rounded-2xl bg-card p-5 text-center text-sm text-muted-foreground">No words saved yet. Tap on any word while reading to save it to your vocabulary!</p>
        ) : vocab.map((v) => (
          <div key={v.key} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="urdu text-2xl font-bold leading-tight">{v.word}</p>
                <p className="text-xs text-muted-foreground">{v.roman} · /{v.pronunciation}/</p>
              </div>
              <div className="flex gap-1">
                <button aria-label="Pronounce" onClick={() => speakUrdu(v.word)} className="grid h-8 w-8 place-items-center rounded-full bg-amber-grad text-primary-foreground"><Volume2 className="h-4 w-4" /></button>
                <button aria-label="Remove word" onClick={() => removeWord(v.key)} className="grid h-8 w-8 place-items-center rounded-full bg-secondary"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <p className="mt-2 text-sm"><span className="font-semibold text-primary">EN</span> {v.meaningEnglish}</p>
            <p className="text-sm text-muted-foreground"><span className="font-semibold text-primary">UR</span> {v.meaningUrdu}</p>
            <Link to="/read" search={{ id: v.coupletId }} className="mt-2 block rounded-xl bg-muted p-2 text-xs text-muted-foreground">
              <span className="italic">{v.couplet}</span> — <span className="font-semibold text-foreground">{v.poet}</span>
            </Link>
          </div>
        )))}
      </section>
    </Shell>
  );
}