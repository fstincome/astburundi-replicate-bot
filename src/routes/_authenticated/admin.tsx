import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getAdminOverview,
  savePublication,
  deletePublication,
  saveRealization,
  deleteRealization,
  saveSiteContent,
  saveHeroSlide,
  deleteHeroSlide,
  setMessageRead,
  deleteMessage,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — AST Burundi" },
      { name: "description", content: "Gestion des publications, réalisations, contenus et messages de l’AST Burundi." },
      { property: "og:title", content: "Tableau de bord — AST Burundi" },
      { property: "og:description", content: "Espace de gestion du site de l’AST Burundi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab = "publications" | "realizations" | "content" | "messages";

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const overview = useServerFn(getAdminOverview);
  const [tab, setTab] = useState<Tab>("publications");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => overview(),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div>
          <img src="/images/ast/logo.png" alt="AST" />
          <span>Espace administrateur</span>
        </div>
        <div className="admin-top-actions">
          <a href="/">Voir le site</a>
          <button type="button" onClick={signOut}>Se déconnecter</button>
        </div>
      </header>

      <nav className="admin-tabs">
        {([
          ["publications", "Publications"],
          ["realizations", "Réalisations"],
          ["content", "Accueil"],
          ["messages", "Messages"],
        ] as [Tab, string][]).map(([value, label]) => (
          <button key={value} type="button" className={tab === value ? "active" : ""} onClick={() => setTab(value)}>
            {label}
            {value === "messages" && data ? ` (${data.messages.filter((m: any) => !m.is_read).length})` : ""}
          </button>
        ))}
      </nav>

      <main className="admin-main">
        {isLoading && <p>Chargement…</p>}
        {error && <p className="auth-error">Accès refusé ou erreur de chargement.</p>}
        {data && tab === "publications" && <PublicationsPanel rows={data.publications} onDone={refetch} />}
        {data && tab === "realizations" && <RealizationsPanel rows={data.realizations} onDone={refetch} />}
        {data && tab === "content" && <ContentPanel rows={data.content} slides={data.slides} onDone={refetch} />}
        {data && tab === "messages" && <MessagesPanel rows={data.messages} onDone={refetch} />}
      </main>
    </div>
  );
}

function PublicationsPanel({ rows, onDone }: { rows: any[]; onDone: () => void }) {
  const save = useServerFn(savePublication);
  const remove = useServerFn(deletePublication);
  const empty = { label: "APPEL D’OFFRES", title: "", description: "", published_on: new Date().toISOString().slice(0, 10), document_url: "", sort_order: rows.length + 1 };
  const [form, setForm] = useState<any>(empty);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    await save({ data: { ...form, sort_order: Number(form.sort_order) } });
    setBusy(false);
    setForm(empty);
    onDone();
  }

  return (
    <section className="admin-panel">
      <form className="admin-form" onSubmit={submit}>
        <h2>{form.id ? "Modifier la publication" : "Nouvelle publication"}</h2>
        <label>Intitulé<input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required /></label>
        <label>Titre<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
        <label className="full">Description<textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label>Date<input type="date" value={form.published_on} onChange={(e) => setForm({ ...form, published_on: e.target.value })} required /></label>
        <label>Lien du document<input value={form.document_url ?? ""} onChange={(e) => setForm({ ...form, document_url: e.target.value })} /></label>
        <label>Ordre<input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></label>
        <div className="admin-form-actions">
          <button type="submit" disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</button>
          {form.id && <button type="button" className="ghost" onClick={() => setForm(empty)}>Annuler</button>}
        </div>
      </form>

      <ul className="admin-list">
        {rows.map((row) => (
          <li key={row.id}>
            <div><strong>{row.title}</strong><span>{row.label} · {row.published_on}</span></div>
            <div className="admin-row-actions">
              <button type="button" onClick={() => setForm({ ...row, document_url: row.document_url ?? "" })}>Modifier</button>
              <button type="button" className="danger" onClick={async () => { await remove({ data: { id: row.id } }); onDone(); }}>Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RealizationsPanel({ rows, onDone }: { rows: any[]; onDone: () => void }) {
  const save = useServerFn(saveRealization);
  const remove = useServerFn(deleteRealization);
  const empty = { title: "", subtitle: "", description: "", image_url: "/images/ast/gallery-2.jpeg", sort_order: rows.length + 1 };
  const [form, setForm] = useState<any>(empty);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    await save({ data: { ...form, sort_order: Number(form.sort_order) } });
    setBusy(false);
    setForm(empty);
    onDone();
  }

  return (
    <section className="admin-panel">
      <form className="admin-form" onSubmit={submit}>
        <h2>{form.id ? "Modifier la réalisation" : "Nouvelle réalisation"}</h2>
        <label>Titre<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
        <label>Sous-titre<input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></label>
        <label className="full">Description<textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label>Image (chemin ou lien)<input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></label>
        <label>Ordre<input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></label>
        <div className="admin-form-actions">
          <button type="submit" disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</button>
          {form.id && <button type="button" className="ghost" onClick={() => setForm(empty)}>Annuler</button>}
        </div>
      </form>

      <ul className="admin-list">
        {rows.map((row) => (
          <li key={row.id}>
            <div><strong>{row.title}</strong><span>{row.subtitle}</span></div>
            <div className="admin-row-actions">
              <button type="button" onClick={() => setForm(row)}>Modifier</button>
              <button type="button" className="danger" onClick={async () => { await remove({ data: { id: row.id } }); onDone(); }}>Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ContentPanel({ rows, slides, onDone }: { rows: any[]; slides: any[]; onDone: () => void }) {
  const save = useServerFn(saveSiteContent);
  const [drafts, setDrafts] = useState<Record<string, any>>(() =>
    Object.fromEntries(rows.map((row) => [row.key, { ...row }])),
  );
  const [savedKey, setSavedKey] = useState<string | null>(null);

  return (
    <section className="admin-panel">
      <HeroSlidesPanel rows={slides} onDone={onDone} />
      {rows.filter((row) => row.key !== "hero").map((row) => {
        const draft = drafts[row.key] ?? row;
        return (
          <form
            key={row.key}
            className="admin-form"
            onSubmit={async (event) => {
              event.preventDefault();
              await save({ data: { key: row.key, title: draft.title, body: draft.body, image_url: draft.image_url } });
              setSavedKey(row.key);
              onDone();
            }}
          >
            <h2>{`Bloc : ${row.title}`}</h2>
            <label className="full">Titre<input value={draft.title} onChange={(e) => setDrafts({ ...drafts, [row.key]: { ...draft, title: e.target.value } })} /></label>
            <label className="full">Texte<textarea rows={4} value={draft.body} onChange={(e) => setDrafts({ ...drafts, [row.key]: { ...draft, body: e.target.value } })} /></label>
            <label className="full">Image<input value={draft.image_url} onChange={(e) => setDrafts({ ...drafts, [row.key]: { ...draft, image_url: e.target.value } })} /></label>
            <div className="admin-form-actions">
              <button type="submit">Enregistrer</button>
              {savedKey === row.key && <span className="admin-saved">Enregistré</span>}
            </div>
          </form>
        );
      })}
    </section>
  );
}

function HeroSlidesPanel({ rows, onDone }: { rows: any[]; onDone: () => void }) {
  const save = useServerFn(saveHeroSlide);
  const remove = useServerFn(deleteHeroSlide);
  const empty = { title: "", image_url: "/images/ast/hero.jpeg", sort_order: rows.length + 1 };
  const [form, setForm] = useState<any>(empty);
  const [status, setStatus] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("Enregistrement…");
    try {
      await save({ data: { ...form, sort_order: Number(form.sort_order) } });
      setForm(empty);
      setStatus("Enregistré");
      onDone();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Enregistrement impossible");
    }
  }

  return (
    <div className="admin-slides">
      <form className="admin-form" onSubmit={submit}>
        <h2>{form.id ? "Modifier la diapositive" : "Ajouter une diapositive"}</h2>
        <label>Titre<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
        <label>Ordre<input type="number" min="1" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} required /></label>
        <label className="full">Image (chemin ou lien)<input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} required /></label>
        <div className="admin-form-actions">
          <button type="submit">Enregistrer</button>
          {form.id && <button type="button" className="ghost" onClick={() => setForm(empty)}>Annuler</button>}
          {status && <span className="admin-saved">{status}</span>}
        </div>
      </form>
      <ul className="admin-list admin-slide-list">
        {rows.map((row) => (
          <li key={row.id}>
            <img src={row.image_url} alt="" />
            <div><strong>{row.title}</strong><span>Diapositive {row.sort_order}</span></div>
            <div className="admin-row-actions">
              <button type="button" onClick={() => setForm({ ...row })}>Modifier</button>
              <button type="button" className="danger" disabled={rows.length <= 1} title={rows.length <= 1 ? "Une diapositive minimum" : undefined} onClick={async () => {
                try { await remove({ data: { id: row.id } }); onDone(); } catch (error) { setStatus(error instanceof Error ? error.message : "Suppression impossible"); }
              }}>Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MessagesPanel({ rows, onDone }: { rows: any[]; onDone: () => void }) {
  const mark = useServerFn(setMessageRead);
  const remove = useServerFn(deleteMessage);

  if (rows.length === 0) return <p>Aucun message pour le moment.</p>;

  return (
    <ul className="admin-messages">
      {rows.map((row) => (
        <li key={row.id} className={row.is_read ? "read" : ""}>
          <div className="admin-message-head">
            <strong>{row.name}</strong>
            <span>{row.email}{row.phone ? ` · ${row.phone}` : ""}</span>
            <span>{new Date(row.created_at).toLocaleString("fr-FR")}</span>
          </div>
          <p>{row.message}</p>
          <div className="admin-row-actions">
            <button type="button" onClick={async () => { await mark({ data: { id: row.id, is_read: !row.is_read } }); onDone(); }}>
              {row.is_read ? "Marquer non lu" : "Marquer comme lu"}
            </button>
            <button type="button" className="danger" onClick={async () => { await remove({ data: { id: row.id } }); onDone(); }}>Supprimer</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
