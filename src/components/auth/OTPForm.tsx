
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import CountryCodeSelector from '@/components/CountryCodeSelector';

type OTPStep = 'input' | 'verify';
type OTPType = 'email' | 'phone';

const OTPForm = () => {
  const [step, setStep] = useState<OTPStep>('input');
  const [otpType, setOtpType] = useState<OTPType>('email');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { sendEmailOTP, sendPhoneOTP, verifyOTP } = useAuth();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let error;
    if (otpType === 'email') {
      if (!email) {
        toast({
          title: "Email Required",
          description: "Please enter your email address",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      const result = await sendEmailOTP(email);
      error = result.error;
    } else {
      if (!phoneNumber) {
        toast({
          title: "Phone Number Required",
          description: "Please enter your phone number",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      const fullPhone = `${countryCode}${phoneNumber}`;
      const result = await sendPhoneOTP(fullPhone);
      error = result.error;
    }

    if (error) {
      toast({
        title: "Failed to Send OTP",
        description: error.message || "An error occurred while sending OTP",
        variant: "destructive",
      });
    } else {
      toast({
        title: "OTP Sent",
        description: `OTP has been sent to your ${otpType}`,
      });
      setStep('verify');
    }
    
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) return;

    setIsLoading(true);
    
    const { error } = await verifyOTP(otpCode, otpType);
    
    if (error) {
      toast({
        title: "OTP Verification Failed",
        description: error.message || "Invalid OTP code",
        variant: "destructive",
      });
    } else {
      toast({
        title: "OTP Verified",
        description: "You have been successfully authenticated",
      });
    }
    
    setIsLoading(false);
  };

  const handleBackToInput = () => {
    setStep('input');
    setOtpCode('');
  };

  if (step === 'verify') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Enter Verification Code</h3>
          <p className="text-sm text-gray-600">
            We've sent a 6-digit code to your {otpType === 'email' ? 'email' : 'phone number'}
          </p>
          <p className="text-sm font-medium text-gray-900 mt-1">
            {otpType === 'email' ? email : `${countryCode}${phoneNumber}`}
          </p>
        </div>

        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otpCode}
              onChange={setOtpCode}
              disabled={isLoading}
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

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={otpCode.length !== 6 || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>

          <div className="text-center space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToInput}
              className="w-full"
            >
              Back to {otpType === 'email' ? 'Email' : 'Phone'} Input
            </Button>
            
            <button
              type="button"
              onClick={handleSendOTP}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
              disabled={isLoading}
            >
              Resend Code
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-4">Choose OTP Method</h3>
      </div>

      {/* OTP Type Selection */}
      <div className="flex space-x-2">
        <Button
          type="button"
          variant={otpType === 'email' ? 'default' : 'outline'}
          onClick={() => setOtpType('email')}
          className="flex-1"
        >
          Email OTP
        </Button>
        <Button
          type="button"
          variant={otpType === 'phone' ? 'default' : 'outline'}
          onClick={() => setOtpType('phone')}
          className="flex-1"
        >
          Phone OTP
        </Button>
      </div>

      <form onSubmit={handleSendOTP} className="space-y-4">
        {otpType === 'email' ? (
          <div>
            <Label htmlFor="otp-email" className="text-sm font-medium text-gray-700">
              Email address
            </Label>
            <Input
              id="otp-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              required
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="otp-phone" className="text-sm font-medium text-gray-700">
              Phone number
            </Label>
            <div className="flex mt-1">
              <CountryCodeSelector
                value={countryCode}
                onChange={setCountryCode}
              />
              <Input
                id="otp-phone"
                type="tel"
                placeholder="123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                className="rounded-l-none"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Selected: {countryCode}{phoneNumber || 'xxxxxxxxx'}
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading || (otpType === 'email' ? !email : !phoneNumber)}
        >
          {isLoading ? 'Sending...' : `Send OTP to ${otpType === 'email' ? 'Email' : 'Phone'}`}
        </Button>
      </form>
    </div>
  );
};

export default OTPForm;
