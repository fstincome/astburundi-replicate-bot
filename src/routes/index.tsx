import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { HeroCarousel } from "@/components/hero-carousel";
import { getHeroSlides, getRealizations, getSiteContent } from "@/lib/public-content.functions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  loader: async () => ({
    content: await getSiteContent(),
    gallery: await getRealizations(),
    slides: await getHeroSlides(),
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
  const { content, gallery, slides } = Route.useLoaderData();
  const { t } = useI18n();
  const cards = content.filter((item) => item.key !== "hero");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <HeroCarousel slides={slides.length ? slides : [{ id: "fallback", title: t("home.title"), image_url: "/images/ast/hero.jpeg" }]} />

        <section className="about-section">
          <h2>{t("home.title")}</h2>
          <div className="title-rule" />
          <p className="section-intro">{t("home.intro")}</p>
          <div className="page-actions centered">
            <Link to="/about" className="action-link primary">{t("home.discover")}</Link>
            <Link to="/contact" className="action-link secondary">{t("home.contactUs")}</Link>
          </div>
          <div className="service-grid">
            {cards.map((card) => <article className="service-card" key={card.key}>
              <img src={card.image_url || "/images/ast/services.jpg"} alt="Activités communautaires de l’AST" />
              <div className="service-copy"><h3>{card.title}</h3><p>{card.body}</p><Link to="/about">{t("home.learnMore")}</Link></div>
            </article>)}
          </div>
        </section>

        <section className="gallery-section">
          <h2>{t("home.gallery")}</h2><div className="title-rule" />
          <div className="gallery-grid">{gallery.map((item) => <article className="gallery-card" key={item.id}>
            <img src={item.image_url} alt={item.title} loading="lazy" /><Link to="/realizations">{item.title}</Link>
          </article>)}</div>
          <div className="page-actions centered"><Link to="/realizations" className="action-link primary">{t("home.allProjects")}</Link></div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
