"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { v4 as uuidv4 } from 'uuid';

export const usePhase10Game = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [game, setGame] = useState(null);
    const [players, setPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [gameMessage, setGameMessage] = useState('');
    const [selectedCards, setSelectedCards] = useState([]);
    const [guestId, setGuestId] = useState(null);
    const [cardDefinitions, setCardDefinitions] = useState(null);
    
    const isMounted = useRef(false);

    const supabase = useSupabaseClient();
    useEffect(() => {
        isMounted.current = true;
        let storedGuestId = localStorage.getItem('p10_guest_id');
        if (!storedGuestId) {
            storedGuestId = uuidv4();
            localStorage.setItem('p10_guest_id', storedGuestId);
        }
        setGuestId(storedGuestId);
        setGameMessage('Create a new game to begin!');

        const fetchCardDefinitions = async () => {
        const { data, error } = await supabase.from('p10_cards').select('*');
            if (isMounted.current) {
                if (error) {
                    toast({ variant: 'destructive', title: 'Error', description: 'Could not load card definitions.' });
                } else {
                    const defs = data.reduce((acc, card) => {
                        acc[card.id] = card;
                        return acc;
                    }, {});
                    setCardDefinitions(defs);
                }
            }
        };
        fetchCardDefinitions();

        return () => { isMounted.current = false; };
    }, [toast]);

    const humanPlayerId = user?.id || guestId;

    const hydrateCardData = useCallback((card) => {
        if (!cardDefinitions || !card) return null;
        
        let cardId = card;
        let cardInstanceData = {};

        if (typeof card === 'object' && card !== null && card.id) {
            cardId = card.id;
            cardInstanceData = card;
        }
        
        if (typeof cardId !== 'string') return null;

        const baseId = cardId.split('-')[0];
        const definition = cardDefinitions[baseId];
        
        if (!definition) return null;

        return { ...definition, ...cardInstanceData, id: cardId };
    }, [cardDefinitions]);

    const updateGameState = useCallback((newGameData) => {
        if (isMounted.current && newGameData && cardDefinitions) {
            const hydratedGame = {
                ...newGameData,
                draw_pile: newGameData.draw_pile?.map(hydrateCardData).filter(Boolean) || [],
                discard_pile: newGameData.discard_pile?.map(hydrateCardData).filter(Boolean) || [],
                players: newGameData.players.map(player => ({
                    ...player,
                    hand: player.hand?.map(hydrateCardData).filter(Boolean) || [],
                    laid_down_cards: player.laid_down_cards?.map(group => group.map(hydrateCardData).filter(Boolean)) || [],
                })).sort((a,b) => a.player_order - b.player_order),
            };

            setGame(hydratedGame);
            setPlayers(hydratedGame.players);
        }
    }, [hydrateCardData, cardDefinitions]);
    
    const handleGameUpdate = useCallback(async (payload) => {
        if (isMounted.current) {
            const { data, error } = await supabase
                .from('p10_games')
                .select('*, players:p10_players!p10_players_game_id_fkey(*)')
                .eq('id', payload.new.id)
                .single();
            if (error) {
                toast({ variant: 'destructive', title: 'Error syncing game', description: error.message });
                return;
            }
            if(data && cardDefinitions) updateGameState(data);
        }
    }, [toast, updateGameState, cardDefinitions]);

    useEffect(() => {
        if (!game?.id || !cardDefinitions) return;
    
        const gameChannel = supabase.channel(`p10_game_${game.id}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'p10_games', filter: `id=eq.${game.id}` }, handleGameUpdate)
            .subscribe();
            
        return () => {
            supabase.removeChannel(gameChannel);
        };
    }, [game?.id, handleGameUpdate, cardDefinitions]);
    
    const handleNewGame = async () => {
        if (!cardDefinitions) {
            toast({ variant: 'destructive', title: 'Game is loading', description: 'Please wait for card definitions to load.' });
            return;
        }

        setIsLoading(true);
        setGameMessage('Shuffling cards and dealing hands...');
        setGame(null);
        setPlayers([]);

        const playerNickname = profile?.nickname || 'Guest';

        const { data, error } = await supabase.functions.invoke('p10-new-game', {
            body: { player_user_id: humanPlayerId, player_nickname: playerNickname },
        });
        
        setIsLoading(false);

        if (error) {
            toast({ variant: 'destructive', title: 'Error starting game', description: error?.message || 'Could not create new game.' });
            setGameMessage('Create a new game to begin!');
        } else if (data?.updatedGame) {
            updateGameState(data.updatedGame);
        }
    };

    const handleDrawCard = async (source) => {
        const humanPlayer = players.find(p => p.user_id === humanPlayerId);
        if (!game || !humanPlayer || game.current_player_id !== humanPlayer.id || game.has_drawn) return;
        setGameMessage('Drawing card...');

        const { data, error } = await supabase.functions.invoke('p10-draw-card', {
            body: { game_id: game.id, player_id: humanPlayer.id, source },
        });

        if (error) {
            toast({ variant: 'destructive', title: `Error drawing card`, description: error.message });
            setGameMessage("It's your turn! Draw a card.");
        } else if (data?.updatedGame) {
             updateGameState(data.updatedGame);
        }
    };
    
    const handleCardClick = (card) => {
        const humanPlayer = players.find(p => p.user_id === humanPlayerId);
        if (!game || !humanPlayer || game.current_player_id !== humanPlayer.id || !game.has_drawn) {
            toast({ title: 'Not your action', description: "You must draw a card first."});
            return;
        };

        if (humanPlayer.has_laid_down_phase) {
             handleDiscardCard(card);
        } else {
            setSelectedCards(prev => {
                if (prev.some(c => c.id === card.id)) {
                    return prev.filter(c => c.id !== card.id);
                } else {
                    return [...prev, card];
                }
            });
        }
    };

    const handleLayDownPhase = async () => {
        const humanPlayer = players.find(p => p.user_id === humanPlayerId);
        if (!game || !humanPlayer || game.current_player_id !== humanPlayer.id || !game.has_drawn || selectedCards.length === 0 || humanPlayer.has_laid_down_phase) return;
        
        setIsLoading(true);
        const { data, error } = await supabase.functions.invoke('p10-lay-down-phase', {
            body: {
                game_id: game.id,
                player_id: humanPlayer.id,
                cards: selectedCards
            }
        });
        setIsLoading(false);

        if (error) {
            toast({ variant: 'destructive', title: `Couldn't lay down phase`, description: error.message });
        } else {
            toast({ title: "Phase successful!", description: "You laid down your phase." });
            updateGameState(data.updatedGame);
            setSelectedCards([]);
        }
    };

    const handleDiscardCard = async (cardToDiscard) => {
        const humanPlayer = players.find(p => p.user_id === humanPlayerId);
        if (!game || !humanPlayer || game.current_player_id !== humanPlayer.id || !game.has_drawn) return;
        
        setGameMessage('Discarding card...');
        setSelectedCards([]);

        const { data, error } = await supabase.functions.invoke('p10-discard-card', {
            body: { game_id: game.id, player_id: humanPlayer.id, card_to_discard: cardToDiscard },
        });

        if (error) {
            toast({ variant: 'destructive', title: `Error discarding card`, description: error.message });
        } else if (data?.updatedGame) {
             updateGameState(data.updatedGame);
        }
    };

    const triggerAiTurns = useCallback(async (startingPlayerId) => {
        if (!game?.id || !isMounted.current) return;
    
        try {
            const aiPlayer = players.find(p => p.id === startingPlayerId);
            if (!aiPlayer || aiPlayer.user_id === humanPlayerId) return;

            if (isMounted.current) setGameMessage(`${aiPlayer.nickname} is thinking...`);
            await new Promise(resolve => setTimeout(resolve, 1500));

            const { data, error } = await supabase.functions.invoke('p10-ai-move', {
                body: { game_id: game.id, player_id: aiPlayer.id },
            });

            if (error) {
                console.error(`AI move error for ${aiPlayer.nickname}:`, error);
                if (isMounted.current) toast({ variant: "destructive", title: "AI Error", description: `AI ${aiPlayer.nickname} failed to move.` });
            } else if (data?.updatedGame) {
                updateGameState(data.updatedGame);
            }
        } catch (e) {
            console.error("Error in AI turn trigger logic:", e);
            if (isMounted.current) {
                toast({ variant: "destructive", title: "Game Error", description: "An issue occurred with the AI turns." });
            }
        }
    }, [game?.id, players, toast, humanPlayerId, updateGameState]);
    
    useEffect(() => {
        const humanPlayer = players.find(p => p.user_id === humanPlayerId);
        const isMyTurn = game?.current_player_id === humanPlayer?.id;
        
        if (game?.current_player_id && players.length > 0 && !isMyTurn) {
            const currentPlayer = players.find(p => p.id === game.current_player_id);
            if (currentPlayer && currentPlayer.user_id !== humanPlayerId) {
                triggerAiTurns(game.current_player_id);
            }
        }
    }, [game?.current_player_id, players, triggerAiTurns, humanPlayerId]);

    useEffect(() => {
        if (!game) {
            setGameMessage('Create a new game to begin!');
            return;
        }

        const humanPlayer = players.find(p => p.user_id === humanPlayerId);
        const isMyTurn = game?.current_player_id === humanPlayer?.id;
        const hasDrawn = game.has_drawn ?? false;

        if (isMyTurn) {
            if (hasDrawn) {
                if (humanPlayer?.has_laid_down_phase) {
                    setGameMessage("Phase complete! Select a card to discard.");
                } else {
                    setGameMessage("Select cards for your phase or to discard.");
                }
            } else {
                setGameMessage("It's your turn! Draw a card.");
            }
        } else {
             const currentPlayer = players.find(p => p.id === game.current_player_id);
             if (currentPlayer) {
                 setGameMessage(`${currentPlayer.nickname}'s Turn`);
             }
        }
    }, [game, players, humanPlayerId]);

    return {
        game,
        players,
        isLoading,
        gameMessage,
        selectedCards,
        cardDefinitions,
        humanPlayerId,
        handleNewGame,
        handleDrawCard,
        handleCardClick,
        handleLayDownPhase,
        handleDiscardCard,
    };
};