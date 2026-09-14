import { createFileRoute } from "@tanstack/react-router";
import { InteriorPage } from "@/components/site-shell";

export const Route = createFileRoute("/publications")({
  head: () => ({ meta: [
    { title: "Publications et appels d’offres — AST Burundi" }, { name: "description", content: "Consultez les annonces, documents et appels d’offres publiés par l’AST Burundi." },
    { property: "og:title", content: "Publications — AST Burundi" }, { property: "og:description", content: "Annonces et appels d’offres de l’Association pour la Solidarité au Travail." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/publications" }] }), component: PublicationsPage,
});

const notices = [
  "Recrutement d’un consultant ou cabinet pour l’élaboration d’un plan de suivi-évaluation",
  "Recrutement d’un consultant-cabinet pour l’élaboration du système de communication interne",
  "Recrutement d’un consultant-cabinet pour l’élaboration du système de gestion des bénévoles",
];

function PublicationsPage() { return <InteriorPage title="Publications" eyebrow="Annonces et documents"><div className="notice-list">{notices.map((notice, index) => <article className="notice-row" key={notice}><div className="notice-date"><strong>30</strong><span>SEP 2024</span></div><div><span className="notice-label">APPEL D’OFFRES {String(index + 1).padStart(2, "0")}</span><h2>{notice}</h2><p>L’AST invite les candidats qualifiés à consulter les termes de référence de cet appel d’offres.</p><a href="https://astburundi.com/publication.php">Consulter le document →</a></div></article>)}</div></InteriorPage>; }