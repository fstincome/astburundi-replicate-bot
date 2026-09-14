import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { InteriorPage } from "@/components/site-shell";
import { sendContactMessage } from "@/lib/public-content.functions";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
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
    <InteriorPage title={t("contact.title")} eyebrow={t("contact.eyebrow")}>
      <div className="contact-layout">
        <section>
          <h2>{t("contact.details")}</h2>
          <p>{t("contact.intro")}</p>
          <p>{t("contact.extra")}</p>
          <dl>
            <dt>{t("contact.phone")}</dt><dd><a className="contact-link" href="tel:+25761556467">+257 61 55 64 67</a></dd>
            <dt>{t("contact.email")}</dt><dd><a className="contact-link" href="mailto:astburundi@gmail.com">astburundi@gmail.com</a><br /><a className="contact-link" href="mailto:info@astburundi.com">info@astburundi.com</a></dd>
            <dt>{t("contact.social")}</dt><dd><a className="contact-link" href="https://www.facebook.com/profile.php?id=61556201796697" target="_blank" rel="noreferrer">{t("contact.socialValue")}</a></dd>
          </dl>
        </section>
        <form className="contact-form" onSubmit={onSubmit}>
          <label>{t("contact.name")}<input name="name" type="text" required /></label>
          <label>{t("contact.emailField")}<input name="email" type="email" required /></label>
          <label>{t("contact.phoneField")}<input name="phone" type="tel" /></label>
          <label>{t("contact.message")}<textarea name="message" rows={6} required /></label>
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? t("contact.sending") : t("contact.send")}
          </button>
          {status === "sent" && <p className="form-status">{t("contact.sent")}</p>}
          {status === "error" && <p className="form-status error">{t("contact.failed")}</p>}
        </form>
      </div>
    </InteriorPage>
  );
}
