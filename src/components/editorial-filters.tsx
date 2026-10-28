import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function EditorialFilters({ search, category, categories, onSearch, onCategory }: { search: string; category: string; categories: string[]; onSearch: (value: string) => void; onCategory: (value: string) => void }) {
  const { lang } = useI18n();
  return <div className="cms-filters public-editorial-filters">
    <label className="cms-search"><Search /><input aria-label={lang === "fr" ? "Rechercher" : "Search"} placeholder={lang === "fr" ? "Rechercher un titre…" : "Search a title…"} value={search} onChange={e => onSearch(e.target.value)} /></label>
    <select aria-label={lang === "fr" ? "Catégorie" : "Category"} value={category} onChange={e => onCategory(e.target.value)}><option value="">{lang === "fr" ? "Toutes les catégories" : "All categories"}</option>{categories.map(value => <option key={value}>{value}</option>)}</select>
  </div>;
}