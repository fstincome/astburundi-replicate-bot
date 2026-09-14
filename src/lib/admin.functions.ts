import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: any; userId: string };

async function assertAdmin(context: Ctx) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Accès refusé");
}

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const supabase = (context as Ctx).supabase;
    const [publications, realizations, content, messages] = await Promise.all([
      supabase.from("publications").select("*").order("sort_order"),
      supabase.from("realizations").select("*").order("sort_order"),
      supabase.from("site_content").select("*").order("sort_order"),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);
    return {
      publications: publications.data ?? [],
      realizations: realizations.data ?? [],
      content: content.data ?? [],
      messages: messages.data ?? [],
    };
  });

export const savePublication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    id?: string; label: string; title: string; description: string;
    published_on: string; document_url: string; sort_order: number;
  }) => input)
  .handler(async ({ context, data }) => {
    await assertAdmin(context as Ctx);
    const supabase = (context as Ctx).supabase;
    const row = {
      label: data.label, title: data.title, description: data.description,
      published_on: data.published_on, document_url: data.document_url || null,
      sort_order: data.sort_order,
    };
    const res = data.id
      ? await supabase.from("publications").update(row).eq("id", data.id)
      : await supabase.from("publications").insert(row);
    if (res.error) throw new Error(res.error.message);
    return { ok: true as const };
  });

export const deletePublication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    await assertAdmin(context as Ctx);
    const { error } = await (context as Ctx).supabase.from("publications").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const saveRealization = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    id?: string; title: string; subtitle: string; description: string;
    image_url: string; sort_order: number;
  }) => input)
  .handler(async ({ context, data }) => {
    await assertAdmin(context as Ctx);
    const supabase = (context as Ctx).supabase;
    const row = {
      title: data.title, subtitle: data.subtitle, description: data.description,
      image_url: data.image_url, sort_order: data.sort_order,
    };
    const res = data.id
      ? await supabase.from("realizations").update(row).eq("id", data.id)
      : await supabase.from("realizations").insert(row);
    if (res.error) throw new Error(res.error.message);
    return { ok: true as const };
  });

export const deleteRealization = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    await assertAdmin(context as Ctx);
    const { error } = await (context as Ctx).supabase.from("realizations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const saveSiteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { key: string; title: string; body: string; image_url: string }) => input)
  .handler(async ({ context, data }) => {
    await assertAdmin(context as Ctx);
    const { error } = await (context as Ctx).supabase
      .from("site_content")
      .update({ title: data.title, body: data.body, image_url: data.image_url })
      .eq("key", data.key);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const setMessageRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; is_read: boolean }) => input)
  .handler(async ({ context, data }) => {
    await assertAdmin(context as Ctx);
    const { error } = await (context as Ctx).supabase
      .from("contact_messages").update({ is_read: data.is_read }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    await assertAdmin(context as Ctx);
    const { error } = await (context as Ctx).supabase.from("contact_messages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
