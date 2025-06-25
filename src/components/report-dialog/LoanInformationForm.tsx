
import React from 'react';
import { Control } from 'react-hook-form';
import { ReportFormData } from '@/types/report';
import BasicLoanInfoSection from './loan-sections/BasicLoanInfoSection';
import LoanDatesSection from './loan-sections/LoanDatesSection';
import LoanPurposeSection from './loan-sections/LoanPurposeSection';
import RepaymentInfoSection from './loan-sections/RepaymentInfoSection';
import CollateralInfoSection from './loan-sections/CollateralInfoSection';

interface LoanInformationFormProps {
  control: Control<ReportFormData>;
  isRestructure?: boolean;
}

const LoanInformationForm: React.FC<LoanInformationFormProps> = ({ 
  control, 
  isRestructure = false 
}) => {
  return (
    <div className="space-y-6">
      <BasicLoanInfoSection control={control} isRestructure={isRestructure} />
      <LoanDatesSection control={control} isRestructure={isRestructure} />
      <LoanPurposeSection control={control} isRestructure={isRestructure} />
      <RepaymentInfoSection control={control} isRestructure={isRestructure} />
      <CollateralInfoSection control={control} isRestructure={isRestructure} />
    </div>
  );
};

export default LoanInformationForm;
