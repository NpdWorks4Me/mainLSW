import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useImageLightbox } from '@/components/ImageLightboxProvider';
import { Button } from '@/components/ui/button';
import { Palette, Gavel } from 'lucide-react';
import confetti from 'canvas-confetti';
import ContestRulesModal from './ContestRulesModal';

const CONTEST_WINNER_IMAGE = {
  src: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/ea51d97872fd40077d578260b1ff8039.png',
  alt: "A cute pumpkin-headed character in a sparkly pink dress, with a rainbow in the background. The winner of the '24 coloring contest.",
  title: "Coloring Contest Winner of '24",
  description: "A huge congratulations to our talented winner, SpaceCadet! This piece captured our hearts with its spooky-sweet charm and vibrant colors."
};

const ContestWinner = () => {
  const { openLightbox } = useImageLightbox();
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  const handleImageClick = (e) => {
    // Prevent lightbox from opening if a button was clicked
    if (e.target.closest('button, a')) {
      return;
    }
    e.preventDefault();
    
    openLightbox([CONTEST_WINNER_IMAGE], 0);
    const end = Date.now() + 2 * 1000;
    const colors = ['#ff7a00', '#8a2be2', '#000000', '#ffffff'];
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };
  
  const handleOpenRules = (e) => {
    e.stopPropagation(); // prevent image click
    setIsRulesModalOpen(true);
  };

  return (
    <>
      <motion.section 
        className="my-16" 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">Community Spotlight</h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">Check out the amazing winning entry from last year's coloring contest!</p>
        </div>
        <div 
          className="relative max-w-xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 cursor-pointer group contest-winner-container" 
          onClick={handleImageClick}
        >
          <img src={CONTEST_WINNER_IMAGE.src} alt={CONTEST_WINNER_IMAGE.alt} className="w-full h-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out flex items-center justify-center p-4">
            <div className="text-center text-white">
              <h3 className="text-3xl md:text-4xl font-bold halloween-gradient-text">Coloring Contest Winner of '24</h3>
              <p className="text-xl md:text-2xl mt-2 font-semibold halloween-gradient-text">by SpaceCadet</p>
            </div>
          </div>
          <div className="winner-badge">
            <span className="winner-badge-text">#1</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button asChild variant="halloween" size="lg">
            <Link to="/coloring-pages">
              <Palette className="mr-2 h-5 w-5" />
              Coloring Contest
            </Link>
          </Button>
          <Button variant="halloween-outline" size="lg" onClick={handleOpenRules}>
             <Gavel className="mr-2 h-5 w-5" />
             Official Contest Rules
          </Button>
        </div>
      </motion.section>

      <ContestRulesModal isOpen={isRulesModalOpen} onOpenChange={setIsRulesModalOpen} />
    </>
  );
};

export default ContestWinner;