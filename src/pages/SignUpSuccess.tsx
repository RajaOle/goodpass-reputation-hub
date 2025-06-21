
import React from 'react';
import SignUpSuccessComponent from '@/components/SignUpSuccess';

const SignUpSuccess = () => {
  // In a real app, this data would come from the signup process
  const mockSignUpData = {
    email: 'user@example.com',
    phoneNumber: '1234567890',
    countryCode: '+1'
  };

  return <SignUpSuccessComponent signUpData={mockSignUpData} />;
};

export default SignUpSuccess;
