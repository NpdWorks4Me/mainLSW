/* @ts-nocheck */
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { supabaseAdmin } from '$lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export async function POST({ request }: { request: Request }) {
  console.log('Webhook received');

  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err?.message || err);
    return json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('Webhook received:', event.type);

  try {
    if (event.type === 'checkout.session.completed') {
      console.log('checkout.session.completed received');
      const session = event.data.object as Stripe.Checkout.Session;

      const metadataCart = session.metadata?.cart ? JSON.parse(String(session.metadata.cart)) : [];
      const stripePaymentIntentId = session.payment_intent as string | undefined;
      const stripeSessionId = session.id;
      const total = Number(session.amount_total || 0) / 100;
      const currency = session.currency || 'usd';

      try {
        const { data: orderData, error: orderErr } = await supabaseAdmin
          .from('orders')
          .upsert({ id: stripeSessionId, provider: 'stripe', raw: session, stripe_payment_intent_id: stripePaymentIntentId || null, status: 'paid', total, currency }, { onConflict: 'id' })
          .select()
          .single();

        if (orderErr) {
          console.warn('Failed to upsert order:', orderErr.message || orderErr);
          const errMsg = (orderErr && (orderErr.message || orderErr)) || '';
          if (errMsg.includes('relation "public.orders"') || errMsg.includes('does not exist') || (orderErr.code === '42P01')) {
            // Write the raw event to tmp/failed_webhooks.jsonl
            try {
              const fs = await import('fs');
              const path = await import('path');
              const tmpDir = path.join(process.cwd(), 'tmp');
              if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
              const outPath = path.join(tmpDir, 'failed_webhooks.jsonl');
              fs.appendFileSync(outPath, JSON.stringify({ id: stripeSessionId, type: event.type, session, received_at: new Date().toISOString() }) + '\n');
              console.log('Saved failed webhook to', outPath);
            } catch (fileErr) { console.warn('Failed to write failed webhook', fileErr); }
          }
        } else {
          const order = orderData;
          for (const item of (metadataCart || [])) {
            const variantId = item.variant_id;
            const quantity = Number(item.quantity || 1);
            const { data: variant, error: vErr } = await supabaseAdmin.from('product_variants').select('id, product_id, sku, price, inventory, product:product_id(product_name)').eq('id', variantId).maybeSingle();
            const price = (variant && variant.price) || 0;
            await supabaseAdmin.from('order_items').insert({ order_id: order.id, variant_id: variantId, product_id: variant?.product_id, sku: variant?.sku || null, quantity, price, total: price * quantity });
            if (variant && typeof variant.inventory === 'number') {
              const newInv = Math.max(0, variant.inventory - quantity);
              await supabaseAdmin.from('product_variants').update({ inventory: newInv }).eq('id', variant.id);
            }
          }
          console.log('Order created and items inserted for', order.id);
        }
      } catch (e) {
        console.warn('supabase upsert error', e);
      }
    }
  } catch (e: any) {
    console.warn('webhook handler failed', e?.message || e);
    return json({ ok: false, error: e?.message || 'error' }, { status: 500 });
  }

  return json({ ok: true });
}
