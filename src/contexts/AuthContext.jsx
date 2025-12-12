"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
  // const supabaseClient = useSupabaseClient(); // moved to outer scope
    const authClient = supabaseClient && supabaseClient.auth ? supabaseClient.auth : {
      async getSession() { return { data: { session: null }, error: null }; },
      onAuthStateChange() { return { data: { subscription: { unsubscribe: () => {} } } }; },
    };

    const fetchInitialSession = async () => {
      const { data: { session }, error } = await authClient.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
      }
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setIsLoading(false);
    };

    fetchInitialSession();

  const { data: { subscription } } = authClient.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
      if (event === 'USER_UPDATED') {
        setUser(session.user);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      }
      setIsLoading(false);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const fetchProfile = async (userId) => {
    setIsLoading(true);
    try {
  if (!supabaseClient) {
        setIsLoading(false);
        setProfile(null);
        return;
      }

      const { data, error, status } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && status !== 406) { 
        console.error('Error fetching profile:', error.message);
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Catch Error fetching profile:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({ email, password, name }) => {
    try {
      if (!name || name.trim() === "") {
        toast({ title: "Name Required", description: "Please enter your name or a nickname.", variant: "destructive" });
        throw new Error('Please enter your name or a nickname.');
      }

  const authClient = supabaseClient && supabaseClient.auth ? supabaseClient.auth : null;
      if (!authClient) {
        toast({ title: 'Registration Failed', description: 'Supabase is not configured.', variant: 'destructive' });
        throw new Error('Supabase is not configured.');
      }

      const { data, error } = await authClient.signUp({
        email: email.toLowerCase().trim(),
        password: password, 
        options: {
          emailRedirectTo: `${window.location.origin}`,
          data: {
            name: name.trim(),
          },
        }
      });

      if (error) {
        toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
        throw error;
      }
      
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast({
          title: "🤔 Hmmm...",
          description: "This email address is already in use. Try signing in!",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "🎉 Almost there!",
        description: `Hi ${name.trim()}! Please check your email to confirm your account.`,
      });

      return data.user; 
    } catch (error) {
      console.error("Registration error:", error.message);
      throw error;
    }
  };

  const login = async ({ email, password }) => {
    try {
  const authClient = supabaseClient && supabaseClient.auth ? supabaseClient.auth : null;
      if (!authClient) {
        toast({ title: 'Login Failed', description: 'Supabase is not configured.', variant: 'destructive' });
        throw new Error('Supabase is not configured.');
      }

      const { data, error } = await authClient.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (error) {
        toast({ title: "Login Failed", description: error.message, variant: "destructive" });
        throw error;
      }

      toast({
        title: `🌟 Welcome back, ${data.user.user_metadata.name || 'friend'}!`,
        description: "You've successfully signed in.",
      });

      return data.user;
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
  const authClient = supabaseClient && supabaseClient.auth ? supabaseClient.auth : null;
      if (!authClient) {
        setUser(null);
        setProfile(null);
        toast({ title: 'Logged out (mock)', description: 'You were logged out in mock mode.' });
        return;
      }

      const { error } = await authClient.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      toast({
        title: "👋 See you later!",
        description: "You've been logged out successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    profile,
    isLoading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    fetchProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};