import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { getProduct } from '@/api/EcommerceApi';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import confetti from 'canvas-confetti';
import LazyImage from '@/components/LazyImage';

const MEGA_STARTER_PACK_ID = 'prod_01k372j5z3f90j4n6dcaejx9ze';

const FeaturedStarterPack = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        setLoading(true);
        const featuredProduct = await getProduct(MEGA_STARTER_PACK_ID);
        setProduct(featuredProduct);
      } catch (err) {
        setError('Could not load the starter pack! Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProduct();
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product && product.variants && product.variants.length > 0) {
      const variant = product.variants[0];
      addToCart(product, variant, 1)
        .then(() => {
          toast({
            title: "It's in the bag!",
            description: `${product.title} has been added to your cart.`,
          });
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#BAFFC9', '#FFD6E0', '#BDB2FF', '#FFC8DD']
          });
        })
        .catch(error => {
          toast({
            title: "Oops!",
            description: error.message,
            variant: 'destructive',
          });
        });
    } else {
      toast({
        title: "Oops!",
        description: "This product has no variants to add.",
        variant: 'destructive',
      });
    }
  };

  const createDescriptionSnippet = (html, maxLength = 100) => {
    if (!html) return '';
    const text = html.replace(/<[^>]+>/g, '');
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 text-pink-400 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center p-4 rounded-lg bg-red-500/10">
        <AlertCircle className="h-12 w-12 mb-4 text-red-400" />
        <p className="text-lg font-semibold text-red-400">{error || 'Featured product not found.'}</p>
      </div>
    );
  }

  return (
    <motion.section 
      className="mb-16 p-6 md:p-8 rounded-3xl overflow-hidden relative bg-gradient-to-bl from-gray-900 via-pink-900/50 to-blue-900/50 border-2 border-pink-500/50 shadow-2xl shadow-pink-500/20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
    >
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl opacity-50"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-500/20 rounded-full filter blur-3xl opacity-50"></div>
      
      <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left md:order-2">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ color: '#FFD6E0' }}>
            {product.title}
          </h2>
          <p className="text-base text-white/80 mb-6 font-sans">
            {createDescriptionSnippet(product.description)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button onClick={handleAddToCart} variant="shop" size="lg" className="rounded-full font-bold px-8">
              Get Started! <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <Link to={`/product/${product.id}`}>
              <Button size="default" variant="outline" className="text-pink-300 border-pink-300/50 hover:bg-pink-500/10 hover:text-pink-200 font-bold">
                View Details
              </Button>
            </Link>
          </div>
        </div>
        <motion.div 
          className="aspect-square rounded-2xl overflow-hidden shadow-lg md:order-1"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link to={`/product/${product.id}`}>
            <LazyImage src={product.image} alt={product.title} className="w-full h-full object-cover" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturedStarterPack;