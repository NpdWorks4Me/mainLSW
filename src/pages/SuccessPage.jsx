import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import PageHelmet from '@/components/PageHelmet';
import confetti from 'canvas-confetti';

const SuccessPage = () => {
  React.useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <>
      <PageHelmet
        title="Payment Successful!"
        description="Thank you for your purchase. Your order has been confirmed."
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center text-center py-20"
      >
        <div className="glass-card p-10 rounded-2xl shadow-2xl max-w-lg">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          >
            <CheckCircle className="h-24 w-24 text-green-400 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">Thank You!</h1>
          <p className="text-lg text-gray-300 mb-8">
            Your order has been successfully placed. We've sent a confirmation email with your order details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold">
              <Link to="/store">
                Continue Shopping <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SuccessPage;