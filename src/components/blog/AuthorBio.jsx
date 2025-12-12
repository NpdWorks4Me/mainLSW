import React from 'react';
import { motion } from 'framer-motion';
import { User, BadgeCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const AuthorBio = ({ author }) => {
  if (!author) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="mt-12 mb-8 relative overflow-hidden rounded-2xl border border-purple-500/20 bg-[#120c24] p-6 md:p-8 shadow-lg"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <User className="w-32 h-32 text-purple-400" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
        <div className="shrink-0">
          <Avatar className="w-24 h-24 border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <AvatarImage src={author.image} alt={author.name} />
            <AvatarFallback className="bg-purple-900 text-purple-200 text-2xl font-bold">
              {author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 justify-center md:justify-start">
            <h3 className="text-2xl font-bold text-white">{author.name}</h3>
            <Badge variant="outline" className="border-pink-500/50 text-pink-300 bg-pink-500/10 px-3 py-1">
              {author.role}
            </Badge>
          </div>

          <p className="text-gray-300 leading-relaxed max-w-2xl">
            {author.bio}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
            {author.credentials && author.credentials.map((cred, index) => (
              <div key={index} className="flex items-center text-xs font-medium text-purple-300 bg-purple-900/30 px-2.5 py-1 rounded-md border border-purple-500/20">
                <BadgeCheck className="w-3 h-3 mr-1.5" />
                {cred}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthorBio;