import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PageHelmet from '@/components/PageHelmet';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Edit, Save, Loader2, Shield, Heart, PawPrint, Cookie, BookOpen, Star, Award, Zap, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserProfileBadge from '@/components/UserProfileBadge';

const avatarOptions = [
  { id: 'alien', url: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/a7364cbc02a10924a2ba2e519ad328c1.png' },
  { id: 'goth', url: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/7d29636c2dee30bef33f936605597e75.png' },
  { id: 'princess', url: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/01da06f6a11f2c65fe53dee161a5c841.png' },
  { id: 'dino', url: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/bbf550d0526deab2d870a274ed64e574.png' },
  { id: 'baby', url: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/b58f9a1c2f53252f97bc6677f0104419.png' },
];

const ProfilePage = () => {
  const { user, profile, fetchProfile } = useAuth();
  const { toast } = useToast();

  const [nickname, setNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [innerChildAge, setInnerChildAge] = useState('');
  const [activities, setActivities] = useState('');
  const [favoriteAnimal, setFavoriteAnimal] = useState('');
  const [favoriteSnack, setFavoriteSnack] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [bio, setBio] = useState('');
  const [badges, setBadges] = useState([]);
  const [reputation, setReputation] = useState(0);
  const [achievements, setAchievements] = useState({});

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const fetchUserProgress = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('user_progress')
      .select('points, level, badges, achievements')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error fetching user progress:', error);
    } else if (data) {
      setReputation(data.points);
      setBadges(data.badges || []);
      setAchievements(data.achievements || {});
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || '');
      setAvatarUrl(profile.avatar_url || '');
      setInnerChildAge(profile.inner_child_age || '');
      setActivities(profile.activities || '');
      setFavoriteAnimal(profile.favorite_animal || '');
      setFavoriteSnack(profile.favorite_snack || '');
      setIsPrivate(profile.is_private || false);
      setBio(profile.bio || '');
      setLoading(false);
    } else if (user) {
      // If user exists but profile is null, it means profile is still loading or doesn't exist
      // We can set loading to false and let the user create a profile
      setLoading(false);
    }
  }, [profile, user]);

  useEffect(() => {
    fetchUserProgress();
  }, [fetchUserProgress]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to update your profile.',
      });
      setIsSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          nickname,
          avatar_url: avatarUrl,
          inner_child_age: innerChildAge,
          activities,
          favorite_animal: favoriteAnimal,
          favorite_snack: favoriteSnack,
          is_private: isPrivate,
          bio,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Profile Update Failed',
        description: error.message,
      });
    } else {
      toast({
        title: 'Profile Updated! 🎉',
        description: 'Your profile has been successfully saved.',
      });
      await fetchProfile(); // Re-fetch profile to ensure local state is in sync
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen px-6 sm:px-8 md:px-12">
        <Loader2 className="w-12 h-12 animate-spin text-pink-300" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 px-6 sm:px-8 md:px-12">
        <h1 className="text-3xl gradient-text">Access Denied</h1>
        <p className="text-lg text-foreground/70 mt-4">Please log in to view your profile.</p>
        <Button asChild className="mt-6">
          <Link to="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHelmet
        title={`${profile?.nickname || 'My'} Profile`}
        description="Manage your Little Space World profile, update your preferences, and view your progress and achievements."
        canonical="/profile"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-10 px-6 sm:px-8 md:px-12"
      >
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
              <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="border-purple-300 text-purple-200 hover:bg-purple-500/20">
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-col items-center mb-8">
              <Avatar className="h-24 w-24 mb-4 border-4 border-pink-300 shadow-lg">
                <AvatarImage src={avatarOptions.find(a => a.id === avatarUrl)?.url || avatarUrl} alt={nickname || 'User'} />
                <AvatarFallback className="text-3xl font-bold bg-purple-500 text-white">{getInitials(nickname)}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="flex space-x-2 mt-2">
                  {avatarOptions.map(option => (
                    <motion.img
                      key={option.id}
                      src={option.url}
                      alt={option.id}
                      className={`h-12 w-12 rounded-full cursor-pointer border-2 ${avatarUrl === option.id ? 'border-pink-400' : 'border-transparent'} hover:border-pink-400 transition-all`}
                      onClick={() => setAvatarUrl(option.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              )}
              <h2 className="text-3xl font-bold text-white mt-4">{nickname || 'Set Your Nickname'}</h2>
              <p className="text-foreground/70 text-lg">{user.email}</p>
              <UserProfileBadge nickname={nickname} avatarUrl={avatarUrl} badges={badges} />
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="nickname">Nickname</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Your display name"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Tell us a little about yourself..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="innerChildAge">Inner Child Age</Label>
                  <Input
                    id="innerChildAge"
                    value={innerChildAge}
                    onChange={(e) => setInnerChildAge(e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., 3-5, 7, teen"
                  />
                </div>
                <div>
                  <Label htmlFor="activities">Favorite Activities</Label>
                  <Input
                    id="activities"
                    value={activities}
                    onChange={(e) => setActivities(e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., coloring, watching cartoons"
                  />
                </div>
                <div>
                  <Label htmlFor="favoriteAnimal">Favorite Animal</Label>
                  <Input
                    id="favoriteAnimal"
                    value={favoriteAnimal}
                    onChange={(e) => setFavoriteAnimal(e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., bunny, dinosaur"
                  />
                </div>
                <div>
                  <Label htmlFor="favoriteSnack">Favorite Snack</Label>
                  <Input
                    id="favoriteSnack"
                    value={favoriteSnack}
                    onChange={(e) => setFavoriteSnack(e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., cookies, fruit snacks"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="isPrivate" className="text-white">Keep profile private?</Label>
                <Switch
                  id="isPrivate"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full" variant="cta">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="mt-12 space-y-8">
              <h2 className="text-3xl font-bold gradient-text">My Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 flex items-center space-x-4">
                  <Star className="h-10 w-10 text-yellow-400" />
                  <div>
                    <p className="text-foreground/70">Reputation Points</p>
                    <p className="text-3xl font-bold text-white">{reputation}</p>
                  </div>
                </div>
                <div className="glass-card p-6 flex items-center space-x-4">
                  <Award className="h-10 w-10 text-blue-400" />
                  <div>
                    <p className="text-foreground/70">Badges Earned</p>
                    <p className="text-3xl font-bold text-white">{badges.length}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Badges</h3>
                {badges.length === 0 ? (
                  <p className="text-foreground/70">No badges earned yet. Keep exploring and interacting!</p>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {badges.map((badge, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-2 bg-purple-500/20 rounded-full px-4 py-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Zap className="h-5 w-5 text-yellow-300" />
                        <span className="text-white font-semibold">{badge.name}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass-card p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Achievements</h3>
                {Object.keys(achievements).length === 0 ? (
                  <p className="text-foreground/70">No achievements unlocked yet. Keep playing and exploring!</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(achievements).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-white">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProfilePage;