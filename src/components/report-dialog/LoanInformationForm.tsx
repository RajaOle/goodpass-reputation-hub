import React, { useState } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { ReportFormData } from '@/types/report';
import BasicLoanInfoSection from './loan-sections/BasicLoanInfoSection';
import LoanPurposeSection from './loan-sections/LoanPurposeSection';
import RepaymentInfoSection from './loan-sections/RepaymentInfoSection';
import CollateralInfoSection from './loan-sections/CollateralInfoSection';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, isBefore, startOfDay } from 'date-fns';

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
  const { setValue, watch } = useFormContext();
  const dueDate = watch('loanInformation.dueDate');
  const [noDueDate, setNoDueDate] = useState(!dueDate);

  // Handler for toggling "No due date"
  const handleNoDueDateChange = (checked: boolean) => {
    setNoDueDate(checked);
    if (checked) {
      setValue('loanInformation.dueDate', '');
    }
  };

  // Handler for selecting a date
  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isNaN(date.getTime())) {
      setValue('loanInformation.dueDate', date.toISOString().split('T')[0]);
      setNoDueDate(false);
    }
  };

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
      {/* Due Date Field (Optional) */}
      <div className={isAddInfo ? "bg-gray-100 border border-gray-200 rounded-lg p-4" : "bg-orange-50 border border-orange-200 rounded-lg p-4"}>
        <div className="mb-2 flex items-center gap-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date <span className="text-gray-400">(optional)</span></label>
          <label className="flex items-center gap-1 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={noDueDate}
              onChange={e => handleNoDueDateChange(e.target.checked)}
              disabled={isAddInfo}
              className="accent-blue-600"
            />
            No due date
          </label>
        </div>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={noDueDate || isAddInfo}
                className={`border rounded px-3 py-2 text-sm flex items-center gap-2 ${noDueDate || isAddInfo ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
              >
                <CalendarIcon className="h-4 w-4" />
                {dueDate
                  ? format(new Date(dueDate), 'PPP')
                  : <span className="text-gray-400">Pick a date</span>
                }
                {dueDate && !noDueDate && !isAddInfo && (
                  <X
                    className="ml-2 h-3 w-3 text-gray-400 hover:text-red-500 cursor-pointer"
                    onClick={e => {
                      e.stopPropagation();
                      setValue('loanInformation.dueDate', '');
                    }}
                  />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate ? new Date(dueDate) : undefined}
                onSelect={handleDateSelect}
                disabled={date => isBefore(startOfDay(date), startOfDay(new Date()))}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-xs text-gray-500 mt-1">Leave empty or check 'No due date' if there is no due date for this loan.</p>
      </div>
      <LoanPurposeSection control={control} isRestructure={isRestructure} isAddInfo={isAddInfo} />
      <RepaymentInfoSection control={control} isRestructure={isRestructure} isAddInfo={isAddInfo} />
      <CollateralInfoSection control={control} isRestructure={isRestructure} isAddInfo={isAddInfo} />
    </div>
  );
};

export default LoanInformationForm;
