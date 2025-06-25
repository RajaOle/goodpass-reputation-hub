import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { FileText, Users, TrendingUp, Plus, Edit, RefreshCw, CreditCard, Calendar, DollarSign } from 'lucide-react';
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
      pending: { label: '🟡 Under Review', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      verified: { label: '✅ Verified', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      rejected: { label: '❌ Rejected', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
      'partially-verified': { label: '⚠️ Partially Verified', variant: 'secondary' as const, color: 'bg-orange-100 text-orange-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
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

  const formatDueDate = (report: Report) => {
    if (report.loanInformation.dueDate) {
      const dueDate = new Date(report.loanInformation.dueDate);
      const now = new Date();
      const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays < 0) {
        return { text: `Overdue by ${Math.abs(diffInDays)} days`, color: 'text-red-600' };
      } else if (diffInDays === 0) {
        return { text: 'Due today', color: 'text-orange-600' };
      } else if (diffInDays <= 7) {
        return { text: `Due in ${diffInDays} days`, color: 'text-orange-600' };
      } else {
        return { text: `Due in ${diffInDays} days`, color: 'text-gray-600' };
      }
    }
    return { text: 'No due date', color: 'text-gray-500' };
  };

  const getPaymentProgress = (report: Report) => {
    if (report.paymentInfo) {
      const { totalPaid = 0, remainingBalance = 0 } = report.paymentInfo;
      const totalAmount = totalPaid + remainingBalance;
      const percentage = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;
      return { totalPaid, remainingBalance, percentage };
    }
    return { totalPaid: 0, remainingBalance: report.loanInformation.loanAmount, percentage: 0 };
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

      {/* Enhanced Recent Reports Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Recent Reports</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report) => {
            const dueDate = formatDueDate(report);
            const paymentProgress = getPaymentProgress(report);

            return (
              <Card key={report.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                        {report.reporteeInformation.fullName}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusBadge(report.status)}
                        <span className="text-sm text-gray-500">{getTimeAgo(report.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Loan Amount and Payment Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Loan Amount</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(report.loanInformation.loanAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className={`font-semibold ${dueDate.color}`}>
                          {dueDate.text}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Progress */}
                  {paymentProgress.percentage > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">Payment Progress</span>
                        <span className="text-sm font-medium text-gray-900">{paymentProgress.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${paymentProgress.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Paid: {formatCurrency(paymentProgress.totalPaid)}</span>
                        <span>Remaining: {formatCurrency(paymentProgress.remainingBalance)}</span>
                      </div>
                    </div>
                  )}

                  {/* Loan Details */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span className="capitalize">
                      {report.loanInformation.paymentMethod === 'installments' ? 'Installment' : 
                       report.loanInformation.paymentMethod === 'one-time' ? 'One-Time' : 'Open Payment'}
                    </span>
                    <span className="capitalize">{report.loanInformation.loanType} Loan</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleProcessReport(report)}
                      className="flex-1 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 hover:border-blue-300 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Process
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRestructure(report)}
                      className="flex-1 bg-white hover:bg-orange-50 border-orange-200 text-orange-700 hover:text-orange-800 hover:border-orange-300 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Restructure
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleProcessPayment(report)}
                      className="flex-1 bg-white hover:bg-green-50 border-green-200 text-green-700 hover:text-green-800 hover:border-green-300 transition-colors"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
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
