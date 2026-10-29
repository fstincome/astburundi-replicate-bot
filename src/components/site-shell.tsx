import { Link } from "@tanstack/react-router";
import { ChevronDown, Heart } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { useMenu, type MenuItem } from "@/lib/menu";

function MenuLink({ item, label }: { item: MenuItem; label: ReactNode }) {
  if (/^https?:\/\//.test(item.route)) return <a href={item.route} target="_blank" rel="noopener noreferrer">{label}</a>;
  return (
    <Link to={item.route as "/"} activeProps={{ className: "active" }} activeOptions={{ exact: item.route === "/" }}>
      {label}
    </Link>
  );
}

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
  const { t, lang } = useI18n();
  const menu = useMenu();
  const label = (i: MenuItem) => (lang === "en" && i.label_en.trim()) || i.label_fr;
  return (
    <header className="site-header">
      <div className="site-nav">
        <Link to="/" aria-label="AST">
          <img src="/images/ast/logo.png" alt="Logo AST" className="site-logo" />
        </Link>
        <nav aria-label="Navigation" className="desktop-nav">
          {menu.map((item) =>
            item.children.length ? (
              <div key={item.id} className="nav-group">
                <MenuLink item={item} label={<>{label(item)}<ChevronDown size={14} aria-hidden="true" /></>} />
                <div className="nav-sub">
                  {item.children.map((c) => <MenuLink key={c.id} item={c} label={label(c)} />)}
                </div>
              </div>
            ) : (
              <MenuLink key={item.id} item={item} label={label(item)} />
            ),
          )}
        </nav>
        <div className="header-actions">
          <LanguageSwitch />
          <Link to="/donate" className="donate-btn">{t("nav.donate")}</Link>
        </div>
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
      <div className="copyright">
        <p className="copyright-left">Copyright © {new Date().getFullYear()} AST Burundi. {t("footer.rights")}</p>
        <p className="copyright-right">
          {t("footer.madeWith")}
          <Heart className="made-heart" aria-hidden="true" />
          {t("footer.by")}
          <a className="credit-link" href="https://www.sightnetwork.org/" target="_blank" rel="noopener noreferrer">SIGHT AFRICA</a>
        </p>
      </div>
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
