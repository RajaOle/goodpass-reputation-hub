
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
  isAddInfo?: boolean;
}

const LoanInformationForm: React.FC<LoanInformationFormProps> = ({ 
  control, 
  isRestructure = false,
  isAddInfo = false
}) => {
  return (
    <div className="space-y-6">
      {isAddInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium">
            💡 Loan information is read-only in "Add Info" mode. To modify loan details, use the "Restructure" option instead.
          </p>
        </div>
      )}
      
      <BasicLoanInfoSection control={control} isRestructure={isRestructure} isAddInfo={isAddInfo} />
      <LoanDatesSection control={control} isRestructure={isRestructure} isAddInfo={isAddInfo} />
      <LoanPurposeSection control={control} isRestructure={isRestructure} isAddInfo={isAddInfo} />
      <RepaymentInfoSection control={control} isRestructure={isRestructure} isAddInfo={isAddInfo} />
      <CollateralInfoSection control={control} isRestructure={isRestructure} isAddInfo={isAddInfo} />
    </div>
  );
};

export default LoanInformationForm;
