
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, RefreshCw, CreditCard, Calendar, DollarSign } from 'lucide-react';
import { Report } from '@/types/report';

interface RecentReportsSectionProps {
  reports: Report[];
  onProcessReport: (report: Report) => void;
  onRestructure: (report: Report) => void;
  onProcessPayment: (report: Report) => void;
}

const RecentReportsSection: React.FC<RecentReportsSectionProps> = ({
  reports,
  onProcessReport,
  onRestructure,
  onProcessPayment
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Under Review', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      verified: { label: 'Verified', variant: 'default' as const, color: 'bg-green-100 text-green-700 border-green-200' },
      rejected: { label: 'Rejected', variant: 'destructive' as const, color: 'bg-red-100 text-red-700 border-red-200' },
      'partially-verified': { label: 'Partially Verified', variant: 'outline' as const, color: 'bg-orange-100 text-orange-700 border-orange-200' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      variant: 'outline' as const, 
      color: 'bg-gray-100 text-gray-700 border-gray-200' 
    };

    return (
      <Badge variant="outline" className={`${config.color} border font-medium`}>
        {config.label}
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

  const formatDueDate = (report: Report) => {
    if (report.loanInformation.dueDate) {
      const dueDate = new Date(report.loanInformation.dueDate);
      const now = new Date();
      const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays < 0) {
        return { text: `Overdue by ${Math.abs(diffInDays)} days`, color: 'text-red-600 font-medium' };
      } else if (diffInDays === 0) {
        return { text: 'Due today', color: 'text-orange-600 font-medium' };
      } else if (diffInDays <= 7) {
        return { text: `Due in ${diffInDays} days`, color: 'text-orange-600 font-medium' };
      } else {
        return { text: `Due in ${diffInDays} days`, color: 'text-gray-700' };
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

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Recent Reports</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => {
          const dueDate = formatDueDate(report);
          const paymentProgress = getPaymentProgress(report);

          return (
            <Card key={report.id} className="border border-gray-200 hover:shadow-md transition-all duration-200 bg-white">
              <CardHeader className="pb-4 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                      {report.reporteeInformation.fullName}
                    </h3>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(report.status)}
                      <span className="text-sm text-gray-500 font-medium">{getTimeAgo(report.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Key Information Row */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-50 rounded-lg">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Loan Amount</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(report.loanInformation.loanAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Due Date</p>
                      <p className={`text-sm font-semibold ${dueDate.color}`}>
                        {dueDate.text}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4 pb-5">
                {/* Payment Progress Section */}
                {paymentProgress.percentage > 0 && (
                  <div className="mb-5 p-3 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Payment Progress</span>
                      <span className="text-sm font-semibold text-gray-900">{paymentProgress.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${paymentProgress.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span className="font-medium">Paid: {formatCurrency(paymentProgress.totalPaid)}</span>
                      <span className="font-medium">Remaining: {formatCurrency(paymentProgress.remainingBalance)}</span>
                    </div>
                  </div>
                )}

                {/* Loan Details */}
                <div className="flex items-center justify-between text-sm mb-5 p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-600 font-medium">
                    Payment: <span className="text-gray-900 capitalize">
                      {report.loanInformation.paymentMethod === 'installments' ? 'Installment' : 
                       report.loanInformation.paymentMethod === 'one-time' ? 'One-Time' : 'Open Payment'}
                    </span>
                  </span>
                  <span className="text-gray-600 font-medium">
                    Type: <span className="text-gray-900 capitalize">{report.loanInformation.loanType}</span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onProcessReport(report)}
                    className="flex-1 h-9 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 font-medium transition-all duration-200"
                  >
                    <Edit className="h-4 w-4 mr-1.5" />
                    Process
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onRestructure(report)}
                    className="flex-1 h-9 bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700 hover:text-orange-800 font-medium transition-all duration-200"
                  >
                    <RefreshCw className="h-4 w-4 mr-1.5" />
                    Restructure
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onProcessPayment(report)}
                    className="flex-1 h-9 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800 font-medium transition-all duration-200"
                  >
                    <CreditCard className="h-4 w-4 mr-1.5" />
                    Add Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RecentReportsSection;
