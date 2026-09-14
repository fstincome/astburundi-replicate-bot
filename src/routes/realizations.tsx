import { createFileRoute } from "@tanstack/react-router";
import { InteriorPage } from "@/components/site-shell";

export const Route = createFileRoute("/realizations")({
  head: () => ({ meta: [
    { title: "Réalisations — AST Burundi" }, { name: "description", content: "Découvrez les actions de terrain et projets communautaires menés par l’AST au Burundi." },
    { property: "og:title", content: "Réalisations — AST Burundi" }, { property: "og:description", content: "Projets environnementaux, formations et initiatives communautaires de l’AST." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/realizations" }] }), component: RealizationsPage,
});

const projects = [
  { image: "/images/ast/gallery-1.png", title: "Pépinière communautaire", date: "Projet environnemental", text: "Arrachage et préparation des plants par les jeunes membres de l’AST en vue de leur mise en terre." },
  { image: "/images/ast/gallery-2.jpeg", title: "Arbre Croissance Agro Écologique", date: "Buganda, Cibitoke — 18 novembre 2024", text: "Lancement du projet ACAE avec les partenaires et communautés bénéficiaires de la commune Buganda." },
  { image: "/images/ast/gallery-3.jpg", title: "Retraite du comité exécutif", date: "Novembre 2024", text: "Session de travail du comité exécutif et du personnel consacrée aux objectifs et à la planification de l’organisation." },
];

function RealizationsPage() { return <InteriorPage title="Nos réalisations" eyebrow="Actions sur le terrain"><div className="project-grid">{projects.map((project) => <article className="project-card" key={project.title}><img src={project.image} alt={project.title} /><div><span>{project.date}</span><h2>{project.title}</h2><p>{project.text}</p></div></article>)}</div></InteriorPage>; }