import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Feather, Send, Loader2, Heart } from 'lucide-react';
import PageHelmet from '@/components/PageHelmet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

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

const StoryForm = ({ onStorySubmitted }) => {
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ variant: "destructive", title: "Oops!", description: "Please fill out both title and story." });
      return;
    }
    if (!user) {
      openAuthModal('login');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from('user_stories')
      .insert([{ title, content, user_id: user.id, status: 'pending' }]);

    setIsSubmitting(false);
    if (error) {
      toast({ variant: "destructive", title: "Error submitting story", description: error.message });
    } else {
      toast({ title: "Story Submitted!", description: "Thank you for sharing! Your story is now pending review." });
      setTitle('');
      setContent('');
      if(onStorySubmitted) onStorySubmitted();
    }
  };

  if (!user) {
    return (
      <div className="text-center p-6 glass-card">
        <p className="text-foreground/80 mb-4">Want to share your own story? Log in to join our community showcase!</p>
        <Button onClick={() => openAuthModal('login')} variant="cta">
          Log In to Share
        </Button>
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 glass-card p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold gradient-text text-center">Share Your Story</h2>
      <div className="space-y-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Your Story's Title"
          maxLength="100"
          disabled={isSubmitting}
          className="text-lg"
        />
      </div>
      <div className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell us your story... (max 1000 characters)"
          rows={8}
          maxLength="1000"
          disabled={isSubmitting}
        />
        <p className="text-xs text-right text-foreground/60">{content.length} / 1000</p>
      </div>
      <div className="text-center">
        <Button type="submit" disabled={isSubmitting || !title.trim() || !content.trim()} size="lg" variant="cta">
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : <>Submit Story <Send className="w-4 h-4 ml-2" /></>}
        </Button>
      </div>
    </motion.form>
  );
};

const StoryCard = ({ story, index }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!story.user_id) return;
      const { data } = await supabase.from('profiles').select('nickname, avatar_url').eq('id', story.user_id).single();
      setProfile(data);
    };
    fetchProfile();
  }, [story.user_id]);

  const getInitials = (name) => {
    if (!name || name === 'Anonymous') return 'A';
    return name.charAt(0).toUpperCase();
  };

  return (
    <motion.div
      className="glass-card p-6 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-center mb-4">
        <Avatar className="h-10 w-10 shrink-0 border-2 border-purple-300">
          <AvatarImage src={getAvatarUrl(profile?.avatar_url)} alt={profile?.nickname} />
          <AvatarFallback>{getInitials(profile?.nickname)}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <p className="font-bold text-foreground">{profile?.nickname || 'Anonymous'}</p>
          <p className="text-xs text-foreground/60">{formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}</p>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2 gradient-text">{story.title}</h3>
      <p className="text-foreground/90 flex-grow">{story.content}</p>
      <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
        <Button variant="ghost" size="sm" className="text-pink-400 hover:text-pink-300">
          <Heart className="w-4 h-4 mr-2" /> Like
        </Button>
      </div>
    </motion.div>
  );
};

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_stories')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stories:', error);
    } else {
      setStories(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return (
    <div className="py-10">
      <PageHelmet
        title="Community Stories"
        description="Read and share personal stories from the Little Space World community. A place for connection, understanding, and shared experiences."
        canonical="/stories"
      />
      <motion.div
        className="max-w-4xl mx-auto text-center mb-12 px-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-block bg-purple-300/20 p-3 rounded-full mb-4">
          <Feather className="w-8 h-8 text-purple-300" />
        </div>
        <h1 className="text-2xl md:text-4xl font-semibold gradient-text leading-tight mb-4">
          Community Stories
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          A collection of heartfelt stories and experiences from our wonderful community.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 space-y-12">
        <StoryForm onStorySubmitted={fetchStories} />

        <div>
          <h2 className="text-2xl font-bold text-center mb-8">Read Our Stories</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-16 w-16 text-white animate-spin" />
            </div>
          ) : stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence>
                {stories.map((story, index) => (
                  <StoryCard key={story.id} story={story} index={index} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16 text-foreground/60 glass-card">
              <p>No stories have been shared yet. Be the first to share yours! ✨</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoriesPage;