"use client";
import React, { ReactNode, useEffect, useState } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchRuntimeConfig } from '@/lib/runtimeConfig';
import { createSupabaseClientFromConfig } from '@/lib/supabaseClient';

export default function SupabaseProvider({ children, initialSession = null }: { children: ReactNode; initialSession?: any; }) {
  const [client, setClient] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const cfg = await fetchRuntimeConfig();
      const supabase = createSupabaseClientFromConfig(cfg);
      if (mounted) {
        setClient(supabase);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Loading configuration…</div>;
  if (!client) return <div role="alert">Admin temporarily unavailable — missing configuration.</div>;

  return <SessionContextProvider supabaseClient={client as any} initialSession={initialSession}>{children}</SessionContextProvider>;
}
