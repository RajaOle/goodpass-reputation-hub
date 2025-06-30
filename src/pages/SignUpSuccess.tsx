
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import SignUpSuccessComponent from '@/components/SignUpSuccess';

const SignUpSuccess = () => {
  const location = useLocation();
  
  // Get the signup data from the location state
  const signUpData = location.state?.signUpData;
  
  // If no signup data is available, redirect to home
  if (!signUpData) {
    return <Navigate to="/" replace />;
  }

  return <SignUpSuccessComponent signUpData={signUpData} />;
};

export default SignUpSuccess;
