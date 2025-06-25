
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Open Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Loan Amount</div>
              <div className="font-semibold">{formatCurrency(report.loanInformation.loanAmount)}</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600">Outstanding</div>
              <div className="font-semibold">{formatCurrency(getOutstandingAmount(report))}</div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="amount">Payment Amount</Label>
            <Input
              id="amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => onPaymentAmountChange(e.target.value)}
              placeholder="Enter payment amount"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenPaymentInterface;
