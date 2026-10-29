import { toast as sonnerToast } from "sonner";

export interface ToastHelper {
  saved: (message?: string) => string | number;
  removed: (message?: string) => string | number;
  exported: (message?: string) => string | number;
  settingsSaved: (message?: string) => string | number;
  success: (message: string) => string | number;
  error: (message: string) => string | number;
  info: (message: string) => string | number;
  raw: typeof sonnerToast;
}

export const sukhanToast: ToastHelper = {
  saved: (message = "Couplet saved to your collection ✨") =>
    sonnerToast.success(message),
  removed: (message = "Removed from collection") =>
    sonnerToast.info(message),
  exported: (message = "Card saved to your device in HD 🎨") =>
    sonnerToast.success(message),
  settingsSaved: (message = "Changes saved successfully") =>
    sonnerToast.success(message),
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
  info: (message: string) => sonnerToast.info(message),
  raw: sonnerToast,
};

export const useToast = () => sukhanToast;
export { sonnerToast as toast };

