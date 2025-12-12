import React, { useState } from 'react';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Checkbox } from '@/components/ui/checkbox';
    import { useToast } from '@/components/ui/use-toast';
    import { Mail, KeyRound } from 'lucide-react';
    import { Link } from 'react-router-dom';
    
    const LoginForm = ({ onSuccess, onSwitchToSignup }) => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [rememberDevice, setRememberDevice] = useState(true);
      const [loading, setLoading] = useState(false);
      const { signIn } = useAuth();
      const { toast } = useToast();
    
      const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const { data, error } = await signIn(email, password);
    
        setLoading(false);
        if (!error && data.user) {
          toast({
            title: "🌟 Welcome back!",
            description: "You've successfully signed in.",
          });
          onSuccess();
        }
      };
    
      return (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-['Nunito_Sans'] gradient-text mb-2">Welcome Back!</h1>
            <p className="text-gray-300">Let's continue the adventure. 💖</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="login-email"
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
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" checked={rememberDevice} onCheckedChange={setRememberDevice} />
                <label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" onClick={onSuccess} className="text-sm text-pink-500 hover:text-blue-400 font-semibold">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" disabled={loading} className="w-full" variant="cta">
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-300">
            Don't have an account?{' '}
            <button onClick={onSwitchToSignup} className="font-semibold text-pink-500 hover:text-blue-400">
              Sign Up
            </button>
          </p>
        </div>
      );
    };
    
    export default LoginForm;