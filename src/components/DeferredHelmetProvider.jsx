import React, { useEffect, useState } from 'react';

/**
 * DeferredHelmetProvider
 *
 * Dynamically imports `react-helmet-async` on the client inside a useEffect so
 * the library's module initialization does not run during initial module
 * evaluation. This avoids a class of TDZ/circular-init errors caused by
 * bundlers reordering module execution in production builds.
 */
export default function DeferredHelmetProvider({ children }) {
  const [Provider, setProvider] = useState(null);

  useEffect(() => {
    let mounted = true;
    // Import inside effect to defer module initialization until after React
    // has mounted on the client.
    import('react-helmet-async')
      .then((mod) => {
        if (mounted) setProvider(() => mod.HelmetProvider);
      })
      .catch((err) => {
        // Fail gracefully; we still render children if provider fails to load
        // (helps diagnostics in production preview environments).
        // eslint-disable-next-line no-console
        console.error('Failed to load react-helmet-async:', err);
      });
    return () => { mounted = false; };
  }, []);

  if (!Provider) return <>{children}</>;

  const P = Provider;
  return <P>{children}</P>;
}
