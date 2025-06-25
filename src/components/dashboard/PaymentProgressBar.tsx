
import React from 'react';
import { Report } from '@/types/report';

interface PaymentProgressBarProps {
  report: Report;
  formatCurrency: (amount: number) => string;
}

const PaymentProgressBar: React.FC<PaymentProgressBarProps> = ({ report, formatCurrency }) => {
  const getPaymentProgress = (report: Report) => {
    if (report.paymentInfo) {
      const { totalPaid = 0, remainingBalance = 0 } = report.paymentInfo;
      const totalAmount = totalPaid + remainingBalance;
      const percentage = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;
      return { totalPaid, remainingBalance, percentage };
    }
    return { totalPaid: 0, remainingBalance: report.loanInformation.loanAmount, percentage: 0 };
  };

  const paymentProgress = getPaymentProgress(report);

  if (paymentProgress.percentage === 0) {
    return null;
  }

  return (
    <div className="mb-5 p-3 bg-gray-50 rounded-lg border">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Payment Progress</span>
        <span className="text-sm font-semibold text-gray-900">{paymentProgress.percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${paymentProgress.percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <span className="font-medium">Paid: {formatCurrency(paymentProgress.totalPaid)}</span>
        <span className="font-medium">Remaining: {formatCurrency(paymentProgress.remainingBalance)}</span>
      </div>
    </div>
  );
};

export default PaymentProgressBar;
