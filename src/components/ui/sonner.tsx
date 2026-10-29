import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-center"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card/95 group-[.toaster]:text-foreground group-[.toaster]:border-border/80 group-[.toaster]:shadow-glow group-[.toaster]:rounded-2xl group-[.toaster]:backdrop-blur-md group-[.toaster]:p-4 group-[.toaster]:border group-[.toaster]:text-xs sm:group-[.toaster]:text-sm group-[.toaster]:font-medium transition-all",
          description: "group-[.toast]:text-muted-foreground text-xs",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-full text-xs font-semibold px-3 py-1",
          cancelButton: "group-[.toast]:bg-secondary group-[.toast]:text-muted-foreground group-[.toast]:rounded-full text-xs font-semibold px-3 py-1",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
