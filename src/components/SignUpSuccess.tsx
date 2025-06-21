
import React, { useState } from 'react';
import PhoneVerification from './PhoneVerification';
import FullNameForm from './FullNameForm';
import WelcomeMessage from './WelcomeMessage';

export interface SignUpData {
  email: string;
  phoneNumber: string;
  countryCode: string;
}

interface SignUpSuccessProps {
  signUpData: SignUpData;
}

type Step = 'phone-verification' | 'full-name' | 'welcome';

const SignUpSuccess: React.FC<SignUpSuccessProps> = ({ signUpData }) => {
  const [currentStep, setCurrentStep] = useState<Step>('phone-verification');
  const [fullName, setFullName] = useState('');

  const handlePhoneVerified = () => {
    setCurrentStep('full-name');
  };

  const handleFullNameSubmitted = (name: string) => {
    setFullName(name);
    setCurrentStep('welcome');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'phone-verification':
        return (
          <PhoneVerification
            phoneNumber={`${signUpData.countryCode}${signUpData.phoneNumber}`}
            onVerified={handlePhoneVerified}
          />
        );
      case 'full-name':
        return (
          <FullNameForm
            onSubmit={handleFullNameSubmitted}
          />
        );
      case 'welcome':
        return (
          <WelcomeMessage
            fullName={fullName}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentStep()}
    </div>
  );
};

export default SignUpSuccess;
