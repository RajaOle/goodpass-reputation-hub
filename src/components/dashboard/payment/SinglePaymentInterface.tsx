
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CreditCard, CheckCircle, DollarSign, Calendar, FileText } from 'lucide-react';
import { Report } from '@/types/report';
import { formatCurrency } from './paymentUtils';

interface SinglePaymentInterfaceProps {
  report: Report;
}

const SinglePaymentInterface: React.FC<SinglePaymentInterfaceProps> = ({ report }) => {
  const amount = report.loanInformation.loanAmount;
  const dueDate = report.loanInformation.dueDate;
  const isOverdue = dueDate ? new Date() > new Date(dueDate) : false;
  const daysUntilDue = dueDate ? Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : null;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-xl">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-2xl text-gray-900">Single Payment</CardTitle>
            <p className="text-sm text-gray-600 mt-1">One-time full payment to complete the loan</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Payment Amount Display */}
        <div className="bg-white rounded-xl p-8 border border-purple-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <DollarSign className="h-6 w-6 text-purple-600" />
              <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                Total Payment Required
              </div>
            </div>
            <div className="text-5xl font-bold text-purple-700 mb-3">
              {formatCurrency(amount)}
            </div>
            <div className="text-gray-600">
              Complete loan repayment in one transaction
            </div>
          </div>

          {/* Payment Timeline */}
          {dueDate && (
            <div className={`p-4 rounded-lg ${isOverdue ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className={`h-4 w-4 ${isOverdue ? 'text-red-600' : 'text-blue-600'}`} />
                <span className={`text-sm font-medium ${isOverdue ? 'text-red-800' : 'text-blue-800'}`}>
                  {isOverdue ? 'Payment Overdue' : 'Payment Due'}
                </span>
              </div>
              <div className={`text-sm ${isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
                {new Date(dueDate).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              {!isOverdue && daysUntilDue !== null && (
                <div className="text-xs text-blue-600 mt-1">
                  {daysUntilDue > 0 ? `${daysUntilDue} days remaining` : 'Due today'}
                </div>
              )}
              {isOverdue && daysUntilDue !== null && (
                <div className="text-xs text-red-600 mt-1">
                  {Math.abs(daysUntilDue)} days overdue
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loan Summary */}
        <div className="bg-white rounded-xl p-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Loan Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Original Amount</div>
              <div className="text-lg font-semibold text-gray-900">{formatCurrency(amount)}</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-xs text-orange-600 uppercase tracking-wide mb-1">Outstanding</div>
              <div className="text-lg font-semibold text-orange-700">{formatCurrency(amount)}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-xs text-purple-600 uppercase tracking-wide mb-1">Required Payment</div>
              <div className="text-lg font-semibold text-purple-700">{formatCurrency(amount)}</div>
            </div>
          </div>
        </div>
        
        {/* Information Panel */}
        <div className="bg-white rounded-xl p-6 border border-purple-100">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Instructions</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">This loan requires a single, full payment of <strong>{formatCurrency(amount)}</strong> to complete repayment</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Upload your payment proof documentation after completing the bank transfer</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Payment will be verified within 1-2 business days and loan status updated accordingly</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Upon verification, your loan will be marked as fully paid and closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className={`bg-gradient-to-r rounded-xl p-5 border-2 ${
          isOverdue 
            ? 'from-red-100 to-red-50 border-red-200' 
            : 'from-purple-100 to-indigo-100 border-purple-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full animate-pulse ${
                isOverdue ? 'bg-red-500' : 'bg-purple-500'
              }`}></div>
              <span className={`font-semibold ${
                isOverdue ? 'text-red-800' : 'text-purple-800'
              }`}>
                {isOverdue ? 'Payment Overdue' : 'Awaiting Payment'}
              </span>
            </div>
            <div className={`text-sm font-medium ${
              isOverdue ? 'text-red-600' : 'text-purple-600'
            }`}>
              {isOverdue ? 'Action Required' : 'Single payment due'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SinglePaymentInterface;
