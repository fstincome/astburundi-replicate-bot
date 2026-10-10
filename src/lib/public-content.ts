// Browser-safe data access (no server functions) so the site can be exported as static files.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

let _client: ReturnType<typeof makeClient> | undefined;

function makeClient() {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string;
  const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

function publicClient() {
  if (!_client) _client = makeClient();
  return _client;
}

export async function getPublications() {
  const { data } = await publicClient()
    .from("publications")
    .select("id, label, title, description, published_on, document_url")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getRealizations() {
  const { data } = await publicClient()
    .from("realizations")
    .select("id, title, subtitle, description, image_url")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getSiteContent() {
  const { data } = await publicClient()
    .from("site_content")
    .select("key, title, body, image_url, sort_order")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getHeroSlides() {
  const { data } = await publicClient()
    .from("hero_slides")
    .select("id, title, image_url")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function sendContactMessage({
  data,
}: {
  data: { name: string; email: string; phone?: string; message: string };
}) {
  if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
    throw new Error("Champs obligatoires manquants");
  }
  const { error } = await publicClient().from("contact_messages").insert({
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone?.trim() || null,
    message: data.message.trim(),
  });
  if (error) throw new Error("Envoi impossible");
  return { ok: true as const };
}

export async function getBlogPosts() {
  const { data } = await publicClient()
    .from("blog_posts")
    .select("id, slug, title, excerpt, image_url, author, published_on")
    .eq("is_published", true)
    .order("published_on", { ascending: false });
  return data ?? [];
}

export async function getBlogPost({ data: input }: { data: { slug: string } }) {
  const { data } = await publicClient()
    .from("blog_posts")
    .select("id, slug, title, excerpt, body, image_url, author, published_on")
    .eq("slug", input.slug)
    .eq("is_published", true)
    .maybeSingle();
  return data;
}
