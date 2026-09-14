import { createFileRoute } from "@tanstack/react-router";
import { InteriorPage } from "@/components/site-shell";
import { getRealizations } from "@/lib/public-content.functions";

export const Route = createFileRoute("/realizations")({
  loader: () => getRealizations(),
  head: () => ({ meta: [
    { title: "Réalisations — AST Burundi" }, { name: "description", content: "Découvrez les actions de terrain et projets communautaires menés par l’AST au Burundi." },
    { property: "og:title", content: "Réalisations — AST Burundi" }, { property: "og:description", content: "Projets environnementaux, formations et initiatives communautaires de l’AST." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/realizations" }] }),
  component: RealizationsPage,
  errorComponent: () => <InteriorPage title="Nos réalisations" eyebrow="Actions sur le terrain"><p>Les réalisations ne sont pas disponibles pour le moment.</p></InteriorPage>,
  notFoundComponent: () => <InteriorPage title="Nos réalisations" eyebrow="Actions sur le terrain"><p>Aucune réalisation.</p></InteriorPage>,
});

function RealizationsPage() {
  const projects = Route.useLoaderData();
  return (
    <InteriorPage title="Nos réalisations" eyebrow="Actions sur le terrain">
      <div className="project-grid">
        {projects.length === 0 && <p>Aucune réalisation pour le moment.</p>}
        {projects.map((project) => (
          <article className="project-card" key={project.id}>
            <img src={project.image_url} alt={project.title} />
            <div>
              <span>{project.subtitle}</span>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </div>
          </article>
        ))}
      </div>
    </InteriorPage>
  );
}
