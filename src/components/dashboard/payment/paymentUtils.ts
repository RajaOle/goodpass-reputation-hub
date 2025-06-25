
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const getPaymentMethod = (report: any) => {
  // First check if there's explicit payment info method
  if (report.paymentInfo?.method) {
    console.log('Using paymentInfo method:', report.paymentInfo.method);
    return report.paymentInfo.method;
  }
  
  // Fall back to loan information repayment plan
  const method = report.loanInformation.repaymentPlan;
  console.log('Using repayment plan:', method);
  
  // Map legacy values to current values
  if (method === 'single-payment') return 'single-payment';
  if (method === 'installment') return 'installment';
  if (method === 'open-payment') return 'open-payment';
  
  // Default fallback
  return 'single-payment';
};

export const getOutstandingAmount = (report: any) => {
  // For open payment, use remaining balance if available
  if (report.paymentInfo?.remainingBalance !== undefined) {
    return report.paymentInfo.remainingBalance;
  }
  
  // For installments, calculate based on unpaid installments
  if (report.paymentInfo?.installments) {
    const unpaidAmount = report.paymentInfo.installments
      .filter((inst: any) => inst.status === 'unpaid')
      .reduce((total: number, inst: any) => total + inst.amount, 0);
    return unpaidAmount;
  }
  
  // Default to full loan amount
  return report.loanInformation.loanAmount;
};

export const calculateInstallmentAmount = (report: any) => {
  // If we have explicit installment data, use the first installment amount
  if (report.paymentInfo?.installments && report.paymentInfo.installments.length > 0) {
    return report.paymentInfo.installments[0].amount;
  }
  
  // Calculate from loan info
  const totalAmount = report.loanInformation.loanAmount;
  const installmentCount = report.loanInformation.installmentCount || 1;
  return Math.round(totalAmount / installmentCount);
};

export const generateInstallments = (report: any) => {
  // If we already have installment data in paymentInfo, use it
  if (report.paymentInfo?.installments) {
    return report.paymentInfo.installments.map((inst: any, index: number) => {
      const dueDate = new Date(inst.dueDate);
      const isOverdue = inst.status === 'unpaid' && new Date() > dueDate;
      
      return {
        id: `installment-${inst.number}`,
        number: inst.number,
        amount: inst.amount,
        dueDate: inst.dueDate,
        status: inst.status,
        isOverdue
      };
    });
  }
  
  // Generate installments from loan information
  const installmentAmount = calculateInstallmentAmount(report);
  const count = report.loanInformation.installmentCount || 1;
  const startDate = new Date(report.loanInformation.disbursementDate);
  
  return Array.from({ length: count }, (_, index) => {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + index + 1);
    
    const isOverdue = new Date() > dueDate;
    
    return {
      id: `installment-${index + 1}`,
      number: index + 1,
      amount: installmentAmount,
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'unpaid',
      isOverdue
    };
  });
};
