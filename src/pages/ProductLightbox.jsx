import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, formatCurrency } from '@/api/EcommerceApi';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Loader2, ShoppingCart, X, AlertCircle, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import Autoplay from "embla-carousel-autoplay";
import LazyImage from '@/components/LazyImage';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } },
};

const stripHtml = (html) => {
  if (typeof document === 'undefined' || !html) {
    return "";
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

const ProductLightbox = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const productIds = useMemo(() => [
    'prod_01k2tbda3wzk4k3f5v05q5c85s', // Amethyst Picky Pad
    'prod_01k372j5z3f90j4n6dcaejx9ze', // Mega Starter Pack
  ], []);

  useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
          const { products: fetchedProducts } = await getProducts({ ids: productIds });
          if (fetchedProducts && fetchedProducts.length > 0) {
            const lowercasedIds = productIds.map(id => id.toLowerCase());
            const sortedProducts = fetchedProducts
              .filter(p => lowercasedIds.includes(p.id.toLowerCase()))
              .sort((a, b) => lowercasedIds.indexOf(a.id.toLowerCase()) - lowercasedIds.indexOf(b.id.toLowerCase()));
            setProducts(sortedProducts);
          } else {
            setProducts([]);
          }
        } catch (e) {
          setError('Could not fetch our pretty things! Please try again.');
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isOpen, productIds]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    e.preventDefault();

    if (product.variants && product.variants.length > 0) {
      const variant = product.variants[0];
      addToCart(product, variant, 1)
        .then(() => {
          toast({
            title: "Added to Cart!",
            description: `${product.title} is now in your cozy cart.`,
            variant: 'success',
          });
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        })
        .catch(error => {
           toast({
            title: "Oh no!",
            description: error.message,
            variant: 'destructive',
          });
        });
    } else {
      toast({
        title: "Oh no!",
        description: `This product has no variants to add.`,
        variant: 'destructive',
      });
    }
  };
  
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-purple-100/10 via-pink-100/10 to-blue-100/10 rounded-2xl p-4 md:p-6 shadow-2xl border border-white/20 glass-card-product flex flex-col overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-50 text-white bg-black/30 hover:bg-white/20 hover:text-white rounded-full border border-white/10 backdrop-blur-md transition-all"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close lightbox</span>
            </Button>
            
            {loading && (
              <div className="flex justify-center items-center h-full flex-grow">
                <Loader2 className="h-12 w-12 text-pink-300 animate-spin" />
              </div>
            )}

            {error && (
              <div className="flex flex-col justify-center items-center h-full text-center text-pink-300 flex-grow">
                <AlertCircle className="h-12 w-12 mb-4" />
                <p className="text-lg font-semibold">{error}</p>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
                <div className="flex flex-col justify-center items-center h-full text-center text-pink-300 flex-grow">
                    <ShoppingBag className="h-12 w-12 mb-4" />
                    <p className="text-lg font-semibold">Couldn't find these specific treasures!</p>
                </div>
            )}

            {!loading && !error && products.length > 0 && (
              <Carousel 
                plugins={[plugin.current]}
                opts={{ align: "start", loop: true }} 
                className="w-full h-full flex-grow"
              >
                <CarouselContent className="h-full">
                  {products.map((product) => (
                    <CarouselItem key={product.id} className="h-full">
                      <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white p-4">
                        <motion.div 
                          className="w-full md:w-1/2 h-1/2 md:h-auto flex-shrink-0 aspect-square"
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <Link to={`/product/${product.id}`} onClick={onClose} className="block w-full h-full">
                            <LazyImage
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-contain shadow-2xl"
                            />
                          </Link>
                        </motion.div>
                        <motion.div 
                          className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <Link to={`/product/${product.id}`} onClick={onClose}>
                            <h2 className="text-2xl md:text-4xl font-bold mb-2 product-carousel-title !text-white">{product.title}</h2>
                          </Link>
                          <p className="text-lg font-bold my-2 md:my-4" style={{ color: '#FFB3BA' }}>
                            {formatCurrency(product.price_in_cents, product.variants[0]?.currency_info)}
                          </p>
                          <p className="text-white/80 mb-4 md:mb-6 text-sm md:text-base max-h-24 overflow-y-auto">
                            {stripHtml(product.description).substring(0, 150) + (stripHtml(product.description).length > 150 ? '...' : '')}
                          </p>
                          <Button
                            onClick={(e) => handleAddToCart(e, product)}
                            size="lg"
                            className="add-to-cart-btn w-full md:w-auto"
                          >
                            Add to Cart <ShoppingCart className="ml-2 h-5 w-5" />
                          </Button>
                        </motion.div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="carousel-arrow absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md border border-white/10" />
                <CarouselNext className="carousel-arrow absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md border border-white/10" />
              </Carousel>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductLightbox;