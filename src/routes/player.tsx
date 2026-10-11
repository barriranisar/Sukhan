import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { ChevronDown, Play, Pause, RotateCcw, RotateCw, Bookmark, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Shell, Verified } from "@/components/sukhan/Shell";
import { getCouplet, coupletSearch } from "@/components/sukhan/data";
import { getSavedCouplets, setSavedCouplets } from "@/components/sukhan/store";

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

function Player() {
  const couplet = getCouplet(Route.useSearch().id);
  const lyricLines = couplet.urdu;
  
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [speed, setSpeed] = useState(1);
  
  const [isSaved, setIsSaved] = useState(() => {
    const savedIds = getSavedCouplets();
    return savedIds.includes(couplet.id);
  });

  const handleSave = () => {
    let savedIds = getSavedCouplets();
    if (isSaved) {
      savedIds = savedIds.filter((id: number) => id !== couplet.id);
      setIsSaved(false);
    } else {
      savedIds.push(couplet.id);
      setIsSaved(true);
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

  const handleSeek = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    setT(percent);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (percent / 100) * audioRef.current.duration;
    }
  };
  const handleRewind = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    else setT(Math.max(0, t - 15));
  };
  const handleForward = () => {
    if (audioRef.current && audioRef.current.duration) audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 15);
    else setT(Math.min(100, t + 15));
  };

  return (
    <Shell nav={false}>
      <div className="relative min-h-full bg-dusk">
        <div className="absolute inset-0 bg-background/30 backdrop-blur-3xl" />
        <div className="relative flex min-h-full flex-col px-6 pb-8 pt-8">
          <div className="flex items-center justify-between">
            <Link to="/read" search={{ id: couplet.id }} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full bg-background/40">
              <ChevronDown className="h-5 w-5" />
            </Link>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mr-auto ml-4">Now reciting</p>
            {/* Yahan se ThemeToggle hata diya hai */}
          </div>

          <div className="mt-8 space-y-2 text-center">
            {lyricLines.map((l, i) => (
              <p
                key={i}
                className={`urdu text-xl transition-all duration-500 ${
                  i === active ? "scale-105 text-primary" : i < active ? "text-foreground/40" : "text-foreground/60"
                }`}
              >
                {l}
              </p>
            ))}
          </div>

          <div className="mt-auto pt-10">
            <p className="text-lg font-semibold">{couplet.audioTitle}</p>
            <p className="text-sm text-muted-foreground">Recited by {couplet.reciterName} · {couplet.poet}</p>
            <Verified label="Verified poet" />

            <button
              className="mt-5 flex h-12 w-full items-center gap-[3px]"
              onClick={handleSeek}
              aria-label="Seek"
            >
              {Array.from({ length: 48 }).map((_, i) => (
                <span
                  key={i}
                  className={`flex-1 rounded-full ${i / 48 < t / 100 ? "bg-primary" : "bg-foreground/20"}`}
                  style={{ height: `${25 + ((i * 53) % 75)}%` }} 
                />
              ))}
            </button>
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>0:{String(Math.floor(t * 1.02)).padStart(2, "0")}</span>
              <span>{couplet.len}</span>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button onClick={() => setSpeed(speed === 1 ? 0.8 : (speed === 0.8 ? 1.5 : 1))} className="w-14 rounded-full border border-border py-1.5 text-xs font-bold">
                {speed.toFixed(1)}x
              </button>
              <button aria-label="Back 15s" onClick={handleRewind}><RotateCcw className="h-7 w-7" /></button>
              <button
                aria-label={playing ? "Pause" : "Play"}
                onClick={() => setPlaying(!playing)}
                className="grid h-16 w-16 place-items-center rounded-full bg-amber-grad text-primary-foreground shadow-glow"
              >
                {playing ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current" />}
              </button>
              <button aria-label="Forward 15s" onClick={handleForward}><RotateCw className="h-7 w-7" /></button>
              <span className="w-14" />
            </div>

            <div className="mt-8 flex items-center gap-2">
              <button onClick={handleSave} aria-label="Save" className="grid h-11 w-11 place-items-center rounded-full bg-background/40">
                <Bookmark className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : ""}`} />
              </button>
              
              <button onClick={handleShare} aria-label="Share" className="grid h-11 w-11 place-items-center rounded-full bg-background/40">
                <Share2 className="h-5 w-5" />
              </button>

              <Link to="/studio" search={{ id: couplet.id }} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-bold text-background">
                <Sparkles className="h-4 w-4" /> Open in Card Studio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}