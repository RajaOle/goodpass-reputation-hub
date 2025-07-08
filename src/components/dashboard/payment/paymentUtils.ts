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
  const count = report.loanInformation.installmentCount || 1;
  const installmentAmount = calculateInstallmentAmount(report);
  const disbursementDateRaw = report.loanInformation.disbursementDate;
  const startDate = new Date(disbursementDateRaw);

  // Defensive: If disbursementDate is invalid, return empty array
  if (!disbursementDateRaw || isNaN(startDate.getTime())) {
    console.error('Invalid disbursementDate in report:', disbursementDateRaw, report);
    return [];
  }

  // Build a map of existing installments by number (if any)
  const existing = (report.paymentInfo?.installments || []).reduce((acc: any, inst: any) => {
    acc[inst.number] = inst;
    return acc;
  }, {});

  // Always generate the full list, merging in status from paymentInfo.installments if available
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + index + 1);
    // Defensive: If dueDate is invalid, use empty string
    const dueDateString = isNaN(dueDate.getTime()) ? '' : dueDate.toISOString().split('T')[0];
    const base = {
      id: `installment-${number}`,
      number,
      amount: installmentAmount,
      dueDate: dueDateString,
      status: 'unpaid',
      isOverdue: dueDateString ? new Date() > dueDate : false
    };
    if (existing[number]) {
      return {
        ...base,
        amount: existing[number].amount,
        status: existing[number].status,
        dueDate: existing[number].dueDate,
      };
    }
    return base;
  });
};
