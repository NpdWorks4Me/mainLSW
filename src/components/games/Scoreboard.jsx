"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Crown, Trophy } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

const Scoreboard = ({ gameId }) => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAvatarUrl = (avatarId) => {
        const avatarMap = {
          alien: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/a7364cbc02a10924a2ba2e519ad328c1.png',
          goth: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/7d29636c2dee30bef33f936605597e75.png',
          princess: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/01da06f6a11f2c65fe53dee161a5c841.png',
          dino: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/bbf550d0526deab2d870a274ed64e574.png',
          baby: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/b58f9a1c2f53252f97bc6677f0104419.png',
        };
        return avatarMap[avatarId] || '';
    };

    const supabase = useSupabaseClient();
    const fetchScores = useCallback(async () => {
        setLoading(true);
        setError(null);
    const { data, error } = await supabase
            .from('game_scores')
            .select('score, profiles (id, nickname, avatar_url, is_private)')
            .eq('game_id', gameId)
            .order('score', { ascending: false })
            .limit(10);
        
        if (error) {
            console.error("Error fetching scores:", error);
            setError("Could not load the scores. Please try again later.");
        } else {
            setScores(data);
        }
        setLoading(false);
    }, [gameId]);

    useEffect(() => {
        fetchScores();

    const channel = supabase
            .channel(`scoreboard-${gameId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'game_scores',
                filter: `game_id=eq.${gameId}`
            }, (payload) => {
                fetchScores(); // Refetch all scores to re-evaluate rankings
            })
            .subscribe();

        return () => {
            try { supabase.removeChannel(channel); }catch(e){}
        };
    }, [gameId, fetchScores]);

    const getRankColor = (index) => {
        if (index === 0) return "text-yellow-400";
        if (index === 1) return "text-gray-400";
        if (index === 2) return "text-yellow-600";
        return "text-purple-400";
    }

    return (
        <div className="glass-effect rounded-3xl p-6 shadow-xl w-full">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Top Players
                </h3>
            </div>
            {loading && (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && (
                <ul className="space-y-3">
                    <AnimatePresence>
                        {scores.length > 0 ? scores.map((scoreEntry, index) => (
                            <motion.li
                                key={scoreEntry.profiles.id + index}
                                className={`flex items-center justify-between p-3 rounded-xl bg-white/50 shadow-sm transition-all hover:bg-white/80 ${index === 0 ? 'border-2 border-yellow-400' : ''}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`font-bold w-6 text-lg ${getRankColor(index)}`}>
                                        {index === 0 && <Crown className="w-5 h-5 inline-block -mt-1" />}
                                        {index > 0 && `${index + 1}`}
                                    </span>
                                     <Link to={!scoreEntry.profiles.is_private ? `/user/${scoreEntry.profiles.nickname}` : '#'} className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={getAvatarUrl(scoreEntry.profiles.avatar_url)} alt={scoreEntry.profiles.nickname} />
                                            <AvatarFallback>{scoreEntry.profiles.nickname ? scoreEntry.profiles.nickname[0].toUpperCase() : '?'}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-semibold text-gray-700 truncate max-w-[120px]">
                                            {scoreEntry.profiles.is_private ? 'Anonymous' : scoreEntry.profiles.nickname || 'Anonymous'}
                                        </span>
                                    </Link>
                                </div>
                                <span className="font-bold text-lg text-purple-600">{scoreEntry.score}</span>
                            </motion.li>
                        )) : (
                            <p className="text-center text-gray-500 py-8">Be the first to get on the scoreboard! 🎉</p>
                        )}
                    </AnimatePresence>
                </ul>
            )}
        </div>
    );
};

export default Scoreboard;