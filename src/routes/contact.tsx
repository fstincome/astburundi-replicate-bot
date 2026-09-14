import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { InteriorPage } from "@/components/site-shell";
import { sendContactMessage } from "@/lib/public-content.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact — AST Burundi" }, { name: "description", content: "Contactez l’Association pour la Solidarité au Travail au Burundi." },
    { property: "og:title", content: "Contact — AST Burundi" }, { property: "og:description", content: "Coordonnées et formulaire de contact de l’AST Burundi." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/contact" }] }),
  component: ContactPage,
});

function ContactPage() {
  const send = useServerFn(sendContactMessage);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");
    try {
      await send({ data: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        message: String(formData.get("message") ?? ""),
      } });
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <InteriorPage title="Contactez-nous" eyebrow="Parlons de votre projet">
      <div className="contact-layout">
        <section>
          <h2>Coordonnées</h2>
          <p>Notre équipe est disponible pour toute demande concernant nos activités, partenariats et publications.</p>
          <dl>
            <dt>Téléphone</dt><dd>+257 61 55 64 67</dd>
            <dt>Courriel</dt><dd>astburundi@gmail.com<br />info@astburundi.com</dd>
            <dt>Réseaux sociaux</dt><dd>AST Burundi sur Facebook</dd>
          </dl>
        </section>
        <form className="contact-form" onSubmit={onSubmit}>
          <label>Nom complet<input name="name" type="text" required /></label>
          <label>Adresse e-mail<input name="email" type="email" required /></label>
          <label>Téléphone<input name="phone" type="tel" /></label>
          <label>Message<textarea name="message" rows={6} required /></label>
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Envoi…" : "Envoyer le message"}
          </button>
          {status === "sent" && <p className="form-status">Merci, votre message a bien été envoyé.</p>}
          {status === "error" && <p className="form-status error">L’envoi a échoué. Veuillez réessayer.</p>}
        </form>
      </div>
    </InteriorPage>
  );
}
