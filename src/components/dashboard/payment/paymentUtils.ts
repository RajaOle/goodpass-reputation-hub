
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const getPaymentMethod = (report: any) => {
  const method = report.paymentInfo?.method || report.loanInformation.repaymentPlan;
  console.log('Payment method determination:', {
    paymentInfoMethod: report.paymentInfo?.method,
    repaymentPlan: report.loanInformation.repaymentPlan,
    finalMethod: method
  });
  return method;
};

export const getOutstandingAmount = (report: any) => {
  if (report.paymentInfo?.remainingBalance !== undefined) {
    return report.paymentInfo.remainingBalance;
  }
  return report.loanInformation.loanAmount;
};

export const calculateInstallmentAmount = (report: any) => {
  const totalAmount = report.loanInformation.loanAmount;
  const installmentCount = report.loanInformation.installmentCount || 1;
  return totalAmount / installmentCount;
};

export const generateInstallments = (report: any) => {
  const installmentAmount = calculateInstallmentAmount(report);
  const count = report.loanInformation.installmentCount || 1;
  const startDate = new Date(report.loanInformation.disbursementDate);
  
  return Array.from({ length: count }, (_, index) => {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + index + 1);
    
    const isPaid = report.paymentInfo?.installments?.[index]?.status === 'paid';
    const isOverdue = !isPaid && new Date() > dueDate;
    
    return {
      id: `installment-${index + 1}`,
      number: index + 1,
      amount: installmentAmount,
      dueDate: dueDate.toISOString().split('T')[0],
      status: isPaid ? 'paid' : 'unpaid',
      isOverdue
    };
  });
};
