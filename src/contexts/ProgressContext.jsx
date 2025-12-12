"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import confetti from 'canvas-confetti';

export const progressConfig = {
  pointsToLevelUp: 200,
  pointValues: {
    LOGIN: 10,
    FORUM_POST: 20,
    GAME_LEVEL: 15,
    INVITE_FRIEND: 20,
    LIKE_POST: 5,
  },
  activityTypes: {
    LOGIN: 'LOGIN',
    FORUM_POST: 'FORUM_POST',
    GAME_LEVEL: 'GAME_LEVEL',
    LIKE_POST: 'LIKE_POST',
    LIKE_THREAD: 'LIKE_THREAD',
  },
  badges: [
    { name: 'Novice Nebula', points: 100 },
    { name: 'Starry Friend', points: 300 },
    { name: 'Little Explorer', points: 500 },
    { name: 'Cosmic Caregiver', points: 1000 },
    { name: 'Community Beacon', points: 2000 },
  ],
  levels: [
    'Little Sprout', 'Little Star', 'Starlight Adventurer', 'Comet Chaser', 'Galaxy Explorer',
    'Nebula Navigator', 'Supernova Scout', 'Cosmic Voyager', 'Celestial Guardian', 'Galactic Hero'
  ]
};

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = useSupabaseClient();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setProgress(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: single row not found
        throw error;
      }
      
      if (data) {
        setProgress(data);
      } else {
        const { data: newData, error: insertError } = await supabase
          .from('user_progress')
          .insert({ user_id: user.id, points: 0, level: 1, badges: [] })
          .select()
          .single();
        if(insertError) throw insertError;
        setProgress(newData);
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch your progress.',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`user_progress:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'user_progress', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const oldLevel = progress?.level || 1;
          const newProgress = payload.new;
          
          if (newProgress.level > oldLevel) {
            const levelName = progressConfig.levels[newProgress.level - 1] || `Level ${newProgress.level}`;
            toast({
              title: '🎉 Level Up!',
              description: `You've reached ${levelName}!`,
              duration: 5000,
            });
            setTimeout(() => {
              confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#BAE1FF', '#BAFFC9', '#FFFF00', '#C3AED6', '#FFF3B0']
              });
            }, 300);
          }
          
          const oldBadges = progress?.badges?.map(b => b.name) || [];
          const newBadges = newProgress.badges.filter(b => !oldBadges.includes(b.name));

          newBadges.forEach(badge => {
            toast({
              title: '🌟 New Badge Unlocked!',
              description: `You've earned the "${badge.name}" badge!`,
              duration: 5000,
            });
          });
          
          setProgress(newProgress);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast, progress]);

  const addPoints = useCallback(async (pointsToAdd, reason, activityType) => {
    if (!user) {
      toast({
        title: 'Log in to earn points!',
        description: 'Create an account to join the fun.',
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc('add_points_daily', {
        p_user_id: user.id,
        p_points_to_add: pointsToAdd,
        p_activity_type: activityType,
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: `✨ +${pointsToAdd} Points!`,
          description: reason,
          duration: 3000,
          variant: 'default',
          className: 'bg-[#FFF3B0] text-[#4B5563] border-none'
        });
      } else if (data.reason === 'already_earned_today') {
        toast({
            title: "Points already earned!",
            description: "You can earn points for this activity once a day. Come back tomorrow! 😊",
            duration: 4000
        });
      }

    } catch (error) {
      console.error('Error adding points:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not add points.',
      });
    }
  }, [user, toast]);

  const value = { progress, loading, addPoints, fetchProgress };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};