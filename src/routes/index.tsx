import { createFileRoute } from "@tanstack/react-router";

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
      <header className="site-header">
        <div className="site-nav">
          <a href="#accueil" aria-label="Accueil AST"><img src="/images/ast/logo.png" alt="Logo AST" className="site-logo" /></a>
          <nav aria-label="Navigation principale" className="desktop-nav">
            <a className="active" href="#accueil">ACCUEIL</a><a href="#about">ABOUT US</a><a href="#realisations">REALIZATION</a><a href="#publication">PUBLICATION⌄</a><a href="#contact">CONTACT</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="accueil" className="hero" aria-label="Présentation de l’AST">
          <img src="/images/ast/hero.jpeg" alt="Membres de l’Association pour la Solidarité au Travail" />
          <div className="hero-shade" />
          <span className="hero-arrow left" aria-hidden="true">‹</span><span className="hero-arrow right" aria-hidden="true">›</span>
          <div className="hero-caption"><h1>Association pour la Solidarité au Travail (AST)</h1><div className="hero-dots"><i /><i /><i /></div></div>
        </section>

        <section id="about" className="about-section">
          <h2>Association pour la Solidarité au Travail (AST)</h2>
          <div className="title-rule" />
          <div className="service-grid">
            {cards.map((card) => <article className="service-card" key={card.title}>
              <img src="/images/ast/services.jpg" alt="Activités communautaires de l’AST" />
              <div className="service-copy"><h3>{card.title}</h3><p>{card.text}</p><a href="#realisations">Learn More</a></div>
            </article>)}
          </div>
        </section>

        <section id="realisations" className="gallery-section">
          <h2>Notre garelly</h2><div className="title-rule" />
          <div className="gallery-grid">{gallery.map((item) => <article className="gallery-card" key={item.title}>
            <img src={item.image} alt={item.title} loading="lazy" /><a href="#publication">{item.title}</a>
          </article>)}</div>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <div className="footer-grid"><div><img src="/images/ast/logo.png" alt="AST" className="footer-logo" /><p>Association pour la Solidarité au Travail</p></div><div><h3>Find us</h3><p>+257 61 55 64 67</p><p>astburundi@gmail.com</p><p>info@astburundi.com</p></div><div><h3>Follow us</h3><p><a href="https://www.facebook.com/profile.php?id=61556201796697">facebook.com</a></p><p>youtube.com</p></div><div><h3>Recent posts</h3></div></div>
        <div className="copyright">All Rights Reserved. © 2014 astburundi Design By : Nova Software Company</div>
      </footer>
    </div>
  );
}
