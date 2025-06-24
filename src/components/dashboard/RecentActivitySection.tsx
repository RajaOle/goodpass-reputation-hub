
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  CheckCircle, 
  User, 
  RefreshCw, 
  CreditCard,
  Clock
} from 'lucide-react';
import { ActivityLog } from '@/types/report';

const RecentActivitySection = () => {
  // Mock activity data - in real app this would come from API
  const activities: ActivityLog[] = [
    {
      id: '1',
      reportId: 'R001',
      action: 'Report submitted successfully',
      timestamp: '2024-01-20T14:30:00Z',
      details: 'Personal loan report for John Doe'
    },
    {
      id: '2',
      reportId: 'R001',
      action: 'GP Score updated',
      timestamp: '2024-01-20T15:00:00Z',
      details: 'Score increased to 750'
    },
    {
      id: '3',
      reportId: 'R002',
      action: 'Profile completed',
      timestamp: '2024-01-19T10:15:00Z',
      details: 'All required information provided'
    },
    {
      id: '4',
      reportId: 'R002',
      action: 'Restructure proposed',
      timestamp: '2024-01-19T11:00:00Z',
      details: 'Payment method change from full to installment'
    },
    {
      id: '5',
      reportId: 'R003',
      action: 'Installment marked paid',
      timestamp: '2024-01-18T16:45:00Z',
      details: 'Cicilan 2 marked as Lunas'
    },
    {
      id: '6',
      reportId: 'R001',
      action: 'Report verified',
      timestamp: '2024-01-18T09:20:00Z',
      details: 'Approved by admin review'
    }
  ];

  const getActivityIcon = (action: string) => {
    if (action.includes('submitted')) return <FileText className="h-4 w-4 text-blue-600" />;
    if (action.includes('verified') || action.includes('approved')) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (action.includes('profile') || action.includes('completed')) return <User className="h-4 w-4 text-purple-600" />;
    if (action.includes('restructure')) return <RefreshCw className="h-4 w-4 text-orange-600" />;
    if (action.includes('payment') || action.includes('installment')) return <CreditCard className="h-4 w-4 text-indigo-600" />;
    if (action.includes('score')) return <Badge className="h-4 w-4 text-yellow-600" />;
    return <Clock className="h-4 w-4 text-gray-600" />;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Activity</h2>
        <p className="text-gray-600">Timeline of your recent actions and updates.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  {activity.details && (
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.details}
                    </p>
                  )}
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-400">
                      Report ID: {activity.reportId}
                    </span>
                  </div>
                </div>
                {index < activities.length - 1 && (
                  <div className="absolute left-6 mt-6 w-px h-6 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Activity
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivitySection;
