CREATE TABLE public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.hero_slides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_slides TO authenticated;
GRANT ALL ON public.hero_slides TO service_role;

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hero slides are public"
ON public.hero_slides FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins manage hero slides"
ON public.hero_slides FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER hero_slides_updated_at
BEFORE UPDATE ON public.hero_slides
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.hero_slides (title, image_url, sort_order) VALUES
('Association pour la Solidarité au Travail (AST)', '/images/ast/hero.jpeg', 1),
('La solidarité au service des communautés', '/images/ast/services.jpg', 2),
('Agir ensemble pour un avenir durable', '/images/ast/gallery-2.jpeg', 3),
('Des initiatives concrètes au Burundi', '/images/ast/gallery-3.jpg', 4);