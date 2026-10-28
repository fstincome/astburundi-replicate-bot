import { createFileRoute, Link } from "@tanstack/react-router";
import { InteriorPage } from "@/components/site-shell";
import { getPublications } from "@/lib/public-content";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { FileText, ArrowUpRight } from "lucide-react";
import { EditorialFilters } from "@/components/editorial-filters";
import { RichContent } from "@/components/rich-content";
import { filterEditorial, safeLink } from "@/lib/editorial";

function PublicationsFallback({ messageKey }: { messageKey: "pub.empty" | "pub.unavailable" }) {
  const { t } = useI18n();
  return <InteriorPage title={t("pub.title")} eyebrow={t("pub.eyebrow")}><p>{t(messageKey)}</p></InteriorPage>;
}

export const Route = createFileRoute("/publications")({
  loader: () => getPublications(),
  head: () => ({ meta: [
    { title: "Publications et appels d’offres — AST Burundi" }, { name: "description", content: "Consultez les annonces, documents et appels d’offres publiés par l’AST Burundi." },
    { property: "og:title", content: "Publications — AST Burundi" }, { property: "og:description", content: "Annonces et appels d’offres de l’Association pour la Solidarité au Travail." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/publications" }] }),
  component: PublicationsPage,
  errorComponent: () => <PublicationsFallback messageKey="pub.unavailable" />,
  notFoundComponent: () => <PublicationsFallback messageKey="pub.empty" />,
});

const MONTHS = {
  fr: ["JAN", "FEV", "MAR", "AVR", "MAI", "JUIN", "JUIL", "AOUT", "SEP", "OCT", "NOV", "DEC"],
  en: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
};

function PublicationsPage() {
  const notices = Route.useLoaderData();
  const { t, lang } = useI18n();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const visible = filterEditorial(notices, search, category);
  return (
    <InteriorPage title={t("pub.title")} eyebrow={t("pub.eyebrow")}>
      <p className="section-intro">{t("pub.intro")}</p>
      <EditorialFilters search={search} category={category} categories={[...new Set(notices.map(n => n.category))]} onSearch={setSearch} onCategory={setCategory} />
      <div className="publication-grid">
        {visible.length === 0 && <p>{t("pub.empty")}</p>}
        {visible.map((notice) => {
          const date = new Date(notice.published_on);
          return (
            <article className="publication-card" key={notice.id}>
              {notice.image_url ? <img className="publication-cover" src={notice.image_url} alt="" loading="lazy" /> : <div className="publication-cover publication-placeholder"><FileText /><span>{notice.category}</span></div>}
              <div className="publication-copy">
                <div className="publication-meta"><span className="editorial-category">{notice.category}</span><time>{date.getUTCDate()} {MONTHS[lang][date.getUTCMonth()]} {date.getUTCFullYear()}</time></div>
                <span className="notice-label">{notice.label}</span>
                <h2>{notice.title}</h2>
                <p>{notice.description}</p>
                {notice.rich_content && <details className="publication-details"><summary>{lang === "fr" ? "Lire la publication" : "Read publication"}</summary><RichContent value={notice.rich_content} /></details>}
                {safeLink(notice.document_url ?? "") && <a className="publication-document" href={safeLink(notice.document_url ?? "")} target="_blank" rel="noopener noreferrer"><FileText />{t("pub.document")}<ArrowUpRight /></a>}
              </div>
            </article>
          );
        })}
      </div>
      <section className="page-cta compact">
        <div><h2>{t("pub.help")}</h2></div>
        <Link to="/contact" className="action-link primary">{t("pub.contact")}</Link>
      </section>
    </InteriorPage>
  );
}
