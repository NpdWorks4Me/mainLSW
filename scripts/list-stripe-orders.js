#!/usr/bin/env node
/* Usage: node ./scripts/list-stripe-orders.js */
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(2);
}
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
(async () => {
  const { data, error } = await supabaseAdmin.from('orders').select('*').eq('provider', 'stripe').order('created_at', { ascending: false }).limit(10);
  if (error) console.error('Error', error);
  else console.log('Latest stripe orders:', JSON.stringify(data, null, 2));
})();
