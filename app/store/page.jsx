import React from 'react';
// Avoid importing Vite-specific PageHelmet (react-helmet/react-router) in Next server components
export const metadata = {
  title: 'Store | Little Space World',
  description: 'Find Little Space items and goodies',
};
import { getProducts } from '@/api/EcommerceApi';

// NOTE: For static export, we keep this page static (no 'force-dynamic')

export default async function StorePage() {
  let products = [];
  try {
    const res = await getProducts({ limit: 12 });
    products = res.products || [];
  } catch (e) {
    console.error('Failed to fetch products for store page:', e);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#05060a,#03111a)', color: 'white' }}>
      <main style={{ paddingTop: 48, paddingBottom: 48 }}>
        <header style={{ maxWidth: 1120, margin: '0 auto', padding: '0 16px 24px' }}>
          <h1 style={{ fontSize: 36, fontWeight: 700 }}>Store</h1>
          <p style={{ color: '#c4b1ff', marginTop: 8 }}>Handpicked items & collections for your Littlespace.</p>
        </header>
        <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 16px' }}>
          {products.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#a78bfa' }}>The shelves are being restocked! Check back soon ♡</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {products.map(p => (
                <article key={p.id} style={{ background: '#0f1724', padding: 12, borderRadius: 12 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{p.title}</h3>
                  <p style={{ color: '#c4b1ff' }}>{p.price_in_cents ? (p.price_in_cents / 100).toFixed(2) : ''} {p.currency}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
