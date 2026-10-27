import { lazy, Suspense, useState } from "react";
import { Plus, Search, Pencil, Trash2, Save, Eye, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RichContent } from "@/components/rich-content";
import { filterEditorial, safeLink } from "@/lib/editorial";
import { savePublication, deletePublication, saveBlogPost, deleteBlogPost } from "@/lib/admin-data";
import type { Database } from "@/integrations/supabase/types";
const RichEditor = lazy(() => import("@/components/cms-rich-editor").then(m => ({ default: m.CmsRichEditor })));
type Publication = Database["public"]["Tables"]["publications"]["Row"];
type Post = Database["public"]["Tables"]["blog_posts"]["Row"];
type Draft = { id?: string; title: string; category: string; label: string; description: string; excerpt: string; body: string; rich_content: string; image_url: string; is_published: boolean; published_on: string; document_url: string; sort_order: number; slug: string; author: string };
export function CmsEditorialPanel({ kind, rows, onDone }: { kind: "publications" | "blog"; rows: (Publication | Post)[]; onDone: () => void }) {
  const isBlog = kind === "blog";
  const defaults = isBlog ? ["Actualités", "Vie associative", "Terrain", "Environnement"] : ["Appels d’offres", "Rapports", "Communiqués", "Documents"];
  const empty = (): Draft => ({ title: "", category: defaults[0] ?? "Actualités", label: "APPEL D’OFFRES", description: "", excerpt: "", body: "", rich_content: "", image_url: "", is_published: false, published_on: new Date().toISOString().slice(0, 10), document_url: "", sort_order: rows.length + 1, slug: "", author: "AST Burundi" });
  const [form, setForm] = useState<Draft | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("all");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const categories = [...new Set([...defaults, ...rows.map(row => row.category)])];
  const visible = filterEditorial(rows, search, category, status);
  function change<K extends keyof Draft>(key: K, value: Draft[K]) { setForm(prev => prev ? { ...prev, [key]: value } : prev); }
  function close() { if (window.confirm("Quitter l’éditeur ? Les modifications non enregistrées seront perdues.")) { setForm(null); setPreview(false); } }
  async function save(published: boolean) {
    if (!form) return;
    if (!form.title.trim()) { setNotice("Le titre est obligatoire."); return; }
    setBusy(true); setNotice("");
    try {
      const data = { ...form, is_published: published };
      if (isBlog) await saveBlogPost({ data }); else await savePublication({ data });
      setNotice(published ? "Publication mise en ligne." : "Brouillon enregistré."); setForm(null); setPreview(false); onDone();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Enregistrement impossible."); }
    finally { setBusy(false); }
  }
  async function remove(id: string) {
    setBusy(true);
    try { if (isBlog) await deleteBlogPost({ data: { id } }); else await deletePublication({ data: { id } }); setDeleting(null); onDone(); setNotice("Contenu supprimé."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Suppression impossible."); }
    finally { setBusy(false); }
  }
  return <section className="cms-editorial">
    {notice && <p className="cms-feedback" role="status">{notice}</p>}
    {!form ? <>
      <div className="cms-section-heading"><div><span className="cms-eyebrow">BIBLIOTHÈQUE ÉDITORIALE</span><h1>{isBlog ? "Articles du blog" : "Publications"}</h1><p>{rows.length} contenus · {rows.filter(row => row.is_published).length} publiés</p></div><Button onClick={() => { setForm(empty()); setNotice(""); }}><Plus />{isBlog ? "Nouvel article" : "Nouvelle publication"}</Button></div>
      <div className="cms-filters"><label className="cms-search"><Search /><input aria-label="Rechercher un contenu" placeholder="Rechercher un titre…" value={search} onChange={e => setSearch(e.target.value)} /></label><select aria-label="Filtrer par catégorie" value={category} onChange={e => setCategory(e.target.value)}><option value="">Toutes les catégories</option>{categories.map(c => <option key={c}>{c}</option>)}</select><select aria-label="Filtrer par statut" value={status} onChange={e => setStatus(e.target.value)}><option value="all">Tous les statuts</option><option value="published">Publiés</option><option value="draft">Brouillons</option></select></div>
      <div className="cms-content-list"><div className="cms-list-header"><span>Contenu</span><span>Statut</span><span>Date</span><span>Actions</span></div>{visible.map(row => <div className="cms-content-row" key={row.id}><div className="cms-content-name">{row.image_url ? <img src={row.image_url} alt="" /> : <div className="cms-file-icon"><FileText /></div>}<div><strong>{row.title}</strong><span>{row.category}</span></div></div><span className={`cms-status ${row.is_published ? "published" : ""}`}>{row.is_published ? "Publié" : "Brouillon"}</span><time>{new Date(`${row.published_on}T00:00:00Z`).toLocaleDateString("fr-FR")}</time><div className="cms-row-actions"><Button size="icon" variant="ghost" title="Modifier" aria-label={`Modifier ${row.title}`} onClick={() => { setForm({ ...empty(), ...row, document_url: "document_url" in row ? row.document_url ?? "" : "" }); setNotice(""); }}><Pencil /></Button><Button size="icon" variant="ghost" title="Supprimer" aria-label={`Supprimer ${row.title}`} onClick={() => setDeleting(row.id)}><Trash2 /></Button></div></div>)}{!visible.length && <p className="cms-empty">Aucun contenu trouvé.</p>}</div>
    </> : <>
      <div className="cms-editor-heading"><Button variant="ghost" onClick={close}><ArrowLeft />Retour</Button><span className="cms-status">{form.id ? "Modification" : "Nouveau contenu"}</span><div><Button variant="outline" onClick={() => setPreview(!preview)}><Eye />{preview ? "Éditer" : "Aperçu"}</Button><Button variant="outline" disabled={busy} onClick={() => save(false)}><Save />Brouillon</Button><Button disabled={busy} onClick={() => save(true)}><CheckCircle2 />{busy ? "Enregistrement…" : "Publier"}</Button></div></div>
      <div className="cms-editor-grid"><div className="cms-writing">
        {preview ? <article className="cms-preview"><span className="cms-eyebrow">{form.category}</span><h1>{form.title || "Sans titre"}</h1>{form.image_url && <img src={form.image_url} alt="" />}<p className="blog-excerpt">{isBlog ? form.excerpt : form.description}</p><RichContent value={form.rich_content} fallback={form.body} />{form.document_url && <a href={safeLink(form.document_url)}>Consulter le document</a>}</article> : <>
          <label className="cms-title-label">Titre<input className="cms-title-input" placeholder={isBlog ? "Titre de l’article" : "Titre de la publication"} value={form.title} onChange={e => change("title", e.target.value)} /></label>
          <label>{isBlog ? "Chapeau" : "Résumé"}<textarea rows={3} value={isBlog ? form.excerpt : form.description} onChange={e => change(isBlog ? "excerpt" : "description", e.target.value)} /></label>
          <span className="cms-field-label">Contenu</span><Suspense fallback={<p>Chargement…</p>}><RichEditor key={form.id ?? "new"} value={form.rich_content} fallback={form.body} onChange={(json, text) => setForm(prev => prev ? { ...prev, rich_content: json, body: text } : prev)} /></Suspense>
        </>}
      </div><aside className="cms-settings"><h2>Paramètres de publication</h2><label>Catégorie<input list={`categories-${kind}`} value={form.category} onChange={e => change("category", e.target.value)} /><datalist id={`categories-${kind}`}>{categories.map(c => <option key={c} value={c} />)}</datalist></label><label>Date<input type="date" value={form.published_on} onChange={e => change("published_on", e.target.value)} /></label><label>Image de couverture<input value={form.image_url} placeholder="https://… ou /images/…" onChange={e => change("image_url", e.target.value)} /></label>{form.image_url && <img className="cms-cover-preview" src={form.image_url} alt="Couverture" />}
      {isBlog ? <><label>Auteur<input value={form.author} onChange={e => change("author", e.target.value)} /></label><label>Lien court<input value={form.slug} placeholder="Généré depuis le titre" onChange={e => change("slug", e.target.value)} /></label></> : <><label>Intitulé<input value={form.label} onChange={e => change("label", e.target.value)} /></label><label>Lien du document<input value={form.document_url} onChange={e => change("document_url", e.target.value)} /></label><label>Ordre d’affichage<input type="number" value={form.sort_order} onChange={e => change("sort_order", Number(e.target.value))} /></label></>}
      <span className={`cms-status ${form.is_published ? "published" : ""}`}>{form.is_published ? "Actuellement publié" : "Brouillon"}</span></aside></div>
    </>}
    {deleting && <div className="cms-modal-backdrop"><div role="alertdialog" aria-modal="true" aria-labelledby="delete-title" className="cms-delete-dialog"><h2 id="delete-title">Supprimer ce contenu ?</h2><p>Cette action est définitive.</p><div><Button variant="outline" disabled={busy} onClick={() => setDeleting(null)}>Annuler</Button><Button variant="destructive" disabled={busy} onClick={() => remove(deleting)}>Supprimer</Button></div></div></div>}
  </section>;
}