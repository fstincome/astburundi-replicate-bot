import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navigation = [
  { to: "/" as const, label: "ACCUEIL" },
  { to: "/about" as const, label: "ABOUT US" },
  { to: "/realizations" as const, label: "REALIZATION" },
  { to: "/publications" as const, label: "PUBLICATION" },
  { to: "/contact" as const, label: "CONTACT" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-nav">
        <Link to="/" aria-label="Accueil AST">
          <img src="/images/ast/logo.png" alt="Logo AST" className="site-logo" />
        </Link>
        <nav aria-label="Navigation principale" className="desktop-nav">
          {navigation.map((item) => (
            <Link key={item.to} to={item.to} activeProps={{ className: "active" }} activeOptions={{ exact: item.to === "/" }}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div><img src="/images/ast/logo.png" alt="AST" className="footer-logo" /><p>Association pour la Solidarité au Travail</p></div>
        <div><h3>Nous contacter</h3><p>+257 61 55 64 67</p><p>astburundi@gmail.com</p><p>info@astburundi.com</p></div>
        <div><h3>Nous suivre</h3><p><a href="https://www.facebook.com/profile.php?id=61556201796697">facebook.com</a></p><p>YouTube</p></div>
        <div><h3>Liens rapides</h3><p><Link to="/about">À propos</Link></p><p><Link to="/publications">Publications</Link></p></div>
      </div>
      <div className="copyright">All Rights Reserved. © 2014 astburundi Design By : Nova Software Company</div>
    </footer>
  );
}

export function InteriorPage({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="page-banner"><p>{eyebrow}</p><h1>{title}</h1></section>
        <div className="page-content">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}