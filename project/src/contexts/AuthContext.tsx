import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = 'https://czkeaamatbtmzzvgrbas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6a2VhYW1hdGJ0bXp6dmdyYmFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTMzMjMsImV4cCI6MjA2NTk4OTMyM30.NyC1TRFLN2SD8oiOBBHblAdmDgzZBojgBnusvOiQVAM';

export const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
  id: string;
  email: string;
  name: string;
  subscription_plan?: string;
  subscription_status?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await setUserFromAuth(session.user);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await setUserFromAuth(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const setUserFromAuth = async (authUser: any) => {
    try {
      // Get or create user profile
      let { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // User profile doesn't exist, create it
        const newProfile = {
          id: authUser.id,
          email: authUser.email,
          name: authUser.email?.split('@')[0] || 'User',
          subscription_plan: 'free',
          subscription_status: 'active'
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          profile = newProfile; // Use the data we tried to insert
        } else {
          profile = createdProfile;
        }
      }

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          subscription_plan: profile.subscription_plan,
          subscription_status: profile.subscription_status
        });
      }
    } catch (error) {
      console.error('Error setting user from auth:', error);
      // Fallback to basic user data
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.email?.split('@')[0] || 'User'
      });
    }
  };

const login = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log('🔍 Starting login process...');
    console.log('📧 Email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('📋 Supabase response:', { data, error });

    if (error) {
      console.error('❌ Login error:', error.message);
      alert('Login failed: ' + error.message); // Temporary alert
      return false;
    }

    if (data.user) {
      console.log('✅ Login successful! User:', data.user);
      alert('Login successful!'); // Temporary alert
    }

    return !!data.user;
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    alert('Unexpected error: ' + error); // Temporary alert
    return false;
  }
};

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        return false;
      }

      // Note: User will be set when the auth state change event fires
      return !!data.user;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('Reset password error:', error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null); // Clear user even if logout fails
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      resetPassword,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
