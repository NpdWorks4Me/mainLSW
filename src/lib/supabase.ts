import { createClient } from '@supabase/supabase-js';
import { fetchRuntimeConfig } from './runtimeConfig';

let client = null;

async function initClient() {
  if (client) return client;
  // Try window injection
  if (typeof window !== 'undefined' && (window as any).__APP_CONFIG__) {
    const cfg = (window as any).__APP_CONFIG__;
    if (cfg.NEXT_PUBLIC_SUPABASE_URL && cfg.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      client = createClient(cfg.NEXT_PUBLIC_SUPABASE_URL, cfg.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      return client;
    }
  }
  // Try build-time env
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    return client;
  }
  // Fallback to fetch /config.json
  try {
    const cfg = await fetchRuntimeConfig();
    if (cfg.NEXT_PUBLIC_SUPABASE_URL && cfg.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      client = createClient(cfg.NEXT_PUBLIC_SUPABASE_URL, cfg.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      return client;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

// For client users that import sync, keep a lazy getter function
export async function getSupabase() {
  return await initClient();
}

// For components that want sync object, we can expose a placeholder (null) and encourage using getSupabase
export const supabase = null;
