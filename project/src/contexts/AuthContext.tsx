import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase - single instance only
const supabaseUrl = 'https://czkeaamatbtmzzvgrbas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6a2VhYW1hdGJ0bXp6dmdyYmFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTMzMjMsImV4cCI6MjA2NTk4OTMyM30.NyC1TRFLN2SD8oiOBBHblAdmDgzZBojgBnusvOiQVAM';

export const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
  id: string;
  email: string;
  name: string;
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
    // Simple session check on startup
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.email?.split('@')[0] || 'User'
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔍 Simple login starting...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('📋 Login result:', { data, error });

      if (error) {
        console.error('❌ Login error:', error.message);
        return false;
      }

      if (data.user) {
        console.log('✅ Setting user:', data.user);
        
        // Set user immediately
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.email?.split('@')[0] || 'User'
        });
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('💥 Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return !error;
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
      setUser(null);
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
