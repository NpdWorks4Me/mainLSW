import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronRight, XCircle } from 'lucide-react';
import Phase10Card from '@/components/games/phase10/Phase10Card';

const getInitials = (name) => {
    if (name === 'Queen Latifah') return 'QL';
    if (name === 'Marsha Ambrosius') return 'MA';
    if (name.includes(' ')) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const PHASES = [
    "2 sets of 3",
    "1 set of 3 + 1 run of 4",
    "1 set of 4 + 1 run of 4",
    "1 run of 7",
    "1 run of 8",
    "1 run of 9",
    "2 sets of 4",
    "7 cards of one color",
    "1 set of 5 + 1 set of 2",
    "1 set of 5 + 1 set of 3"
];

const PhaseTracker = ({ players, isOpen, onClose }) => {
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const menuVariants = {
        hidden: { x: '100%' },
        visible: { 
            x: 0,
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
        exit: { x: '100%' }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-40"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full max-w-md z-50 phase-tracker-menu"
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="p-6 h-full overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold gradient-text">Phase Tracker</h2>
                                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {players.map(player => (
                                    <div key={player.id} className="p-4 rounded-xl bg-black/30">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-lg font-bold text-white truncate">
                                                {getInitials(player.nickname)}
                                            </h3>
                                            <span className="text-sm font-semibold text-yellow-300">
                                                Phase {player.current_phase}
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-2 text-xs text-white/80">
                                            {PHASES.map((desc, index) => (
                                                <div key={index} className={`flex items-center gap-2 transition-opacity ${player.current_phase > index + 1 ? 'opacity-40' : ''}`}>
                                                    {player.current_phase > index + 1 ? (
                                                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                                    ) : player.current_phase === index + 1 ? (
                                                        <ChevronRight className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-400/50 flex-shrink-0" />
                                                    )}
                                                    <span className={`${player.current_phase === index + 1 ? 'font-bold text-white' : ''}`}>
                                                        {index + 1}: {desc}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {player.laid_down_cards && player.laid_down_cards.length > 0 && (
                                            <div className="mt-4 pt-3 border-t border-white/20">
                                                <h4 className="text-sm font-semibold mb-2 text-purple-300">Laid Down:</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {player.laid_down_cards.flat().map((card, i) => (
                                                        <div key={i} className="transform scale-75">
                                                            <Phase10Card {...card} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PhaseTracker;