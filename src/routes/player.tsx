import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Play, Pause, RotateCcw, RotateCw, Bookmark, Share2, Sparkles, BookOpen, Settings } from "lucide-react";
import { toast } from "sonner";
import { Shell, Verified } from "@/components/sukhan/Shell";
import { getCouplet, coupletSearch } from "@/components/sukhan/data";
import { getSavedCouplets, setSavedCouplets } from "@/components/sukhan/store";
import { isUserAuthenticated } from "@/components/sukhan/auth";
import { GuestAuthDialog } from "@/components/sukhan/GuestAuthDialog";

export const Route = createFileRoute("/player")({
  validateSearch: coupletSearch,
  head: () => ({
    meta: [
      { title: "Audio Lounge — Sukhan" },
      { name: "description", content: "Listen to Urdu poetry recitations with synced, line-by-line verses." },
      { property: "og:title", content: "Audio Lounge — Sukhan" },
      { property: "og:description", content: "Synced Urdu poetry recitations." },
    ],
  }),
  component: Player,
});

function parseDurationSeconds(lenStr?: string): number {
  if (!lenStr) return 14;
  const parts = lenStr.split(":").map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  return 14;
}

function formatTime(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return "0:00";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function Player() {
  const couplet = getCouplet(Route.useSearch().id);
  const lyricLines = couplet.urdu;
  
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  
  const [isSaved, setIsSaved] = useState(() => {
    const savedIds = getSavedCouplets();
    return savedIds.includes(couplet.id);
  });

  const handleSave = () => {
    if (!isUserAuthenticated()) {
      setShowGuestDialog(true);
      return;
    }
    let savedIds = getSavedCouplets();
    if (isSaved) {
      savedIds = savedIds.filter((id: number) => id !== couplet.id);
      setIsSaved(false);
      toast.info("Removed from collection");
    } else {
      savedIds.push(couplet.id);
      setIsSaved(true);
      toast.success("Couplet saved to your collection ✨");
    }
    setSavedCouplets(savedIds); 
  };

  const handleShare = async () => {
    const shareData = {
      title: `Sukhan - ${couplet.poet}`,
      text: `${couplet.urdu[0]}\n- ${couplet.poet}\n\nListen on Sukhan:`,
      url: window.location.href, 
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast.success("Link copied to clipboard!"); 
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!couplet.audioUrl) return undefined; 
    const audio = new Audio(couplet.audioUrl);
    audioRef.current = audio;
    const updateProgress = () => {
      if (audio.duration) setT((audio.currentTime / audio.duration) * 100);
    };
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", () => {
      setPlaying(false);
      setT(100);
    });
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audioRef.current = null;
    };
  }, [couplet.audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      if (playing) {
        audioRef.current.play().catch(e => console.error("Audio error:", e));
      } else {
        audioRef.current.pause();
      }
      return undefined; 
    } else {
      if (playing) {
        const utterance = new SpeechSynthesisUtterance(couplet.urdu.join(" "));
        utterance.lang = 'ur-PK';
        utterance.rate = speed;
        window.speechSynthesis.speak(utterance);
        const id = setInterval(() => setT((v) => {
          if (v >= 100) { setPlaying(false); return 100; }
          return v + 1 * speed;
        }), 300);
        return () => {
          clearInterval(id);
          window.speechSynthesis.cancel();
        };
      } else {
        window.speechSynthesis.cancel();
        return undefined; 
      }
    }
  }, [playing, speed, couplet.urdu]);

  const active = Math.floor((t / 100) * lyricLines.length);

  const totalDuration =
    audioRef.current?.duration && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration)
      ? audioRef.current.duration
      : parseDurationSeconds(couplet.len);

  const currentSeconds = Math.min(totalDuration, Math.max(0, (t / 100) * totalDuration));

  const handleSeek = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    setT(percent);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (percent / 100) * audioRef.current.duration;
    }
  };

  const handleRewind = () => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    } else {
      const step = (15 / totalDuration) * 100;
      setT(Math.max(0, t - step));
    }
  };

  const handleForward = () => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 15);
    } else {
      const step = (15 / totalDuration) * 100;
      setT(Math.min(100, t + step));
    }
  };

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

      {/* Desktop Section Banner */}
      <div className="hidden md:flex items-center justify-between pb-4 pt-2">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-primary">
            Audio Lounge
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            سخن · Synced Urdu poetry recitations for late nights and quiet reflections.
          </p>
        </div>
      </div>

      {/* Player Card */}
      <div className="max-w-xl mx-auto w-full my-auto py-2">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-dusk shadow-glow">
          <div className="absolute inset-0 bg-background/35 backdrop-blur-3xl" />
          <div className="relative flex min-h-[560px] flex-col px-6 sm:px-8 pb-8 pt-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <Link
                to="/read"
                search={{ id: couplet.id }}
                aria-label="Read verse"
                className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-background/50 hover:bg-background/80 transition-colors">
                  <BookOpen className="h-4 w-4" />
                </span>
                <span className="hidden sm:inline">Read Verse</span>
              </Link>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Now Reciting</p>
              </div>
              <Link
                to="/discover"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-background/50 hover:bg-background/80"
              >
                Discover
              </Link>
            </div>

            <div className="my-auto py-8 space-y-3 text-center">
              {lyricLines.map((l, i) => (
                <p
                  key={i}
                  className={`urdu text-xl sm:text-2xl transition-all duration-500 ${
                    i === active ? "scale-105 text-primary font-bold" : i < active ? "text-foreground/40" : "text-foreground/60"
                  }`}
                >
                  {l}
                </p>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <p className="text-lg font-semibold">{couplet.audioTitle}</p>
              <p className="text-sm text-muted-foreground">
                Recited by {couplet.reciterName} · {couplet.poet}
              </p>
              <Verified label="Verified poet" />

              <button
                className="mt-5 flex h-12 w-full items-center gap-[3px]"
                onClick={handleSeek}
                aria-label="Seek"
              >
                {Array.from({ length: 48 }).map((_, i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-full transition-colors ${i / 48 < t / 100 ? "bg-primary" : "bg-foreground/20"}`}
                    style={{ height: `${25 + ((i * 53) % 75)}%` }} 
                  />
                ))}
              </button>
              <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                <span>{formatTime(currentSeconds)}</span>
                <span>{formatTime(totalDuration)}</span>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => setSpeed(speed === 1 ? 0.8 : (speed === 0.8 ? 1.5 : 1))}
                  className="w-14 rounded-full border border-border py-1.5 text-xs font-bold hover:bg-secondary transition-colors"
                >
                  {speed.toFixed(1)}x
                </button>
                <button aria-label="Back 15s" onClick={handleRewind} className="hover:text-primary transition-colors">
                  <RotateCcw className="h-7 w-7" />
                </button>
                <button
                  aria-label={playing ? "Pause" : "Play"}
                  onClick={() => setPlaying(!playing)}
                  className="grid h-16 w-16 place-items-center rounded-full bg-amber-grad text-primary-foreground shadow-glow hover:scale-105 transition-transform"
                >
                  {playing ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current" />}
                </button>
                <button aria-label="Forward 15s" onClick={handleForward} className="hover:text-primary transition-colors">
                  <RotateCw className="h-7 w-7" />
                </button>
                <span className="w-14" />
              </div>

              <div className="mt-8 flex items-center gap-2">
                <button
                  onClick={handleSave}
                  aria-label="Save"
                  className="grid h-11 w-11 place-items-center rounded-full bg-background/40 hover:bg-background/70 transition-colors"
                >
                  <Bookmark className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : ""}`} />
                </button>
                
                <button
                  onClick={handleShare}
                  aria-label="Share"
                  className="grid h-11 w-11 place-items-center rounded-full bg-background/40 hover:bg-background/70 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>

                <Link
                  to="/studio"
                  search={{ id: couplet.id }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-bold text-background hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="h-4 w-4" /> Open in Card Studio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GuestAuthDialog open={showGuestDialog} onOpenChange={setShowGuestDialog} />
    </Shell>
  );
}
