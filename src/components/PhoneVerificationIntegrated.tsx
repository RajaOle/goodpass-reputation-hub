
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface PhoneVerificationIntegratedProps {
  phoneNumber: string;
  email: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

const PhoneVerificationIntegrated: React.FC<PhoneVerificationIntegratedProps> = ({
  phoneNumber,
  email,
  onVerificationSuccess,
  onBack
}) => {
  const { sendSmsOtp, verifySmsOtp } = useAuth();
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Start countdown and send initial OTP
  useEffect(() => {
    console.log('PhoneVerification mounted for:', phoneNumber, email);
    handleSendOtp();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    console.log('Sending OTP to:', phoneNumber);
    
    const { error } = await sendSmsOtp(phoneNumber, email);
    
    setIsSendingOtp(false);
    
    if (!error) {
      setCountdown(60);
      setCanResend(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsVerifying(true);
    console.log('Verifying OTP:', otp, 'for:', phoneNumber);
    
    const { error } = await verifySmsOtp(phoneNumber, email, otp);
    
    setIsVerifying(false);
    
    if (!error) {
      onVerificationSuccess();
    } else {
      // Clear OTP on error
      setOtp('');
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    await handleSendOtp();
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.length <= 4) return phone;
    return phone.slice(0, -4) + '****';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <img src="/lovable-uploads/c10eb088-0cd8-47ba-b004-d8600fb18116.png" alt="Goodpass Logo" className="h-8 w-auto" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Verify your phone number</h2>
        <p className="text-sm text-gray-600">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-sm font-medium text-gray-900">
          {formatPhoneNumber(phoneNumber)}
        </p>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div>
          <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
            Verification Code
          </Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="mt-1 text-center text-lg tracking-widest"
            maxLength={6}
            required
            autoFocus
          />
        </div>

        {/* Verify Button */}
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          disabled={otp.length !== 6 || isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify Phone Number'}
        </Button>
      </form>

      {/* Resend Section */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">Didn't receive the code?</p>
        
        {!canResend ? (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Resend in {countdown}s</span>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={handleResendOtp}
            disabled={isSendingOtp}
            className="text-blue-600 hover:text-blue-700"
          >
            {isSendingOtp ? 'Sending...' : 'Resend Code'}
          </Button>
        )}
      </div>

      {/* Back Button */}
      <Button 
        type="button" 
        variant="outline" 
        onClick={onBack}
        className="w-full flex items-center justify-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign Up
      </Button>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Make sure to check your messages and enter the code exactly as received.
        </p>
      </div>
    </div>
  );
};

export default PhoneVerificationIntegrated;
