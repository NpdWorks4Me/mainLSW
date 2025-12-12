"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from '@/components/ui/use-toast';
import { progressConfig } from '@/contexts/ProgressContext';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  const createNewProfile = useCallback(async (userId, nickname = null, avatar_url = null) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ id: userId, nickname, avatar_url, updated_at: new Date().toISOString() })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating new profile:', error);
      return null;
    }
    return data;
  }, []);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    
    // Use maybeSingle() to avoid PGRST116 error when profile doesn't exist
    // This returns { data: null, error: null } if no row is found, instead of throwing an error
    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      return;
    }

    // If no data is returned, it means the profile doesn't exist yet
    if (!data) {
      console.warn('Profile not found for user, creating one.');
      data = await createNewProfile(userId);
      if (!data) {
        console.error('Failed to create profile after not finding one.');
        setProfile(null);
        return;
      }
    }
    
    setProfile(data || null);
  }, [createNewProfile]);

  const handleSession = useCallback(async (currentSession) => {
    setSession(currentSession);
    const currentUser = currentSession?.user ?? null;
    setUser(currentUser);
    
    if (currentUser) {
      await fetchProfile(currentUser.id);
    } else {
      setProfile(null);
    }
    
    setLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    // Make a small internal auth client wrapper that falls back to no-op implementations
    // when Supabase is not configured. This prevents runtime errors when `supabase` is null
    // and ensures the app continues to function in mock mode.
  const authClient = supabase && supabase.auth ? supabase.auth : {
      async getSession() { return { data: { session: null } }; },
      onAuthStateChange(_handler) { return { data: { subscription: { unsubscribe: () => {} } } }; },
      async signUp() { return { data: null, error: new Error('Supabase not configured') }; },
      async signInWithPassword() { return { data: null, error: new Error('Supabase not configured') }; },
      async signOut() { return { error: null }; },
    };

    const getSessionAndProfile = async () => {
      setLoading(true);
      const { data: { session } } = await authClient.getSession();
      await handleSession(session);
    };

    getSessionAndProfile();

    const authChange = authClient.onAuthStateChange(
      async (_event, session) => {
        if (_event === 'SIGNED_IN' && session) {
          if (supabase && supabase.rpc) {
            try {
              const { data, error } = await supabase.rpc('add_points_daily', {
                p_user_id: session.user.id,
                p_points_to_add: progressConfig.pointValues.LOGIN,
                p_activity_type: progressConfig.activityTypes.LOGIN
              });
              if (!error && data && data.success) {
                toast({ title: '✨ Welcome back!', description: `You earned ${progressConfig.pointValues.LOGIN} points for logging in!` });
              }
            } catch (rpcErr) {
              console.error('RPC add_points_daily failed', rpcErr);
            }
          }
        }
        await handleSession(session);
      }
    );

    return () => {
      try { authChange?.data?.subscription?.unsubscribe?.(); } catch (e) { /* ignore */ }
    };
  }, [handleSession, toast, supabase]);

  const signUp = useCallback(async (email, password, options) => {
    const authClient = supabase && supabase.auth ? supabase.auth : null;
    if (!authClient) {
      toast({ variant: 'destructive', title: 'Sign up Failed', description: 'Supabase not configured.' });
      return { data: null, error: new Error('Supabase not configured') };
    }

    const { data, error } = await authClient.signUp({
      email,
      password,
      options,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { data, error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const authClient = supabase && supabase.auth ? supabase.auth : null;
    if (!authClient) {
      toast({ variant: 'destructive', title: 'Sign in Failed', description: 'Supabase not configured.' });
      return { data: null, error: new Error('Supabase not configured') };
    }

    const { data, error } = await authClient.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { data, error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const authClient = supabase && supabase.auth ? supabase.auth : null;
    if (!authClient) {
      toast({ variant: 'destructive', title: 'Sign out Failed', description: 'Supabase not configured.' });
      return { error: new Error('Supabase not configured') };
    }

    const { error } = await authClient.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    profile,
    loading,
    setProfile,
    signUp,
    signIn,
    signOut,
  }), [user, session, profile, loading, setProfile, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};