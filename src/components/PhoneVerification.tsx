
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PhoneVerificationProps {
  phoneNumber: string;
  onVerified: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ phoneNumber, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [showChangeNumber, setShowChangeNumber] = useState(false);

  // Rate limiter countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    // Auto-verify when 6 digits are entered
    if (value.length === 6) {
      handleVerify(value);
    }
  };

  const handleVerify = async (otpValue: string = otp) => {
    if (otpValue.length !== 6) return;
    
    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Verifying OTP:', otpValue);
      setIsVerifying(false);
      onVerified();
    }, 1500);
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    
    console.log('Resending OTP to:', phoneNumber);
    setCanResend(false);
    setCountdown(180); // 3 minutes
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <Link to="/login" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Link>
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

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your phone number</h2>
            <p className="text-gray-600">
              We've sent a 6-digit code to{' '}
              <span className="font-medium">{phoneNumber}</span>
            </p>
          </div>

          <div className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                disabled={isVerifying}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Verify Button */}
            <Button
              onClick={() => handleVerify()}
              disabled={otp.length !== 6 || isVerifying}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isVerifying ? 'Verifying...' : 'Verify Code'}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
              <Button
                variant="outline"
                onClick={handleResendOtp}
                disabled={!canResend}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                {canResend ? 'Resend code' : `Resend in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`}
              </Button>
            </div>

            {/* Change Phone Number */}
            <div className="text-center">
              <button
                onClick={() => setShowChangeNumber(!showChangeNumber)}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Wrong number? Change it
              </button>
            </div>

            {showChangeNumber && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  To change your phone number, please go back and sign up again with the correct number.
                </p>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Back to Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
