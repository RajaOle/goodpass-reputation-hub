import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PhoneVerificationProps {
  phoneNumber: string;
  onVerified: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ phoneNumber, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minutes
  const [showChangeNumber, setShowChangeNumber] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Send initial OTP when component mounts
  useEffect(() => {
    sendOtp();
  }, []);

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

  const sendOtp = async () => {
    if (isSendingOtp) return;
    
    setIsSendingOtp(true);
    try {
      console.log('Sending OTP to:', phoneNumber);
      
      // Use the new fixed endpoint
      const { data, error } = await supabase.functions.invoke('send-sms-otp-fixed', {
        body: { 
          phone: phoneNumber,
          userId: user?.id 
        }
      });

      if (error) {
        console.error('Error sending OTP:', error);
        toast({
          title: "Error",
          description: "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('OTP sent successfully:', data);
      
      // Show the OTP in development mode
      if (data?.otp) {
        toast({
          title: "Development Mode",
          description: `Your verification code is: ${data.otp}`,
          duration: 10000,
        });
      } else {
        toast({
          title: "Code Sent",
          description: "Verification code sent to your phone number.",
        });
      }

      setCanResend(false);
      setCountdown(180); // Reset countdown to 3 minutes
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

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
    try {
      console.log('Verifying OTP:', otpValue, 'for phone:', phoneNumber);
      
      // Use the new fixed verification endpoint
      if (user?.id) {
        const { data, error } = await supabase.functions.invoke('verify-sms-otp-fixed', {
          body: { 
            userId: user.id,
            phone: phoneNumber,
            otpCode: otpValue
          }
        });

        if (error) {
          console.error('Error verifying OTP:', error);
          toast({
            title: "Verification Failed",
            description: "Invalid or expired verification code. Please try again.",
            variant: "destructive",
          });
          setOtp('');
          return;
        }

        if (data?.success) {
          console.log('Phone verification completed successfully');
          toast({
            title: "Success",
            description: "Phone number verified and updated successfully!",
          });
          onVerified();
        } else {
          toast({
            title: "Verification Failed",
            description: data?.error || "Invalid or expired verification code. Please try again.",
            variant: "destructive",
          });
          setOtp('');
        }
      } else {
        toast({
          title: "Error",
          description: "User not found. Please try signing in again.",
          variant: "destructive",
        });
        setOtp('');
      }
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
      setOtp('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = () => {
    if (!canResend || isSendingOtp) return;
    setOtp('');
    sendOtp();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
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
                disabled={!canResend || isSendingOtp}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                {isSendingOtp ? 'Sending...' : 
                 canResend ? 'Resend code' : 
                 `Resend in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`}
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
