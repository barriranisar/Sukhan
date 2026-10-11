import { Link } from "@tanstack/react-router";
import { Compass, Library, Headphones, Sparkles, BadgeCheck } from "lucide-react";
import { useEffect, type ReactNode } from "react";

const tabs = [
  { to: "/", label: "Discover", icon: Compass },
  { to: "/player", label: "Lounge", icon: Headphones },
  { to: "/studio", label: "Studio", icon: Sparkles },
  { to: "/library", label: "Library", icon: Library },
] as const;

export function Shell({ children, nav = true }: { children: ReactNode; nav?: boolean }) {
  // Yeh useEffect app khulte hi light theme ko default set kar dega
  useEffect(() => {
    const savedTheme = localStorage.getItem("sukhan-theme");
    if (!savedTheme) {
      localStorage.setItem("sukhan-theme", "day");
    }
    const isDay = localStorage.getItem("sukhan-theme") !== "night";
    document.documentElement.classList.toggle("light", isDay);
    document.documentElement.classList.toggle("dark", !isDay);
  }, []);

  return (
    <div className="flex min-h-screen justify-center sm:py-8">
      <div className="relative flex h-screen w-full max-w-[420px] flex-col overflow-hidden bg-background sm:h-[860px] sm:rounded-[2.5rem] sm:border sm:border-border sm:shadow-glow">
        <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
        {nav && (
          <nav className="grid grid-cols-4 border-t border-border bg-background/90 px-2 pb-5 pt-2 backdrop-blur">
            {tabs.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: true }}
                className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors"
                activeProps={{ className: "text-primary" }}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

export function Verified({ label = "Verified" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-verified">
      <BadgeCheck className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function Wave({ bars = 18, playing = true }: { bars?: number; playing?: boolean }) {
  return (
    <div className="flex h-6 items-end gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full bg-primary ${playing ? "animate-wave" : ""}`}
          style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 6) * 0.12}s` }}
        />
      ))}
    </div>
  );
}