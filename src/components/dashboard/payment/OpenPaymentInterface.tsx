
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Calculator, TrendingDown, AlertTriangle } from 'lucide-react';
import { Report } from '@/types/report';
import { formatCurrency, getOutstandingAmount } from './paymentUtils';

interface OpenPaymentInterfaceProps {
  report: Report;
  paymentAmount: string;
  onPaymentAmountChange: (amount: string) => void;
}

const OpenPaymentInterface: React.FC<OpenPaymentInterfaceProps> = ({
  report,
  paymentAmount,
  onPaymentAmountChange
}) => {
  const initialAmount = report.loanInformation.loanAmount;
  const outstandingAmount = getOutstandingAmount(report);
  const totalPaid = report.paymentInfo?.totalPaid || (initialAmount - outstandingAmount);
  const paymentValue = parseFloat(paymentAmount) || 0;
  const remainingAfterPayment = Math.max(0, outstandingAmount - paymentValue);
  const progressPercentage = Math.round(((initialAmount - remainingAfterPayment) / initialAmount) * 100);

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Calculator className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl text-gray-900">Open Payment</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Flexible payment amount - pay any amount you want</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Initial Loan</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(initialAmount)}</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-blue-100 text-center">
            <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Total Paid</div>
            <div className="text-xl font-bold text-blue-700">{formatCurrency(totalPaid)}</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-orange-100 text-center">
            <div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-2">Outstanding</div>
            <div className="text-xl font-bold text-orange-700">{formatCurrency(outstandingAmount)}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-green-100 text-center">
            <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">Progress</div>
            <div className="text-xl font-bold text-green-700">{Math.round((totalPaid / initialAmount) * 100)}%</div>
          </div>
        </div>

        {/* Payment Flow Visualization */}
        <div className="bg-white rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-blue-600" />
              Payment Impact
            </h3>
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Live Calculation</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Current Outstanding */}
            <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-100">
              <div className="text-sm font-medium text-orange-600 uppercase tracking-wide mb-2">Current Outstanding</div>
              <div className="text-2xl font-bold text-orange-700 mb-2">{formatCurrency(outstandingAmount)}</div>
              <div className="text-xs text-orange-600">Amount due</div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-8 w-8 text-gray-400" />
            </div>

            {/* After Payment */}
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
              <div className="text-sm font-medium text-green-600 uppercase tracking-wide mb-2">After Payment</div>
              <div className="text-2xl font-bold text-green-700 mb-2">{formatCurrency(remainingAfterPayment)}</div>
              <div className="text-xs text-green-600">
                {remainingAfterPayment === 0 ? 'Fully Paid!' : 'Remaining'}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {paymentValue > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Loan Progress</span>
                <span>{progressPercentage}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Input */}
        <div className="bg-white rounded-xl p-6 border border-blue-100">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount" className="text-lg font-semibold text-gray-900">
                Enter Payment Amount
              </Label>
              {paymentValue > outstandingAmount && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-medium">Exceeds outstanding amount</span>
                </div>
              )}
            </div>
            
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => onPaymentAmountChange(e.target.value)}
                placeholder="Enter amount to pay"
                className="text-xl font-semibold h-16 pl-16 pr-4 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-blue-400 transition-all"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold text-lg">
                IDR
              </div>
            </div>

            {paymentValue > 0 && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Amount:</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(paymentValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Outstanding Reduction:</span>
                  <span className="font-semibold text-green-600">
                    -{formatCurrency(Math.min(paymentValue, outstandingAmount))}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="bg-white rounded-xl p-6 border border-blue-100">
          <div className="text-base font-semibold text-gray-900 mb-4">Quick Select Amounts</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: '25%', value: Math.round(outstandingAmount * 0.25) },
              { label: '50%', value: Math.round(outstandingAmount * 0.5) },
              { label: '75%', value: Math.round(outstandingAmount * 0.75) },
              { label: 'Full Payment', value: outstandingAmount }
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => onPaymentAmountChange(option.value.toString())}
                className="p-4 text-center border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 group"
              >
                <div className="font-semibold text-sm mb-1">{option.label}</div>
                <div className="text-xs text-gray-600 group-hover:text-blue-600">
                  {formatCurrency(option.value)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenPaymentInterface;
