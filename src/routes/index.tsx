import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { getRealizations, getSiteContent } from "@/lib/public-content.functions";

export const Route = createFileRoute("/")({
  loader: async () => ({
    content: await getSiteContent(),
    gallery: await getRealizations(),
  }),
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
  const { content, gallery } = Route.useLoaderData();
  const hero = content.find((item) => item.key === "hero");
  const cards = content.filter((item) => item.key !== "hero");

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
