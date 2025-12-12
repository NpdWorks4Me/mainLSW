import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
  if (!STRIPE_SECRET_KEY) return NextResponse.json({ error: 'NO_STRIPE_KEY' }, { status: 400 });
  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
  try {
    const body = await req.json();
    const { items, line_items, success_url, cancel_url, mode = 'payment', metadata } = body;

    let finalLineItems = line_items;
    if ((!Array.isArray(finalLineItems) || finalLineItems.length === 0) && Array.isArray(items) && items.length > 0) {
      // Map product variant ids to stripe price_data using supabase
      const variantIds = items.map(i => i.variant_id);
      const { data: variants, error } = await supabaseAdmin.from('product_variants').select('id, product_id, sku, price, currency').in('id', variantIds);
      if (error) return NextResponse.json({ error: 'FAILED_FETCH_VARIANTS', details: error.message }, { status: 500 });
      const priceMap = {};
      for (const v of variants || []) priceMap[v.id] = v;
      finalLineItems = items.map(it => {
        const v = priceMap[it.variant_id];
        const unitAmount = Math.round((v?.price || 0) * 100);
        return {
          price_data: {
            currency: v?.currency || 'usd',
            unit_amount: unitAmount,
            product_data: {
              name: `SKU: ${v?.sku || it.variant_id}`,
            }
          },
          quantity: Number(it.quantity) || 1,
        };
      });
    }
    if (!Array.isArray(finalLineItems) || finalLineItems.length === 0) return NextResponse.json({ error: 'INVALID_LINE_ITEMS' }, { status: 400 });
    const session = await stripe.checkout.sessions.create({
      line_items: finalLineItems,
      mode,
      success_url: success_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/cancel`,
      metadata: metadata || (Array.isArray(items) ? { cart: JSON.stringify(items) } : {}),
    } as any);
    return NextResponse.json({ url: session.url, id: session.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
  }
}
