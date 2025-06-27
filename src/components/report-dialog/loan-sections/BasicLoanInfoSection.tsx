import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFormData } from '@/types/report';

interface BasicLoanInfoSectionProps {
  control: Control<ReportFormData>;
  isRestructure?: boolean;
  isAddInfo?: boolean;
}

const BasicLoanInfoSection: React.FC<BasicLoanInfoSectionProps> = ({ 
  control, 
  isRestructure = false,
  isAddInfo = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="loanInformation.loanName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Name *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter loan name"
                    {...field}
                    readOnly={isRestructure || isAddInfo}
                    className={(isRestructure || isAddInfo) ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="loanInformation.loanType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Loan Type * 
                  {isRestructure && <span className="text-orange-600">(Editable)</span>}
                  {isAddInfo && <span className="text-gray-500">(Read-only)</span>}
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isAddInfo}
                >
                  <FormControl>
                    <SelectTrigger className={isRestructure ? "border-orange-200 bg-orange-50" : isAddInfo ? "bg-gray-100" : ""}>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                    <SelectItem value="business">Business Loan</SelectItem>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                    <SelectItem value="auto">Auto Loan</SelectItem>
                    <SelectItem value="student">Student Loan</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="loanInformation.loanAmount"
          render={({ field }) => {
            // Format with thousand separators
            const formatNumber = (value: number | string) =>
              value
                ? Number(value)
                    .toLocaleString('id-ID', { maximumFractionDigits: 0 })
                : '';

            return (
              <FormItem>
                <FormLabel>Loan Amount (IDR) *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter loan amount"
                    value={field.value ? formatNumber(field.value) : ''}
                    onChange={e => {
                      // Remove all non-digit characters
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      // Prevent leading zero
                      const normalized = raw.replace(/^0+/, '');
                      // Update form state as number, or '' if empty
                      field.onChange(normalized ? parseInt(normalized, 10) : '');
                    }}
                    readOnly={isRestructure || isAddInfo}
                    className={(isRestructure || isAddInfo) ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </CardContent>
    </Card>
  );
};

export default BasicLoanInfoSection;
