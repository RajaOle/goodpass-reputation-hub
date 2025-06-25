
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CreditCard, CheckCircle } from 'lucide-react';
import { Report } from '@/types/report';
import { formatCurrency } from './paymentUtils';

interface SinglePaymentInterfaceProps {
  report: Report;
}

const SinglePaymentInterface: React.FC<SinglePaymentInterfaceProps> = ({ report }) => {
  const amount = report.loanInformation.loanAmount;

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <CreditCard className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-gray-900">Single Payment</CardTitle>
            <p className="text-sm text-gray-600 mt-1">One-time full payment</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Amount Display */}
        <div className="bg-white rounded-xl p-8 border border-purple-100 text-center">
          <div className="mb-4">
            <div className="text-sm font-medium text-purple-600 uppercase tracking-wide mb-2">
              Total Payment Required
            </div>
            <div className="text-4xl font-bold text-purple-700 mb-2">
              {formatCurrency(amount)}
            </div>
            <div className="text-sm text-gray-600">
              Complete loan repayment
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Initial</div>
              <div className="font-semibold text-gray-900">{formatCurrency(amount)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Outstanding</div>
              <div className="font-semibold text-gray-900">{formatCurrency(amount)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Required</div>
              <div className="font-semibold text-purple-700">{formatCurrency(amount)}</div>
            </div>
          </div>
        </div>
        
        {/* Information Panel */}
        <div className="bg-white rounded-xl p-6 border border-purple-100">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Instructions</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>This loan requires a single, full payment to complete repayment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Upload your payment proof after completing the transfer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Payment will be verified and loan status updated accordingly</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-purple-800">Awaiting Payment</span>
            </div>
            <div className="text-sm text-purple-600">
              Single payment due
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SinglePaymentInterface;
