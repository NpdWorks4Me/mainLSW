"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getProducts, formatCurrency } from '@/api/EcommerceApi';
import confetti from 'canvas-confetti';
import LazyImage from '@/components/LazyImage';
import { Button } from '@/components/ui/button';
// Avoiding global tailwind/postcss import to prevent dev server postcss errors
// until we finish migrating Vite -> Next styling and PostCSS config.

import { useCart } from '@/hooks/useCart';

// Reuse createDescriptionSnippet helper adapted from Vite app version
const createDescriptionSnippet = (html, maxLength = 85) => {
  if (!html) return 'So cute! You need this ♡';
  try {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    let text = tmp.textContent || tmp.innerText || "";
    text = text.replace(/\s+/g, ' ').trim();
    return text.length <= maxLength ? text : text.slice(0, text.lastIndexOf(' ', maxLength)) + '...';
  } catch (e) {
    return html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').slice(0, maxLength) + '...';
  }
};

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const displayVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  if (!displayVariant) return null;

  const hasSale = displayVariant.sale_price_in_cents && displayVariant.sale_price_in_cents < displayVariant.price_in_cents;
  const price = formatCurrency(hasSale ? displayVariant.sale_price_in_cents : displayVariant.price_in_cents, displayVariant.currency_info);
  const oldPrice = hasSale ? formatCurrency(displayVariant.price_in_cents, displayVariant.currency_info) : null;

  const handleAddToCart = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (product.variants.length > 1) { router.push(`/product/${product.id}`); return; }

    await addToCart(product, displayVariant, 1);
    toast({ title: 'Added to basket!', description: `${product.title} is coming home!` });
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.7 }, colors: ['#FFB3D9', '#D8B4FE', '#A7F3D0'] });
  };

  const cardDescription = product.title.toLowerCase().includes('basic starter pack') ? 'LittleSpace Kit with essentials for your journey.' : createDescriptionSnippet(product.description);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="relative group h-full"
    >
      <Link href={`/product/${product.id}`} className="block h-full">
        <div className="product-card-glow h-full flex flex-col bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 rounded-3xl overflow-hidden hover:border-pink-400/50 transition-all duration-300 shadow-lg hover:shadow-pink-500/10">
          {product.ribbon_text && (
            <div className="absolute top-4 left-0 z-20">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-r-full shadow-lg border-t border-b border-white/20">{product.ribbon_text}</div>
            </div>
          )}

          <div className="relative aspect-[4/4] overflow-hidden bg-black/20">
            <LazyImage src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

            <div className="absolute bottom-3 right-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-white text-black p-2 rounded-full shadow-lg"><ShoppingCart className="w-4 h-4" /></div>
            </div>
          </div>

          <div className="p-5 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1 mb-2">{product.title}</h3>
            <p className="text-purple-200/70 text-xs leading-relaxed line-clamp-2 mb-4 min-h-[2.5em]">{cardDescription}</p>
            <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-white/5">
              <div className="flex flex-col">{hasSale && <span className="line-through text-gray-500 text-xs font-medium">{oldPrice}</span>}<span className="text-lg font-bold text-white drop-shadow-md">{price}</span></div>
              <Button onClick={handleAddToCart} size="sm" className="rounded-xl bg-white/10 hover:bg-pink-500 hover:text-white text-pink-200 border border-white/10 transition-all duration-300 font-bold text-xs px-4">{product.variants.length > 1 ? 'View' : 'Add'}</Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProductsListClient = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        const productsData = response.products || [];
        if (isMounted) setProducts(productsData);
      } catch (err) {
        console.error('Error loading store data:', err);
        if (isMounted) setError(err.message || 'Failed to load products');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="h-12 w-12 text-pink-400 animate-spin" /></div>;
  if (error) return <div className="text-center py-20 text-red-400 bg-red-900/20 rounded-xl m-4 p-8 max-w-2xl mx-auto border border-red-500/30">Error: {error}</div>;
  if (products.length === 0) return <div className="text-center py-32 text-purple-300 text-xl">The shelves are being restocked! Check back soon ♡</div>;

  return (
  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', maxWidth: '1120px', margin: '0 auto', padding: '0 16px 80px'}}>
  {products.map((product, i) => <div key={product.id} style={{margin: 0}}><ProductCard product={product} index={i} /></div>)}
    </div>
  );
};

export default ProductsListClient;
