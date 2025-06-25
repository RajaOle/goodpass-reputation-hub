
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, TrendingUp } from 'lucide-react';
import { Report } from '@/types/report';

interface StatsCardsProps {
  reports: Report[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ reports }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reports Submitted</CardTitle>
          <FileText className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reports.length}</div>
          <p className="text-xs text-gray-600">+{reports.filter(r => new Date(r.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length} from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Community Impact</CardTitle>
          <Users className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">248</div>
          <p className="text-xs text-gray-600">People helped by your reports</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">GP Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">750</div>
          <p className="text-xs text-green-600">+15 this week</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
