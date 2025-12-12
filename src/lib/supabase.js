import { createClient } from '@supabase/supabase-js';

// Centralized Supabase client: prefer environment variables for configuration.
// Vite exposes env vars via import.meta.env.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

console.log('Supabase Config:', { 
  url: supabaseUrl ? 'Set' : 'Missing', 
  key: supabaseAnonKey ? 'Set' : 'Missing',
  fullUrl: supabaseUrl
});

// Export a function to create an ad-hoc client and a shared client (null if not configured).
export const createSupabaseClient = (url, key) => {
    if (!url || typeof url !== 'string' || !url.trim()) {
        console.error('createSupabaseClient: Invalid URL', url);
        return null;
    }
    if (!key || typeof key !== 'string' || !key.trim()) {
        console.error('createSupabaseClient: Invalid Key');
        return null;
    }
    try {
        return createClient(url, key);
    } catch (e) {
        console.error('createSupabaseClient: createClient threw error', e);
        return null;
    }
};

let client = null;
try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
    console.log('Initializing Supabase client...');
    client = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized.');
  } else {
    console.warn('Supabase credentials missing or invalid in src/lib/supabase.js', { url: supabaseUrl });
  }
} catch (e) {
  console.error('Supabase initialization failed:', e);
}

export const supabase = client;