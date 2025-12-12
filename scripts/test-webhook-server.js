#!/usr/bin/env node
/*
  scripts/test-webhook-server.js
  Simple webhook server to locally test `app/api/webhooks/stripe/route.ts` logic.
  Usage:
    node ./scripts/test-webhook-server.js --port 3001
  Ensure STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY are set in env
*/
import http from 'http';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const port = Number(process.env.PORT || process.argv.find(a => a.startsWith('--port'))?.split('=')[1] || 3001);
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const args = process.argv.slice(2);
const skipVerify = args.includes('--no-sig') || args.includes('--skip-verify');
const writeFailed = args.includes('--write-failed');

if (!STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY in env');
  process.exit(2);
}
if (!STRIPE_WEBHOOK_SECRET) {
  if (!skipVerify) console.warn('Missing STRIPE_WEBHOOK_SECRET — signature validation will be skipped');
}

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-08-01' });
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function notFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'not found' }));
}

async function handleWebhook(req, res) {
  if (req.method !== 'POST') return notFound(res);
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', async () => {
    const buf = Buffer.concat(chunks).toString('utf8');
    let event;
  if (STRIPE_WEBHOOK_SECRET && !skipVerify) {
      const sig = req.headers['stripe-signature'] || '';
      try {
        event = stripe.webhooks.constructEvent(buf, String(sig), STRIPE_WEBHOOK_SECRET);
      } catch (error) {
        console.warn('invalid signature', error?.message || error);
        res.statusCode = 400;
        res.end(JSON.stringify({ ok: false, error: 'INVALID_SIGNATURE' }));
        return;
      }
  } else {
      try {
        event = JSON.parse(buf);
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ ok: false, error: 'INVALID_JSON' }));
        return;
      }
    }
    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('Received checkout.session.completed', session.id);
        // upsert order like the route
        // If SUPABASE keys are missing, save the event to tmp/failed_webhooks.jsonl for later reprocessing
        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
          if (writeFailed) {
            try {
              const fs = await import('fs');
              const path = await import('path');
              const tmpDir = path.join(process.cwd(), 'tmp');
              if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
              const outPath = path.join(tmpDir, 'failed_webhooks.jsonl');
              fs.appendFileSync(outPath, JSON.stringify({ id: session.id, type: event.type, session, received_at: new Date().toISOString() }) + '\n');
              console.log('Saved failed webhook to', outPath);
            } catch (fileErr) { console.warn('Failed to write failed webhook', fileErr); }
          } else {
            console.log('SUPABASE not configured; skipping upsert. Use --write-failed to persist the event.');
          }
        } else {
          try {
            const { data, error } = await supabaseAdmin.from('orders').upsert({ id: session.id, provider: 'stripe', raw: session }, { onConflict: 'id' }).select();
            if (error) {
              console.warn('supabase upsert error', error.message || JSON.stringify(error));
              if (writeFailed) {
                try {
                  const fs = await import('fs');
                  const path = await import('path');
                  const tmpDir = path.join(process.cwd(), 'tmp');
                  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
                  const outPath = path.join(tmpDir, 'failed_webhooks.jsonl');
                  fs.appendFileSync(outPath, JSON.stringify({ id: session.id, type: event.type, session, received_at: new Date().toISOString(), error: JSON.stringify(error) }) + '\n');
                  console.log('Saved failed webhook to', outPath);
                } catch (fileErr) { console.warn('Failed to write failed webhook', fileErr); }
              }
            } else {
              console.log('upserted order', data?.[0]?.id || data?.id);
            }
          } catch (e) {
            console.warn('supabase error', e?.message || e);
            if (writeFailed) {
              try {
                const fs = await import('fs');
                const path = await import('path');
                const tmpDir = path.join(process.cwd(), 'tmp');
                if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
                const outPath = path.join(tmpDir, 'failed_webhooks.jsonl');
                fs.appendFileSync(outPath, JSON.stringify({ id: session.id, type: event.type, session, received_at: new Date().toISOString(), error: String(e) }) + '\n');
                console.log('Saved failed webhook to', outPath);
              } catch (fileErr) { console.warn('Failed to write failed webhook', fileErr); }
            }
          }
        }
      }
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      console.warn('handler error', e?.message || e);
      res.statusCode = 500;
      res.end(JSON.stringify({ ok: false, error: e?.message || e }));
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/api/webhooks/stripe') return handleWebhook(req, res);
  notFound(res);
});

server.listen(port, () => {
  console.log(`Test webhook server listening on http://localhost:${port}/api/webhooks/stripe`);
  console.log('Ensure you run: stripe listen --forward-to http://localhost:' + port + '/api/webhooks/stripe');
});
