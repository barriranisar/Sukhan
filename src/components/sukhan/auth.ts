import { useState, useEffect } from "react";

export interface UserProfile {
  name: string;
  email: string;
  initial: string;
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("sukhan_user") || sessionStorage.getItem("sukhan_user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (!user || !user.email) return null;
    const name = user.name || user.email.split("@")[0] || "Poet";
    const initial = name.charAt(0).toUpperCase() || "S";
    return { name, email: user.email, initial };
  } catch {
    return null;
  }
}

export function isUserAuthenticated(): boolean {
  return getUserProfile() !== null;
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("sukhan_user");
  sessionStorage.removeItem("sukhan_user");
  window.dispatchEvent(new Event("sukhan_auth_change"));
}

export function useAuthUser() {
  const [user, setUser] = useState<UserProfile | null>(() => getUserProfile());

  useEffect(() => {
    const sync = () => setUser(getUserProfile());
    window.addEventListener("sukhan_auth_change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sukhan_auth_change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    logout: logoutUser,
  };
}
