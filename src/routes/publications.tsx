import { createFileRoute } from "@tanstack/react-router";
import { InteriorPage } from "@/components/site-shell";
import { getPublications } from "@/lib/public-content.functions";

export const Route = createFileRoute("/publications")({
  loader: () => getPublications(),
  head: () => ({ meta: [
    { title: "Publications et appels d’offres — AST Burundi" }, { name: "description", content: "Consultez les annonces, documents et appels d’offres publiés par l’AST Burundi." },
    { property: "og:title", content: "Publications — AST Burundi" }, { property: "og:description", content: "Annonces et appels d’offres de l’Association pour la Solidarité au Travail." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/publications" }] }),
  component: PublicationsPage,
  errorComponent: () => <InteriorPage title="Publications" eyebrow="Annonces et documents"><p>Les publications ne sont pas disponibles pour le moment.</p></InteriorPage>,
  notFoundComponent: () => <InteriorPage title="Publications" eyebrow="Annonces et documents"><p>Aucune publication.</p></InteriorPage>,
});

const MONTHS = ["JAN", "FEV", "MAR", "AVR", "MAI", "JUIN", "JUIL", "AOUT", "SEP", "OCT", "NOV", "DEC"];

function PublicationsPage() {
  const notices = Route.useLoaderData();

  return (
    <InteriorPage title="Publications" eyebrow="Annonces et documents">
      <div className="notice-list">
        {notices.length === 0 && <p>Aucune publication pour le moment.</p>}
        {notices.map((notice) => {
          const date = new Date(notice.published_on);
          return (
            <article className="notice-row" key={notice.id}>
              <div className="notice-date">
                <strong>{String(date.getUTCDate()).padStart(2, "0")}</strong>
                <span>{MONTHS[date.getUTCMonth()]} {date.getUTCFullYear()}</span>
              </div>
              <div>
                <span className="notice-label">{notice.label}</span>
                <h2>{notice.title}</h2>
                <p>{notice.description}</p>
                {notice.document_url && <a href={notice.document_url}>Consulter le document →</a>}
              </div>
            </article>
          );
        })}
      </div>
    </InteriorPage>
  );
}
