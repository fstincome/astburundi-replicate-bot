import { createFileRoute } from "@tanstack/react-router";
import { InteriorPage } from "@/components/site-shell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "À propos de l’AST Burundi | About AST" },
    { name: "description", content: "Histoire, mission, vision et domaines d’intervention de l’Association pour la Solidarité au Travail." },
    { property: "og:title", content: "À propos de l’AST Burundi" },
    { property: "og:description", content: "Découvrez l’organisation burundaise AST, son histoire et ses engagements." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/about" }] }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();
  return <InteriorPage title={t("about.title")} eyebrow={t("about.eyebrow")}>
    <section className="story-grid"><img src="/images/ast/gallery-3.jpg" alt="AST Burundi" /><div><h2>{t("about.historyTitle")}</h2><p>{t("about.history1")}</p><p>{t("about.history2")}</p></div></section>
    <section className="values-grid">
      <article><h2>{t("about.missionTitle")}</h2><p>{t("about.mission")}</p></article>
      <article><h2>{t("about.visionTitle")}</h2><p>{t("about.vision")}</p></article>
      <article><h2>{t("about.valuesTitle")}</h2><p>{t("about.values")}</p></article>
    </section>
  </InteriorPage>;
}
