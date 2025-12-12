import React from 'react';
import { motion } from 'framer-motion';
import Phase10Card from '@/components/games/phase10/Phase10Card';

const PlayerArea = ({ player, isCurrent, isHuman, onCardClick, selectedCards }) => {
    const isCardSelected = (card) => {
        return selectedCards.some(c => c.id === card.id);
    }
    
    const sortedHand = player.hand ? [...player.hand].sort((a, b) => {
        const aValue = a.type === 'number' ? a.value : (a.type === 'wild' ? 13 : 14);
        const bValue = b.type === 'number' ? b.value : (b.type === 'wild' ? 13 : 14);
        
        if (aValue !== bValue) {
            return aValue - bValue;
        }
        
        const colorA = a.color || '';
        const colorB = b.color || '';
        return colorA.localeCompare(colorB);
    }) : [];

    return (
        <motion.div 
            className={`p-2 rounded-2xl border-2 transition-all duration-500 flex flex-col items-center ${isCurrent ? 'border-yellow-400 shadow-yellow-400/30 shadow-lg bg-white/10' : 'border-transparent'}`}
            animate={{ scale: isCurrent ? 1.02 : 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div className="w-full text-center">
                <h3 className="font-bold text-sm md:text-base text-white mb-1 truncate">{player.nickname}</h3>
                <div className="text-xs text-white/80">
                    <span>P: {player.current_phase}</span> | <span>S: {player.score}</span>
                </div>
            </div>
             {player.laid_down_cards && player.laid_down_cards.length > 0 && (
                <div className="mt-2 w-full bg-black/20 p-1 rounded-lg">
                    <h4 className="text-xs text-purple-300 font-semibold mb-1 text-center">Laid Down</h4>
                    <div className="flex flex-wrap gap-1 justify-center">
                        {player.laid_down_cards.flat().map((card, i) => (
                           <div key={i} className="transform scale-50 -m-3">
                               <Phase10Card {...card} />
                           </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex flex-wrap gap-1 mt-2 justify-center min-h-[5rem] md:min-h-[8.5rem] w-full">
                {sortedHand.map((card) => (
                    <motion.div 
                        key={card.id}
                        onClick={() => isHuman && onCardClick(card)}
                        className={`transform transition-all duration-200 ${isHuman ? 'cursor-pointer' : ''} ${isHuman ? 'scale-100' : 'scale-75'} ${isCardSelected(card) ? '!-translate-y-4' : ''}`}
                        whileHover={{ scale: isHuman ? 1.1 : 0.75, y: isHuman && !isCardSelected(card) ? -10 : 0 }}
                    >
                        <Phase10Card 
                           {...card}
                           isFaceDown={!isHuman}
                           isSelected={isCardSelected(card)}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default PlayerArea;