import { createFileRoute, Link } from "@tanstack/react-router";
import { InteriorPage } from "@/components/site-shell";
import { getPublications } from "@/lib/public-content.functions";
import { useI18n } from "@/lib/i18n";

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

  return (
    <InteriorPage title={t("pub.title")} eyebrow={t("pub.eyebrow")}>
      <p className="section-intro">{t("pub.intro")}</p>
      <div className="notice-list">
        {notices.length === 0 && <p>{t("pub.empty")}</p>}
        {notices.map((notice) => {
          const date = new Date(notice.published_on);
          return (
            <article className="notice-row" key={notice.id}>
              <div className="notice-date">
                <strong>{String(date.getUTCDate()).padStart(2, "0")}</strong>
                <span>{MONTHS[lang][date.getUTCMonth()]} {date.getUTCFullYear()}</span>
              </div>
              <div>
                <span className="notice-label">{notice.label}</span>
                <h2>{notice.title}</h2>
                <p>{notice.description}</p>
                {notice.document_url && <a href={notice.document_url}>{t("pub.document")}</a>}
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
