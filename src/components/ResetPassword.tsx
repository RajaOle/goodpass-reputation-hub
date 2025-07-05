import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";

interface PasswordValidation {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  useEffect(() => {
    // Parse hash fragment for tokens (Supabase sends tokens in hash fragment)
    const hash = window.location.hash.substring(1); // Remove the # symbol
    const params = new URLSearchParams(hash);
    
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    
    // Also check query parameters as fallback
    const queryAccessToken = searchParams.get('access_token');
    const queryRefreshToken = searchParams.get('refresh_token');
    
    const finalAccessToken = accessToken || queryAccessToken;
    const finalRefreshToken = refreshToken || queryRefreshToken;
    
    if (!finalAccessToken || !finalRefreshToken) {
      // Redirect to forgot password if tokens are missing
      navigate('/forgot-password');
      return;
    }

    // Set the session with the tokens
    const setSession = async () => {
      const { error } = await supabase.auth.setSession({
        access_token: finalAccessToken,
        refresh_token: finalRefreshToken,
      });

      if (error) {
        console.error('Error setting session:', error);
        navigate('/forgot-password');
      }
    };

    setSession();
  }, [searchParams, navigate]);

  const validatePassword = (pwd: string) => {
    const validation = {
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
    setPasswordValidation(validation);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const doPasswordsMatch = password === confirmPassword && confirmPassword !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid || !doPasswordsMatch) {
      return;
    }

    setIsLoading(true);

    const { error } = await updatePassword(password);
    
    setIsLoading(false);
    
    if (!error) {
      setIsSuccess(true);
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  if (isSuccess) {
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
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Password updated!</h2>
                <p className="text-gray-600">
                  Your password has been successfully updated. You will be redirected to the sign in page shortly.
                </p>
              </div>
              
              <Button 
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Set new password</CardTitle>
            <p className="text-gray-600 text-sm mt-2">
              Please enter your new password below
            </p>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  New Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                
                {/* Password Validation */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className={`text-xs ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                      • At least 8 characters
                    </div>
                    <div className={`text-xs ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                      • One uppercase letter
                    </div>
                    <div className={`text-xs ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                      • One lowercase letter
                    </div>
                    <div className={`text-xs ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                      • One number
                    </div>
                    <div className={`text-xs ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                      • One special character
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {confirmPassword && !doPasswordsMatch && (
                  <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!isPasswordValid || !doPasswordsMatch || isLoading}
              >
                {isLoading ? 'Updating password...' : 'Update password'}
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

export default ResetPassword;
