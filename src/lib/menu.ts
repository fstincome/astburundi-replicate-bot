import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MenuItem = {
  id: string;
  route: string;
  label_fr: string;
  label_en: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
};

export const defaultMenu: Omit<MenuItem, "id" | "parent_id">[] = [
  { route: "/", label_fr: "Accueil", label_en: "Home", sort_order: 1, is_active: true },
  { route: "/about", label_fr: "À propos", label_en: "About us", sort_order: 2, is_active: true },
  { route: "/realizations", label_fr: "Réalisations", label_en: "Our work", sort_order: 3, is_active: true },
  { route: "/publications", label_fr: "Publications", label_en: "Publications", sort_order: 4, is_active: true },
  { route: "/blog", label_fr: "Blog", label_en: "Blog", sort_order: 5, is_active: true },
  { route: "/contact", label_fr: "Contact", label_en: "Contact", sort_order: 6, is_active: true },
];

export type MenuNode = MenuItem & { children: MenuItem[] };

/** Builds the public tree: active items only, top level sorted, children under their parent. */
export function buildMenuTree(items: MenuItem[]): MenuNode[] {
  const active = items.filter((i) => i.is_active).sort((a, b) => a.sort_order - b.sort_order);
  const ids = new Set(active.map((i) => i.id));
  return active
    .filter((i) => !i.parent_id || !ids.has(i.parent_id))
    .map((i) => ({ ...i, children: active.filter((c) => c.parent_id === i.id) }));
}

const fallback: MenuItem[] = defaultMenu.map((m, i) => ({ ...m, id: `default-${i}`, parent_id: null }));

export function useMenu() {
  const [items, setItems] = useState<MenuItem[]>(fallback);
  useEffect(() => {
    supabase.from("menu_items").select("*").then(({ data }) => {
      if (data && data.length) setItems(data as MenuItem[]);
    });
  }, []);
  return buildMenuTree(items);
}
