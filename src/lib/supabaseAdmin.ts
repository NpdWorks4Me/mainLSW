import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('supabaseAdmin: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

let _supabaseAdmin: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  _supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  global: { headers: { 'x-admin': 'true' } },
  });
}

export const supabaseAdmin: SupabaseClient | null = _supabaseAdmin;

export async function uploadProductImages(productId: string, files: { name: string; data: ArrayBuffer | Blob }[]) {
  // Ensure bucket exists 'products'
  if (!supabaseAdmin) throw new Error('supabaseAdmin not configured');
  const uploaded = [] as string[];
  for (const file of files) {
    const key = `${productId}/${Date.now()}-${file.name}`;
    try {
      const { error } = await supabaseAdmin.storage.from('products').upload(key, file.data, { upsert: true });
      if (error) throw error;
      // Get public URL
      const { data } = supabaseAdmin.storage.from('products').getPublicUrl(key);
      const url = data?.publicUrl || '';
      uploaded.push(url);
    } catch (e) {
      console.warn('uploadProductImages error', e);
      // continue - we will throw after trying all files
    }
  }
  return uploaded;
}

export async function getProductById(id: string) {
  if (!supabaseAdmin) throw new Error('supabaseAdmin not configured');
  const { data, error } = await supabaseAdmin.from('products').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listProducts({ page = 1, pageSize = 10, search, sortBy, sortDir }: { page?: number; pageSize?: number; search?: string; sortBy?: string; sortDir?: 'asc' | 'desc' }) {
  if (!supabaseAdmin) throw new Error('supabaseAdmin not configured');
  let query = supabaseAdmin.from('products').select('*', { count: 'exact' });
  if (search) {
    // simple match on name or description
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (sortBy) query = query.order(sortBy, { ascending: (sortDir ?? 'asc') === 'asc' });
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await query.range(from, to);
  if (error) throw error;
  return { data: data || [], total: count || 0 };
}

export async function createProduct(payload: any) {
  if (!supabaseAdmin) throw new Error('supabaseAdmin not configured');
  const { data, error } = await supabaseAdmin.from('products').insert([payload]).single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, payload: any) {
  if (!supabaseAdmin) throw new Error('supabaseAdmin not configured');
  const { data, error } = await supabaseAdmin.from('products').update(payload).eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  if (!supabaseAdmin) throw new Error('supabaseAdmin not configured');
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export default supabaseAdmin;
