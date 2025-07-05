import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, try to sign in with the email to check if it exists
      // We'll use a dummy password to trigger the "Invalid login credentials" error
      // which indicates the email exists but password is wrong
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'dummy-password-for-email-check'
      });

      // If we get "Invalid login credentials", the email exists
      // If we get "Email not confirmed" or other errors, the email might exist
      // If we get "Invalid login credentials" with specific message about email, it might not exist
      
      // For now, we'll proceed with the reset password request
      // Supabase will handle the security aspect of not revealing if an email exists
      const { error } = await resetPassword(email);
      
      setIsLoading(false);
      
      if (!error) {
        setIsSubmitted(true);
      }
    } catch (error: any) {
      setIsLoading(false);
      // Even if there's an error, we'll show the success message for security
      // This prevents email enumeration attacks
      setIsSubmitted(true);
    }
  };

  const handleBackClick = () => {
    navigate('/login');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link to="/">
              <img 
                src="/lovable-uploads/c10eb088-0cd8-47ba-b004-d8600fb18116.png" 
                alt="Goodpass Logo" 
                className="h-8 w-auto mx-auto mb-8 cursor-pointer hover:opacity-80 transition-opacity" 
              />
            </Link>
          </div>
          
          <Card className="shadow-lg border-0">
            <CardContent className="px-8 py-8 text-center">
              <div className="mb-6">
                <Mail className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                <p className="text-gray-600">
                  If an account with <span className="font-medium text-gray-900">{email}</span> exists, 
                  we've sent password reset instructions to that email address.
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or try again with a different email address.
                </p>
                
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="w-full"
                >
                  Try again
                </Button>
                
                <Button 
                  onClick={handleBackClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Sign In
          </button>
        </div>

        {/* Logo */}
        <div className="text-center">
          <Link to="/">
            <img 
              src="/lovable-uploads/c10eb088-0cd8-47ba-b004-d8600fb18116.png" 
              alt="Goodpass Logo" 
              className="h-8 w-auto mx-auto mb-8 cursor-pointer hover:opacity-80 transition-opacity" 
            />
          </Link>
        </div>
        
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Reset your password</CardTitle>
            <p className="text-gray-600 text-sm mt-2">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="mt-1"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading || !email}
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
