CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT 'APPEL D''OFFRES',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  published_on date NOT NULL DEFAULT current_date,
  document_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.publications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.publications TO authenticated;
GRANT ALL ON public.publications TO service_role;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Publications are public" ON public.publications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage publications" ON public.publications FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER publications_updated_at BEFORE UPDATE ON public.publications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.realizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.realizations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.realizations TO authenticated;
GRANT ALL ON public.realizations TO service_role;
ALTER TABLE public.realizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Realizations are public" ON public.realizations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage realizations" ON public.realizations FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER realizations_updated_at BEFORE UPDATE ON public.realizations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site content is public" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage site content" ON public.site_content FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.publications (label, title, description, published_on, document_url, sort_order) VALUES
('APPEL D''OFFRES 01', 'Recrutement d''un consultant ou cabinet pour l''élaboration d''un plan de suivi-évaluation', 'L''AST invite les candidats qualifiés à consulter les termes de référence de cet appel d''offres.', '2024-09-30', 'https://astburundi.com/publication.php', 1),
('APPEL D''OFFRES 02', 'Recrutement d''un consultant-cabinet pour l''élaboration du système de communication interne', 'L''AST invite les candidats qualifiés à consulter les termes de référence de cet appel d''offres.', '2024-09-30', 'https://astburundi.com/publication.php', 2),
('APPEL D''OFFRES 03', 'Recrutement d''un consultant-cabinet pour l''élaboration du système de gestion des bénévoles', 'L''AST invite les candidats qualifiés à consulter les termes de référence de cet appel d''offres.', '2024-09-30', 'https://astburundi.com/publication.php', 3);

INSERT INTO public.realizations (title, subtitle, description, image_url, sort_order) VALUES
('Pépinière communautaire', 'Projet environnemental', 'Arrachage et préparation des plants par les jeunes membres de l''AST en vue de leur mise en terre.', '/images/ast/gallery-1.png', 1),
('Arbre Croissance Agro Écologique', 'Buganda, Cibitoke — 18 novembre 2024', 'Lancement du projet ACAE avec les partenaires et communautés bénéficiaires de la commune Buganda.', '/images/ast/gallery-2.jpeg', 2),
('Retraite du comité exécutif', 'Novembre 2024', 'Session de travail du comité exécutif et du personnel consacrée aux objectifs et à la planification de l''organisation.', '/images/ast/gallery-3.jpg', 3);

INSERT INTO public.site_content (key, title, body, image_url, sort_order) VALUES
('hero', 'Association pour la Solidarité au Travail (AST)', '', '/images/ast/hero.jpeg', 0),
('card_mission', 'Mission', 'avoir une société Burundaise inclusive, caractérisée par un environnement socio-économique inclusif, par l''accès à l''éducation, aux soins de santé et aux services judiciaires équitables pour toutes les couches de la population.', '/images/ast/services.jpg', 1),
('card_domaine', 'Domaine d''intervention', '(1) Promouvoir la santé sexuelle et reproductive, (2) Protection de droit de l''homme, (3) Promouvoir la protection de l''environnement, (4) Promouvoir l''entreprenariat pour le jeune et femme ; (5) Promouvoir l''éducation pour tous', '/images/ast/services.jpg', 2),
('card_historique', 'Historique', 'L''Association pour la Solidarité au Travail, en sigle AST, est une organisation de droit Burundais à but non lucratif et apolitique, œuvrant dans le domaine du Développement social, de la Santé, de l''Education, de la Protection de l''Environnement, de la Formation et de la réinsertion.', '/images/ast/services.jpg', 3);