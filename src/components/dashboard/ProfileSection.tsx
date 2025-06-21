
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Star, TrendingUp, Award, FileText } from 'lucide-react';

const ProfileSection = () => {
  const achievements = [
    { name: "First Report", icon: FileText, earned: true },
    { name: "Helpful Reviewer", icon: Star, earned: true },
    { name: "Community Leader", icon: Award, earned: false },
    { name: "Trusted Voice", icon: TrendingUp, earned: false }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">View and manage your public profile information.</p>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src="" alt="John Doe" />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-bold">
                  JD
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-bold text-gray-900 mb-1">John Doe</h2>
              <p className="text-gray-600 mb-4">john@example.com</p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined March 2024</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>New York, NY</span>
                </div>
              </div>
              
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* GP Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Goodpass Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-blue-600">750</div>
                  <p className="text-sm text-gray-600">Good Standing</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">+15</div>
                  <p className="text-sm text-gray-600">This week</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>0</span>
                <span>500</span>
                <span>1000</span>
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">12</div>
                <p className="text-sm text-gray-600">Reports</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">248</div>
                <p className="text-sm text-gray-600">Helpful Votes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">2</div>
                <p className="text-sm text-gray-600">Achievements</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-purple-600" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border text-center ${
                    achievement.earned 
                      ? 'bg-purple-50 border-purple-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <Icon className={`h-8 w-8 mx-auto mb-2 ${
                    achievement.earned ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <h3 className={`font-medium text-sm ${
                    achievement.earned ? 'text-purple-900' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </h3>
                  {achievement.earned && (
                    <Badge className="mt-2 bg-purple-100 text-purple-800">
                      Earned
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">ABC Electronics Store</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Great customer service and competitive prices. Highly recommend for electronics purchases.
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm">5.0</span>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                  <Badge className="bg-green-100 text-green-800">Published</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">XYZ Consulting Services</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Professional team with good expertise, but response time could be improved.
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm">3.5</span>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
