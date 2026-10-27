ALTER TABLE public.publications ADD COLUMN category text NOT NULL DEFAULT 'Appels d’offres', ADD COLUMN is_published boolean NOT NULL DEFAULT true, ADD COLUMN image_url text NOT NULL DEFAULT '', ADD COLUMN rich_content text NOT NULL DEFAULT '';
ALTER TABLE public.blog_posts ADD COLUMN category text NOT NULL DEFAULT 'Actualités', ADD COLUMN rich_content text NOT NULL DEFAULT '';
DROP POLICY "Publications are public" ON public.publications;
CREATE POLICY "Publications are public" ON public.publications FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE INDEX publications_category_idx ON public.publications (category);
CREATE INDEX blog_posts_category_idx ON public.blog_posts (category);