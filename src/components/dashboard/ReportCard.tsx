import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, DollarSign, FileText, User, Hash } from 'lucide-react';
import { Report } from '@/types/report';
import ReportStatusBadge from './ReportStatusBadge';
import PaymentProgressBar from './PaymentProgressBar';
import ReportActionButtons from './ReportActionButtons';

interface ReportCardProps {
  report: Report;
  onProcessReport: (report: Report) => void;
  onRestructure: (report: Report) => void;
  onProcessPayment: (report: Report) => void;
  onAddInfo: (report: Report) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onProcessReport,
  onRestructure,
  onProcessPayment,
  onAddInfo
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

  const getOutstandingAmount = (report: Report) => {
    if (report.paymentInfo && report.paymentInfo.remainingBalance !== undefined) {
      return report.paymentInfo.remainingBalance;
    }
    return report.loanInformation.loanAmount;
  };

  const dueDate = formatDueDate(report);
  const outstandingAmount = getOutstandingAmount(report);

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-all duration-200 bg-white">
      <CardHeader className="pb-4 border-b border-gray-100">
        {/* Reportee Name and Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Reportee</p>
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {report.reporteeInformation.fullName}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ReportStatusBadge status={report.status} />
              <span className="text-sm text-gray-500 font-medium">{getTimeAgo(report.createdAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Loan Name and ID */}
        <div className="grid grid-cols-1 gap-3 pt-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-50 rounded-lg">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Loan Name</p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {report.loanInformation.loanName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-50 rounded-lg">
              <Hash className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Loan ID</p>
              <p className="text-sm font-semibold text-gray-900">
                R00{report.id}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 pb-5">
        {/* Amount Information */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-50 rounded-lg">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Initial Amount</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(report.loanInformation.loanAmount)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-50 rounded-lg">
              <DollarSign className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Outstanding</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(outstandingAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-2 mb-4">
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

        {/* Payment Progress Section */}
        <PaymentProgressBar report={report} formatCurrency={formatCurrency} />

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
        <ReportActionButtons
          report={report}
          onProcessReport={onProcessReport}
          onRestructure={onRestructure}
          onAddInfo={onAddInfo}
        />
      </CardContent>
    </Card>
  );
};

export default ReportCard;
