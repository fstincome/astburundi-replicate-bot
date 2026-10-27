import { createFileRoute, Link } from "@tanstack/react-router";
import { InteriorPage } from "@/components/site-shell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Faire un don — AST Burundi" },
      { name: "description", content: "Soutenez l’Association pour la Solidarité au Travail : virement bancaire, Mobile Money, Western Union et MoneyGram." },
      { property: "og:title", content: "Faire un don — AST Burundi" },
      { property: "og:description", content: "Soutenez les actions de l’AST au Burundi par un don." },
    ],
    links: [{ rel: "canonical", href: "/donate" }],
  }),
  component: DonatePage,
});

const HOLDER = "ASSOCIATION POUR LA SOLIDARITÉ AU TRAVAIL (AST)";
const TBD = "À compléter";

const banks = [
  { bank: "Banque (à préciser)", currency: "BIF" },
  { bank: "Banque (à préciser)", currency: "USD" },
];

function DonatePage() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const L = fr
    ? { eyebrow: "Soutenir l’AST", title: "Faire un don", h: "Soutenez notre mission", intro: "Votre contribution nous aide à accompagner les communautés burundaises dans la santé, l’éducation, la formation, la réinsertion et la protection de l’environnement.", holder: "Titulaire du compte", account: "Numéro de compte", other: "Autres moyens de donner", mm: "Mobile Money", end: "Chaque contribution, même modeste, fait la différence. Merci de croire en une société burundaise plus solidaire. Un reçu est délivré pour chaque don.", q: "Une question sur votre don ?", c: "Nous contacter" }
    : { eyebrow: "Support AST", title: "Donate", h: "Support our mission", intro: "Your contribution helps us support Burundian communities in health, education, training, reintegration and environmental protection.", holder: "Account holder", account: "Account number", other: "Other ways to give", mm: "Mobile Money", end: "Every contribution, however small, makes a difference. Thank you for believing in a more united Burundian society. A receipt is issued for every donation.", q: "A question about your donation?", c: "Contact us" };

  return (
    <InteriorPage eyebrow={L.eyebrow} title={L.title}>
      <section className="donate">
        <h2>{L.h}</h2>
        <p className="section-intro">{L.intro}</p>
        <div className="donate-banks">
          {banks.map((b) => (
            <article key={b.currency} className="donate-card">
              <header><h3>{b.bank}</h3><span className="donate-cur">{b.currency}</span></header>
              <dl>
                <dt>{L.holder}</dt><dd>{HOLDER}</dd>
                <dt>IBAN</dt><dd>{TBD}</dd>
                <dt>SWIFT/BIC</dt><dd>{TBD}</dd>
                <dt>{L.account}</dt><dd>{TBD}</dd>
              </dl>
            </article>
          ))}
        </div>
        <h2>{L.other}</h2>
        <div className="donate-other">
          <article className="donate-card"><h3>{L.mm}</h3><p>+257 61 55 64 67 (Lumicash)</p></article>
          <article className="donate-card"><h3>Western Union</h3><p>AST, Bujumbura, Burundi</p></article>
          <article className="donate-card"><h3>MoneyGram</h3><p>AST, Bujumbura, Burundi</p></article>
        </div>
        <p className="donate-thanks">{L.end}</p>
        <div className="page-cta"><h2>{L.q}</h2><Link to="/contact" className="action-link primary">{L.c}</Link></div>
      </section>
    </InteriorPage>
  );
}
