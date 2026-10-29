import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Info, MoonStar, User, LogOut, Check, Sliders } from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/sukhan/Shell";
import { ThemeToggle } from "@/components/sukhan/ThemeToggle";
import { setSavedCouplets, setVocab } from "@/components/sukhan/store";
import { useAuthUser } from "@/components/sukhan/auth";
import { ConfirmDialog } from "@/components/sukhan/ConfirmDialog";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [{ title: "Settings — Sukhan" }],
  }),
  component: Settings,
});

function Settings() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthUser();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [autoplayRecitations, setAutoplayRecitations] = useState(true);

  useEffect(() => {
    if (user?.name) setDisplayName(user.name);
  }, [user]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updated = {
        ...user,
        name: displayName.trim() || user.name,
        initial: (displayName.trim() || user.name).charAt(0).toUpperCase(),
      };
      localStorage.setItem("sukhan_user", JSON.stringify(updated));
      window.dispatchEvent(new Event("sukhan_auth_change"));
    }
    toast.success("Changes saved successfully");
  };

  const handleClearData = () => {
    localStorage.removeItem("sukhan_saved_couplets");
    localStorage.removeItem("sukhan_vocab");
    
    setSavedCouplets([]);
    setVocab([]);
    
    toast.info("Removed from collection");
    navigate({ to: "/discover" });
  };

  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully.");
    navigate({ to: "/" });
  };

  return (
    <Shell>
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-4 pt-2 md:pt-4">
          <Link
            to="/discover"
            aria-label="Back"
            className="grid h-10 w-10 place-items-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-2xl font-semibold">Settings</h1>
        </div>

        <div className="pt-8 space-y-8 pb-8">
          {/* Account & Profile Edit Section */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Account Profile</p>
            <div className="rounded-2xl bg-card border border-border p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-primary font-bold">
                    {user?.initial || "G"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user ? user.name : "Guest Poet"}</p>
                    <p className="text-xs text-muted-foreground">{user ? user.email : "Browsing as guest"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{isAuthenticated ? "Sign Out" : "Go to Login"}</span>
                </button>
              </div>

              {/* Edit Profile Form */}
              {isAuthenticated && (
                <form onSubmit={handleSaveSettings} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Display Name
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your pen name"
                        className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold shadow-sm hover:opacity-90 transition cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Reading Preferences */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Preferences</p>
            <div className="rounded-2xl bg-card border border-border p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <Sliders className="h-5 w-5 text-primary" />
                <div>
                  <span className="text-sm font-medium">Autoplay Recitations</span>
                  <p className="text-xs text-muted-foreground">Play couplet audio automatically when opening Lounge</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAutoplayRecitations(!autoplayRecitations);
                  toast.success("Changes saved successfully");
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  autoplayRecitations ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoplayRecitations ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

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
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="flex w-full items-center justify-between p-4 hover:bg-destructive/10 transition text-destructive cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Clear All Saved Data</p>
                    <p className="text-xs opacity-75 mt-0.5">Removes library items and vocabulary</p>
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
      </div>

      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Clear All Saved Data?"
        description="Are you sure you want to delete all saved couplets and vocabulary? This cannot be undone."
        confirmLabel="Clear All"
        cancelLabel="Keep"
        isDestructive={true}
        onConfirm={handleClearData}
      />
    </Shell>
  );
}
