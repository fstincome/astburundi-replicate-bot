import { createFileRoute } from "@tanstack/react-router";
import { InteriorPage } from "@/components/site-shell";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact — AST Burundi" }, { name: "description", content: "Contactez l’Association pour la Solidarité au Travail au Burundi." },
    { property: "og:title", content: "Contact — AST Burundi" }, { property: "og:description", content: "Coordonnées et formulaire de contact de l’AST Burundi." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/contact" }] }), component: ContactPage,
});

function ContactPage() { return <InteriorPage title="Contactez-nous" eyebrow="Parlons de votre projet"><div className="contact-layout"><section><h2>Coordonnées</h2><p>Notre équipe est disponible pour toute demande concernant nos activités, partenariats et publications.</p><dl><dt>Téléphone</dt><dd>+257 61 55 64 67</dd><dt>Courriel</dt><dd>astburundi@gmail.com<br />info@astburundi.com</dd><dt>Réseaux sociaux</dt><dd>AST Burundi sur Facebook</dd></dl></section><form className="contact-form"><label>Nom complet<input name="name" type="text" /></label><label>Adresse e-mail<input name="email" type="email" /></label><label>Téléphone<input name="phone" type="tel" /></label><label>Message<textarea name="message" rows={6} /></label><button type="submit">Envoyer le message</button></form></div></InteriorPage>; }