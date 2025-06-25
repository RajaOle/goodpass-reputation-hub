
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
}

const BasicLoanInfoSection: React.FC<BasicLoanInfoSectionProps> = ({ 
  control, 
  isRestructure = false 
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
                    readOnly={isRestructure}
                    className={isRestructure ? "bg-gray-100" : ""}
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
                <FormLabel>Loan Type * {isRestructure && <span className="text-orange-600">(Editable)</span>}</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isRestructure ? false : false}
                >
                  <FormControl>
                    <SelectTrigger className={isRestructure ? "border-orange-200 bg-orange-50" : ""}>
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Amount (IDR) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter loan amount"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  readOnly={isRestructure}
                  className={isRestructure ? "bg-gray-100" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default BasicLoanInfoSection;
