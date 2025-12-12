-- 2025-12_create_orders_and_order_items.sql
-- Creates orders and order_items tables for Stripe/hostinger migrations
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  provider TEXT,
  status TEXT,
  total NUMERIC(12,2),
  currency TEXT,
  raw JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT,
  variant_id TEXT,
  sku TEXT,
  quantity INTEGER DEFAULT 1,
  price NUMERIC(12,2),
  total NUMERIC(12,2)
);

CREATE INDEX IF NOT EXISTS idx_orders_provider ON public.orders(provider);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Add a unique index on stripe session
CREATE UNIQUE INDEX IF NOT EXISTS uniq_orders_stripe_session ON public.orders(stripe_session_id);
