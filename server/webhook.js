#!/usr/bin/env node
import express from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const PORT = Number(process.env.WEBHOOK_PORT || process.env.PORT || 4000);
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_STRIPE_SECRET || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY in env');
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-08-01' });
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const app = express();
// Use raw body parser for Stripe signature verification
app.post('/webhooks/stripe', express.raw({ type: '*/*' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] || '';
  const buf = req.body;
  let event;
  try {
    if (STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(buf, String(sig), STRIPE_WEBHOOK_SECRET);
    } else {
      // If webhook secret not set, fall back to JSON parse (for local test only)
      event = JSON.parse(buf.toString('utf8'));
    }
  } catch (err) {
    console.error('Invalid signature or JSON', err?.message || err);
    return res.status(400).json({ ok: false, error: 'INVALID_SIGNATURE_OR_JSON' });
  }

  console.log('Webhook received:', event.type);
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const stripeSessionId = session.id;
      const stripePaymentIntentId = session.payment_intent || null;
      const total = Number(session.amount_total || 0) / 100;
      const currency = session.currency || 'usd';
      const metadataCart = session.metadata?.cart ? JSON.parse(session.metadata.cart) : [];
      try {
        const { data: orderData, error: orderErr } = await supabaseAdmin
          .from('orders')
          .upsert({ id: stripeSessionId, provider: 'stripe', raw: session, stripe_payment_intent_id: stripePaymentIntentId, status: 'paid', total, currency }, { onConflict: 'id' })
          .select()
          .single();
        if (orderErr) {
          console.warn('Failed to upsert order', orderErr);
          if (orderErr.message && (orderErr.message.includes('relation "public.orders"') || orderErr.message.includes('does not exist'))) {
            // persist event
            try {
              const tmpDir = path.join(process.cwd(), 'tmp');
              if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
              const outPath = path.join(tmpDir, 'failed_webhooks.jsonl');
              fs.appendFileSync(outPath, JSON.stringify({ id: stripeSessionId, type: event.type, session, received_at: new Date().toISOString() }) + '\n');
              console.log('Saved failed webhook to', outPath);
            } catch (e) { console.warn('Failed to write failed webhook', e); }
          }
        } else {
          const order = orderData;
          for (const item of (metadataCart || [])) {
            const variantId = item.variant_id;
            const quantity = Number(item.quantity || 1);
            const { data: variant } = await supabaseAdmin.from('product_variants').select('id, product_id, sku, price, inventory').eq('id', variantId).maybeSingle();
            const price = variant?.price || (item.price || 0);
            await supabaseAdmin.from('order_items').insert({ order_id: order.id, variant_id: variant?.id || variantId, product_id: variant?.product_id || null, sku: variant?.sku || null, quantity, price, total: price * quantity });
            if (variant && typeof variant.inventory === 'number') {
              const newInv = Math.max(0, variant.inventory - quantity);
              await supabaseAdmin.from('product_variants').update({ inventory: newInv }).eq('id', variant.id);
            }
          }
          console.log('Processed order', order.id);
        }
      } catch (e) {
        console.warn('Supabase error', e?.message || e);
      }
    }
  } catch (e) {
    console.error('Webhook handler error', e?.message || e);
    return res.status(500).json({ ok: false, error: 'handler error' });
  }

  return res.json({ ok: true });
});

app.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`Webhook server listening on http://localhost:${PORT}`);
});
