import React, { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import * as EcommerceApi from '@/api/EcommerceApi';
import { useToast } from '@/components/ui/use-toast';
import LazyImage from '@/components/LazyImage';

const ShoppingCartView = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Add some products to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const items = cartItems.map(item => ({
        variant_id: item.variant.id,
        quantity: item.quantity,
      }));

  const successUrl = `${window.location.origin}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${window.location.origin}/shop/checkout/cancel`;
  // show loading toast
  toast({ title: 'Creating checkout session…' });

      const { url } = await EcommerceApi.initializeCheckout({ items, successUrl, cancelUrl });

      // We don't clear the cart here, as the user might cancel and come back.
      // The cart will be cleared on the success page.
  // Redirect to Stripe Checkout
  window.location.href = url;
    } catch (error) {
      toast({
        title: 'Checkout Error',
        description: 'There was a problem initializing checkout. Please try again.',
        variant: 'destructive',
      });
    }
  }, [cartItems, toast]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[100]"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md glass-card-dark shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-white hover:bg-purple-500/20">
                <X />
              </Button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-400 h-full flex flex-col items-center justify-center">
                  <ShoppingCartIcon size={48} className="mb-4 text-purple-400" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.variant.id} className="flex items-center gap-4 glass-card p-3 rounded-lg">
                    <LazyImage src={item.product.image_url || item.product.image} alt={item.product.title} className="w-20 h-20 object-cover rounded-md" />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-white">{item.product.title}</h3>
                      <p className="text-sm text-gray-300">{item.variant.title}</p>
                      <p className="text-sm text-purple-400 font-bold">
                        {EcommerceApi.formatCurrency(item.variant.sale_price_in_cents ?? item.variant.price_in_cents, item.variant.currency_info)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border border-white/20 rounded-md">
                        <Button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))} size="sm" variant="ghost" className="px-2 text-white hover:bg-white/10">-</Button>
                        <span className="px-2 text-white">{item.quantity}</span>
                        <Button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} size="sm" variant="ghost" className="px-2 text-white hover:bg-white/10">+</Button>
                      </div>
                      <Button onClick={() => removeFromCart(item.variant.id)} size="sm" variant="ghost" className="text-red-400 hover:text-red-300 text-xs">
                        <Trash2 className="w-3 h-3 mr-1"/> Remove
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-purple-500/30">
                <div className="flex justify-between items-center mb-4 text-white">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold">{EcommerceApi.formatCurrency(getCartTotal(), cartItems[0].variant.currency_info)}</span>
                </div>
                <Button onClick={handleCheckout} size="lg" className="w-full font-semibold">
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCartView;