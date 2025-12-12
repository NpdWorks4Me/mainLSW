// src/server/webhooks/stripe.js
// Adapter that forwards Node req/res to a Next.js/Route POST handler (if present)
export default async function handler(req, res) {
  try {
    // Construct a Request like Next.js expects
    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost:3001'}`);
    const nextReq = new Request(url.toString(), {
      method: req.method,
      headers: req.headers,
      body: req.body,
    });

    // Try to import a SvelteKit route, then Next.js route as fallback. SvelteKit
    // `+server.ts` exports functions like POST/GET. Try that first so local
    // Vite dev server plugin can forward to SvelteKit handler when present.
    let POST = null;
    // Use an indirect import function to avoid build-time static analysis from
    // Vite/esbuild which would otherwise try to resolve server-only packages
    // (e.g. next, @sveltejs/kit) at dev startup.
    const dynamicImport = (p) => import(p);
    try {
      ({ POST } = await dynamicImport('../../routes/api/webhooks/stripe/+server'));
    } catch (e1) {
      try { ({ POST } = await dynamicImport('../../../app/api/webhooks/stripe/route')); } catch (e2) { /* noop */ }
    }

    if (typeof POST === 'function') {
      const nextRes = await POST(nextReq);
      // Forward headers
      nextRes.headers.forEach((value, key) => res.setHeader(key, value));
      res.statusCode = nextRes.status;
      const buf = Buffer.from(await nextRes.arrayBuffer());
      return res.end(buf.length ? buf : undefined);
    }

    // Fallback echo for dev
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, devFallback: true }));
  } catch (err) {
    console.error('[dev:stripe adapter] error', err);
    if (!res.headersSent) {
      res.writeHead(500);
      res.end('Internal adapter error');
    }
  }
}
