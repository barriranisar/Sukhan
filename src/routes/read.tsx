import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, BadgeCheck, X, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/sukhan/Shell";
import { getCouplet, coupletSearch } from "@/components/sukhan/data";
import { getVocab, setVocab as storeVocab, getSavedCouplets, setSavedCouplets, type SavedWord } from "@/components/sukhan/store";
import { isUserAuthenticated } from "@/components/sukhan/auth";
import { GuestAuthDialog } from "@/components/sukhan/GuestAuthDialog";

export const Route = createFileRoute("/read")({
  validateSearch: coupletSearch,
  head: () => ({
    meta: [
      { title: "Read a couplet — Sukhan" },
      { name: "description", content: "Tap any word for its meaning, switch scripts, and read a simple explanation." },
    ],
  }),
  component: Read,
});

function Read() {
  const { id } = Route.useSearch();
  const couplet = getCouplet(id);
  const [script, setScript] = useState<"urdu" | "roman">("urdu");
  const [sel, setSel] = useState<[number, number] | null>(null);
  const [open, setOpen] = useState(true);
  const [vocab, setVocab] = useState<SavedWord[]>([]);
  const [savedC, setSavedC] = useState<number[]>([]);
  const [showGuestDialog, setShowGuestDialog] = useState(false);

  useEffect(() => { setVocab(getVocab()); setSavedC(getSavedCouplets()); }, []);
  const bookmarked = savedC.includes(couplet.id);
  const toggleBookmark = () => {
    if (!isUserAuthenticated()) {
      setShowGuestDialog(true);
      return;
    }
    const next = bookmarked ? savedC.filter((x) => x !== couplet.id) : [...savedC, couplet.id];
    setSavedC(next);
    setSavedCouplets(next);
    if (bookmarked) {
      toast.info("Removed from collection");
    } else {
      toast.success("Couplet saved to your collection ✨");
    }
  };
  const lines = couplet[script];
  const g = sel ? (couplet.words[sel[0]]?.[sel[1]] ?? null) : null;
  const key = g ? `${couplet.id}:${g.word}:${g.meaningEnglish}` : "";
  const saved = g ? vocab.some((v) => v.key === key) : false;
  const toggleSave = () => {
    if (!g) return;
    if (!isUserAuthenticated()) {
      setShowGuestDialog(true);
      return;
    }
    const next = saved ? vocab.filter((v) => v.key !== key) : [...vocab, {
      key, word: g.word, roman: g.roman, meaningUrdu: g.meaningUrdu, meaningEnglish: g.meaningEnglish,
      pronunciation: g.pronunciation, couplet: couplet.roman.join(" / "), poet: couplet.poet, coupletId: couplet.id,
    }];
    setVocab(next); storeVocab(next);
  };

  return (
    <Shell>
      <div className="max-w-2xl mx-auto w-full">
        {/* Centered Script Toggle with Left-aligned Back Button */}
        <div className="relative flex items-center justify-center pt-2 md:pt-4 min-h-[44px]">
          <Link
            to="/discover"
            aria-label="Back"
            className="absolute left-0 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="inline-flex rounded-full bg-card border border-border p-1 text-xs font-semibold shadow-sm">
            {(["urdu", "roman"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScript(s)}
                className={`rounded-full px-4 py-1.5 transition-colors ${
                  script === s
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "urdu" ? "Nastaliq Urdu" : "Roman Urdu"}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8">
        <p className="mb-2 text-center text-[11px] text-muted-foreground">Tap any word for its meaning</p>
        <div className={`text-center ${script === "urdu" ? "urdu text-[1.7rem]" : "font-display text-2xl leading-[2.2] italic"}`}>
          {lines.map((line, li) => (
            <p key={li}>
              {line.split(" ").map((w, i) => {
                const active = sel?.[0] === li && sel?.[1] === i;
                return (
                  <span key={i}>
                    <button
                      onClick={() => setSel(active ? null : [li, i])}
                      className={`rounded-md px-0.5 transition ${
                        active
                          ? "bg-accent text-accent-foreground underline decoration-primary decoration-2 underline-offset-8 shadow-glow"
                          : "hover:bg-accent/60"
                      }`}
                    >
                      {w}
                    </button>{" "}
                  </span>
                );
              })}
            </p>
          ))}
        </div>

        {g && (
          <div key={g.word + sel} className="mt-4 animate-in fade-in zoom-in-95 rounded-2xl border border-border bg-popover p-4 shadow-glow">
            <div className="flex items-start justify-between">
              <div>
                <p className="urdu text-lg leading-tight">{g.word}</p>
                <p className="text-xs text-muted-foreground">/{g.pronunciation}/</p>
              </div>
              <div className="flex gap-1">
                <button aria-label="Close" onClick={() => setSel(null)} className="grid h-8 w-8 place-items-center rounded-full bg-secondary">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm"><span className="font-semibold text-primary">English</span> {g.meaningEnglish}</p>
            <p className="text-sm text-muted-foreground"><span className="font-semibold text-primary">Roman</span> {g.meaningUrdu}</p>
            <p className="mt-2 rounded-xl bg-muted p-2 text-xs text-muted-foreground"><span className="font-semibold text-foreground">In this couplet:</span> {g.context ?? couplet.english}</p>
            <button
              onClick={toggleSave}
              className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold ${saved ? "bg-accent text-accent-foreground" : "border border-border"}`}
            >
              {saved ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
              {saved ? "Saved to Vocabulary" : "Save to Personal Vocabulary"}
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">— {couplet.poet} · {couplet.era}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button onClick={toggleBookmark} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${bookmarked ? "bg-accent text-accent-foreground" : "border border-border"}`}>
            {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />} {bookmarked ? "Couplet saved" : "Save couplet"}
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-verified/15 px-3 py-1.5 text-xs font-semibold text-verified">
            <BadgeCheck className="h-4 w-4" /> Verified Verse & Poet Source
          </span>
        </div>
      </div>

        <div className="mt-8 rounded-3xl bg-card border border-border p-5">
          <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between">
            <span className="text-sm font-bold">Simple Meaning <span className="text-muted-foreground">(Tashreeh)</span></span>
            <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
          </button>
          {open && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{couplet.tashreeh}</p>}
        </div>
        <div className="flex gap-3 py-6">
          <Link to="/player" search={{ id: couplet.id }} className="flex-1 rounded-full bg-amber-grad py-3 text-center text-sm font-bold text-primary-foreground shadow-sm hover:opacity-95 transition-opacity">Listen</Link>
          <Link to="/studio" search={{ id: couplet.id }} className="flex-1 rounded-full border border-border bg-card py-3 text-center text-sm font-bold hover:bg-secondary transition-colors">Make a card</Link>
        </div>
      </div>
      <GuestAuthDialog open={showGuestDialog} onOpenChange={setShowGuestDialog} />
    </Shell>
  );
}