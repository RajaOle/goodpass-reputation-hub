
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Calculator } from 'lucide-react';
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
  const paymentValue = parseFloat(paymentAmount) || 0;
  const remainingAfterPayment = Math.max(0, outstandingAmount - paymentValue);

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calculator className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-gray-900">Open Payment</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Flexible payment amount</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Flow Visualization */}
        <div className="bg-white rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Payment Flow</h3>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Live Calculation</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Initial Amount */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Initial Loan</div>
              <div className="text-lg font-bold text-gray-900">{formatCurrency(initialAmount)}</div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>

            {/* Outstanding Amount */}
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Outstanding</div>
              <div className="text-lg font-bold text-orange-700">{formatCurrency(outstandingAmount)}</div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>

            {/* Remaining After Payment */}
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">After Payment</div>
              <div className="text-lg font-bold text-green-700">{formatCurrency(remainingAfterPayment)}</div>
            </div>
          </div>
        </div>

        {/* Payment Input */}
        <div className="bg-white rounded-xl p-6 border border-blue-100">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount" className="text-base font-semibold text-gray-900">
                Payment Amount
              </Label>
              {paymentValue > outstandingAmount && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  Exceeds outstanding amount
                </span>
              )}
            </div>
            
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => onPaymentAmountChange(e.target.value)}
                placeholder="0"
                className="text-lg font-semibold h-14 pl-12 pr-4 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                IDR
              </div>
            </div>

            {paymentValue > 0 && (
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-gray-600">Outstanding Reduction:</span>
                <span className="font-semibold text-blue-600">
                  -{formatCurrency(Math.min(paymentValue, outstandingAmount))}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="bg-white rounded-xl p-4 border border-blue-100">
          <div className="text-sm font-medium text-gray-700 mb-3">Quick Select</div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '25%', value: Math.round(outstandingAmount * 0.25) },
              { label: '50%', value: Math.round(outstandingAmount * 0.5) },
              { label: '75%', value: Math.round(outstandingAmount * 0.75) },
              { label: 'Full', value: outstandingAmount }
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => onPaymentAmountChange(option.value.toString())}
                className="px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
              >
                {option.label} ({formatCurrency(option.value)})
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenPaymentInterface;
