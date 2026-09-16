CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT 'AST Burundi',
  is_published boolean NOT NULL DEFAULT true,
  published_on date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are public" ON public.blog_posts
  FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Admins read all posts" ON public.blog_posts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert posts" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update posts" ON public.blog_posts
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete posts" ON public.blog_posts
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER blog_posts_set_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.blog_posts (slug, title, excerpt, body, image_url, published_on) VALUES
('solidarite-au-coeur-des-communautes', 'La solidarité au cœur des communautés', 'Retour sur nos activités d’accompagnement des groupements communautaires au Burundi.', E'L’AST accompagne chaque année des groupements communautaires dans la mise en place d’activités génératrices de revenus.\n\nNos équipes assurent la formation, le suivi et l’appui matériel nécessaires pour que chaque initiative devienne durable.', '/images/ast/gallery-2.jpeg', CURRENT_DATE),
('environnement-et-reboisement', 'Environnement et reboisement : un engagement durable', 'Des pépinières communautaires pour restaurer les collines et protéger les sols.', E'La protection de l’environnement fait partie des priorités de l’AST.\n\nAvec les communautés, nous installons des pépinières, sensibilisons les ménages et suivons les plantations pour garantir leur reprise.', '/images/ast/gallery-3.jpg', CURRENT_DATE);