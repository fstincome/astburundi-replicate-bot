import { createFileRoute, Link } from "@tanstack/react-router";
import { InteriorPage } from "@/components/site-shell";
import { getRealizations } from "@/lib/public-content.functions";
import { useI18n } from "@/lib/i18n";

function RealizationsFallback({ messageKey }: { messageKey: "real.empty" | "real.unavailable" }) {
  const { t } = useI18n();
  return <InteriorPage title={t("real.title")} eyebrow={t("real.eyebrow")}><p>{t(messageKey)}</p></InteriorPage>;
}

export const Route = createFileRoute("/realizations")({
  loader: () => getRealizations(),
  head: () => ({ meta: [
    { title: "Réalisations — AST Burundi" }, { name: "description", content: "Découvrez les actions de terrain et projets communautaires menés par l’AST au Burundi." },
    { property: "og:title", content: "Réalisations — AST Burundi" }, { property: "og:description", content: "Projets environnementaux, formations et initiatives communautaires de l’AST." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/realizations" }] }),
  component: RealizationsPage,
  errorComponent: () => <RealizationsFallback messageKey="real.unavailable" />,
  notFoundComponent: () => <RealizationsFallback messageKey="real.empty" />,
});

function RealizationsPage() {
  const projects = Route.useLoaderData();
  const { t } = useI18n();
  return (
    <InteriorPage title={t("real.title")} eyebrow={t("real.eyebrow")}>
      <p className="section-intro">{t("real.intro")}</p>
      <div className="project-grid">
        {projects.length === 0 && <p>{t("real.empty")}</p>}
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
      <section className="page-cta">
        <div><h2>{t("real.ctaTitle")}</h2><p>{t("real.ctaText")}</p></div>
        <Link to="/contact" className="action-link primary">{t("real.ctaButton")}</Link>
      </section>
    </InteriorPage>
  );
}
