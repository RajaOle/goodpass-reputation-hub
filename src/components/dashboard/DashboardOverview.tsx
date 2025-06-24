import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { FileText, Users, TrendingUp, Plus, Edit, RefreshCw, CreditCard } from 'lucide-react';
import NewReportDialog from '../report-dialog/NewReportDialog';
import ReportDetailsDialog from './ReportDetailsDialog';
import PaymentDialog from './PaymentDialog';
import RestructureDialog from './RestructureDialog';
import { Report } from '@/types/report';
import { useReports } from '@/contexts/ReportsContext';

const DashboardOverview = () => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isRestructureOpen, setIsRestructureOpen] = useState(false);
  const { reports } = useReports();

  // Mock recent activities
  const recentActivities = [
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '🟡 Under Review', variant: 'secondary' as const },
      verified: { label: '✅ Verified', variant: 'default' as const },
      rejected: { label: '❌ Rejected', variant: 'destructive' as const },
      'partially-verified': { label: '⚠️ Partially Verified', variant: 'secondary' as const }
    };

    return (
      <Badge variant={statusConfig[status as keyof typeof statusConfig]?.variant || 'secondary'}>
        {statusConfig[status as keyof typeof statusConfig]?.label || status}
      </Badge>
    );
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

  const handleProcessReport = (report: Report) => {
    setSelectedReport(report);
    setIsDetailsOpen(true);
  };

  const handleRestructure = (report: Report) => {
    setSelectedReport(report);
    setIsRestructureOpen(true);
  };

  const handleProcessPayment = (report: Report) => {
    setSelectedReport(report);
    setIsPaymentOpen(true);
  };

  const handleActivityClick = (activity: any) => {
    if (activity.type === 'report-submitted' && activity.reportId) {
      const report = reports.find(r => r.id === activity.reportId.replace('R00', ''));
      if (report) {
        handleProcessReport(report);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
        <p className="text-gray-600">Here's what's happening with your Goodpass account today.</p>
      </div>

      {/* Stats Cards */}
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

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex justify-start">
          <Button 
            className="h-16 bg-blue-600 hover:bg-blue-700 text-white justify-start"
            onClick={() => setIsReportDialogOpen(true)}
          >
            <Plus className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Write New Report</div>
              <div className="text-sm opacity-90">Share your experience</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Recent Reports</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{report.reporteeInformation.fullName}</h3>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{formatCurrency(report.loanInformation.loanAmount)}</span>
                      <span className="capitalize">{report.loanInformation.paymentMethod === 'installments' ? 'Installment' : 'One-Time'}</span>
                      <span>{getTimeAgo(report.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleProcessReport(report)}
                      className="flex items-center space-x-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Process</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRestructure(report)}
                      className="flex items-center space-x-1"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Restructure</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleProcessPayment(report)}
                      className="flex items-center space-x-1"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Payment</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className={`flex items-start space-x-3 ${activity.type === 'report-submitted' ? 'cursor-pointer hover:bg-gray-50 p-2 rounded-lg -m-2' : ''}`}
                  onClick={() => handleActivityClick(activity)}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <NewReportDialog 
        open={isReportDialogOpen} 
        onOpenChange={setIsReportDialogOpen} 
      />

      {selectedReport && (
        <>
          <ReportDetailsDialog
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            report={selectedReport}
          />
          <PaymentDialog
            open={isPaymentOpen}
            onOpenChange={setIsPaymentOpen}
            report={selectedReport}
          />
          <RestructureDialog
            open={isRestructureOpen}
            onOpenChange={setIsRestructureOpen}
            report={selectedReport}
          />
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
