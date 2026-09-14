import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-shell";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Association pour la Solidarité au Travail (AST)" },
      { name: "description", content: "L’AST œuvre au Burundi pour le développement social, la santé, l’éducation, l’environnement et la réinsertion." },
      { property: "og:title", content: "Association pour la Solidarité au Travail (AST)" },
      { property: "og:description", content: "Découvrez les missions, domaines d’intervention et réalisations de l’AST au Burundi." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  const cards = [
    {
      title: "Mission",
      text: "avoir une société Burundaise inclusive, caractérisée par un environnement socio-économique inclusif, par l’accès à l’éducation, aux soins de santé et aux services judiciaires équitables pour toutes les couches de la population.",
    },
    {
      title: "Domaine d’intervention",
      text: "(1) Promouvoir la santé sexuelle et reproductive, (2) Protection de droit de l’homme, (3) Promouvoir la protection de l’environnement, (4) Promouvoir l’entreprenariat pour le jeune et femme ; (5) Promouvoir l’éducation pour tous",
    },
    {
      title: "Historique",
      text: "L’Association pour la Solidarité au Travail, en sigle AST, est une organisation de droit Burundais à but non lucratif et apolitique, œuvrant dans le domaine du Développement social, de la Santé, de l’Education, de la Protection de l’Environnement, de la Formation et de la réinsertion.",
    },
  ];

  const gallery = [
    { image: "/images/ast/gallery-1.png", title: "ARRACHAGE DES PLANTS DANS LA PÉPINIÈRE PAR LES MEMBRES JEUNES DE L’ASSOCIATION POUR LA SOLIDARITÉ AU TRAVAIL (AST)" },
    { image: "/images/ast/gallery-2.jpeg", title: "LANCEMENT DU PROJET ARBRE CROISSANCE AGRO ÉCOLOGIQUE (ACAE) EN COMMUNE BUGANDA DE LA PROVINCE CIBITOKE DU 18 NOVEMBRE 2024." },
    { image: "/images/ast/gallery-3.jpg", title: "RETRAITE DU COMITÉ EXÉCUTIF ET LE STAFF DE L'ORGANISATION QUI A ÉTÉ EFFECTUÉ AU MOIS DE NOVEMBRE, SUR LES OBJECTIFS" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="hero" aria-label="Présentation de l’AST">
          <img src="/images/ast/hero.jpeg" alt="Membres de l’Association pour la Solidarité au Travail" />
          <div className="hero-shade" />
          <span className="hero-arrow left" aria-hidden="true">‹</span><span className="hero-arrow right" aria-hidden="true">›</span>
          <div className="hero-caption"><h1>Association pour la Solidarité au Travail (AST)</h1><div className="hero-dots"><i /><i /><i /></div></div>
        </section>

        <section className="about-section">
          <h2>Association pour la Solidarité au Travail (AST)</h2>
          <div className="title-rule" />
          <div className="service-grid">
            {cards.map((card) => <article className="service-card" key={card.title}>
              <img src="/images/ast/services.jpg" alt="Activités communautaires de l’AST" />
              <div className="service-copy"><h3>{card.title}</h3><p>{card.text}</p><Link to="/about">Learn More</Link></div>
            </article>)}
          </div>
        </section>

        <section className="gallery-section">
          <h2>Notre garelly</h2><div className="title-rule" />
          <div className="gallery-grid">{gallery.map((item) => <article className="gallery-card" key={item.title}>
            <img src={item.image} alt={item.title} loading="lazy" /><Link to="/realizations">{item.title}</Link>
          </article>)}</div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
