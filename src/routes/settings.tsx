import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Trash2, Info, MoonStar } from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/sukhan/Shell";
import { ThemeToggle } from "@/components/sukhan/ThemeToggle";
import { setSavedCouplets, setVocab } from "@/components/sukhan/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [{ title: "Settings — Sukhan" }],
  }),
  component: Settings,
});

function Settings() {
  const navigate = useNavigate();

  const handleClearData = () => {
    // Confirmation dialog taake ghalti se delete na ho
    if (window.confirm("Are you sure you want to delete all saved couplets and vocabulary? This cannot be undone.")) {
      localStorage.removeItem("sukhan_saved_couplets");
      localStorage.removeItem("sukhan_vocab");
      
      // Store ko bhi empty array de dein
      setSavedCouplets([]);
      setVocab([]);
      
      toast.success("All personal data has been cleared.");
      navigate({ to: "/" });
    }
  };

  return (
    <Shell>
      <div className="flex items-center gap-4 px-5 pt-8">
        <Link to="/" aria-label="Back" className="grid h-10 w-10 place-items-center rounded-full bg-secondary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-2xl font-semibold">Settings</h1>
      </div>

      <div className="px-5 pt-10 space-y-8">
        
        {/* Appearance Section */}
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Appearance</p>
          <div className="rounded-2xl bg-card border border-border p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <MoonStar className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">App Theme</span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Data Management Section */}
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Data & Storage</p>
          <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
            <button
              onClick={handleClearData}
              className="flex w-full items-center justify-between p-4 hover:bg-red-500/10 transition text-red-500"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5" />
                <div className="text-left">
                  <p className="text-sm font-medium">Clear All Saved Data</p>
                  <p className="text-xs text-red-500/70 mt-0.5">Removes library items and vocabulary</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* About App Section */}
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">About</p>
          <div className="rounded-2xl bg-card border border-border p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Info className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Sukhan App</span>
            </div>
            <p className="text-xs text-muted-foreground ml-8 leading-relaxed">
              Urdu poetry for the quiet hours. A beautiful HCI project crafted with care for a seamless reading experience. <br/>
              <span className="mt-2 block font-semibold">Version 1.0.0</span>
            </p>
          </div>
        </div>

      </div>
    </Shell>
  );
}