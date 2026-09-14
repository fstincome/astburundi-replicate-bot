import { createFileRoute } from "@tanstack/react-router";
import { InteriorPage } from "@/components/site-shell";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "À propos de l’AST Burundi" },
    { name: "description", content: "Histoire, mission, vision et domaines d’intervention de l’Association pour la Solidarité au Travail." },
    { property: "og:title", content: "À propos de l’AST Burundi" },
    { property: "og:description", content: "Découvrez l’organisation burundaise AST, son histoire et ses engagements." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/about" }] }),
  component: AboutPage,
});

function AboutPage() {
  return <InteriorPage title="À propos de l’AST" eyebrow="Qui sommes-nous ?">
    <section className="story-grid"><img src="/images/ast/gallery-3.jpg" alt="Équipe de l’AST Burundi" /><div><h2>Historique</h2><p>L’Association pour la Solidarité au Travail, en sigle AST, est une organisation de droit burundais à but non lucratif et apolitique.</p><p>Elle œuvre dans le développement social, la santé, l’éducation, la protection de l’environnement, la formation et la réinsertion.</p></div></section>
    <section className="values-grid"><article><h2>Notre mission</h2><p>Contribuer à une société burundaise inclusive, caractérisée par un environnement socio-économique favorable et un accès équitable aux services essentiels.</p></article><article><h2>Notre vision</h2><p>Une population solidaire, autonome et engagée dans la construction d’un développement durable au Burundi.</p></article><article><h2>Nos valeurs</h2><p>Solidarité, inclusion, équité, responsabilité, respect des droits humains et protection des ressources naturelles.</p></article></section>
  </InteriorPage>;
}