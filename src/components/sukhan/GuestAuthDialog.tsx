import { useNavigate } from "@tanstack/react-router";
import { Lock, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GuestAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuestAuthDialog({ open, onOpenChange }: GuestAuthDialogProps) {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    onOpenChange(false);
    navigate({ to: "/" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border border-border bg-card/95 backdrop-blur-xl p-6 sm:p-8 shadow-glow text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm mb-2">
          <Lock className="h-7 w-7" />
        </div>

        <DialogHeader className="text-center sm:text-center">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              سخن شناس بنیں · Member Feature
            </span>
          </div>
          <DialogTitle className="font-display text-2xl font-bold tracking-tight text-foreground text-center">
            Log In Required
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-muted-foreground text-center leading-relaxed">
            Please log in to save your favorite couplets and export studio designs
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto flex-1 rounded-full border border-border bg-secondary/60 py-2.5 px-5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLoginRedirect}
            className="w-full sm:w-auto flex-1 rounded-full bg-amber-grad py-2.5 px-6 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
          >
            Log In
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

