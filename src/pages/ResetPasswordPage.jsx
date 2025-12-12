import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageHelmet from '@/components/PageHelmet';
import { motion } from 'framer-motion';
import { Lock, CheckCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // If no user is logged in, it means the user is coming from a reset password email link
        // Supabase automatically handles the session for the user when they click the link
        // We don't need to do anything specific here other than ensure the user is authenticated
        // before allowing them to reset the password.
      }
    };
    checkUser();
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match',
        description: 'Please make sure your new password and confirmation match.',
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Password Reset Failed',
        description: error.message,
      });
    } else {
      setResetSuccess(true);
      toast({
        title: 'Password Reset Successful! 🎉',
        description: 'Your password has been updated. You can now log in with your new password.',
      });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  return (
    <>
      <PageHelmet title="Reset Password" description="Set a new password for your Little Space World account." />
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-6 sm:px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="auth-glass-card">
            <div className="text-center mb-8">
              <Lock className="mx-auto h-12 w-12 text-pink-400 mb-4" />
              <h1 className="text-3xl font-bold font-['Nunito_Sans'] gradient-text mb-2">Reset Your Password</h1>
              <p className="text-gray-300">Enter your new password below.</p>
            </div>
            {resetSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6 rounded-lg bg-green-500/20 text-green-300"
              >
                <CheckCircle className="mx-auto h-16 w-16 mb-4" />
                <p className="text-xl font-semibold">Password reset successfully!</p>
                <p className="mt-2">Redirecting to login...</p>
              </motion.div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full" variant="cta">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPasswordPage;