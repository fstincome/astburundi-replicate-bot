// Admin data access from the browser with the signed-in session.
// Security is enforced by row-level security (has_role 'admin') in the database.
import { supabase } from "@/integrations/supabase/client";

type Ok = { ok: true };
const ok: Ok = { ok: true };

async function assertAdmin() {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Non connecté");
  const { data, error } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
  if (error || !data) throw new Error("Accès refusé");
}

function check(res: { error: { message: string } | null }) {
  if (res.error) throw new Error(res.error.message);
}

export async function getAdminOverview() {
  await assertAdmin();
  const [publications, realizations, posts, content, slides, messages] = await Promise.all([
    supabase.from("publications").select("*").order("sort_order"),
    supabase.from("realizations").select("*").order("sort_order"),
    supabase.from("blog_posts").select("*").order("published_on", { ascending: false }),
    supabase.from("site_content").select("*").order("sort_order"),
    supabase.from("hero_slides").select("*").order("sort_order"),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
  ]);
  [publications, realizations, posts, content, slides, messages].forEach(check);
  return {
    publications: publications.data ?? [],
    realizations: realizations.data ?? [],
    posts: posts.data ?? [],
    content: content.data ?? [],
    slides: slides.data ?? [],
    messages: messages.data ?? [],
  };
}

export async function savePublication({ data }: { data: {
  id?: string; label: string; title: string; description: string;
  published_on: string; document_url: string; sort_order: number;
  category: string; is_published: boolean; image_url: string; rich_content: string;
} }): Promise<Ok> {
  const row = {
    label: data.label, title: data.title, description: data.description,
    published_on: data.published_on, document_url: data.document_url || null,
    sort_order: data.sort_order,
    category: data.category.trim() || "Appels d’offres", is_published: data.is_published,
    image_url: data.image_url, rich_content: data.rich_content,
  };
  check(data.id
    ? await supabase.from("publications").update(row).eq("id", data.id)
    : await supabase.from("publications").insert(row));
  return ok;
}

export async function deletePublication({ data }: { data: { id: string } }): Promise<Ok> {
  check(await supabase.from("publications").delete().eq("id", data.id));
  return ok;
}

export async function saveRealization({ data }: { data: {
  id?: string; title: string; subtitle: string; description: string;
  image_url: string; sort_order: number;
} }): Promise<Ok> {
  const row = {
    title: data.title, subtitle: data.subtitle, description: data.description,
    image_url: data.image_url, sort_order: data.sort_order,
  };
  check(data.id
    ? await supabase.from("realizations").update(row).eq("id", data.id)
    : await supabase.from("realizations").insert(row));
  return ok;
}

export async function deleteRealization({ data }: { data: { id: string } }): Promise<Ok> {
  check(await supabase.from("realizations").delete().eq("id", data.id));
  return ok;
}

export async function saveSiteContent({ data }: { data: { key: string; title: string; body: string; image_url: string } }): Promise<Ok> {
  check(await supabase
    .from("site_content")
    .update({ title: data.title, body: data.body, image_url: data.image_url })
    .eq("key", data.key));
  return ok;
}

export async function saveHeroSlide({ data }: { data: { id?: string; title: string; image_url: string; sort_order: number } }): Promise<Ok> {
  const row = { title: data.title.trim(), image_url: data.image_url.trim(), sort_order: data.sort_order };
  if (!row.title || !row.image_url) throw new Error("Titre et image obligatoires");
  check(data.id
    ? await supabase.from("hero_slides").update(row).eq("id", data.id)
    : await supabase.from("hero_slides").insert(row));
  return ok;
}

export async function deleteHeroSlide({ data }: { data: { id: string } }): Promise<Ok> {
  const { count, error } = await supabase.from("hero_slides").select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  if ((count ?? 0) <= 1) throw new Error("Le diaporama doit conserver au moins une image");
  check(await supabase.from("hero_slides").delete().eq("id", data.id));
  return ok;
}

export async function setMessageRead({ data }: { data: { id: string; is_read: boolean } }): Promise<Ok> {
  check(await supabase.from("contact_messages").update({ is_read: data.is_read }).eq("id", data.id));
  return ok;
}

export async function deleteMessage({ data }: { data: { id: string } }): Promise<Ok> {
  check(await supabase.from("contact_messages").delete().eq("id", data.id));
  return ok;
}

export async function saveBlogPost({ data }: { data: {
  id?: string; slug: string; title: string; excerpt: string; body: string;
  image_url: string; author: string; is_published: boolean; published_on: string;
  category: string; rich_content: string;
} }): Promise<Ok> {
  const slug = (data.slug || data.title)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!data.title.trim() || !slug) throw new Error("Titre obligatoire");
  const row = {
    slug, title: data.title.trim(), excerpt: data.excerpt, body: data.body,
    image_url: data.image_url, author: data.author || "AST Burundi",
    is_published: data.is_published, published_on: data.published_on,
    category: data.category.trim() || "Actualités", rich_content: data.rich_content,
  };
  check(data.id
    ? await supabase.from("blog_posts").update(row).eq("id", data.id)
    : await supabase.from("blog_posts").insert(row));
  return ok;
}

export async function deleteBlogPost({ data }: { data: { id: string } }): Promise<Ok> {
  check(await supabase.from("blog_posts").delete().eq("id", data.id));
  return ok;
}
