
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, RefreshCw, CreditCard, Eye, Search } from 'lucide-react';
import NewReportDialog from '../report-dialog/NewReportDialog';
import ReportDetailsDialog from './ReportDetailsDialog';
import PaymentDialog from './PaymentDialog';
import RestructureDialog from './RestructureDialog';
import { Report } from '@/types/report';
import { useReports } from '@/contexts/ReportsContext';

const MakeReportSection = () => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isRestructureOpen, setIsRestructureOpen] = useState(false);
  const { reports } = useReports();

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

  const handleActivityClick = (activity: any) => {
    if (activity.type === 'report-submitted' && activity.reportId) {
      const report = reports.find(r => r.id === activity.reportId.replace('R00', ''));
      if (report) {
        handleProcessReport(report);
      }
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Quick Actions */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="flex justify-start">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white justify-start h-14 sm:h-16 w-auto px-4 sm:px-6"
            onClick={() => setIsReportDialogOpen(true)}
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
            <div className="text-left">
              <div className="font-medium text-sm sm:text-base">Write New Report</div>
              <div className="text-xs sm:text-sm opacity-90">Share your experience</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Your Recent Reports */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Your Recent Reports</h2>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{report.reporteeInformation.fullName}</h3>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                      <span className="font-medium">{formatCurrency(report.loanInformation.loanAmount)}</span>
                      <span className="capitalize">{report.loanInformation.paymentMethod === 'installments' ? 'Installment' : 'One-Time'}</span>
                      <span>{getTimeAgo(report.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleProcessReport(report)}
                      className="flex items-center justify-center space-x-1 text-xs sm:text-sm w-full sm:w-auto"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Process</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRestructure(report)}
                      className="flex items-center justify-center space-x-1 text-xs sm:text-sm w-full sm:w-auto"
                    >
                      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Restructure</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleProcessPayment(report)}
                      className="flex items-center justify-center space-x-1 text-xs sm:text-sm w-full sm:w-auto"
                    >
                      <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
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
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className={`flex items-start space-x-3 ${activity.type === 'report-submitted' ? 'cursor-pointer hover:bg-gray-50 p-2 rounded-lg -m-2' : ''}`}
                  onClick={() => handleActivityClick(activity)}
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

export default MakeReportSection;
