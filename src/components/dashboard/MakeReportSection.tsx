
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, FileText, Star, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MakeReportSection = () => {
  const reportTypes = [
    {
      title: "Business Review",
      description: "Share your experience with a company or service",
      icon: Star,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Issue Report",
      description: "Report problems or concerns about a business",
      icon: AlertCircle,
      color: "bg-red-100 text-red-600"
    },
    {
      title: "General Feedback",
      description: "Provide feedback or suggestions",
      icon: FileText,
      color: "bg-blue-100 text-blue-600"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Make a Report</h1>
        <p className="text-gray-600">Share your experiences to help build a more transparent community.</p>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((type, index) => {
          const Icon = type.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{type.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <Link to="/make-report">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Report
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Recent Reports</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <PenTool className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">ABC Company Review</p>
                    <p className="text-sm text-gray-600">Submitted 2 hours ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Published
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <PenTool className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">XYZ Service Feedback</p>
                    <p className="text-sm text-gray-600">Submitted 1 day ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  Under Review
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MakeReportSection;
