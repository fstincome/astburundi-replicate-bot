import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useI18n, type TKey } from "@/lib/i18n";

const navigation: { to: "/" | "/about" | "/realizations" | "/publications" | "/contact"; key: TKey }[] = [
  { to: "/", key: "nav.home" },
  { to: "/about", key: "nav.about" },
  { to: "/realizations", key: "nav.realizations" },
  { to: "/publications", key: "nav.publications" },
  { to: "/contact", key: "nav.contact" },
];

function LanguageSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div className="lang-switch" role="group" aria-label="Langue / Language">
      <button type="button" aria-pressed={lang === "fr"} onClick={() => setLang("fr")}>FR</button>
      <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button>
    </div>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  return (
    <header className="site-header">
      <div className="site-nav">
        <Link to="/" aria-label="AST">
          <img src="/images/ast/logo.png" alt="Logo AST" className="site-logo" />
        </Link>
        <nav aria-label="Navigation" className="desktop-nav">
          {navigation.map((item) => (
            <Link key={item.to} to={item.to} activeProps={{ className: "active" }} activeOptions={{ exact: item.to === "/" }}>
              {t(item.key)}
            </Link>
          ))}
          <LanguageSwitch />
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div><img src="/images/ast/logo.png" alt="AST" className="footer-logo" /><p>{t("footer.tagline")}</p></div>
        <div><h3>{t("footer.contact")}</h3><p>+257 61 55 64 67</p><p>astburundi@gmail.com</p><p>info@astburundi.com</p></div>
        <div><h3>{t("footer.follow")}</h3><p><a href="https://www.facebook.com/profile.php?id=61556201796697">facebook.com</a></p><p>YouTube</p></div>
        <div><h3>{t("footer.links")}</h3><p><Link to="/about">{t("footer.about")}</Link></p><p><Link to="/publications">{t("footer.publications")}</Link></p></div>
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
