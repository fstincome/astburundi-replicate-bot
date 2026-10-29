import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { defaultTexts } from "@/lib/i18n";
import { defaultMenu, type MenuItem } from "@/lib/menu";

const sections: Record<string, string> = {
  nav: "Menu & en-tête", home: "Accueil", about: "À propos", real: "Réalisations", pub: "Publications",
  blog: "Blog", contact: "Contact", donate: "Faire un don", footer: "Bas de page",
};
const pageRoutes = ["/", "/about", "/realizations", "/publications", "/blog", "/contact", "/donate"];

let seeding: Promise<unknown> | null = null;

export function MenuPanel() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [status, setStatus] = useState("Chargement…");

  async function load() {
    let { data, error } = await supabase.from("menu_items").select("*").order("sort_order");
    if (!error && data && data.length === 0) {
      seeding ??= Promise.resolve(supabase.from("menu_items").insert(defaultMenu));
      await seeding;
      ({ data, error } = await supabase.from("menu_items").select("*").order("sort_order"));
    }
    if (error) return setStatus(error.message);
    setItems((data ?? []) as MenuItem[]);
    setStatus("");
  }
  useEffect(() => { load(); }, []);

  const tops = items.filter((i) => !i.parent_id);
  const ordered = tops.flatMap((t) => [t, ...items.filter((c) => c.parent_id === t.id)]);
  const update = (id: string, patch: Partial<MenuItem>) => setItems(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  function move(item: MenuItem, dir: -1 | 1) {
    const siblings = items.filter((i) => i.parent_id === item.parent_id).sort((a, b) => a.sort_order - b.sort_order);
    const idx = siblings.findIndex((s) => s.id === item.id);
    const other = siblings[idx + dir];
    if (!other) return;
    const order = siblings.map((s, i) => [s.id, i] as const);
    const map = new Map(order);
    map.set(item.id, idx + dir); map.set(other.id, idx);
    setItems(items.map((i) => (map.has(i.id) ? { ...i, sort_order: map.get(i.id)! } : i)).sort((a, b) => a.sort_order - b.sort_order));
  }

  async function saveAll() {
    setStatus("Enregistrement…");
    const { error } = await supabase.from("menu_items").upsert(items.map(({ id, route, label_fr, label_en, parent_id, sort_order, is_active }) => ({ id, route, label_fr, label_en, parent_id, sort_order, is_active })));
    setStatus(error ? error.message : "Menu enregistré");
  }
  async function add() {
    const { error } = await supabase.from("menu_items").insert({ route: "/", label_fr: "Nouvel élément", label_en: "", sort_order: tops.length + 1 });
    if (error) return setStatus(error.message);
    load();
  }
  async function remove(id: string) {
    await supabase.from("menu_items").update({ parent_id: null }).eq("parent_id", id);
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) return setStatus(error.message);
    load();
  }

  return (
    <section className="admin-panel">
      <div className="admin-form">
        <h2>Menu du site</h2>
        <p className="full">Activez ou masquez un élément, changez l’ordre avec les flèches, ou placez-le en sous-menu sous un autre élément. Pensez à enregistrer.</p>
        <div className="full" style={{ display: "grid", gap: 10 }}>
          {ordered.map((item) => (
            <div key={item.id} className={`menu-admin-row${item.parent_id ? " child" : ""}${item.is_active ? "" : " off"}`}>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input type="checkbox" checked={item.is_active} onChange={(e) => update(item.id, { is_active: e.target.checked })} />
                {item.is_active ? "Actif" : "Inactif"}
              </label>
              <input aria-label="Libellé FR" value={item.label_fr} onChange={(e) => update(item.id, { label_fr: e.target.value })} />
              <input aria-label="Libellé EN" placeholder="Libellé EN" value={item.label_en} onChange={(e) => update(item.id, { label_en: e.target.value })} />
              <input aria-label="Lien" list="menu-routes" value={item.route} onChange={(e) => update(item.id, { route: e.target.value })} />
              <select aria-label="Placer sous" value={item.parent_id ?? ""} onChange={(e) => update(item.id, { parent_id: e.target.value || null, sort_order: 99 })}>
                <option value="">Menu principal</option>
                {tops.filter((t) => t.id !== item.id && !items.some((c) => c.parent_id === item.id)).map((t) => (
                  <option key={t.id} value={t.id}>Sous « {t.label_fr} »</option>
                ))}
              </select>
              <Button type="button" variant="outline" size="icon" aria-label="Monter" onClick={() => move(item, -1)}><ArrowUp /></Button>
              <Button type="button" variant="outline" size="icon" aria-label="Descendre" onClick={() => move(item, 1)}><ArrowDown /></Button>
              <Button type="button" variant="outline" size="icon" aria-label="Supprimer" onClick={() => remove(item.id)}><Trash2 /></Button>
            </div>
          ))}
          <datalist id="menu-routes">{pageRoutes.map((r) => <option key={r} value={r} />)}</datalist>
        </div>
        <div className="admin-form-actions">
          <Button type="button" onClick={saveAll}>Enregistrer le menu</Button>
          <Button type="button" className="ghost" onClick={add}><Plus size={16} />Ajouter un élément</Button>
          {status && <span className="admin-saved">{status}</span>}
        </div>
      </div>
    </section>
  );
}

export function PagesPanel() {
  const [overrides, setOverrides] = useState<Record<string, { fr: string; en: string }>>({});
  const [section, setSection] = useState("home");
  const [status, setStatus] = useState("");

  useEffect(() => {
    supabase.from("text_overrides").select("key, fr, en").then(({ data }) => {
      if (data) setOverrides(Object.fromEntries(data.map((r) => [r.key, { fr: r.fr, en: r.en }])));
    });
  }, []);

  const keys = useMemo(() => Object.keys(defaultTexts.fr).filter((k) => k.split(".")[0] === section), [section]);
  const value = (k: string, l: "fr" | "en") => overrides[k]?.[l] || defaultTexts[l][k] || "";

  async function save() {
    setStatus("Enregistrement…");
    const rows = keys.map((k) => ({ key: k, fr: value(k, "fr"), en: value(k, "en"), updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("text_overrides").upsert(rows);
    setStatus(error ? error.message : "Textes enregistrés");
  }

  return (
    <section className="admin-panel">
      <div className="admin-form">
        <h2>Textes des pages</h2>
        <label className="full">Page
          <select value={section} onChange={(e) => { setSection(e.target.value); setStatus(""); }} style={{ padding: 10 }}>
            {Object.entries(sections).filter(([s]) => Object.keys(defaultTexts.fr).some((k) => k.startsWith(s + "."))).map(([s, l]) => <option key={s} value={s}>{l}</option>)}
          </select>
        </label>
        <div className="full">
          {keys.map((k) => (
            <div key={k} className="text-admin-row">
              <small>{k}</small>
              {(["fr", "en"] as const).map((l) => (
                <textarea key={l} aria-label={`${k} ${l}`} rows={value(k, l).length > 80 ? 3 : 1} value={value(k, l)}
                  onChange={(e) => setOverrides({ ...overrides, [k]: { fr: value(k, "fr"), en: value(k, "en"), [l]: e.target.value } })} />
              ))}
            </div>
          ))}
        </div>
        <div className="admin-form-actions">
          <Button type="button" onClick={save}>Enregistrer les textes</Button>
          {status && <span className="admin-saved">{status}</span>}
        </div>
      </div>
    </section>
  );
}
