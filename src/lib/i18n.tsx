import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

const dict = {
  fr: {
    "nav.home": "ACCUEIL",
    "nav.about": "À PROPOS",
    "nav.realizations": "RÉALISATIONS",
    "nav.publications": "PUBLICATIONS",
    "nav.contact": "CONTACT",
    "footer.tagline": "Association pour la Solidarité au Travail",
    "footer.contact": "Nous contacter",
    "footer.follow": "Nous suivre",
    "footer.links": "Liens rapides",
    "footer.about": "À propos",
    "footer.publications": "Publications",
    "home.title": "Association pour la Solidarité au Travail (AST)",
    "home.gallery": "Notre galerie",
    "home.learnMore": "En savoir plus",
    "about.eyebrow": "Qui sommes-nous ?",
    "about.title": "À propos de l’AST",
    "about.historyTitle": "Historique",
    "about.history1":
      "L’Association pour la Solidarité au Travail, en sigle AST, est une organisation de droit burundais à but non lucratif et apolitique.",
    "about.history2":
      "Elle œuvre dans le développement social, la santé, l’éducation, la protection de l’environnement, la formation et la réinsertion.",
    "about.missionTitle": "Notre mission",
    "about.mission":
      "Contribuer à une société burundaise inclusive, caractérisée par un environnement socio-économique favorable et un accès équitable aux services essentiels.",
    "about.visionTitle": "Notre vision",
    "about.vision":
      "Une population solidaire, autonome et engagée dans la construction d’un développement durable au Burundi.",
    "about.valuesTitle": "Nos valeurs",
    "about.values":
      "Solidarité, inclusion, équité, responsabilité, respect des droits humains et protection des ressources naturelles.",
    "real.eyebrow": "Actions sur le terrain",
    "real.title": "Nos réalisations",
    "real.empty": "Aucune réalisation pour le moment.",
    "real.unavailable": "Les réalisations ne sont pas disponibles pour le moment.",
    "pub.eyebrow": "Annonces et documents",
    "pub.title": "Publications",
    "pub.empty": "Aucune publication pour le moment.",
    "pub.unavailable": "Les publications ne sont pas disponibles pour le moment.",
    "pub.document": "Consulter le document →",
    "contact.eyebrow": "Parlons de votre projet",
    "contact.title": "Contactez-nous",
    "contact.details": "Coordonnées",
    "contact.intro":
      "Notre équipe est disponible pour toute demande concernant nos activités, partenariats et publications.",
    "contact.phone": "Téléphone",
    "contact.email": "Courriel",
    "contact.social": "Réseaux sociaux",
    "contact.socialValue": "AST Burundi sur Facebook",
    "contact.name": "Nom complet",
    "contact.emailField": "Adresse e-mail",
    "contact.phoneField": "Téléphone",
    "contact.message": "Message",
    "contact.send": "Envoyer le message",
    "contact.sending": "Envoi…",
    "contact.sent": "Merci, votre message a bien été envoyé.",
    "contact.failed": "L’envoi a échoué. Veuillez réessayer.",
  },
  en: {
    "nav.home": "HOME",
    "nav.about": "ABOUT US",
    "nav.realizations": "OUR WORK",
    "nav.publications": "PUBLICATIONS",
    "nav.contact": "CONTACT",
    "footer.tagline": "Association for Solidarity at Work",
    "footer.contact": "Contact us",
    "footer.follow": "Follow us",
    "footer.links": "Quick links",
    "footer.about": "About",
    "footer.publications": "Publications",
    "home.title": "Association for Solidarity at Work (AST)",
    "home.gallery": "Our gallery",
    "home.learnMore": "Learn more",
    "about.eyebrow": "Who are we?",
    "about.title": "About AST",
    "about.historyTitle": "Our history",
    "about.history1":
      "The Association for Solidarity at Work (AST) is a non-profit, non-political organisation established under Burundian law.",
    "about.history2":
      "It works in social development, health, education, environmental protection, training and reintegration.",
    "about.missionTitle": "Our mission",
    "about.mission":
      "To contribute to an inclusive Burundian society with a favourable socio-economic environment and fair access to essential services.",
    "about.visionTitle": "Our vision",
    "about.vision":
      "A united, self-reliant population committed to building sustainable development in Burundi.",
    "about.valuesTitle": "Our values",
    "about.values":
      "Solidarity, inclusion, fairness, accountability, respect for human rights and protection of natural resources.",
    "real.eyebrow": "Action in the field",
    "real.title": "Our work",
    "real.empty": "No projects yet.",
    "real.unavailable": "Projects are unavailable right now.",
    "pub.eyebrow": "Notices and documents",
    "pub.title": "Publications",
    "pub.empty": "No publications yet.",
    "pub.unavailable": "Publications are unavailable right now.",
    "pub.document": "View the document →",
    "contact.eyebrow": "Let’s talk about your project",
    "contact.title": "Contact us",
    "contact.details": "Contact details",
    "contact.intro":
      "Our team is available for any request about our activities, partnerships and publications.",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.social": "Social media",
    "contact.socialValue": "AST Burundi on Facebook",
    "contact.name": "Full name",
    "contact.emailField": "Email address",
    "contact.phoneField": "Phone",
    "contact.message": "Message",
    "contact.send": "Send message",
    "contact.sending": "Sending…",
    "contact.sent": "Thank you, your message has been sent.",
    "contact.failed": "Sending failed. Please try again.",
  },
} as const;

export type TKey = keyof (typeof dict)["fr"];

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string }>({
  lang: "fr",
  setLang: () => {},
  t: (k) => dict.fr[k],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = window.localStorage.getItem("ast-lang");
    if (stored === "en" || stored === "fr") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(next: Lang) {
    setLangState(next);
    window.localStorage.setItem("ast-lang", next);
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: (k) => dict[lang][k] }}>{children}</LangContext.Provider>
  );
}

export function useI18n() {
  return useContext(LangContext);
}
