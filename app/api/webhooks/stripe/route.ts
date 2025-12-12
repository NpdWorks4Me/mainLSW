import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  return NextResponse.json({ ok: false, error: 'Webhook removed; use SvelteKit route' }, { status: 410 });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'Webhook removed; use SvelteKit route' }, { status: 410 });
}
