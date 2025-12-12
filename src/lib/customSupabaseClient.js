// Re-export the centralized supabase client from src/lib/supabase.js
import { supabase as centralSupabase } from './supabase';

// If a real Supabase client is available (settings provided via env), export it.
// Otherwise, provide a light-weight mock client that implements the subset of the
// API used by the app (auth, from, rpc, etc.) to avoid runtime crashes in dev/demo mode.
const makeMockSupabase = () => {
    const noopPromise = (data = null) => Promise.resolve({ data, error: null });
        const mockFrom = (resource) => {
            const builder = {
                select() { return this; },
                eq() { return this; },
                maybeSingle: async () => noopPromise(null),
                single: async () => noopPromise(null),
                insert: async () => noopPromise(null),
                upsert: async () => noopPromise(null),
                update: async () => noopPromise(null),
                delete: async () => noopPromise(null),
            };
            return builder;
        };

    return {
        auth: {
            async getSession() { return { data: { session: null }, error: null }; },
            onAuthStateChange(_handler) { return { data: { subscription: { unsubscribe: () => {} } } }; },
            async signUp() { return { data: null, error: new Error('Supabase not configured') }; },
            async signInWithPassword() { return { data: null, error: new Error('Supabase not configured') }; },
            async signOut() { return { error: null }; },
            async getUser() { return { data: { user: null } }; },
            async updateUser() { return { data: null }; },
        },
        from: mockFrom,
        rpc: async () => noopPromise(null),
        storage: {
            from: () => ({
                download: async () => { return { data: null, error: new Error('Supabase not configured') }; },
                getPublicUrl: () => ({ publicURL: '' }),
            })
        }
    };
};

const customSupabaseClient = centralSupabase || makeMockSupabase();

export default customSupabaseClient;

export { 
        customSupabaseClient,
        customSupabaseClient as supabase,
};
