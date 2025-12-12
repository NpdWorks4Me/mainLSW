import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { Cookie, ShieldCheck, X } from 'lucide-react';

const CookieConsentBanner = () => {
  const { consent, updateConsent, hasMadeChoice } = useCookieConsent();

  if (hasMadeChoice) {
    return null;
  }

  const handleAccept = () => {
    updateConsent('accepted');
  };

  const handleReject = () => {
    updateConsent('rejected');
  };

  return (
    <AnimatePresence>
      {!consent && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-2 md:p-4"
        >
          <div className="glass-card max-w-4xl mx-auto p-3 sm:p-4 rounded-2xl shadow-2xl border border-white/20">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <Cookie className="w-8 h-8 sm:w-10 sm:h-10 text-pink-300" />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h2 className="text-base font-bold text-white mb-1">Our Recipe for a Cozier Space</h2>
                <p className="text-xs sm:text-sm text-foreground/80">
                  We use cookies to improve your experience and power our community features. See our{' '}
                  <Link to="/cookie-policy" className="underline text-pink-300 hover:text-pink-200">Cookie Policy</Link>.
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2 w-full sm:w-auto">
                <Button onClick={handleAccept} variant="cta" size="sm" className="flex-1 sm:flex-none">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Accept All
                </Button>
                <Button onClick={handleReject} variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <X className="w-4 h-4 mr-2" />
                  Reject All
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;