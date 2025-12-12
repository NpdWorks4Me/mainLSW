export type RuntimeConfig = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  NEXT_PUBLIC_ADMIN_HOST?: string;
  NEXT_PUBLIC_MAIN_HOST?: string;
};

export async function fetchRuntimeConfig(): Promise<RuntimeConfig> {
  if (typeof window !== 'undefined' && (window as any).__APP_CONFIG__) {
    // Normalize runtime config by dropping empty string values
    const raw = (window as any).__APP_CONFIG__ as Record<string, any>;
    const normalized: Record<string, string> = {};
    for (const k of Object.keys(raw || {})) {
      const v = raw[k];
      if (v !== undefined && v !== null && String(v).trim() !== '') normalized[k] = String(v);
    }
    return normalized as RuntimeConfig;
  }
  try {
    const r = await fetch('/config.json', { cache: 'no-store' });
    if (!r.ok) return {};
    const raw = (await r.json()) as Record<string, any>;
    // Normalize to drop empty string keys
    const normalized: Record<string, string> = {};
    for (const k of Object.keys(raw || {})) {
      const v = raw[k];
      if (v !== undefined && v !== null && String(v).trim() !== '') normalized[k] = String(v);
    }
    return normalized as RuntimeConfig;
  } catch {
    return {};
  }
}
