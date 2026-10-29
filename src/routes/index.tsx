import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "./login";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign In & Register — Sukhan | Urdu Poetry for Late Nights" },
      { name: "description", content: "Sign in or register on Sukhan to explore curated Urdu poetry, synced recitations, and card creation." },
    ],
  }),
  component: LoginPage,
});
