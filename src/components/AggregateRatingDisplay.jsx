import React from 'react';
import { Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AggregateRatingDisplay = ({ productId }) => {
  const { toast } = useToast();

  const handleFeatureClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      variant: "default",
    });
  };

  // Placeholder for aggregate rating
  const averageRating = 4.5; // Example value
  const totalReviews = 120; // Example value

  return (
    <div className="flex items-center ml-4 cursor-pointer" onClick={handleFeatureClick}>
      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
      <span className="text-lg font-semibold text-white">{averageRating.toFixed(1)}</span>
      <span className="text-sm text-gray-400 ml-2">({totalReviews} reviews)</span>
    </div>
  );
};

export default AggregateRatingDisplay;