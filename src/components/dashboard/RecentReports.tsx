import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, CreditCard, Calendar, DollarSign } from 'lucide-react';
import { Report } from '@/types/report';
import PaymentProgressBar from './PaymentProgressBar';
import DualStatusBadge from './DualStatusBadge';

interface RecentReportsProps {
  reports: Report[];
  onProcessReport: (report: Report) => void;
  onRestructure: (report: Report) => void;
  onProcessPayment: (report: Report) => void;
}

const RecentReports: React.FC<RecentReportsProps> = ({
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

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Recent Reports</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => {
          const dueDate = formatDueDate(report);

          return (
            <Card key={report.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                      {report.reporteeInformation.fullName}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <DualStatusBadge 
                        verificationStatus={report.status} 
                        reportStatus={report.reportStatus}
                      />
                      <span className="text-sm text-gray-500">{getTimeAgo(report.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Loan Amount and Due Date */}
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

                {/* Payment Progress Bar with comprehensive payment history */}
                <PaymentProgressBar report={report} formatCurrency={formatCurrency} />

                {/* Loan Details */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span className="capitalize">
                    {report.loanInformation.paymentMethod === 'installments' ? 'Installment' : 
                     report.loanInformation.paymentMethod === 'one-time' ? 'One-Time' : 'Open Payment'}
                  </span>
                  <span className="capitalize">{report.loanInformation.loanType} Loan</span>
                </div>

                {/* Action Buttons - Updated labels for clarity */}
                <div className="flex justify-center">
                  <div className="flex gap-2 w-full max-w-md">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onProcessReport(report)}
                      className="flex-1 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 hover:border-blue-300 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Process
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onRestructure(report)}
                      className="flex-1 bg-white hover:bg-orange-50 border-orange-200 text-orange-700 hover:text-orange-800 hover:border-orange-300 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Restructure
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onProcessPayment(report)}
                      className="flex-1 bg-white hover:bg-green-50 border-green-200 text-green-700 hover:text-green-800 hover:border-green-300 transition-colors"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Method
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RecentReports;
