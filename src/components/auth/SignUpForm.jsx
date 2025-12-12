import React, { useState } from 'react';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { Mail, KeyRound, User } from 'lucide-react';
    
    const SignUpForm = ({ onSuccess, onSwitchToLogin }) => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [nickname, setNickname] = useState('');
      const [loading, setLoading] = useState(false);
      const { signUp } = useAuth();
      const { toast } = useToast();
    
      const handleSignUp = async (e) => {
        e.preventDefault();
        if (!/^[a-zA-Z0-9 ]{1,50}$/.test(nickname)) {
          toast({
            variant: "destructive",
            title: "Invalid Nickname",
            description: "Nickname must be 1-50 characters and only contain letters, numbers, and spaces.",
          });
          return;
        }
        setLoading(true);
        
        const { data, error } = await signUp(email, password, {
          data: { nickname: nickname },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        });
    
        setLoading(false);
    
        if (!error && data.user) {
          toast({
            title: "🎉 Almost there!",
            description: "Please check your email to confirm your account.",
          });
          onSuccess();
        }
      };
    
      return (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-['Nunito_Sans'] gradient-text mb-2">Create Your Account</h1>
            <p className="text-gray-300">Join our magical world! ✨</p>
          </div>
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="signup-nickname">Public Nickname</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="signup-nickname"
                  type="text"
                  placeholder="e.g. SparkleDreamer"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  maxLength="50"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="signup-email"
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
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                 <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full" variant="cta">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="font-semibold text-pink-500 hover:text-blue-400">
              Sign In
            </button>
          </p>
        </div>
      );
    };
    
    export default SignUpForm;