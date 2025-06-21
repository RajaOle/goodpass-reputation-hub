
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LogoutSection = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, this would clear authentication tokens, etc.
    console.log('Logging out user...');
    navigate('/');
  };

  const handleCancel = () => {
    // Return to dashboard overview
    window.history.back();
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <Card className="border-orange-200">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">Confirm Logout</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Are you sure you want to log out of your Goodpass account?
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Yes, Log Out
            </Button>
            
            <Button 
              onClick={handleCancel}
              variant="outline" 
              className="w-full"
            >
              Cancel
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>You'll need to sign in again to access your account.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoutSection;
