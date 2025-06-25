
import React, { useState } from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Info } from 'lucide-react';
import { ReportFormData } from '@/types/report';
import BasicInformationSection from './reportee-sections/BasicInformationSection';
import IdentificationSection from './reportee-sections/IdentificationSection';
import SocialMediaSection from './reportee-sections/SocialMediaSection';
import BankingInformationSection from './reportee-sections/BankingInformationSection';

interface ReporteeInformationFormProps {
  control: Control<ReportFormData>;
  setValue: UseFormSetValue<ReportFormData>;
  isRestructure?: boolean;
  isAddInfo?: boolean;
}

const ReporteeInformationForm: React.FC<ReporteeInformationFormProps> = ({ 
  control, 
  setValue,
  isRestructure = false,
  isAddInfo = false
}) => {
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  return (
    <div className="space-y-6">
      {isAddInfo && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800 font-medium">
              ✏️ You can edit additional reportee information. Basic info (name, email, phone) remains unchanged.
            </p>
          </div>
        </div>
      )}

      {isRestructure && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 font-medium">
              All reportee information is read-only during restructure
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              className="flex items-center gap-2"
            >
              {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showSensitiveData ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        </div>
      )}
      
      <BasicInformationSection 
        control={control}
        isRestructure={isRestructure}
        isAddInfo={isAddInfo}
        showSensitiveData={showSensitiveData}
      />

      <IdentificationSection 
        control={control}
        isRestructure={isRestructure}
        isAddInfo={isAddInfo}
        showSensitiveData={showSensitiveData}
      />

      <SocialMediaSection 
        control={control}
        setValue={setValue}
        isRestructure={isRestructure}
        isAddInfo={isAddInfo}
        showSensitiveData={showSensitiveData}
      />

      <BankingInformationSection 
        control={control}
        isRestructure={isRestructure}
        isAddInfo={isAddInfo}
        showSensitiveData={showSensitiveData}
      />
    </div>
  );
};

export default ReporteeInformationForm;
