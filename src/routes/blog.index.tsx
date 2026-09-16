import { createFileRoute, Link } from "@tanstack/react-router";
import { InteriorPage } from "@/components/site-shell";
import { getBlogPosts } from "@/lib/public-content.functions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/blog/")({
  loader: () => getBlogPosts(),
  head: () => ({
    meta: [
      { title: "Blog et actualités — AST Burundi" },
      { name: "description", content: "Articles, actualités et récits de terrain de l’Association pour la Solidarité au Travail." },
      { property: "og:title", content: "Blog — AST Burundi" },
      { property: "og:description", content: "Nos actualités et récits de terrain au Burundi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
  errorComponent: () => <BlogFallback messageKey="blog.unavailable" />,
});

function BlogFallback({ messageKey }: { messageKey: "blog.empty" | "blog.unavailable" }) {
  const { t } = useI18n();
  return <InteriorPage title={t("blog.title")} eyebrow={t("blog.eyebrow")}><p>{t(messageKey)}</p></InteriorPage>;
}

const MONTHS = {
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

function BlogPage() {
  const posts = Route.useLoaderData();
  const { t, lang } = useI18n();

  return (
    <InteriorPage title={t("blog.title")} eyebrow={t("blog.eyebrow")}>
      <p className="section-intro">{t("blog.intro")}</p>
      <div className="blog-grid">
        {posts.length === 0 && <p>{t("blog.empty")}</p>}
        {posts.map((post) => {
          const date = new Date(post.published_on);
          return (
            <article className="blog-card" key={post.id}>
              {post.image_url && <img src={post.image_url} alt={post.title} loading="lazy" />}
              <div>
                <span className="blog-meta">
                  {date.getUTCDate()} {MONTHS[lang][date.getUTCMonth()]} {date.getUTCFullYear()} · {post.author}
                </span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <Link to="/blog/$slug" params={{ slug: post.slug }} className="action-link primary">
                  {t("blog.read")}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      <section className="page-cta compact">
        <div><h2>{t("blog.ctaTitle")}</h2></div>
        <Link to="/contact" className="action-link primary">{t("blog.ctaButton")}</Link>
      </section>
    </InteriorPage>
  );
}
