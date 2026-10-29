import { AlertTriangle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  icon?: "trash" | "alert";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Remove from Saved?",
  description = "Are you sure you want to remove this item from your library?",
  confirmLabel = "Remove",
  cancelLabel = "Keep",
  isDestructive = true,
  onConfirm,
  icon = "trash",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border border-border bg-card/95 backdrop-blur-xl p-6 sm:p-7 shadow-glow text-center">
        <div
          className={`mx-auto flex h-13 w-13 items-center justify-center rounded-2xl shadow-sm mb-3 ${
            isDestructive
              ? "bg-destructive/15 text-destructive"
              : "bg-primary/15 text-primary"
          }`}
        >
          {icon === "trash" ? (
            <Trash2 className="h-6 w-6" />
          ) : (
            <AlertTriangle className="h-6 w-6" />
          )}
        </div>

        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="font-display text-xl font-bold tracking-tight text-foreground text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-1.5 text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto flex-1 rounded-full border border-border bg-secondary/60 py-2.5 px-5 text-xs sm:text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`w-full sm:w-auto flex-1 rounded-full py-2.5 px-5 text-xs sm:text-sm font-bold shadow-sm transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
              isDestructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

