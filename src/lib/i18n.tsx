import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

const dict = {
  fr: {
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.realizations": "Réalisations",
    "nav.publications": "Publications",
    "nav.contact": "Contact",
    "footer.tagline": "Association pour la Solidarité au Travail",
    "footer.contact": "Nous contacter",
    "footer.follow": "Nous suivre",
    "footer.links": "Liens rapides",
    "footer.about": "À propos",
    "footer.publications": "Publications",
    "home.title": "Association pour la Solidarité au Travail (AST)",
    "home.intro":
      "Nous accompagnons les communautés burundaises par des actions concrètes en faveur de l’inclusion, de l’autonomie et du développement durable.",
    "home.discover": "Découvrir l’AST",
    "home.contactUs": "Nous contacter",
    "home.gallery": "Notre galerie",
    "home.allProjects": "Voir toutes nos réalisations",
    "home.learnMore": "En savoir plus",
    "about.eyebrow": "Qui sommes-nous ?",
    "about.title": "À propos de l’AST",
    "about.historyTitle": "Historique",
    "about.history1":
      "L’Association pour la Solidarité au Travail, en sigle AST, est une organisation de droit burundais à but non lucratif et apolitique.",
    "about.history2":
      "Elle œuvre dans le développement social, la santé, l’éducation, la protection de l’environnement, la formation et la réinsertion.",
    "about.commitment":
      "Au plus près des réalités locales, nous construisons nos projets avec les communautés et nos partenaires afin d’apporter des réponses durables aux besoins prioritaires.",
    "about.actions": "Voir nos réalisations",
    "about.join": "Échangeons ensemble",
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
    "real.intro":
      "Chaque initiative répond à un besoin identifié avec les communautés. Découvrez quelques actions qui traduisent notre engagement sur le terrain.",
    "real.ctaTitle": "Construisons de nouvelles solutions ensemble",
    "real.ctaText":
      "Vous souhaitez soutenir une initiative, proposer un partenariat ou en savoir plus sur nos activités ? Notre équipe est à votre écoute.",
    "real.ctaButton": "Devenir partenaire",
    "real.empty": "Aucune réalisation pour le moment.",
    "real.unavailable": "Les réalisations ne sont pas disponibles pour le moment.",
    "pub.eyebrow": "Annonces et documents",
    "pub.title": "Publications",
    "pub.intro":
      "Retrouvez ici nos avis, appels d’offres et documents utiles. Chaque publication précise les informations nécessaires et les échéances à retenir.",
    "pub.help": "Vous recherchez un document ou une information complémentaire ?",
    "pub.contact": "Contacter notre équipe",
    "pub.empty": "Aucune publication pour le moment.",
    "pub.unavailable": "Les publications ne sont pas disponibles pour le moment.",
    "pub.document": "Consulter le document →",
    "contact.eyebrow": "Parlons de votre projet",
    "contact.title": "Contactez-nous",
    "contact.details": "Coordonnées",
    "contact.intro":
      "Notre équipe est disponible pour toute demande concernant nos activités, partenariats et publications.",
    "contact.extra":
      "Écrivez-nous en précisant l’objet de votre demande. Nous vous répondrons dans les meilleurs délais.",
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
    "nav.home": "Home",
    "nav.about": "About us",
    "nav.realizations": "Our work",
    "nav.publications": "Publications",
    "nav.contact": "Contact",
    "footer.tagline": "Association for Solidarity at Work",
    "footer.contact": "Contact us",
    "footer.follow": "Follow us",
    "footer.links": "Quick links",
    "footer.about": "About",
    "footer.publications": "Publications",
    "home.title": "Association for Solidarity at Work (AST)",
    "home.intro":
      "We support Burundian communities through practical action promoting inclusion, self-reliance and sustainable development.",
    "home.discover": "Discover AST",
    "home.contactUs": "Contact us",
    "home.gallery": "Our gallery",
    "home.allProjects": "View all our work",
    "home.learnMore": "Learn more",
    "about.eyebrow": "Who are we?",
    "about.title": "About AST",
    "about.historyTitle": "Our history",
    "about.history1":
      "The Association for Solidarity at Work (AST) is a non-profit, non-political organisation established under Burundian law.",
    "about.history2":
      "It works in social development, health, education, environmental protection, training and reintegration.",
    "about.commitment":
      "Working closely with local communities, we develop projects with residents and partners to provide lasting responses to priority needs.",
    "about.actions": "View our work",
    "about.join": "Let’s talk",
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
    "real.intro":
      "Every initiative addresses a need identified with local communities. Explore some of the projects that reflect our work in the field.",
    "real.ctaTitle": "Let’s build new solutions together",
    "real.ctaText":
      "Would you like to support an initiative, propose a partnership or learn more about our work? Our team is ready to listen.",
    "real.ctaButton": "Become a partner",
    "real.empty": "No projects yet.",
    "real.unavailable": "Projects are unavailable right now.",
    "pub.eyebrow": "Notices and documents",
    "pub.title": "Publications",
    "pub.intro":
      "Find our notices, calls for tenders and useful documents here. Each publication includes the key information and deadlines to remember.",
    "pub.help": "Looking for a document or more information?",
    "pub.contact": "Contact our team",
    "pub.empty": "No publications yet.",
    "pub.unavailable": "Publications are unavailable right now.",
    "pub.document": "View the document →",
    "contact.eyebrow": "Let’s talk about your project",
    "contact.title": "Contact us",
    "contact.details": "Contact details",
    "contact.intro":
      "Our team is available for any request about our activities, partnerships and publications.",
    "contact.extra":
      "Write to us and tell us the purpose of your enquiry. We will respond as soon as possible.",
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
