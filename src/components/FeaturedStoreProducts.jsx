import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Sparkles, Loader2, Star } from 'lucide-react';
import { getProducts, formatCurrency } from '@/api/EcommerceApi';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import LazyImage from '@/components/LazyImage';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import '@/styles/components/cards.css';

const FeaturedProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const displayVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  
  if (!displayVariant) return null;

  const hasSale = displayVariant.sale_price_in_cents && displayVariant.sale_price_in_cents < displayVariant.price_in_cents;
  const price = formatCurrency(hasSale ? displayVariant.sale_price_in_cents : displayVariant.price_in_cents, displayVariant.currency_info);
  const oldPrice = hasSale ? formatCurrency(displayVariant.price_in_cents, displayVariant.currency_info) : null;

  const handleAddToCart = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (product.variants.length > 1) { navigate(`/product/${product.id}`); return; }

    await addToCart(product, displayVariant, 1);
    toast({ title: "Added to basket!", description: `${product.title} is coming home!` });
    confetti({
      particleCount: 100, spread: 70, origin: { y: 0.8 },
      colors: ['#FFB3D9', '#D8B4FE', '#A7F3D0', '#99F3FF', '#F0A8F8'],
      shapes: ['heart', 'star'],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ y: -8 }}
      className="relative group h-full"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="product-card-glow h-full flex flex-col">
           {product.ribbon_text && (
            <div className="absolute top-2 md:top-3 left-0 z-10 bg-pink-500 text-white text-[10px] md:text-xs font-bold px-3 md:px-4 py-0.5 md:py-1 shadow-lg transform -rotate-6 origin-bottom-left border border-white/20">
              {product.ribbon_text}
            </div>
          )}

          <div className="relative overflow-hidden h-48 sm:h-56 md:h-64 lg:h-72">
            <LazyImage 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden md:block">
                 <div className="backdrop-blur-md p-2 rounded-full border border-white/20 text-pink-300">
                    <Sparkles className="w-4 h-4" />
                 </div>
            </div>
          </div>

          <div className="p-3 md:p-5 flex flex-col flex-grow relative">
             <h3 className="text-lg md:text-2xl font-extrabold mb-1 md:mb-2 line-clamp-2 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400">
                {product.title}
             </h3>
             
             <div className="mt-auto pt-2 md:pt-4 flex items-end justify-between gap-2 md:gap-3">
                <div className="flex flex-col items-start">
                    {hasSale && <span className="text-[10px] md:text-xs text-gray-400 line-through font-mono">{oldPrice}</span>}
                    <span className="text-sm font-medium text-gray-300">
                        {price}
                    </span>
                </div>
                
                <Button 
                    onClick={handleAddToCart}
                    variant="shop"
                    className="rounded-full w-10 h-10 md:w-12 md:h-12 p-0 flex items-center justify-center"
                    aria-label="Add to cart"
                >
                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
             </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const FeaturedStoreProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ limit: 4 });
        let fetchedProducts = response.products || [];

        if (fetchedProducts.length < 4) {
          const kandiProduct = {
            id: 'kandi-pacifier-clips',
            title: 'Kandi Pacifier Clips',
            image: 'https://images.unsplash.com/photo-1542861271-e945c9945ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw0fHBrYWNpZmllciUyMGNsaXBzJTJDa2FuZGl8ZW58MHwwfHx8MTcwMTkxNjYzOXww&ixlib=rb-4.0.3&q=80&w=1080',
            variants: [
              {
                id: 'kandi-pacifier-clips-default',
                price_in_cents: 1299,
                currency_info: {
                  code: 'USD',
                  symbol: '$',
                  decimal_digits: 2
                },
                stock: 100,
              },
            ],
            ribbon_text: 'New Arrival',
          };
          if (!fetchedProducts.some(p => p.title === kandiProduct.title)) {
              fetchedProducts.push(kandiProduct);
          }
        }
        setProducts(fetchedProducts.slice(0,4));
      } catch (error) {
        console.error("Failed to fetch featured products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 text-pink-400 animate-spin" /></div>;
  if (!products.length) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-4 relative mt-4 md:mt-8 pb-4 md:pb-8">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <Sparkles className="absolute -top-6 right-10 w-6 h-6 text-yellow-300 animate-pulse delay-300 hidden md:block" />
        <Star className="absolute bottom-10 -left-4 w-5 h-5 text-pink-400 animate-spin-slow opacity-70 hidden md:block" />
        <div className="absolute top-1/2 -right-8 w-3 h-3 bg-cyan-400 rounded-full animate-ping hidden md:block" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, idx) => (
                <FeaturedProductCard key={product.id} product={product} index={idx} />
            ))}
        </div>
    </div>
  );
};

export default FeaturedStoreProducts;