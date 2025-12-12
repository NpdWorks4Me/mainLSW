-- Migration: create products table with basic fields and RLS for admin
BEGIN;

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text,
  description text,
  price numeric DEFAULT 0,
  inventory integer DEFAULT 0,
  images text[] DEFAULT ARRAY[]::text[],
  variants jsonb DEFAULT '{}'::jsonb,
  category text,
  featured boolean DEFAULT FALSE,
  published boolean DEFAULT FALSE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow admin to select/insert/update/delete
CREATE POLICY "Admin full access to products" ON public.products
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin'));

-- Allow public select on published products for storefront (if needed)
CREATE POLICY "Public select published products" ON public.products
  FOR SELECT USING (published = TRUE OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin'));

COMMIT;
