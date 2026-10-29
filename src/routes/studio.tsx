import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Download, Video, ImagePlus, Trash2, Sparkles, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image"; 
import { Shell } from "@/components/sukhan/Shell";
import { getCouplet, coupletSearch } from "@/components/sukhan/data";
import { isUserAuthenticated } from "@/components/sukhan/auth";
import { GuestAuthDialog } from "@/components/sukhan/GuestAuthDialog";
import { ConfirmDialog } from "@/components/sukhan/ConfirmDialog";

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

const inkPresets = [
  { label: "Pure White", v: "#FFFFFF" },
  { label: "Black", v: "#1E1E24" },
  { label: "Warm Gold", v: "#D97706" },
];

const types = { urdu: "Nastaliq", roman: "Roman", english: "+ English" } as const;

const urduFonts = [
  { id: "nastaliq" as const, label: "Classic Nastaliq", font: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif" },
  { id: "modern" as const, label: "Modern Urdu Sans", font: "'Gulzar', 'Noto Sans Arabic', sans-serif" },
];

const latinFonts = [
  { id: "serif" as const, label: "Classic Serif", font: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" },
  { id: "sans" as const, label: "Clean Modern", font: "'Plus Jakarta Sans', 'Inter', 'Manrope', sans-serif" },
  { id: "editorial" as const, label: "Editorial / Literary", font: "'Lora', 'Fraunces', Georgia, serif" },
];

function Studio() {
  const couplet = getCouplet(Route.useSearch().id);
  const [bg, setBg] = useState<string>(gradients[1]!.v);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customGradStart, setCustomGradStart] = useState<string>("#4C1D95");
  const [customGradEnd, setCustomGradEnd] = useState<string>("#0F172A");
  const [isCustomGradActive, setIsCustomGradActive] = useState<boolean>(false);
  const [overlayType, setOverlayType] = useState<"dark" | "light">("dark");
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.4);
  const [ink, setInk] = useState<string>(inkPresets[0]!.v);
  const [textShadow, setTextShadow] = useState(false);
  const [type, setType] = useState<keyof typeof types>("urdu");
  const [urduFont, setUrduFont] = useState<"nastaliq" | "modern">("nastaliq");
  const [latinFont, setLatinFont] = useState<"serif" | "sans" | "editorial">("serif");
  const [isRecording, setIsRecording] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [hasExported, setHasExported] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    confirmLabel: "",
    onConfirm: () => {},
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Invalid file format. Please upload a JPG, PNG, or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image is too large. Please select a file under 10MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      setCustomImage(res);
      setIsCustomGradActive(false);
      toast.success("Custom background loaded!");
    };
    reader.onerror = () => {
      toast.error("Failed to read image file. The file may be corrupted.");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const isCustomized =
    customImage !== null ||
    bg !== gradients[1]!.v ||
    ink !== inkPresets[0]!.v ||
    textShadow !== false ||
    type !== "urdu" ||
    urduFont !== "nastaliq" ||
    latinFont !== "serif" ||
    isCustomGradActive;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isCustomized && !hasExported) {
        e.preventDefault();
        e.returnValue = "You have unsaved customizations in Story Studio. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isCustomized, hasExported]);

  const resetCanvas = () => {
    setBg(gradients[1]!.v);
    setCustomImage(null);
    setOverlayType("dark");
    setOverlayOpacity(0.4);
    setInk(inkPresets[0]!.v);
    setTextShadow(false);
    setType("urdu");
    setUrduFont("nastaliq");
    setLatinFont("serif");
    setIsCustomGradActive(false);
    toast.info("Canvas reset to default layout.");
  };

  const requestRemoveBackground = () => {
    setConfirmModal({
      open: true,
      title: "Remove Background Photo?",
      description: "Are you sure you want to remove your custom uploaded background image?",
      confirmLabel: "Remove",
      onConfirm: () => {
        setCustomImage(null);
        toast.info("Custom background removed.");
      },
    });
  };

  const requestResetCanvas = () => {
    setConfirmModal({
      open: true,
      title: "Reset Canvas?",
      description: "Are you sure you want to reset all styling, typography, and background changes?",
      confirmLabel: "Reset",
      onConfirm: resetCanvas,
    });
  };

  const handleSelectBg = (v: string) => {
    setBg(v);
    setCustomImage(null);
    setIsCustomGradActive(false);
  };

  const handleSelectCustomGradient = () => {
    setIsCustomGradActive(true);
    setCustomImage(null);
    setBg(`linear-gradient(135deg, ${customGradStart}, ${customGradEnd})`);
  };

  const handleCustomGradStartChange = (val: string) => {
    setCustomGradStart(val);
    setIsCustomGradActive(true);
    setCustomImage(null);
    setBg(`linear-gradient(135deg, ${val}, ${customGradEnd})`);
  };

  const handleCustomGradEndChange = (val: string) => {
    setCustomGradEnd(val);
    setIsCustomGradActive(true);
    setCustomImage(null);
    setBg(`linear-gradient(135deg, ${customGradStart}, ${val})`);
  };

  const handleDownload = async () => {
    if (!isUserAuthenticated()) {
      setShowGuestDialog(true);
      return;
    }
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
      setHasExported(true);
      toast.success("Card saved to your device in HD 🎨");

      try {
        const existingRaw = localStorage.getItem("sukhan_studio_cards");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const newCard = {
          id: Date.now(),
          coupletId: couplet.id,
          poet: couplet.poet,
          line: couplet.urdu[0],
          bg: customImage ? "custom-photo" : bg,
          color: ink,
          createdAt: new Date().toLocaleDateString(),
        };
        localStorage.setItem("sukhan_studio_cards", JSON.stringify([newCard, ...existing.slice(0, 19)]));
      } catch {
        // ignore storage errors
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image.");
    }
  };

  const handleVideoDownload = async () => {
    if (!isUserAuthenticated()) {
      setShowGuestDialog(true);
      return;
    }
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

  const activeUrduFont = urduFonts.find((f) => f.id === urduFont)?.font ?? urduFonts[0].font;
  const activeLatinFont = latinFonts.find((f) => f.id === latinFont)?.font ?? latinFonts[0].font;

  return (
    <Shell>
      <div className="pt-2 md:pt-4 pb-4">
        <h1 className="font-display text-2xl md:text-3xl font-semibold">Story Studio</h1>
        <p className="mt-1 text-xs md:text-sm text-muted-foreground">
          9:16 · Instagram Story / WhatsApp Status · Create & Export aesthetic cards
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: 9:16 Card Preview */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div
            ref={cardRef}
            className="relative flex aspect-[9/16] w-full max-w-[280px] sm:max-w-[320px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border p-6 text-center shadow-glow transition-all"
            style={{
              backgroundColor: customImage ? undefined : (bg.startsWith("linear-gradient") ? undefined : bg),
              backgroundImage: customImage ? `url(${customImage})` : (bg.startsWith("linear-gradient") ? bg : undefined),
              backgroundSize: customImage ? "cover" : undefined,
              backgroundPosition: customImage ? "center" : undefined,
              backgroundRepeat: customImage ? "no-repeat" : undefined,
              color: ink,
            }}
          >
            {/* Automatic Semi-transparent Overlay for Custom Images */}
            {customImage && overlayOpacity > 0 && (
              <div
                className="pointer-events-none absolute inset-0 transition-opacity"
                style={{
                  backgroundColor: overlayType === "dark" ? "#000000" : "#FFFFFF",
                  opacity: overlayOpacity,
                }}
              />
            )}

            {/* Sukhan Brand Tag */}
            <span
              className="absolute top-3.5 text-[9px] font-bold tracking-widest opacity-60 z-10"
              style={{
                textShadow: textShadow ? "0 1px 4px rgba(0,0,0,0.85)" : "none",
              }}
            >
              SUKHAN
            </span>

            {/* Couplet Typography */}
            <div
              className="relative z-10 max-w-full px-2"
              style={{
                textShadow: textShadow
                  ? "0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.95)"
                  : "none",
              }}
            >
              {type !== "roman" && (
                <div
                  className="urdu text-[0.92rem] leading-[2.4]"
                  style={{ fontFamily: activeUrduFont }}
                >
                  {couplet.urdu.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
              )}
              {type === "roman" && (
                <div
                  className="text-sm italic leading-relaxed"
                  style={{ fontFamily: activeLatinFont }}
                >
                  {couplet.roman.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
              )}
              {type === "english" && (
                <p
                  className="mt-3 text-[11px] italic leading-relaxed opacity-90"
                  style={{ fontFamily: activeLatinFont }}
                >
                  “{couplet.english}”
                </p>
              )}
              <p
                className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80"
                style={{
                  fontFamily: type === "urdu" ? activeUrduFont : activeLatinFont,
                }}
              >
                — {couplet.poet}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Studio Controls & Actions */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-4 rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            {/* Consolidated Background Section */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Background
                </p>
                <div className="flex items-center gap-2">
                  {customImage && (
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                      Custom Photo Active
                    </span>
                  )}
                  {isCustomized && (
                    <button
                      type="button"
                      onClick={requestResetCanvas}
                      className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                      title="Reset canvas changes to default"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset Canvas
                    </button>
                  )}
                </div>
              </div>

              {/* Row 1: Solid swatches and Upload from gallery */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground shrink-0 min-w-[50px]">
                    Solid:
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {solids.map((s) => (
                      <Swatch
                        key={s.v}
                        label={s.label}
                        value={s.v}
                        active={!customImage && !isCustomGradActive && bg === s.v}
                        onClick={() => handleSelectBg(s.v)}
                      />
                    ))}
                    <label
                      className={`relative grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full border transition ${
                        !customImage && !isCustomGradActive && !solids.some((s) => s.v === bg) && !bg.startsWith("linear-gradient")
                          ? "scale-110 border-primary ring-2 ring-primary/40"
                          : "border-border"
                      }`}
                      style={{ background: "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" }}
                      aria-label="Custom background color"
                      title="Custom background color"
                    >
                      <input
                        type="color"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={(e) => handleSelectBg(e.target.value)}
                      />
                    </label>
                  </div>
                </div>

                {/* Upload from gallery button on the right */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                      customImage
                        ? "border-primary bg-primary/10 text-primary shadow-xs"
                        : "border-dashed border-border hover:border-primary/50 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                    title="Upload background image from device (JPEG, PNG, WEBP under 10MB)"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    {customImage ? "Change photo" : "Upload from gallery"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {customImage && (
                    <button
                      type="button"
                      onClick={requestRemoveBackground}
                      className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"
                      title="Remove custom photo"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Custom Background Overlay Controls */}
              {customImage && (
                <div className="rounded-2xl border border-border/80 bg-secondary/40 p-3 space-y-2.5 animate-in fade-in-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Text Contrast Overlay
                    </span>
                    <div className="inline-flex rounded-full bg-card border border-border p-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setOverlayType("dark");
                          if (overlayOpacity === 0) setOverlayOpacity(0.45);
                        }}
                        className={`rounded-full px-2.5 py-1 font-medium transition ${
                          overlayType === "dark" && overlayOpacity > 0
                            ? "bg-primary text-primary-foreground font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Dark
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOverlayType("light");
                          if (overlayOpacity === 0) setOverlayOpacity(0.45);
                        }}
                        className={`rounded-full px-2.5 py-1 font-medium transition ${
                          overlayType === "light" && overlayOpacity > 0
                            ? "bg-primary text-primary-foreground font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Light
                      </button>
                      <button
                        type="button"
                        onClick={() => setOverlayOpacity(overlayOpacity === 0 ? 0.45 : 0)}
                        className={`rounded-full px-2.5 py-1 font-medium transition ${
                          overlayOpacity === 0
                            ? "bg-primary text-primary-foreground font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        None
                      </button>
                    </div>
                  </div>
                  {overlayOpacity > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground w-20">
                        Overlay: {Math.round(overlayOpacity * 100)}%
                      </span>
                      <input
                        type="range"
                        min="0.1"
                        max="0.85"
                        step="0.05"
                        value={overlayOpacity}
                        onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                        className="flex-1 accent-primary h-1.5 rounded-lg bg-card cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Row 2: Gradient pills with live gradient preview inside */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-1">
                <span className="text-xs font-semibold text-muted-foreground shrink-0 min-w-[50px]">
                  Gradient:
                </span>
                <div className="flex-1 grid grid-cols-4 gap-1.5 sm:gap-2">
                  {gradients.map((g) => {
                    const isSelected = !customImage && !isCustomGradActive && bg === g.v;
                    return (
                      <button
                        key={g.label}
                        type="button"
                        onClick={() => handleSelectBg(g.v)}
                        style={{ background: g.v }}
                        className={`relative rounded-full px-1.5 sm:px-2 py-2 text-[11px] sm:text-xs font-semibold text-white shadow-xs transition-all ${
                          isSelected
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-[1.03] font-bold"
                            : "opacity-90 hover:opacity-100 hover:scale-[1.01] border border-white/20"
                        }`}
                      >
                        <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] tracking-wide">
                          {g.label}
                        </span>
                      </button>
                    );
                  })}

                  {/* Custom Gradient Pill */}
                  <button
                    type="button"
                    onClick={handleSelectCustomGradient}
                    style={{
                      background: `linear-gradient(135deg, ${customGradStart}, ${customGradEnd})`,
                    }}
                    className={`relative rounded-full px-1.5 sm:px-2 py-2 text-[11px] sm:text-xs font-semibold text-white shadow-xs transition-all ${
                      !customImage && isCustomGradActive
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-[1.03] font-bold"
                        : "opacity-90 hover:opacity-100 hover:scale-[1.01] border border-white/20"
                    }`}
                    title="Customize gradient with start and end colors"
                  >
                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] tracking-wide">
                      Custom
                    </span>
                  </button>
                </div>
              </div>

              {/* Dual Color Pickers for Custom Gradient */}
              {!customImage && isCustomGradActive && (
                <div className="rounded-2xl border border-border/80 bg-secondary/30 p-3 space-y-2.5 animate-in fade-in-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Custom Gradient (135° diagonal)
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      {customGradStart} → {customGradEnd}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-6">
                    {/* Start Color */}
                    <div className="flex items-center gap-2">
                      <label
                        className="relative grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 cursor-pointer place-items-center rounded-full border-2 border-border shadow-xs hover:scale-105 transition-transform"
                        style={{ backgroundColor: customGradStart }}
                        title="Pick Start Color"
                      >
                        <input
                          type="color"
                          value={customGradStart}
                          className="absolute inset-0 cursor-pointer opacity-0"
                          onChange={(e) => handleCustomGradStartChange(e.target.value)}
                        />
                      </label>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground font-medium">Start Color</span>
                        <span className="text-xs font-mono font-semibold uppercase">{customGradStart}</span>
                      </div>
                    </div>

                    <div className="h-6 w-px bg-border/60" />

                    {/* End Color */}
                    <div className="flex items-center gap-2">
                      <label
                        className="relative grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 cursor-pointer place-items-center rounded-full border-2 border-border shadow-xs hover:scale-105 transition-transform"
                        style={{ backgroundColor: customGradEnd }}
                        title="Pick End Color"
                      >
                        <input
                          type="color"
                          value={customGradEnd}
                          className="absolute inset-0 cursor-pointer opacity-0"
                          onChange={(e) => handleCustomGradEndChange(e.target.value)}
                        />
                      </label>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground font-medium">End Color</span>
                        <span className="text-xs font-mono font-semibold uppercase">{customGradEnd}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Text Color & Custom Color Picker */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Text Color
                </p>
                <button
                  type="button"
                  onClick={() => setTextShadow(!textShadow)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    textShadow
                      ? "border-primary bg-accent text-accent-foreground shadow-sm"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                  title="Toggle text drop shadow for better contrast"
                >
                  <Sparkles className="h-3 w-3" />
                  Text Shadow: {textShadow ? "On" : "Off"}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {inkPresets.map((i) => (
                  <button
                    key={i.v}
                    type="button"
                    aria-label={i.label}
                    title={i.label}
                    onClick={() => setInk(i.v)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      ink === i.v
                        ? "border-primary bg-accent text-accent-foreground shadow-sm"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-border shadow-xs"
                      style={{ backgroundColor: i.v }}
                    />
                    {i.label}
                  </button>
                ))}
                <label
                  className="relative flex items-center gap-1.5 cursor-pointer rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  title="Choose any custom color"
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-border shadow-xs"
                    style={{
                      background: !inkPresets.some((p) => p.v.toLowerCase() === ink.toLowerCase())
                        ? ink
                        : "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)",
                    }}
                  />
                  Custom
                  <input
                    type="color"
                    value={ink}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(e) => setInk(e.target.value)}
                  />
                </label>
              </div>
            </div>

            {/* Script */}
            <Row label="Script">
              {Object.entries(types).map(([k, v]) => (
                <Pill
                  key={k}
                  active={type === k}
                  onClick={() => setType(k as keyof typeof types)}
                >
                  {v}
                </Pill>
              ))}
            </Row>

            {/* Font Family Selector */}
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {type === "urdu"
                  ? "Urdu Font Style"
                  : type === "roman"
                  ? "Roman Font Style"
                  : "Typography Style"}
              </p>
              {type === "urdu" && (
                <div className="flex items-center gap-2">
                  {urduFonts.map((f) => (
                    <Pill
                      key={f.id}
                      active={urduFont === f.id}
                      onClick={() => setUrduFont(f.id)}
                    >
                      {f.label}
                    </Pill>
                  ))}
                </div>
              )}
              {type === "roman" && (
                <div className="flex items-center gap-2">
                  {latinFonts.map((f) => (
                    <Pill
                      key={f.id}
                      active={latinFont === f.id}
                      onClick={() => setLatinFont(f.id)}
                    >
                      {f.label}
                    </Pill>
                  ))}
                </div>
              )}
              {type === "english" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-12 font-medium">Urdu:</span>
                    {urduFonts.map((f) => (
                      <Pill
                        key={f.id}
                        active={urduFont === f.id}
                        onClick={() => setUrduFont(f.id)}
                      >
                        {f.label}
                      </Pill>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-12 font-medium">English:</span>
                    {latinFonts.map((f) => (
                      <Pill
                        key={f.id}
                        active={latinFont === f.id}
                        onClick={() => setLatinFont(f.id)}
                      >
                        {f.label}
                      </Pill>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDownload}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3.5 text-sm font-bold shadow-sm hover:bg-secondary transition-colors"
            >
              <Download className="h-4 w-4" /> Save HD Image (PNG)
            </button>
            <button
              onClick={handleVideoDownload}
              disabled={isRecording}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold shadow-glow transition-all ${
                isRecording
                  ? "bg-secondary text-muted-foreground cursor-not-allowed"
                  : "bg-amber-grad text-primary-foreground hover:opacity-95"
              }`}
            >
              <Video className="h-4 w-4" /> {isRecording ? "Recording..." : "Export as Video (Audio Sync)"}
            </button>
          </div>
        </div>
      </div>
      <GuestAuthDialog open={showGuestDialog} onOpenChange={setShowGuestDialog} />
      <ConfirmDialog
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal((prev) => ({ ...prev, open }))}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmLabel={confirmModal.confirmLabel}
        cancelLabel="Keep"
        isDestructive={true}
        onConfirm={confirmModal.onConfirm}
      />
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
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`h-8 w-8 shrink-0 rounded-full border-2 transition ${active ? "scale-110 border-primary ring-2 ring-primary/40" : "border-border"}`}
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