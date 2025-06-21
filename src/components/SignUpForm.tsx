
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CountryCodeSelector from './CountryCodeSelector';

interface PasswordValidation {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const SignUpForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

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

  const handleGoogleSignUp = () => {
    console.log('Google sign up clicked');
    // Implement Google OAuth here
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPasswordValid && doPasswordsMatch && email && phoneNumber) {
      setIsCreatingAccount(true);
      console.log('Creating account with:', { email, phoneNumber: `${countryCode}${phoneNumber}` });
      
      // Simulate account creation API call
      setTimeout(() => {
        setIsCreatingAccount(false);
        // Navigate to signup success page
        navigate('/signup-success');
      }, 1500);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md mx-auto">
        <DialogHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <img src="/lovable-uploads/c10eb088-0cd8-47ba-b004-d8600fb18116.png" alt="Goodpass Logo" className="h-8 w-auto" />
          </div>
          <DialogTitle className="text-2xl font-semibold text-gray-900">Create your account</DialogTitle>
          <p className="text-sm text-blue-600 cursor-pointer hover:underline">
            Or sign in to your existing account
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-4">Sign up</h3>
          </div>

          {/* Google Sign Up Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 hover:bg-gray-50"
            onClick={handleGoogleSignUp}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">OR CONTINUE WITH EMAIL</span>
            </div>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone number
              </Label>
              <div className="flex mt-1">
                <CountryCodeSelector
                  value={countryCode}
                  onChange={setCountryCode}
                />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="rounded-l-none"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Selected: {countryCode}xxxxxxxxx</p>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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
                Confirm password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
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

            {/* Create Account Button */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              disabled={!isPasswordValid || !doPasswordsMatch || !email || !phoneNumber || isCreatingAccount}
            >
              {isCreatingAccount ? 'Creating account...' : 'Create account'}
            </Button>

            {/* Back Button */}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {/* Terms and Privacy */}
            <p className="text-xs text-center text-gray-500 mt-4">
              By signing up, you agree to our{' '}
              <a href="/about-us/terms-of-use" className="text-blue-600 hover:underline">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="/about-us/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpForm;
