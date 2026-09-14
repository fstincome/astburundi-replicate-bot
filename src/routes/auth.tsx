import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteFooter, SiteHeader } from "@/components/site-shell";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion administrateur — AST Burundi" },
      { name: "description", content: "Espace réservé à l’équipe de l’AST Burundi pour gérer le contenu du site." },
      { property: "og:title", content: "Connexion administrateur — AST Burundi" },
      { property: "og:description", content: "Accès réservé à l’équipe de l’AST Burundi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError("Adresse e-mail ou mot de passe incorrect.");
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="auth-wrap">
        <form className="auth-card" onSubmit={onSubmit}>
          <h1>Espace administrateur</h1>
          <p>Connectez-vous pour gérer les contenus du site.</p>
          <label>
            Adresse e-mail
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label>
            Mot de passe
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "Connexion…" : "Se connecter"}</button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
