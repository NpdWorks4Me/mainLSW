import React from 'react';
import { useToast } from '@/components/ui/use-toast';

const ReviewsAndRatings = ({ productId }) => {
  const { toast } = useToast();

  const handleFeatureClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      variant: "default",
    });
  };

  return (
    <div className="mt-12 p-6 glass-card rounded-lg text-center">
      <h2 className="text-3xl font-bold gradient-text mb-4">Customer Reviews & Ratings</h2>
      <p className="text-lg text-gray-300 mb-6">
        Be the first to review this product! Your feedback helps others make great choices.
      </p>
      <button
        onClick={handleFeatureClick}
        className="gummy-cta-sm"
      >
        Write a Review
      </button>
    </div>
  );
};

export default ReviewsAndRatings;