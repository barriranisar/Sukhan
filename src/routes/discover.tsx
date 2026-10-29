import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { Search, Play, Settings, X, User, Sparkles, BookOpen, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Shell, Verified, Wave } from "@/components/sukhan/Shell";
import { coupletsData, moods, getAllPoets, getPoetProfile } from "@/components/sukhan/data";
import { getSavedCouplets, setSavedCouplets } from "@/components/sukhan/store";
import { isUserAuthenticated } from "@/components/sukhan/auth";
import { GuestAuthDialog } from "@/components/sukhan/GuestAuthDialog";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Sukhan — Urdu poetry for late nights" },
      { name: "description", content: "Discover Urdu poetry by mood, hear recitations, and share aesthetic couplet cards." },
    ],
  }),
  component: Discover,
});

interface Suggestion {
  id: string;
  type: "poet" | "mood" | "title";
  label: string;
  sublabel: string;
}

function Discover() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"mood" | "poet">("mood");
  const [mood, setMood] = useState<string | null>(null);
  const [selectedPoet, setSelectedPoet] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSavedIds(getSavedCouplets());
  }, []);

  const toggleSaveCouplet = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!isUserAuthenticated()) {
      setShowGuestDialog(true);
      return;
    }
    const isSaved = savedIds.includes(id);
    const next = isSaved ? savedIds.filter((x) => x !== id) : [...savedIds, id];
    setSavedIds(next);
    setSavedCouplets(next);
    if (isSaved) {
      toast.info("Removed from collection");
    } else {
      toast.success("Couplet saved to your collection ✨");
    }
  };

  const query = q.trim().toLowerCase();

  // Close dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Compute autocomplete suggestions based on poet names, mood tags, and recitations
  const suggestions = useMemo<Suggestion[]>(() => {
    if (!query) return [];

    const list: Suggestion[] = [];
    const seen = new Set<string>();

    // 1. Matching poets
    const uniquePoets = Array.from(new Set(coupletsData.map((c) => c.poet)));
    for (const poet of uniquePoets) {
      if (poet.toLowerCase().includes(query)) {
        const count = coupletsData.filter((c) => c.poet === poet).length;
        list.push({
          id: `poet-${poet}`,
          type: "poet",
          label: poet,
          sublabel: `${count} couplet${count > 1 ? "s" : ""} · Verified Poet`,
        });
        seen.add(poet.toLowerCase());
      }
    }

    // 2. Matching moods
    for (const m of moods) {
      if (m.toLowerCase().includes(query) && !seen.has(m.toLowerCase())) {
        const count = coupletsData.filter((c) => c.mood.includes(m)).length;
        list.push({
          id: `mood-${m}`,
          type: "mood",
          label: m,
          sublabel: `${count} couplet${count > 1 ? "s" : ""} · Mood Tag`,
        });
        seen.add(m.toLowerCase());
      }
    }

    // 3. Matching audio titles
    for (const c of coupletsData) {
      if (c.audioTitle.toLowerCase().includes(query) && !seen.has(c.audioTitle.toLowerCase())) {
        list.push({
          id: `title-${c.id}`,
          type: "title",
          label: c.audioTitle,
          sublabel: `${c.poet} · Audio Recitation`,
        });
        seen.add(c.audioTitle.toLowerCase());
      }
    }

    return list.slice(0, 6);
  }, [query]);

  const allPoets = useMemo(() => getAllPoets(), []);
  const selectedPoetProfile = useMemo(() => {
    return selectedPoet ? getPoetProfile(selectedPoet) : null;
  }, [selectedPoet]);

  const handleModeChange = (newMode: "mood" | "poet") => {
    if (newMode === mode) return;
    setMode(newMode);
    if (newMode === "poet") {
      setMood(null);
    } else {
      setSelectedPoet(null);
    }
  };

  const handleSelectSuggestion = (item: Suggestion) => {
    if (item.type === "poet") {
      setMood(null);
      setSelectedPoet(item.label);
      setMode("poet");
      setQ("");
    } else if (item.type === "mood") {
      setSelectedPoet(null);
      setMood(item.label);
      setMode("mood");
      setQ("");
    } else {
      setQ(item.label);
    }
    setShowDropdown(false);
  };

  const feed = coupletsData.filter(
    (c) =>
      (!mood || c.mood.includes(mood)) &&
      (!selectedPoet || c.poet.trim().toLowerCase() === selectedPoet.trim().toLowerCase()) &&
      (!query ||
        (mode === "poet"
          ? c.poet.toLowerCase().includes(query)
          : c.mood.some((m) => m.toLowerCase().includes(query)) ||
            c.poet.toLowerCase().includes(query) ||
            c.audioTitle.toLowerCase().includes(query) ||
            c.tashreeh.toLowerCase().includes(query) ||
            c.english.toLowerCase().includes(query) ||
            c.verseRoman.some((v) => v.toLowerCase().includes(query)))),
  );
  const daily = coupletsData[0]!;

  return (
    <Shell>
      {/* Mobile Top Header */}
      <header className="flex items-center justify-between pb-3 pt-2 md:hidden">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-primary">Sukhan</h1>
          <p className="text-xs text-muted-foreground">سخن · poetry for the quiet hours</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/settings"
            aria-label="Settings"
            className="grid h-10 w-10 place-items-center rounded-full bg-secondary transition-transform hover:scale-105"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Desktop Banner Intro */}
      <div className="hidden md:flex items-center justify-between pb-6 pt-2">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-primary">
            Sukhan Feed
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            سخن · Curated Urdu poetry, recitations, and reflections for the quiet hours.
          </p>
        </div>
      </div>

      {/* Search & Mode Toggle */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div ref={searchContainerRef} className="relative flex-1">
            <div className="flex items-center gap-2 rounded-2xl bg-card border border-border px-4 py-3 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/40">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  if (query) setShowDropdown(true);
                }}
                placeholder={mode === "mood" ? "How are you feeling tonight?" : "Ghalib, Faiz, Jaun…"}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {q.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setShowDropdown(false);
                  }}
                  aria-label="Clear search"
                  className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick Recommendations / Autocomplete Dropdown */}
            {showDropdown && query.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 z-30 rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-xl overflow-hidden py-1.5 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Quick Recommendations
                </div>
                {suggestions.length > 0 ? (
                  <div className="divide-y divide-border/30">
                    {suggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-secondary/70 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {item.type === "poet" && <User className="h-3.5 w-3.5" />}
                            {item.type === "mood" && <Sparkles className="h-3.5 w-3.5 text-amber-500" />}
                            {item.type === "title" && <BookOpen className="h-3.5 w-3.5" />}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                              {item.label}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">{item.sublabel}</p>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full border border-border/60 bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {item.type === "poet" ? "Poet" : item.type === "mood" ? "Mood" : "Poem"}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-xs text-muted-foreground">
                    No direct suggestions for &ldquo;{q}&rdquo;. Press enter to filter feed.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="inline-flex self-start sm:self-auto rounded-full bg-card border border-border p-1 text-xs font-semibold shadow-sm">
            {(["mood", "poet"] as const).map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`rounded-full px-4 py-1.5 transition ${
                  mode === m ? "bg-primary text-primary-foreground font-bold shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "mood" ? "Mood Search" : "Poet Search"}
              </button>
            ))}
          </div>
        </div>

        {/* Mood Chips or Poet Search Grid */}
        {mode === "mood" ? (
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 pt-1">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => setMood(mood === m ? null : m)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  mood === m
                    ? "border-primary bg-accent text-accent-foreground shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        ) : (
          /* Poet Chips (Matching Mood Search Chips) */
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 pt-1 animate-in fade-in-50 duration-150">
            {allPoets.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPoet(selectedPoet === p.name ? null : p.name)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  selectedPoet === p.name
                    ? "border-primary bg-accent text-accent-foreground shadow-sm font-bold"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Inline Poet Overview Banner */}
      {selectedPoetProfile && (
        <section className="pt-4">
          <div className="relative rounded-3xl border border-border bg-card/90 p-5 md:p-6 shadow-sm animate-in fade-in-50 zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setSelectedPoet(null)}
              aria-label="Clear poet filter"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all hover:scale-105 cursor-pointer shadow-sm border border-border/50"
              title="Clear poet filter"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pr-10">
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="urdu text-2xl font-bold text-primary">
                  {selectedPoetProfile.urduName}
                </span>
                <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                  {selectedPoetProfile.name}
                  <Verified label="Verified Master" />
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground font-medium">
                {selectedPoetProfile.era}
              </p>

              <p className="mt-3 text-xs md:text-sm leading-relaxed text-foreground/85 bg-secondary/30 rounded-2xl p-3.5 border border-border/50">
                {selectedPoetProfile.bio}
              </p>

              <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
                  Core Themes:
                </span>
                {selectedPoetProfile.themes.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Couplet of the Day - hidden when search is active, mood chip is selected, or poet is selected */}
      {!query && !mood && !selectedPoet && (
        <section className="pt-6">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Couplet of the day
          </p>
          <div
            onClick={() => navigate({ to: "/read", search: { id: daily.id } })}
            className="group block rounded-3xl border border-border bg-card-grad p-6 md:p-8 shadow-glow transition-all duration-200 hover:border-primary/50 hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="urdu text-center text-xl md:text-2xl lg:text-3xl text-foreground group-hover:text-primary transition-colors">
              {daily.urdu.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
              <div>
                <p className="text-sm md:text-base font-semibold text-foreground">
                  {daily.poet}
                </p>
                <Verified />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => toggleSaveCouplet(e, daily.id)}
                  aria-label={savedIds.includes(daily.id) ? "Remove from saved" : "Save couplet"}
                  title={savedIds.includes(daily.id) ? "Saved" : "Save couplet"}
                  className={`grid h-9 w-9 place-items-center rounded-full border border-border transition-colors cursor-pointer ${
                    savedIds.includes(daily.id)
                      ? "text-primary bg-primary/10 border-primary/30"
                      : "text-muted-foreground bg-card hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${savedIds.includes(daily.id) ? "fill-primary text-primary" : ""}`} />
                </button>
                <Link
                  to="/player"
                  search={{ id: daily.id }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 rounded-full bg-amber-grad px-4 py-2 text-xs md:text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:scale-105"
                >
                  <Play className="h-3.5 w-3.5 fill-current" /> Play recitation
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Couplets Grid / List */}
      <section className="pb-6 pt-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {selectedPoet
              ? `POET: ${selectedPoet.toUpperCase()} · ${feed.length} ${feed.length === 1 ? "couplet" : "couplets"}`
              : mood
              ? `Mood: ${mood} · ${feed.length}`
              : query
              ? `Search: "${q}" · ${feed.length}`
              : `All couplets · ${feed.length}`}
          </p>
          {(mood || query || selectedPoet) && (
            <button
              onClick={() => {
                setMood(null);
                setSelectedPoet(null);
                setQ("");
                setShowDropdown(false);
              }}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        {feed.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No couplets match yet — try another mood or poet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feed.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate({ to: "/read", search: { id: c.id } })}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-glow hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex-1">
                  <div className="urdu text-center text-base md:text-lg leading-[2.2] text-foreground group-hover:text-primary transition-colors">
                    {c.urdu.map((l) => (
                      <p key={l}>{l}</p>
                    ))}
                  </div>
                  <div className="mt-3">
                    <p className="font-semibold text-sm text-foreground">
                      {c.poet}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{c.mood.join(" · ")}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                  <Verified label="Verified poet" />
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => toggleSaveCouplet(e, c.id)}
                      aria-label={savedIds.includes(c.id) ? "Remove from saved" : "Save couplet"}
                      title={savedIds.includes(c.id) ? "Saved" : "Save couplet"}
                      className={`grid h-8 w-8 place-items-center rounded-full transition-colors cursor-pointer ${
                        savedIds.includes(c.id)
                          ? "text-primary bg-primary/10 hover:bg-primary/20"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${savedIds.includes(c.id) ? "fill-primary text-primary" : ""}`} />
                    </button>
                    <Link
                      to="/player"
                      search={{ id: c.id }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-secondary"
                      title="Play recitation"
                    >
                      <Wave bars={6} playing={false} />
                      <Play className="h-3.5 w-3.5 fill-current text-primary" />
                      <span>{c.len}</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <GuestAuthDialog open={showGuestDialog} onOpenChange={setShowGuestDialog} />
    </Shell>
  );
}

