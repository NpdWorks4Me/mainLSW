import React, { useEffect, useState } from 'react';

/**
 * DeferredHelmet
 *
 * Dynamically imports `Helmet` from `react-helmet-async` on the client and
 * renders it once available. This mirrors the DeferredHelmetProvider pattern
 * and avoids top-level module evaluation that can trigger TDZ/circular-init
 * issues in production bundles.
 */
export default function DeferredHelmet({ children, ...props }) {
  const [HelmetComp, setHelmetComp] = useState(null);

  useEffect(() => {
    let mounted = true;
    import('react-helmet-async')
      .then((mod) => {
        if (mounted) setHelmetComp(() => mod.Helmet);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load react-helmet-async Helmet:', err);
      });
    return () => { mounted = false; };
  }, []);

  if (!HelmetComp) return null;
  const H = HelmetComp;
  return <H {...props}>{children}</H>;
}
