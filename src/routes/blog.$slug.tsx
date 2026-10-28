import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { InteriorPage } from "@/components/site-shell";
import { getBlogPost } from "@/lib/public-content";
import { useI18n } from "@/lib/i18n";
import { RichContent } from "@/components/rich-content";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getBlogPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article introuvable — AST Burundi" }, { name: "description", content: "Cet article AST Burundi n’est pas disponible." }, { property: "og:title", content: "Article introuvable — AST Burundi" }, { property: "og:description", content: "Cet article AST Burundi n’est pas disponible." }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.title} — Blog AST Burundi` },
        { name: "description", content: loaderData.excerpt || loaderData.title },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.excerpt || loaderData.title },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(/^https:\/\//i.test(loaderData.image_url) ? [{ property: "og:image", content: loaderData.image_url }, { name: "twitter:image", content: loaderData.image_url }] : []),
      ],
      links: [{ rel: "canonical", href: `/blog/${loaderData.slug}` }],
    };
  },
  component: BlogPostPage,
  notFoundComponent: () => <PostFallback messageKey="blog.missing" />,
  errorComponent: () => <PostFallback messageKey="blog.unavailable" />,
});

function PostFallback({ messageKey }: { messageKey: "blog.missing" | "blog.unavailable" }) {
  const { t } = useI18n();
  return (
    <InteriorPage title={t("blog.title")} eyebrow={t("blog.eyebrow")}>
      <p>{t(messageKey)}</p>
      <Link to="/blog" className="action-link primary">{t("blog.back")}</Link>
    </InteriorPage>
  );
}

function BlogPostPage() {
  const post = Route.useLoaderData();
  const { t, lang } = useI18n();
  const date = new Date(post.published_on);

  return (
    <InteriorPage title={post.title} eyebrow={t("blog.eyebrow")}>
      <article className="blog-article">
        <span className="editorial-category">{post.category}</span>
        <p className="blog-meta">
          {date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })} · {post.author}
        </p>
        {post.image_url && <img src={post.image_url} alt={post.title} />}
        {post.excerpt && <p className="blog-excerpt">{post.excerpt}</p>}
        <RichContent value={post.rich_content} fallback={post.body} />
      </article>
      <div className="page-actions">
        <Link to="/blog" className="action-link secondary">{t("blog.back")}</Link>
        <Link to="/contact" className="action-link primary">{t("blog.ctaButton")}</Link>
      </div>
    </InteriorPage>
  );
}
