"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, CornerUpLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import SocialActions from './SocialActions';
import UserProfileBadge from '@/components/UserProfileBadge';
const getAvatarUrl = avatarId => {
  const avatarMap = {
    alien: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/a7364cbc02a10924a2ba2e519ad328c1.png',
    goth: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/7d29636c2dee30bef33f936605597e75.png',
    princess: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/01da06f6a11f2c65fe53dee161a5c841.png',
    dino: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/bbf550d0526deab2d870a274ed64e574.png',
    baby: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/b58f9a1c2f53252f97bc6677f0104419.png'
  };
  return avatarMap[avatarId] || '';
};
const badgePriorities = ['Community Beacon', 'Cosmic Caregiver', 'Little Explorer', 'Starry Friend', 'Novice Nebula'];
const CommentItem = ({
  comment,
  onReply,
  allComments
}) => {
  const {
    user
  } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const supabase = useSupabaseClient();
  useEffect(() => {
    const fetchProfile = async () => {
      if (!comment.user_id) return;
      const {
        data,
        error
      } = await supabase.from('profiles').select('nickname, avatar_url, is_private, badges').eq('id', comment.user_id).single();
      if (data) {
        setProfile(data);
      } else {
        console.error("Error fetching profile for comment:", error);
        setProfile({
          nickname: 'Anonymous',
          avatar_url: '',
          is_private: true,
          badges: []
        });
      }
    };
    fetchProfile();
  }, [comment.user_id]);
  const handleProfileClick = () => {
    if (profile && !profile.is_private && profile.nickname) {
      navigate(`/user/${profile.nickname}`);
    } else if (profile?.is_private) {
      toast({
        title: "This profile is private!",
        description: "This user prefers to keep their profile to themselves. 🤫"
      });
    }
  };
  const getInitials = name => {
    if (!name || name === 'Anonymous') return 'A';
    return name.charAt(0).toUpperCase();
  };
  const getDisplayBadge = () => {
    if (!profile || !profile.badges || profile.badges.length === 0) return null;
    for (const badgeName of badgePriorities) {
      const foundBadge = profile.badges.find(b => b.name === badgeName);
      if (foundBadge) {
        return foundBadge;
      }
    }
    return profile.badges[0];
  };
  if (!profile) return null;
  const replies = allComments.filter(c => c.parent_id === comment.id);
  const displayBadge = getDisplayBadge();
  return <motion.div layout initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} className="flex items-start space-x-4">
      <Avatar className="h-10 w-10 shrink-0 cursor-pointer border-2 border-transparent hover:border-[#BAFFC9] transition-all" onClick={handleProfileClick}>
        <AvatarImage src={getAvatarUrl(profile.avatar_url)} alt={profile.nickname} />
        <AvatarFallback>{getInitials(profile.nickname)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-white/10 p-4 rounded-xl rounded-tl-none">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleProfileClick}>
              <p className="font-bold text-foreground">{profile.nickname || 'Anonymous'}</p>
              {displayBadge && <UserProfileBadge badge={displayBadge} index={0} profile={profile} size="sm" />}
            </div>
            <p className="text-xs text-foreground/60">{new Date(comment.created_at).toLocaleDateString()}</p>
          </div>
          <p className="text-foreground/90 mt-2">{comment.content}</p>
        </div>
        <div className="flex items-center">
          {user && <Button variant="ghost" size="sm" onClick={() => onReply(comment)} className="mt-1 text-xs text-foreground/70 hover:text-foreground">
              <CornerUpLeft className="w-3 h-3 mr-1" />
              Reply
            </Button>}
        </div>
        
        {replies.length > 0 && <div className="mt-4 space-y-6 pl-6 border-l-2 border-white/10">
            <AnimatePresence>
              {replies.map(reply => <CommentItem key={reply.id} comment={reply} onReply={onReply} allComments={allComments} />)}
            </AnimatePresence>
          </div>}
      </div>
    </motion.div>;
};
const CommentForm = ({
  postSlug,
  parentId = null,
  onCommentPosted,
  onCancelReply,
  replyingToNickname
}) => {
  const {
    user
  } = useAuth();
  const {
    openAuthModal
  } = useAuthModal();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toast
  } = useToast();
  const supabase = useSupabaseClient();
  const handleSubmit = async e => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please log in",
        description: "You need to be logged in to post a comment."
      });
      openAuthModal('login');
      return;
    }
    setIsSubmitting(true);
    const {
      data,
      error
    } = await supabase.rpc('add_comment', {
      p_slug: postSlug,
      p_user_id: user.id,
      p_content: content.trim(),
      p_parent_id: parentId
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not post your comment. Please try again."
      });
      console.error('Error posting comment:', error);
    } else {
      toast({
        title: "Comment posted!",
        description: "Thanks for sharing your thoughts."
      });
      setContent('');
      if (onCommentPosted) {
        onCommentPosted();
      }
    }
    setIsSubmitting(false);
  };
  if (!user) {
    return <div className="text-center p-6 bg-white/5 rounded-lg">
        <p className="text-foreground/80"></p>
        <Button onClick={() => openAuthModal('login')} className="mt-4">
          Log in to comment
        </Button>
      </div>;
  }
  return <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {parentId && <div className="p-2 bg-white/10 rounded-md text-sm text-foreground/80">
          Replying to <span className="font-bold">{replyingToNickname}</span>
        </div>}
      <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder={parentId ? "Write a reply..." : "Share your thoughts..."} rows={3} disabled={isSubmitting} />
      <div className="flex justify-end space-x-2">
        {parentId && <Button type="button" variant="ghost" onClick={onCancelReply} disabled={isSubmitting}>
            Cancel
          </Button>}
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          {isSubmitting ? 'Posting...' : 'Post Comment'} <Send className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>;
};
const CommentSection = ({
  postSlug
}) => {
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [replyingToNickname, setReplyingToNickname] = useState('');
  const {
    toast
  } = useToast();
  const fetchComments = useCallback(async () => {
  const { toast } = useToast();
  const supabase = useSupabaseClient();
    const {
      data,
      error
    } = await supabase.from('comments').select('*').eq('post_slug', postSlug).order('created_at', {
      ascending: true
    });
    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data);
    }
  }, [postSlug]);
  const fetchPost = useCallback(async () => {
    if(!postSlug) return;
    const {
      data,
      error
    } = await supabase.from('posts').select('likes, comments_count').eq('slug', postSlug).single();
    if (data) setPost(data);
  }, [postSlug]);
  useEffect(() => {
    fetchComments();
    fetchPost();
  }, [fetchComments, fetchPost]);
  const handleSetReplyTo = async comment => {
    setReplyTo(comment);
    const {
      data,
      error
    } = await supabase.from('profiles').select('nickname').eq('id', comment.user_id).single();
    if (error) {
      console.error("Error fetching profile for reply:", error);
      setReplyingToNickname('Anonymous');
    } else {
      setReplyingToNickname(data?.nickname || 'Anonymous');
    }
  };
  const handleCommentPosted = () => {
    fetchComments();
    fetchPost();
    setReplyTo(null);
    setReplyingToNickname('');
  };
  const handleCancelReply = () => {
    setReplyTo(null);
    setReplyingToNickname('');
  };
  const topLevelComments = comments.filter(c => !c.parent_id);
  return <div className="mt-16 max-w-3xl mx-auto">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="glass-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
            <MessageCircle className="w-7 h-7 text-purple-300" />
            <h3 className="text-2xl font-bold gradient-text">Thoughts?</h3>
          </div>
          <SocialActions postSlug={postSlug} initialLikes={post?.likes} initialComments={post?.comments_count} showComments={true} />
        </div>
        
        <div className="space-y-8">
            <AnimatePresence>
            {topLevelComments.length > 0 ? topLevelComments.map(comment => <CommentItem key={comment.id} comment={comment} onReply={handleSetReplyTo} allComments={comments} />) : <div className="text-center py-8 text-foreground/60">
                    <p>Super Sad. :( No comments yet. Be the first! ✨</p>
                </div>}
            </AnimatePresence>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <CommentForm postSlug={postSlug} parentId={replyTo?.id} onCommentPosted={handleCommentPosted} onCancelReply={handleCancelReply} replyingToNickname={replyingToNickname} />
        </div>
      </motion.div>
    </div>;
};
export default CommentSection;