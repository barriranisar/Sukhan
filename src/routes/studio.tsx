import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Download, Music, Video } from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image"; 
import { Shell } from "@/components/sukhan/Shell";
import { getCouplet, coupletSearch } from "@/components/sukhan/data";

export const Route = createFileRoute("/studio")({
  validateSearch: coupletSearch,
  head: () => ({
    meta: [
      { title: "Story Studio — Sukhan" },
      { name: "description", content: "Turn a couplet into an aesthetic Instagram Story or WhatsApp Status card." },
    ],
  }),
  component: Studio,
});

const solids = [
  { label: "Midnight Charcoal", v: "#1E2230" },
  { label: "Deep Burgundy", v: "#5A1E2A" },
  { label: "Vintage Parchment", v: "#EFE4CC" },
  { label: "Forest Green", v: "#1F3B2D" },
  { label: "Pastel Sand", v: "#E8D5B9" },
];
const gradients = [
  { label: "Warm Sunset", v: "linear-gradient(160deg,#F6B26B,#C2410C 55%,#4A1D1F)" },
  { label: "Velvet Dusk", v: "linear-gradient(160deg,#6B2E3A,#2B1F4A 60%,#11131C)" },
  { label: "Monochrome", v: "linear-gradient(160deg,#F4F4F5,#71717A 55%,#18181B)" },
];
const inks = [
  { label: "Light", v: "#FAF7F0" },
  { label: "Dark", v: "#1E1A16" },
  { label: "Warm Amber", v: "#F5B544" },
];
const textures = {
  flat: { label: "Flat", bg: "none", size: "auto" },
  grain: { label: "Grain", bg: "radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px)", size: "3px 3px" },
  paper: { label: "Paper", bg: "radial-gradient(rgba(90,60,30,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(120,90,50,.05) 1px, transparent 1px)", size: "6px 6px, 14px 14px" },
} as const;
const types = { urdu: "Nastaliq", roman: "Roman", english: "+ English" } as const;

function Studio() {
  const couplet = getCouplet(Route.useSearch().id);
  const [bg, setBg] = useState<string>(gradients[1]!.v);
  const [ink, setInk] = useState<string>(inks[0]!.v);
  const [texture, setTexture] = useState<keyof typeof textures>("grain");
  const [type, setType] = useState<keyof typeof types>("urdu");
  const [isRecording, setIsRecording] = useState(false);
  const tx = textures[texture];

  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      toast("Generating HD image...");
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3, 
        skipFonts: true 
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Sukhan-${couplet.poet.replace(/\s+/g, '-')}-story.png`;
      link.click();
      toast.success("Saved HD image — ready to share");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image.");
    }
  };

  const handleVideoDownload = async () => {
    if (!cardRef.current) return;
    if (!couplet.audioUrl) {
      toast.error("Is sher ki audio maujood nahi hai!");
      return;
    }
    try {
      setIsRecording(true);
      toast.info("Recording video... Please wait.");
      
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, 
        skipFonts: true
      });
      
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }

      const audioEl = new Audio(couplet.audioUrl);
      audioEl.crossOrigin = "anonymous";
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();
      const source = audioCtx.createMediaElementSource(audioEl);
      source.connect(dest);

      const canvasStream = canvas.captureStream(30); 
      const audioTrack = dest.stream.getAudioTracks()[0];
      if (audioTrack) canvasStream.addTrack(audioTrack);

      const recorder = new MediaRecorder(canvasStream, { mimeType: "video/webm" });
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Sukhan-${couplet.poet.replace(/\s+/g, '-')}-video.webm`;
        link.click();
        toast.success("Video saved successfully!");
        setIsRecording(false);
      };

      audioEl.play();
      recorder.start();

      audioEl.onended = () => {
        recorder.stop();
      };

    } catch (error) {
      console.error("Video error:", error);
      toast.error("Failed to generate video.");
      setIsRecording(false);
    }
  };

  return (
    <Shell>
      <div className="flex items-center justify-between px-5 pt-8">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold">Story Studio</h1>
          <p className="text-xs text-muted-foreground">9:16 · Instagram Story / WhatsApp Status</p>
        </div>
        {/* Yahan se ThemeToggle hata diya hai */}
      </div>

      <div className="mt-4 flex justify-center px-5">
        <div
          ref={cardRef}
          className="relative flex aspect-[9/16] w-[58%] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border p-5 text-center shadow-glow transition-all"
          style={{ background: bg, color: ink }}
        >
          <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: tx.bg, backgroundSize: tx.size }} />
          <div className="relative">
            {type !== "roman" && <div className="urdu text-[0.85rem] leading-[2.3]">{couplet.urdu.map((l) => <p key={l}>{l}</p>)}</div>}
            {type === "roman" && <div className="font-display text-sm italic leading-relaxed">{couplet.roman.map((l) => <p key={l}>{l}</p>)}</div>}
            {type === "english" && <p className="mt-2 font-display text-[11px] italic leading-relaxed opacity-85">“{couplet.english}”</p>}
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70">— {couplet.poet}</p>
          </div>
          <span className="absolute top-3 text-[9px] font-bold tracking-widest opacity-60">SUKHAN</span>
        </div>
      </div>

      <div className="space-y-4 px-5 pt-6">
        <Row label="Solid background">
          {solids.map((s) => <Swatch key={s.v} label={s.label} value={s.v} active={bg === s.v} onClick={() => setBg(s.v)} />)}
          <label className="relative grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-border" style={{ background: "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" }} aria-label="Custom background color">
            <input type="color" className="absolute inset-0 cursor-pointer opacity-0" onChange={(e) => setBg(e.target.value)} />
          </label>
        </Row>
        <Row label="Gradient">
          {gradients.map((g) => <Pill key={g.label} active={bg === g.v} onClick={() => setBg(g.v)}>{g.label}</Pill>)}
        </Row>
        <Row label="Text color">
          {inks.map((i) => <Pill key={i.v} active={ink === i.v} onClick={() => setInk(i.v)}>{i.label}</Pill>)}
          <label className="relative flex-1 cursor-pointer rounded-full border border-border py-2 text-center text-xs font-semibold text-muted-foreground">
            Custom
            <input type="color" className="absolute inset-0 cursor-pointer opacity-0" onChange={(e) => setInk(e.target.value)} />
          </label>
        </Row>
        <Row label="Texture">
          {Object.entries(textures).map(([k, v]) => <Pill key={k} active={texture === k} onClick={() => setTexture(k as keyof typeof textures)}>{v.label}</Pill>)}
        </Row>
        <Row label="Script">
          {Object.entries(types).map(([k, v]) => <Pill key={k} active={type === k} onClick={() => setType(k as keyof typeof types)}>{v}</Pill>)}
        </Row>
      </div>

      <div className="px-5 py-6 space-y-3">
        <button
          onClick={handleDownload}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-4 text-sm font-bold shadow-sm"
        >
          <Download className="h-4 w-4" /> Save HD Image (PNG)
        </button>
        <button
          onClick={handleVideoDownload}
          disabled={isRecording}
          className={`flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold shadow-glow ${isRecording ? "bg-secondary text-muted-foreground cursor-not-allowed" : "bg-amber-grad text-primary-foreground"}`}
        >
          <Video className="h-4 w-4" /> {isRecording ? "Recording..." : "Export as Video (Audio Sync)"}
        </button>
      </div>
    </Shell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
function Swatch({ label, value, active, onClick }: { label: string; value: string; active: boolean; onClick: () => void }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`h-9 w-9 shrink-0 rounded-full border-2 transition ${active ? "scale-110 border-primary" : "border-border"}`}
      style={{ background: value }}
    />
  );
}
function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-full border px-1 py-2 text-xs font-semibold ${active ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground"}`}
    >
      {children}
    </button>
  );
}