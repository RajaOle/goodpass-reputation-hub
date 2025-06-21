
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface WelcomeMessageProps {
  fullName: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ fullName }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Logo */}
          <div className="mb-6">
            <Link to="/">
              <img 
                src="/lovable-uploads/c10eb088-0cd8-47ba-b004-d8600fb18116.png" 
                alt="Goodpass Logo" 
                className="h-8 w-auto mx-auto cursor-pointer hover:opacity-80 transition-opacity" 
              />
            </Link>
          </div>

          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Goodpass!</h1>
            <p className="text-gray-600">Your account has been created successfully</p>
          </div>

          {/* Get Started Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-blue-600 mb-4">Get Started</h2>
            <p className="text-gray-700 mb-6">
              Write reports into Goodpass to make the community a better place
            </p>
            <p className="text-sm text-gray-600 mb-8">
              Start contributing to a more transparent and trustworthy ecosystem.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">Build Community Trust</h3>
                  <p className="text-sm text-gray-600">
                    Help create a transparent ecosystem where everyone benefits from shared financial insights.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">Improve Your GP Score</h3>
                  <p className="text-sm text-gray-600">
                    Contributing quality reports helps establish your credibility and improve your Goodpass Score.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                Go to Dashboard
              </Button>
              <Link to="/make-report" className="block">
                <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">
                  Start writing your first report →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
