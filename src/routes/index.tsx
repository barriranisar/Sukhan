import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Compass, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign In & Register — Sukhan | Urdu Poetry for Late Nights" },
      { name: "description", content: "Sign in or register on Sukhan to explore curated Urdu poetry, synced recitations, and card creation." },
    ],
  }),
  component: LoginPage,
});

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function AppleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.66-.81 1.11-1.93.99-3.05-1 .04-2.16.67-2.84 1.47-.6.69-1.13 1.83-1 2.94 1.12.09 2.2-.56 2.85-1.36z" />
    </svg>
  );
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Derived validation errors
  const nameError = mode === "signup" && touched.name && !name.trim() ? "Please enter your full name." : null;
  const emailError =
    touched.email &&
    (!email.trim()
      ? "Email address is required."
      : !EMAIL_REGEX.test(email.trim())
      ? "Please enter a valid email address."
      : null);
  const passwordError =
    touched.password &&
    (!password
      ? "Password is required."
      : password.length < 6
      ? "Password must be at least 6 characters."
      : null);
  const confirmPasswordError =
    mode === "signup" &&
    (touched.confirmPassword || confirmPassword.length > 0) &&
    password !== confirmPassword
      ? "Passwords do not match."
      : null;

  // Initialize theme on landing
  useEffect(() => {
    const savedTheme = localStorage.getItem("sukhan-theme");
    if (!savedTheme) {
      localStorage.setItem("sukhan-theme", "day");
    }
    const isDay = localStorage.getItem("sukhan-theme") !== "night";
    document.documentElement.classList.toggle("light", isDay);
    document.documentElement.classList.toggle("dark", !isDay);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (mode === "signup") {
      if (!name.trim()) {
        toast.error("Please enter your full name.");
        return;
      }
      if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
        toast.error("Please enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        const user = {
          name: name.trim(),
          email: email.trim(),
          initial: name.trim().charAt(0).toUpperCase() || "S",
          registeredAt: new Date().toISOString(),
        };
        localStorage.setItem("sukhan_user", JSON.stringify(user));
        window.dispatchEvent(new Event("sukhan_auth_change"));
        toast.success(`خوش آمدید، ${user.name}! Your account has been created.`);
        setIsLoading(false);
        navigate({ to: "/discover" });
      }, 450);
      return;
    }

    // Login mode
    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const user = {
        name: email.split("@")[0] || "Poet",
        email: email.trim(),
        initial: (email.split("@")[0] || "P").charAt(0).toUpperCase(),
        loginAt: new Date().toISOString(),
      };
      if (rememberMe) {
        localStorage.setItem("sukhan_user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("sukhan_user", JSON.stringify(user));
        localStorage.removeItem("sukhan_user");
      }
      window.dispatchEvent(new Event("sukhan_auth_change"));
      toast.success("خوش آمدید — Welcome back to Sukhan!");
      setIsLoading(false);
      navigate({ to: "/discover" });
    }, 450);
  };

  const handleSocialAuth = (provider: "Google" | "Apple") => {
    setIsLoading(true);
    setTimeout(() => {
      const defaultName = provider === "Google" ? "Faiz Ahmed" : "Mirza Ghalib";
      const defaultEmail = provider === "Google" ? "faiz@gmail.com" : "ghalib@icloud.com";
      const user = {
        name: defaultName,
        email: defaultEmail,
        initial: defaultName.charAt(0).toUpperCase(),
        provider,
        loginAt: new Date().toISOString(),
      };
      localStorage.setItem("sukhan_user", JSON.stringify(user));
      window.dispatchEvent(new Event("sukhan_auth_change"));
      toast.success(`خوش آمدید — Signed in with ${provider}!`);
      setIsLoading(false);
      navigate({ to: "/discover" });
    }, 400);
  };

  const handleGuestAccess = () => {
    localStorage.removeItem("sukhan_user");
    sessionStorage.removeItem("sukhan_user");
    navigate({ to: "/discover" });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-background text-foreground transition-colors duration-300">
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[520px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-accent blur-3xl opacity-60" />
      </div>

      {/* Top Bar with Brand Text Only */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center px-6 py-5">
        <Link to="/discover" className="flex items-baseline gap-2 group">
          <span className="font-display text-2xl font-bold tracking-tight text-primary">Sukhan</span>
          <span className="font-urdu ml-2 text-sm text-muted-foreground">سخن</span>
        </Link>
      </header>

      {/* Main Auth Card Container */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-border bg-card/90 backdrop-blur-xl p-7 sm:p-9 shadow-glow transition-all">
            {/* Header Badge & Title */}
            <div className="text-center flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                سخن شناس بنیں · Poetry for late nights
              </span>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
                {mode === "login" ? "Welcome to Sukhan" : "Create an Account"}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                {mode === "login"
                  ? "Enter your credentials to access your saved couplets, lounge & studio."
                  : "Join Sukhan to curate your Urdu poetry library and craft custom cards."}
              </p>
            </div>

            {/* Sign Up / Login Tab Switcher */}
            <div className="mt-6 grid grid-cols-2 rounded-2xl bg-secondary/80 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-xl py-2 transition-all ${
                  mode === "signup"
                    ? "bg-card text-foreground shadow-sm font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-xl py-2 transition-all ${
                  mode === "login"
                    ? "bg-card text-foreground shadow-sm font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Log In
              </button>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Full Name field (Sign Up mode only) */}
              {mode === "signup" && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    Full Name
                  </label>
                  <div
                    className={`relative flex items-center rounded-2xl border bg-background px-3.5 py-3 transition-all focus-within:ring-2 ${
                      nameError
                        ? "border-destructive focus-within:ring-destructive/20"
                        : "border-border focus-within:border-primary focus-within:ring-primary/20"
                    }`}
                  >
                    <User className="h-4 w-4 text-muted-foreground mr-2.5 shrink-0" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                      placeholder="Faiz Ahmed"
                      required
                      className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                    />
                  </div>
                  {nameError && (
                    <p className="mt-1 text-xs text-destructive font-medium animate-in fade-in-50">
                      {nameError}
                    </p>
                  )}
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Email Address
                </label>
                <div
                  className={`relative flex items-center rounded-2xl border bg-background px-3.5 py-3 transition-all focus-within:ring-2 ${
                    emailError
                      ? "border-destructive focus-within:ring-destructive/20"
                      : "border-border focus-within:border-primary focus-within:ring-primary/20"
                  }`}
                >
                  <Mail className="h-4 w-4 text-muted-foreground mr-2.5 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                    placeholder="poet@sukhan.art"
                    required
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
                {emailError && (
                  <p className="mt-1 text-xs text-destructive font-medium animate-in fade-in-50">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => toast.info("Password reset feature will be available soon.")}
                      className="text-[11px] font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div
                  className={`relative flex items-center rounded-2xl border bg-background px-3.5 py-3 transition-all focus-within:ring-2 ${
                    passwordError
                      ? "border-destructive focus-within:ring-destructive/20"
                      : "border-border focus-within:border-primary focus-within:ring-primary/20"
                  }`}
                >
                  <Lock className="h-4 w-4 text-muted-foreground mr-2.5 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                    placeholder="••••••••"
                    required
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="ml-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-xs text-destructive font-medium animate-in fade-in-50">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Confirm Password (Sign Up mode only) */}
              {mode === "signup" && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    Confirm Password
                  </label>
                  <div
                    className={`relative flex items-center rounded-2xl border bg-background px-3.5 py-3 transition-all focus-within:ring-2 ${
                      confirmPasswordError
                        ? "border-destructive focus-within:ring-destructive/20"
                        : "border-border focus-within:border-primary focus-within:ring-primary/20"
                    }`}
                  >
                    <Lock className="h-4 w-4 text-muted-foreground mr-2.5 shrink-0" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, confirmPassword: true }))}
                      placeholder="••••••••"
                      required
                      className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="ml-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p className="mt-1 text-xs text-destructive font-medium animate-in fade-in-50">
                      {confirmPasswordError}
                    </p>
                  )}
                </div>
              )}

              {/* Remember Me (Login mode only) */}
              {mode === "login" && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                    <span>Remember me on this device</span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-amber-grad py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{mode === "login" ? "Login" : "Create Account"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Mode Switcher Link at Bottom of Form */}
            <div className="mt-3 text-center">
              {mode === "login" ? (
                <p className="text-xs text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="font-bold text-primary hover:underline ml-1"
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-bold text-primary hover:underline ml-1"
                  >
                    Log In
                  </button>
                </p>
              )}
            </div>

            {/* Social Divider */}
            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-border/70" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                or continue with
              </span>
              <span className="h-px flex-1 bg-border/70" />
            </div>

            {/* Social Sign-In Buttons (Google & Apple) */}
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleSocialAuth("Google")}
                aria-label="Continue with Google"
                title="Continue with Google"
                className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card/70 text-foreground transition-all duration-200 hover:bg-secondary hover:border-primary/40 hover:scale-105 active:scale-95 shadow-sm"
              >
                <GoogleIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => handleSocialAuth("Apple")}
                aria-label="Continue with Apple"
                title="Continue with Apple"
                className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card/70 text-foreground transition-all duration-200 hover:bg-secondary hover:border-primary/40 hover:scale-105 active:scale-95 shadow-sm"
              >
                <AppleIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Guest Access Divider */}
            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-border/70" />
              <span className="font-urdu text-xs text-muted-foreground">یا</span>
              <span className="h-px flex-1 bg-border/70" />
            </div>

            {/* Guest / Direct Discovery */}
            <button
              type="button"
              onClick={handleGuestAccess}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-secondary/50 py-3 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-secondary hover:border-primary/40"
            >
              <span>Explore feed without signing in</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-muted-foreground">
        <p>Sukhan · سخن · Urdu Poetry for late nights</p>
      </footer>
    </div>
  );
}
