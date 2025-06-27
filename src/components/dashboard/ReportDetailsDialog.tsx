import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Report } from '@/types/report';
import { 
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Edit,
  FileText
} from 'lucide-react';
import { generateInstallments } from './payment/paymentUtils';

interface ReportDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: Report;
}

const ReportDetailsDialog: React.FC<ReportDetailsDialogProps> = ({
  open,
  onOpenChange,
  report
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'partially-verified':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Report Details</span>
            <Badge variant={report.status === 'verified' ? 'default' : 'secondary'} className="ml-2">
              {getStatusIcon(report.status)}
              <span className="ml-1 capitalize">{report.status.replace('-', ' ')}</span>
            </Badge>
          </DialogTitle>
          <DialogDescription>
            View detailed information about this report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reportee Information */}
          <Card>
            <CardHeader>
              <CardTitle>Reportee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Full Name:</span>
                <span className="ml-2">{report.reporteeInformation.fullName}</span>
              </div>
              <div>
                <span className="font-medium">Phone Number:</span>
                <span className="ml-2">{report.reporteeInformation.phoneNumber}</span>
              </div>
              {report.reporteeInformation.email && (
                <div>
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{report.reporteeInformation.email}</span>
                </div>
              )}
              {report.reporteeInformation.nationalId && (
                <div>
                  <span className="font-medium">National ID:</span>
                  <span className="ml-2">{report.reporteeInformation.nationalId}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Loan Information */}
          <Card>
            <CardHeader>
              <CardTitle>Loan Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Loan Type:</span>
                <span className="ml-2 capitalize">{report.loanInformation.loanType}</span>
              </div>
              <div>
                <span className="font-medium">Loan Amount:</span>
                <span className="ml-2">{formatCurrency(report.loanInformation.loanAmount)}</span>
              </div>
              <div>
                <span className="font-medium">Loan Term:</span>
                <span className="ml-2">{report.loanInformation.loanTerm} months</span>
              </div>
              <div>
                <span className="font-medium">Monthly Payment:</span>
                <span className="ml-2">{formatCurrency(report.loanInformation.monthlyPayment)}</span>
              </div>
              <div>
                <span className="font-medium">Loan Purpose:</span>
                <p className="mt-1 text-sm text-gray-600">{report.loanInformation.loanPurpose}</p>
              </div>
              {report.loanInformation.collateral && (
                <div>
                  <span className="font-medium">Collateral:</span>
                  <p className="mt-1 text-sm text-gray-600">{report.loanInformation.collateral}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          {report.paymentInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Payment Method:</span>
                  <span className="ml-2 capitalize">{report.paymentInfo.method}</span>
                </div>
                <div>
                  <span className="font-medium">Payment Status:</span>
                  <Badge variant={report.paymentInfo.status === 'paid' ? 'default' : 'secondary'} className="ml-2">
                    {report.paymentInfo.status === 'paid' ? 'Paid' : 'Unpaid'}
                  </Badge>
                </div>
                {['installment', 'installments'].includes(report.paymentInfo.method) && (
                  <div>
                    <span className="font-medium">Installments:</span>
                    <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                      {generateInstallments(report).map((installment) => (
                        <div key={installment.number} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>Installment {installment.number}</span>
                          <span>{formatCurrency(installment.amount)}</span>
                          <span className="text-sm text-gray-500">{new Date(installment.dueDate).toLocaleDateString()}</span>
                          <Badge variant={installment.status === 'paid' ? 'default' : 'secondary'}>
                            {installment.status === 'paid' ? 'Paid' : 'Unpaid'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {report.paymentInfo.openPayments && (
                  <div>
                    <span className="font-medium">Open Payments:</span>
                    <div className="mt-2 space-y-2">
                      {report.paymentInfo.openPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{formatCurrency(payment.amount)}</span>
                          <span className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</span>
                          <span className="text-sm">Balance: {formatCurrency(payment.runningBalance)}</span>
                          {payment.notes && (
                            <span className="text-sm text-gray-400">{payment.notes}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {report.paymentInfo.totalPaid && (
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex justify-between">
                          <span className="font-medium">Total Paid:</span>
                          <span>{formatCurrency(report.paymentInfo.totalPaid)}</span>
                        </div>
                        {report.paymentInfo.remainingBalance && (
                          <div className="flex justify-between">
                            <span className="font-medium">Remaining Balance:</span>
                            <span>{formatCurrency(report.paymentInfo.remainingBalance)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Report Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Report Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-2">{new Date(report.createdAt).toLocaleString()}</span>
              </div>
              {report.submittedAt && (
                <div>
                  <span className="font-medium">Submitted:</span>
                  <span className="ml-2">{new Date(report.submittedAt).toLocaleString()}</span>
                </div>
              )}
              {report.reviewedAt && (
                <div>
                  <span className="font-medium">Reviewed:</span>
                  <span className="ml-2">{new Date(report.reviewedAt).toLocaleString()}</span>
                </div>
              )}
              {report.reviewedBy && (
                <div>
                  <span className="font-medium">Reviewed By:</span>
                  <span className="ml-2">{report.reviewedBy}</span>
                </div>
              )}
              {report.rejectionReason && (
                <div>
                  <span className="font-medium">Rejection Reason:</span>
                  <p className="mt-1 text-sm text-red-600">{report.rejectionReason}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsDialog;
