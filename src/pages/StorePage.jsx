import React from 'react';
import { motion } from 'framer-motion';
import ProductsList from '@/components/ProductsList';
import PageHelmet from '@/components/PageHelmet';
import { Store, Sparkles, Truck, Heart } from 'lucide-react';

const StorePage = () => {
  return (
    <>
      <PageHelmet 
        title="Little Space Shop | Handcrafted Sensory Gear & Comfort Items" 
        description="Your one-stop comfort shop for handcrafted exclusives. Shop Mystery Boxes, Picky Pads, Slime, and Adult Pacifier Sets. High-quality sensory items with discreet shipping." 
        canonical="/store" 
      />

      <div className="min-h-screen bg-transparent py-8 px-4 md:px-8">
        
        {/* Redesigned SEO-Optimized Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-7xl mx-auto mb-12 relative z-10"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl rounded-3xl -z-10" />
          
          <div className="glass-card rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
            
            {/* Subtle animated background pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] group-hover:opacity-[0.05] transition-opacity duration-700" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              
              {/* Left Content: Title & SEO Text */}
              <div className="text-left space-y-5 max-w-3xl flex-1">
                 <div className="flex items-center gap-2">
                    <div className="bg-pink-500/20 p-1.5 rounded-lg border border-pink-500/30">
                      <Store className="w-4 h-4 text-pink-300" />
                    </div>
                    <span className="text-cyan-300 font-bold tracking-[0.2em] uppercase text-xs">One-Stop Comfort Shop</span>
                 </div>
                 
                 <div>
                   <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-2 drop-shadow-lg">
                     LITTLE SPACE <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">SHOP</span>
                   </h1>
                   <h2 className="text-lg md:text-xl text-purple-200 font-medium max-w-2xl">
                     Your destination for Handcrafted Exclusives & Sensory Essentials.
                   </h2>
                 </div>

                 <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl">
                   Explore our specialized collection of comfort items designed to soothe and delight. From our signature <strong className="text-pink-300">Mystery Boxes</strong> and satisfying <strong className="text-blue-300">Picky Pads</strong> to therapeutic <strong className="text-purple-300">Slime</strong> and custom <strong className="text-cyan-300">Adult Pacifier & Clip Sets</strong>, every item is crafted with care. We are constantly expanding our galaxy of goods—watch for <strong className="text-yellow-300">new items coming soon</strong>!
                 </p>
              </div>

              {/* Right Content: Quick Stats/Badges */}
              <div className="flex flex-row md:flex-col lg:flex-row gap-4 shrink-0">
                 <div className="bg-black/30 p-4 rounded-2xl backdrop-blur-md border border-white/10 flex flex-col items-center justify-center w-24 md:w-28 h-24 md:h-28 hover:bg-black/40 transition-colors group/badge">
                    <Sparkles className="w-6 h-6 text-yellow-300 mb-2 group-hover/badge:animate-spin" />
                    <span className="font-bold text-white text-sm">Handcrafted</span>
                    <span className="text-xs text-gray-400">Exclusives</span>
                 </div>
                 
                 <div className="bg-black/30 p-4 rounded-2xl backdrop-blur-md border border-white/10 flex flex-col items-center justify-center w-24 md:w-28 h-24 md:h-28 hover:bg-black/40 transition-colors group/badge">
                    <Truck className="w-6 h-6 text-cyan-300 mb-2 group-hover/badge:animate-bounce" />
                    <span className="font-bold text-white text-sm">Discreet</span>
                    <span className="text-xs text-gray-400">Shipping</span>
                 </div>

                 <div className="bg-black/30 p-4 rounded-2xl backdrop-blur-md border border-white/10 flex flex-col items-center justify-center w-24 md:w-28 h-24 md:h-28 hover:bg-black/40 transition-colors group/badge hidden sm:flex">
                    <Heart className="w-6 h-6 text-pink-400 mb-2 group-hover/badge:scale-110 transition-transform" />
                    <span className="font-bold text-white text-sm">Trusted</span>
                    <span className="text-xs text-gray-400">Comfort</span>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        <ProductsList />
      </div>
    </>
  );
};

export default StorePage;