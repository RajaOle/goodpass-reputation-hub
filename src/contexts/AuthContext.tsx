
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, phone: string, fullName?: string) => Promise<{ error: any; data?: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  sendSmsOtp: (phone: string, email: string) => Promise<{ error: any }>;
  verifySmsOtp: (phone: string, email: string, otp: string) => Promise<{ error: any; data?: any }>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, phone: string, fullName?: string) => {
    try {
      console.log('Starting signup process for:', email, phone);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          toast({
            title: "Account Already Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return { error };
      }

      console.log('Signup successful, user created:', data.user?.id);

      // Don't show success toast here - we'll show it after phone verification
      return { error: null, data };
    } catch (error: any) {
      console.error('Signup exception:', error);
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const sendSmsOtp = async (phone: string, email: string) => {
    try {
      console.log('Sending SMS OTP to:', phone, 'for email:', email);
      
      const { data, error } = await supabase.functions.invoke('send-sms-otp', {
        body: { phone, email }
      });

      if (error) {
        console.error('SMS OTP send error:', error);
        toast({
          title: "SMS Failed",
          description: "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
        return { error };
      }

      console.log('SMS OTP sent successfully');
      return { error: null };
    } catch (error: any) {
      console.error('SMS OTP send exception:', error);
      toast({
        title: "SMS Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const verifySmsOtp = async (phone: string, email: string, otp: string) => {
    try {
      console.log('Verifying SMS OTP for:', phone, email, otp);
      
      const { data, error } = await supabase.functions.invoke('verify-sms-otp', {
        body: { phone, email, otp_code: otp }
      });

      if (error) {
        console.error('SMS OTP verification error:', error);
        toast({
          title: "Verification Failed",
          description: "Invalid or expired verification code. Please try again.",
          variant: "destructive",
        });
        return { error };
      }

      console.log('SMS OTP verified successfully');
      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully!",
      });
      
      return { error: null, data };
    } catch (error: any) {
      console.error('SMS OTP verification exception:', error);
      toast({
        title: "Verification Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        toast({
          title: "Google Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Google Sign In Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Sign In Successful",
        description: "Welcome back!",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signInWithGoogle,
    signIn,
    signOut,
    sendSmsOtp,
    verifySmsOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
