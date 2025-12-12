import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageHelmet from '@/components/PageHelmet';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(email, password, nickname);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message,
      });
    } else {
      toast({
        title: 'Welcome to Little Space World! 🎉',
        description: 'Please check your email to confirm your account.',
      });
      navigate('/confirmation');
    }
    setLoading(false);
  };

  return (
    <>
      <PageHelmet title="Sign Up" description="Create an account on Little Space World to join our community, access exclusive content, and personalize your experience." />
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-6 sm:px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="auth-glass-card">
            <div className="text-center mb-8">
              <UserPlus className="mx-auto h-12 w-12 text-pink-400 mb-4" />
              <h1 className="text-3xl font-bold font-['Nunito_Sans'] gradient-text mb-2">Join Little Space World</h1>
              <p className="text-gray-300">Create your account and start your journey!</p>
            </div>
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nickname">Nickname</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="Choose your nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full" variant="cta">
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-pink-500 hover:text-blue-400">
                Log In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SignUpPage;