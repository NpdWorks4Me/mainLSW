import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const ContestSubmitButton = ({ className = '' }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`w-full max-w-md mx-auto ${className}`}
    >
      <Button
        asChild
        variant="contestSubmit"
        className="w-full text-base"
      >
        <a href="mailto:Jeana@littlespaceworld.com?subject=Coloring Contest Submission" className="interactive-star-effect">
          <Send className="w-5 h-5 mr-3" />
          Submit Your Coloring Page
        </a>
      </Button>
    </motion.div>
  );
};

export default ContestSubmitButton;