import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { RuntimeConfig } from './runtimeConfig';

export function createSupabaseClientFromConfig(cfg: RuntimeConfig): SupabaseClient | null {
  const url = cfg.NEXT_PUBLIC_SUPABASE_URL || (process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined);
  const anonKey = cfg.NEXT_PUBLIC_SUPABASE_ANON_KEY || (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined);
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

export const supabaseBrowser = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, detectSessionInUrl: false } }) : null;

export default supabaseBrowser;
