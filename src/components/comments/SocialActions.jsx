"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useProgress, progressConfig } from '@/contexts/ProgressContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';

const HeartIcon = ({ filled, ...props }) => (
  <motion.svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-6 h-6 transition-colors duration-300 ${
      filled ? 'text-pink-500' : 'text-foreground/80'
    }`}
    initial={false}
    animate={filled ? { scale: [1, 1.3, 1], filter: 'drop-shadow(0 0 5px #ff69b4)' } : { scale: 1, filter: 'drop-shadow(0 0 0 #ff69b4)' }}
    transition={{ duration: 0.3 }}
    whileTap={{ scale: 1.3, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
    whileHover={{ scale: 1.1 }}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </motion.svg>
);


const SocialActions = ({ postSlug, initialLikes, initialComments, showComments = true }) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [commentsCount, setCommentsCount] = useState(initialComments || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const { toast } = useToast();
  const { addPoints } = useProgress();
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();

  const supabase = useSupabaseClient();
  useEffect(() => {
    if (postSlug) {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      if (likedPosts[postSlug]) {
        setHasLiked(true);
      }
    }
  }, [postSlug]);
  
  useEffect(() => {
    setLikes(initialLikes || 0);
  }, [initialLikes]);
  
  useEffect(() => {
    setCommentsCount(initialComments || 0);
  }, [initialComments]);

  useEffect(() => {
    if (!postSlug) return;
      
    const channel = supabase.channel(`realtime:posts:${postSlug}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'posts', 
        filter: `slug=eq.${postSlug}` 
      }, (payload) => {
        setLikes(payload.new.likes);
        setCommentsCount(payload.new.comments_count);
      })
      .subscribe();

    return () => {
      try { supabase.removeChannel(channel); } catch(e) { /* ignore */ }
    };
  }, [postSlug]);
  
  const handleLike = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    
    if (!postSlug) return;

    if (hasLiked) {
       toast({
        title: "💖 You've already shown your love!",
        description: "Thanks for the support!",
      });
      return;
    }

    addPoints(progressConfig.pointValues.LIKE_POST, 'Liking a blog post', progressConfig.activityTypes.LIKE_POST);

    const newLikes = likes + 1;
    setLikes(newLikes);
    setHasLiked(true);

    const { error } = await supabase.rpc('increment_likes', { post_slug_param: postSlug });

    if (error) {
      console.error('Error updating likes:', error);
      setLikes(likes); // Revert on error
      setHasLiked(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not save your like. Please try again.",
      });
    } else {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      likedPosts[postSlug] = true;
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
       toast({
        title: "✨ Thank you!",
        description: "Your support means the world!",
      });
    }
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleLike} className="rounded-full w-12 h-12">
          <HeartIcon filled={hasLiked} />
        </Button>
        <span className="text-lg font-semibold text-foreground/90">{likes}</span>
      </div>
      {showComments && (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full w-12 h-12">
            <MessageCircle className="w-6 h-6 text-foreground/80" />
          </Button>
          <span className="text-lg font-semibold text-foreground/90">{commentsCount}</span>
        </div>
      )}
    </div>
  );
};

export default SocialActions;