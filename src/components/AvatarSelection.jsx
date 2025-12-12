import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const avatars = [
  {
    id: 'alien',
    alt: 'A feisty little alien avatar',
    description: 'A cute, feisty little alien in a kawaii cartoon style, with big expressive eyes.',
    url: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/a7364cbc02a10924a2ba2e519ad328c1.png',
  },
  {
    id: 'goth',
    alt: 'A gothic/punk style avatar',
    description: 'A cute, kawaii cartoon character with a gothic/punk aesthetic, featuring dark colors and edgy accessories.',
    url: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/7d29636c2dee30bef33f936605597e75.png',
  },
  {
    id: 'princess',
    alt: 'A pastel princess avatar',
    description: 'A sweet pastel princess in a kawaii cartoon style, with a sparkling tiara and flowing gown.',
    url: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/01da06f6a11f2c65fe53dee161a5c841.png',
  },
  {
    id: 'dino',
    alt: 'A cute dinosaur avatar',
    description: 'A friendly and cute dinosaur in a kawaii cartoon style, with soft colors and a happy smile.',
    url: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/bbf550d0526deab2d870a274ed64e574.png',
  },
  {
    id: 'baby',
    alt: 'A happy baby avatar',
    description: 'An adorable and happy baby in a kawaii cartoon style, giggling and full of joy.',
    url: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/b58f9a1c2f53252f97bc6677f0104419.png',
  },
];

const AvatarSelection = ({ selectedAvatar, onSelectAvatar }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-2 rounded-lg bg-white/10">
      {avatars.map((avatar) => (
        <motion.div
          key={avatar.id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectAvatar(avatar.id)}
          className={cn(
            'w-20 h-20 md:w-24 md:h-24 rounded-full cursor-pointer transition-all duration-300 border-4',
            selectedAvatar === avatar.id ? 'border-pink-400 shadow-lg' : 'border-transparent hover:border-white/50'
          )}
        >
          <img 
            className="w-full h-full rounded-full object-cover"
            alt={avatar.alt}
            src={avatar.url} />
        </motion.div>
      ))}
    </div>
  );
};

export default AvatarSelection;