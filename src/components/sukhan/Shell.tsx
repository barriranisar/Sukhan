import { Link, useNavigate } from "@tanstack/react-router";
import { Compass, Headphones, Sparkles, BadgeCheck, Settings, LogIn, User, LogOut } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useAuthUser } from "./auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const tabs = [
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/player", label: "Lounge", icon: Headphones },
  { to: "/studio", label: "Studio", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function Shell({ children, nav = true }: { children: ReactNode; nav?: boolean }) {
  const { user, isAuthenticated, logout } = useAuthUser();
  const navigate = useNavigate();

  // Yeh useEffect app khulte hi theme ko initialize karega
  useEffect(() => {
    const savedTheme = localStorage.getItem("sukhan-theme");
    if (!savedTheme) {
      localStorage.setItem("sukhan-theme", "day");
    }
    const isDay = localStorage.getItem("sukhan-theme") !== "night";
    document.documentElement.classList.toggle("light", isDay);
    document.documentElement.classList.toggle("dark", !isDay);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully.");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Top Navigation Header */}
      {nav && (
        <header className="sticky top-0 z-40 flex w-full border-b border-border/70 bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex h-14 md:h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link to="/discover" className="flex items-center gap-2.5 sm:gap-3 group">
              {/* Day Mode Logo */}
              <img
                src="/logo-day.png"
                alt="Sukhan Logo"
                className="h-9 w-auto object-contain rounded-none cursor-pointer transition-transform group-hover:scale-105 block dark:hidden"
              />
              {/* Night Mode Logo */}
              <img
                src="/logo-night.png"
                alt="Sukhan Logo"
                className="h-9 w-auto object-contain rounded-none cursor-pointer transition-transform group-hover:scale-105 hidden dark:block"
              />
              <div className="flex items-baseline gap-2">
                <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-primary">Sukhan</span>
                
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1.5">
              {tabs.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  activeOptions={{ exact: to === "/discover" }}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "!bg-primary !text-primary-foreground shadow-sm font-bold" }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2.5">
              <Link
                to="/settings"
                aria-label="Settings"
                className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-foreground transition-transform hover:scale-105"
              >
                <Settings className="h-4 w-4" />
              </Link>

              {/* Dynamic Auth State: Profile Avatar with Dropdown vs Login Button */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label="User profile menu"
                      className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-tr from-primary to-accent text-primary-foreground font-bold text-sm shadow-sm ring-2 ring-primary/40 transition-transform hover:scale-105 cursor-pointer outline-none focus:ring-primary"
                    >
                      {user.initial}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-56 rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-2 shadow-glow"
                  >
                    <div className="px-3 py-2.5">
                      <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-border/60" />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                      >
                        <User className="h-4 w-4 text-primary" />
                        <span>Your Profile Hub</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/settings"
                        className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                      >
                        <Settings className="h-4 w-4 text-primary" />
                        <span>Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/60" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to="/"
                  title="Account / Login"
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Responsive Content Area */}
      <main className={`flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${nav ? "pb-24 md:pb-10 pt-3 md:pt-6" : "py-4 md:py-8"}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      {nav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-border bg-background/95 px-2 pb-5 pt-2 backdrop-blur-lg md:hidden">
          {tabs.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/discover" }}
              className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors"
              activeProps={{ className: "!text-primary font-bold" }}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>
      )}
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
