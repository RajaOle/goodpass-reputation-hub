import React from 'react';
import { Report } from '@/types/report';
import { Calendar, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { generateInstallments } from './payment/paymentUtils';

interface PaymentProgressBarProps {
  report: Report;
  formatCurrency: (amount: number) => string;
}

const PaymentProgressBar: React.FC<PaymentProgressBarProps> = ({ report, formatCurrency }) => {
  // Use generateInstallments to get the full list
  const installments = generateInstallments(report);

  // Calculate paid/unpaid totals from installments
  const totalPaid = installments
    .filter(inst => inst.status === 'paid')
    .reduce((sum, inst) => sum + inst.amount, 0);
  const remainingBalance = installments
    .filter(inst => inst.status !== 'paid')
    .reduce((sum, inst) => sum + inst.amount, 0);
  const totalAmount = totalPaid + remainingBalance;
  const percentage = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

  // Use repaymentPlan from loanInformation as the primary source
  const paymentMethod = report.paymentInfo?.method || report.loanInformation.repaymentPlan;
  console.log('PaymentProgressBar - paymentMethod:', paymentMethod, 'from report:', report.id);

  const renderInstallmentHistory = () => {
    if (!installments || installments.length === 0) return null;
    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Installment History
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {installments.map((installment) => (
            <div key={installment.number} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100">
              <div className="flex items-center gap-2">
                {installment.status === 'paid' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-orange-500" />
                )}
                <span className="text-sm font-medium">#{installment.number}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {new Date(installment.dueDate).toLocaleDateString()}
                </span>
                <span className={`text-sm font-semibold ${installment.status === 'paid' ? 'text-green-600' : 'text-gray-900'}`}>
                  {formatCurrency(installment.amount)}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  installment.status === 'paid' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {installment.status === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOpenPaymentHistory = () => {
    if (!report.paymentInfo?.openPayments) return null;

    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Payment History
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {report.paymentInfo.openPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(payment.amount)}
                  </span>
                  {payment.notes && (
                    <p className="text-xs text-gray-500">{payment.notes}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">
                  {new Date(payment.date).toLocaleDateString()}
                </span>
                <p className="text-xs text-gray-500">
                  Balance: {formatCurrency(payment.runningBalance)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSinglePaymentStatus = () => {
    if (paymentMethod !== 'single-payment') return null;

    const isPaid = report.paymentInfo?.status === 'paid';
    
    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Payment Status
        </h4>
        <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-100">
          <div className="flex items-center gap-2">
            {isPaid ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Clock className="h-4 w-4 text-orange-500" />
            )}
            <span className="text-sm font-medium">Full Payment</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(report.loanInformation.loanAmount)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              isPaid 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {isPaid ? 'Paid' : 'Pending'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Don't show if no payment progress
  if (percentage === 0 && (!installments || installments.length === 0)) {
    return null;
  }

  return (
    <div className="mb-5 p-3 bg-gray-50 rounded-lg border">
      {/* Payment Progress Bar */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Payment Progress</span>
        <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-600 mb-3">
        <span className="font-medium">Paid: {formatCurrency(totalPaid)}</span>
        <span className="font-medium">Remaining: {formatCurrency(remainingBalance)}</span>
      </div>

      {/* Payment Method Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment Method</span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          paymentMethod === 'installment' ? 'bg-blue-100 text-blue-700' :
          paymentMethod === 'open-payment' ? 'bg-purple-100 text-purple-700' :
          'bg-green-100 text-green-700'
        }`}>
          {paymentMethod === 'installment' ? 'Installment' :
           paymentMethod === 'open-payment' ? 'Open Payment' :
           'Single Payment'}
        </span>
      </div>

      {/* Payment History Based on Type */}
      {paymentMethod === 'installment' ? renderInstallmentHistory() : null}
      {paymentMethod === 'open-payment' ? renderOpenPaymentHistory() : null}
      {paymentMethod === 'single-payment' ? renderSinglePaymentStatus() : null}
    </div>
  );
};

export default PaymentProgressBar;
