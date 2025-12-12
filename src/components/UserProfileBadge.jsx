import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Star, Heart, Award, Shield, Sun, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const badgeIcons = {
  'First Post': { icon: MessageSquare, color: 'text-green-400', bgColor: 'bg-green-200' },
  'Novice Nebula': { icon: Star, color: 'text-gray-400', bgColor: 'bg-gray-200' },
  'Starry Friend': { icon: Heart, color: 'text-pink-400', bgColor: 'bg-pink-200' },
  'Little Explorer': { icon: Award, color: 'text-blue-400', bgColor: 'bg-blue-200' },
  'Cosmic Caregiver': { icon: Shield, color: 'text-purple-400', bgColor: 'bg-purple-200' },
  'Community Beacon': { icon: Sun, color: 'text-yellow-400', bgColor: 'bg-yellow-200' },
};

const UserProfileBadge = ({ badge, index, size = "md" }) => {
  if (!badge || !badge.name) {
    return null; 
  }
  
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-10 h-10 md:w-16 md:h-16"
  }
  
  const iconSizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5 md:w-8 md-h-8"
  }

  const { name, earned_at } = badge;
  const badgeInfo = badgeIcons[name] || { icon: Star, color: 'text-gray-400', bgColor: 'bg-gray-200' };
  const Icon = badgeInfo.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`relative rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-300 ${badgeInfo.bgColor} ${sizeClasses[size]}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.2, rotate: 5, boxShadow: '0 0 10px #BAFFC9' }}
          >
            <div className="absolute inset-0 rounded-full bg-[#FFFF00]/30" />
            <Icon className={`${iconSizeClasses[size]} ${badgeInfo.color}`} />
          </motion.div>
        </TooltipTrigger>
        <TooltipContent className="bg-[#4B5563] text-white border-none shadow-lg">
          <p className="font-bold text-lg text-yellow-300">{name}</p>
          {earned_at && <p className="text-sm">Earned on: {format(new Date(earned_at), 'PPP')}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserProfileBadge;