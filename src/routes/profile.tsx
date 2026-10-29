import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  User,
  Settings,
  Sparkles,
  Bookmark,
  Volume2,
  Trash2,
  Plus,
  Play,
  ArrowRight,
  LogOut,
  Palette,
  BookOpen,
} from "lucide-react";
import { Shell, Verified } from "@/components/sukhan/Shell";
import { coupletsData } from "@/components/sukhan/data";
import {
  getVocab,
  setVocab as storeVocab,
  getSavedCouplets,
  setSavedCouplets,
  type SavedWord,
} from "@/components/sukhan/store";
import { useAuthUser } from "@/components/sukhan/auth";
import { ConfirmDialog } from "@/components/sukhan/ConfirmDialog";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile Hub — Sukhan" },
      { name: "description", content: "Your personal Sukhan profile hub: saved couplets, studio cards, and vocabulary." },
    ],
  }),
  component: ProfilePage,
});

interface StudioCardItem {
  id: number;
  coupletId: number;
  poet: string;
  line: string;
  bg: string;
  color?: string;
  createdAt: string;
}

function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthUser();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"saved" | "studio" | "vocab">("saved");
  const [vocab, setVocab] = useState<SavedWord[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [studioCards, setStudioCards] = useState<StudioCardItem[]>([]);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    open: boolean;
    type: "couplet" | "studio" | "vocab" | null;
    id: number | null;
    key?: string | null;
    title: string;
    description: string;
  }>({
    open: false,
    type: null,
    id: null,
    key: null,
    title: "Remove from Saved?",
    description: "Are you sure you want to remove this item from your library?",
  });

  useEffect(() => {
    setVocab(getVocab());
    setSavedIds(getSavedCouplets());

    try {
      const storedCards = localStorage.getItem("sukhan_studio_cards");
      if (storedCards) {
        setStudioCards(JSON.parse(storedCards));
      }
    } catch {
      // ignore
    }
  }, []);

  const savedCouplets = coupletsData.filter((c) => savedIds.includes(c.id));

  // Global reference to prevent garbage collection and queue deadlocks
  const playWordSound = (word: string, roman: string, key: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    // 1. Instantly unfreeze and clear any stuck speech queue
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    setSpeakingKey(key);

    // 2. Clear any lingering utterance references
    if ((window as any)._sukhanUtterance) {
      (window as any)._sukhanUtterance.onend = null;
      (window as any)._sukhanUtterance.onerror = null;
      (window as any)._sukhanUtterance = null;
    }

    // 3. Chrome needs a ~120ms gap after cancel() before it can accept a new speak() call
    setTimeout(() => {
      try {
        const voices = window.speechSynthesis.getVoices();
        const urduVoice = voices.find(
          (v) => v.lang.startsWith("ur") || v.lang.toLowerCase().includes("urdu")
        );
        const hindiVoice = voices.find(
          (v) => v.lang.startsWith("hi") || v.lang.toLowerCase().includes("hindi")
        );
        const defaultVoice = voices.find((v) => v.default) || voices[0];

        // Choose text: Urdu if Urdu/Hindi voice exists, otherwise Roman so audio never mutes on Windows
        const text = urduVoice || hindiVoice ? word : roman || word;
        const utterance = new SpeechSynthesisUtterance(text);

        if (urduVoice) {
          utterance.voice = urduVoice;
          utterance.lang = urduVoice.lang;
        } else if (hindiVoice) {
          utterance.voice = hindiVoice;
          utterance.lang = hindiVoice.lang;
        } else if (defaultVoice) {
          utterance.voice = defaultVoice;
          utterance.lang = defaultVoice.lang || "en-US";
        }

        utterance.rate = 0.85;
        utterance.pitch = 1.0;

        // Cleanup on finish
        utterance.onend = () => {
          (window as any)._sukhanUtterance = null;
          setSpeakingKey(null);
        };

        // Cleanup on error
        utterance.onerror = (err) => {
          console.warn("Speech playback reset:", err);
          (window as any)._sukhanUtterance = null;
          setSpeakingKey(null);
        };

        // Store reference on window to survive Chrome garbage collector
        (window as any)._sukhanUtterance = utterance;

        window.speechSynthesis.speak(utterance);

        // Safety fallback: If browser fails to fire onend, automatically release speakingKey after 2 seconds
        setTimeout(() => {
          setSpeakingKey((cur) => (cur === key ? null : cur));
        }, 2000);
      } catch (e) {
        console.error("Speech trigger error:", e);
        setSpeakingKey(null);
      }
    }, 120);
  };

  const removeCouplet = (id: number) => {
    const next = savedIds.filter((x) => x !== id);
    setSavedIds(next);
    setSavedCouplets(next);
    toast.info("Removed from collection");
  };

  const removeWord = (key: string) => {
    const next = vocab.filter((v) => v.key !== key);
    setVocab(next);
    storeVocab(next);
    toast.info("Word removed from vocabulary");
  };

  const removeStudioCard = (id: number) => {
    const next = studioCards.filter((c) => c.id !== id);
    setStudioCards(next);
    localStorage.setItem("sukhan_studio_cards", JSON.stringify(next));
    toast.info("Removed from collection");
  };

  const requestRemoveCouplet = (id: number) => {
    setDeleteTarget({
      open: true,
      type: "couplet",
      id,
      key: null,
      title: "Remove from Saved?",
      description: "Are you sure you want to remove this item from your library?",
    });
  };

  const requestRemoveStudioCard = (id: number) => {
    setDeleteTarget({
      open: true,
      type: "studio",
      id,
      key: null,
      title: "Remove from Saved?",
      description: "Are you sure you want to remove this item from your library?",
    });
  };

  const requestRemoveWord = (key: string) => {
    setDeleteTarget({
      open: true,
      type: "vocab",
      id: null,
      key,
      title: "Remove Word from Vocabulary?",
      description: "Are you sure you want to remove this word from your saved vocabulary?",
    });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget.type === "couplet" && deleteTarget.id !== null) {
      removeCouplet(deleteTarget.id);
    } else if (deleteTarget.type === "studio" && deleteTarget.id !== null) {
      removeStudioCard(deleteTarget.id);
    } else if (deleteTarget.type === "vocab" && deleteTarget.key) {
      removeWord(deleteTarget.key);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully.");
    navigate({ to: "/" });
  };

  return (
    <Shell>
      <div className="space-y-6 pt-2 md:pt-4 pb-8">
        {/* Top Section: User Header / Greeting */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/90 backdrop-blur-xl p-6 sm:p-8 shadow-glow">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
            {isAuthenticated && user ? (
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-to-tr from-primary to-accent text-3xl font-bold text-primary-foreground shadow-md ring-4 ring-primary/25">
                {user.initial}
              </div>
            ) : (
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground ring-4 ring-border">
                <User className="h-10 w-10" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {isAuthenticated && user ? user.name : "Guest Poet"}
                </h1>
                {isAuthenticated && <Verified label="Sukhan Member" />}
              </div>

              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                {isAuthenticated && user ? user.email : "Browsing as guest · شاعری برائے شب زندہ داران"}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <Link
                  to="/settings"
                  className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  <Settings className="h-3.5 w-3.5 text-primary" />
                  <span>Settings</span>
                </Link>

                <Link
                  to="/studio"
                  className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  <Palette className="h-3.5 w-3.5 text-primary" />
                  <span>Card Studio</span>
                </Link>

                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-4 sm:p-5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-display text-base font-semibold text-primary">
                  Save your favorite couplets & export designs
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Log in to your account to sync saved verses, customize your library, and create story cards across all devices.
                </p>
              </div>
              <Link
                to="/"
                className="shrink-0 flex items-center gap-2 rounded-full bg-amber-grad px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-glow hover:opacity-95 transition-opacity"
              >
                <span>Log In / Sign Up</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-border/60 pb-3">
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "saved"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>Saved Couplets ({savedCouplets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("studio")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "studio"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Created Studio Cards ({studioCards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("vocab")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "vocab"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Vocabulary ({vocab.length})</span>
          </button>
        </div>

        {/* Tab 1: Saved Couplets */}
        {activeTab === "saved" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Saved Couplets ({savedCouplets.length})
              </h2>
            </div>

            {savedCouplets.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-10 text-center space-y-3">
                <Bookmark className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                <p className="text-sm font-semibold text-foreground">No saved couplets yet</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Tap "Save couplet" while exploring verses in Discover, Reader, or Lounge to collect your favorites here.
                </p>
                <Link
                  to="/discover"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
                >
                  <span>Explore Discover Feed</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCouplets.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate({ to: "/read", search: { id: c.id } })}
                    className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-glow hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div>
                      <div className="urdu text-center text-lg leading-[2.2] text-foreground group-hover:text-primary transition-colors">
                        {c.urdu.map((l) => (
                          <p key={l}>{l}</p>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">{c.poet}</p>
                        <Verified />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{c.mood.join(" · ")}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                      <div className="flex items-center gap-1.5">
                        <Link
                          to="/player"
                          search={{ id: c.id }}
                          onClick={(e) => e.stopPropagation()}
                          title="Listen in Lounge"
                          className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
                        >
                          <Play className="h-3 w-3 fill-current text-primary" />
                          <span>Lounge</span>
                        </Link>
                        <Link
                          to="/studio"
                          search={{ id: c.id }}
                          onClick={(e) => e.stopPropagation()}
                          title="Open in Studio"
                          className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Studio</span>
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          requestRemoveCouplet(c.id);
                        }}
                        aria-label="Remove couplet"
                        title="Remove couplet"
                        className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 2: Created Studio Cards */}
        {activeTab === "studio" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Created Studio Cards ({studioCards.length})
              </h2>
              <Link
                to="/studio"
                className="flex items-center gap-1 rounded-full bg-amber-grad px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-95"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create New Card</span>
              </Link>
            </div>

            {studioCards.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-10 text-center space-y-4">
                <Palette className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                <p className="text-sm font-semibold text-foreground">No exported studio designs yet</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Customize 9:16 story cards in the Story Studio and export them to have your personal creations saved here.
                </p>
                <Link
                  to="/studio"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-grad px-5 py-2 text-xs font-bold text-primary-foreground shadow-glow hover:opacity-95 transition-opacity"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Open Story Studio</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {studioCards.map((card) => (
                  <div
                    key={card.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border p-4 shadow-sm transition-all hover:scale-[1.02] hover:border-primary/50"
                    style={{ background: card.bg, color: card.color || "#fff" }}
                  >
                    <div className="text-center pt-2">
                      <p className="urdu text-sm line-clamp-3 leading-relaxed">{card.line}</p>
                      <p className="mt-2 text-[10px] uppercase font-bold tracking-wider opacity-75">— {card.poet}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-2 text-[10px]">
                      <span className="opacity-60">{card.createdAt}</span>
                      <div className="flex gap-1">
                        <Link
                          to="/studio"
                          search={{ id: card.coupletId }}
                          title="Edit in Studio"
                          className="grid h-6 w-6 place-items-center rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
                        >
                          <Sparkles className="h-3 w-3" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => requestRemoveStudioCard(card.id)}
                          title="Delete card"
                          className="grid h-6 w-6 place-items-center rounded-full bg-black/40 hover:bg-red-500/80 text-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 3: Vocabulary */}
        {activeTab === "vocab" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
                My Urdu Vocabulary ({vocab.length})
              </h2>
            </div>

            {vocab.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-10 text-center space-y-3">
                <BookOpen className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                <p className="text-sm font-semibold text-foreground">No words saved to vocabulary</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  When reading couplets, tap any word to see its pronunciation, meaning, and save it to your personal vocabulary.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vocab.map((v) => (
                  <div
                    key={v.key}
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="urdu text-2xl font-bold leading-tight">{v.word}</p>
                          <p className="text-xs text-muted-foreground">{v.roman} · /{v.pronunciation}/</p>
                        </div>
                        <div className="flex gap-1">
                          
                          <button
                            type="button"
                            aria-label="Remove word"
                            title="Remove word"
                            onClick={(e) => {
                              e.stopPropagation();
                              requestRemoveWord(v.key);
                            }}
                            className="grid h-8 w-8 place-items-center rounded-full bg-secondary hover:bg-destructive/20 hover:text-destructive transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm"><span className="font-semibold text-primary">EN</span> {v.meaningEnglish}</p>
                      <p className="text-sm text-muted-foreground"><span className="font-semibold text-primary">UR</span> {v.meaningUrdu}</p>
                    </div>
                    <Link
                      to="/read"
                      search={{ id: v.coupletId }}
                      className="mt-3 block rounded-xl bg-muted p-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="italic">{v.couplet}</span> — <span className="font-semibold text-foreground">{v.poet}</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget.open}
        onOpenChange={(open) => setDeleteTarget((prev) => ({ ...prev, open }))}
        title={deleteTarget.title}
        description={deleteTarget.description}
        confirmLabel="Remove"
        cancelLabel="Keep"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
      />
    </Shell>
  );
}