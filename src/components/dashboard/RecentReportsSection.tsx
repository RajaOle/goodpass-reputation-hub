
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Edit, RefreshCw, CreditCard } from 'lucide-react';
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

  return (
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
                    onClick={() => onProcessReport(report)}
                    className="flex items-center justify-center space-x-1 text-xs sm:text-sm w-full sm:w-auto"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Process</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onRestructure(report)}
                    className="flex items-center justify-center space-x-1 text-xs sm:text-sm w-full sm:w-auto"
                  >
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Restructure</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onProcessPayment(report)}
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
  );
};

export default RecentReportsSection;
