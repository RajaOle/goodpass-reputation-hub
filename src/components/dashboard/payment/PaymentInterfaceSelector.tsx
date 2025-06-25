
import React from 'react';
import { Report } from '@/types/report';
import OpenPaymentInterface from './OpenPaymentInterface';
import InstallmentInterface from './InstallmentInterface';
import SinglePaymentInterface from './SinglePaymentInterface';
import { getPaymentMethod } from './paymentUtils';

interface PaymentInterfaceSelectorProps {
  report: Report;
  paymentAmount: string;
  onPaymentAmountChange: (amount: string) => void;
  selectedInstallment: string;
  onInstallmentChange: (installment: string) => void;
}

const PaymentInterfaceSelector: React.FC<PaymentInterfaceSelectorProps> = ({
  report,
  paymentAmount,
  onPaymentAmountChange,
  selectedInstallment,
  onInstallmentChange
}) => {
  const paymentMethod = getPaymentMethod(report);

  if (paymentMethod === 'open-payment') {
    return (
      <OpenPaymentInterface
        report={report}
        paymentAmount={paymentAmount}
        onPaymentAmountChange={onPaymentAmountChange}
      />
    );
  }

  if (paymentMethod === 'installment') {
    return (
      <InstallmentInterface
        report={report}
        selectedInstallment={selectedInstallment}
        onInstallmentChange={onInstallmentChange}
      />
    );
  }

  if (paymentMethod === 'single-payment' || paymentMethod === 'full') {
    return <SinglePaymentInterface report={report} />;
  }

  return null;
};

export default PaymentInterfaceSelector;
