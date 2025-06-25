
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import { Report } from '@/types/report';
import { formatCurrency } from './paymentUtils';

interface SinglePaymentInterfaceProps {
  report: Report;
}

const SinglePaymentInterface: React.FC<SinglePaymentInterfaceProps> = ({ report }) => {
  const amount = report.loanInformation.loanAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Single Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Total Payment Required</div>
            <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
          </div>
          
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Full Payment Required</p>
                <p className="text-sm text-blue-700">
                  This loan requires full payment of {formatCurrency(amount)} to complete the repayment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SinglePaymentInterface;
