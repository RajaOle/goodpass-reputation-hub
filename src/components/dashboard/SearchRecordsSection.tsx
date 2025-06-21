
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star, MapPin } from 'lucide-react';

const SearchRecordsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const sampleResults = [
    {
      id: 1,
      title: "ABC Electronics Store",
      rating: 4.5,
      location: "New York, NY",
      reportCount: 23,
      lastReport: "2 days ago"
    },
    {
      id: 2,
      title: "XYZ Consulting Services",
      rating: 3.8,
      location: "Los Angeles, CA",
      reportCount: 15,
      lastReport: "1 week ago"
    },
    {
      id: 3,
      title: "QuickFix Auto Repair",
      rating: 4.2,
      location: "Chicago, IL",
      reportCount: 31,
      lastReport: "3 days ago"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Records</h1>
        <p className="text-gray-600">Find reports and reviews from the Goodpass community.</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for businesses, services, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Results</h2>
        <div className="space-y-4">
          {sampleResults.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{result.title}</h3>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{result.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{result.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{result.reportCount} reports</span>
                      <span>Last report: {result.lastReport}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Searches */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Searches</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {["Electronics", "Restaurants", "Auto Repair", "Healthcare", "Real Estate", "Financial Services"].map((tag) => (
                <Button key={tag} variant="outline" size="sm" className="text-sm">
                  {tag}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SearchRecordsSection;
