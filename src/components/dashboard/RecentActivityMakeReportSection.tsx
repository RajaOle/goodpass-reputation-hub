
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Report } from '@/types/report';

interface Activity {
  id: string;
  reportId: string;
  borrowerName: string;
  message: string;
  timestamp: string;
  type: string;
}

interface RecentActivityMakeReportSectionProps {
  reports: Report[];
  onActivityClick: (activity: Activity) => void;
}

const RecentActivityMakeReportSection: React.FC<RecentActivityMakeReportSectionProps> = ({
  reports,
  onActivityClick
}) => {
  const recentActivities: Activity[] = [
    {
      id: '1',
      reportId: 'R001',
      borrowerName: 'John Doe',
      message: '✅ Report Submitted — Your loan report for John Doe is now under review',
      timestamp: '2024-01-20T14:30:00Z',
      type: 'report-submitted'
    },
    {
      id: '2',
      reportId: '',
      borrowerName: '',
      message: 'GP Score increased by 15 points',
      timestamp: '2024-01-20T15:00:00Z',
      type: 'score-update'
    },
    {
      id: '3',
      reportId: 'R002',
      borrowerName: 'Jane Smith',
      message: '✅ Report Submitted — Your loan report for Jane Smith is now under review',
      timestamp: '2024-01-19T10:15:00Z',
      type: 'report-submitted'
    }
  ];

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
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Recent Activity</h2>
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity) => (
              <div 
                key={activity.id} 
                className={`flex items-start space-x-3 ${activity.type === 'report-submitted' ? 'cursor-pointer hover:bg-gray-50 p-2 rounded-lg -m-2' : ''}`}
                onClick={() => onActivityClick(activity)}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium break-words">{activity.message}</p>
                  <p className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivityMakeReportSection;
