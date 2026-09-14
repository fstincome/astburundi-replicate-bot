import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
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

export const getPublications = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("publications")
    .select("id, label, title, description, published_on, document_url")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getRealizations = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("realizations")
    .select("id, title, subtitle, description, image_url")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("site_content")
    .select("key, title, body, image_url, sort_order")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getHeroSlides = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("hero_slides")
    .select("id, title, image_url")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: { name: string; email: string; phone?: string; message: string }) => {
    if (!input.name.trim() || !input.email.trim() || !input.message.trim()) {
      throw new Error("Champs obligatoires manquants");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const { error } = await publicClient().from("contact_messages").insert({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || null,
      message: data.message.trim(),
    });
    if (error) throw new Error("Envoi impossible");
    return { ok: true as const };
  });
