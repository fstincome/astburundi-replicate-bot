CREATE TABLE public.text_overrides (
  key text PRIMARY KEY,
  fr text NOT NULL DEFAULT '',
  en text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.text_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.text_overrides TO authenticated;
GRANT ALL ON public.text_overrides TO service_role;
ALTER TABLE public.text_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Texts are public" ON public.text_overrides FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage texts" ON public.text_overrides FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route text NOT NULL,
  label_fr text NOT NULL,
  label_en text NOT NULL DEFAULT '',
  parent_id uuid REFERENCES public.menu_items(id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Menu is public" ON public.menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage menu" ON public.menu_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));