
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFormData } from '@/types/report';

interface LoanPurposeSectionProps {
  control: Control<ReportFormData>;
  isRestructure?: boolean;
  isAddInfo?: boolean;
}

const LoanPurposeSection: React.FC<LoanPurposeSectionProps> = ({ 
  control, 
  isRestructure = false,
  isAddInfo = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Loan Purpose</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="loanInformation.loanPurpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose of Loan *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isRestructure || isAddInfo}
              >
                <FormControl>
                  <SelectTrigger className={(isRestructure || isAddInfo) ? "bg-gray-100" : ""}>
                    <SelectValue placeholder="Select loan purpose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="business-expansion">Business Expansion</SelectItem>
                  <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
                  <SelectItem value="home-improvement">Home Improvement</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="medical-expenses">Medical Expenses</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          control={control}
          name="loanInformation.customLoanPurpose"
          render={({ field }) => {
            const loanPurpose = control._formValues.loanInformation?.loanPurpose;
            if (loanPurpose !== 'other') return null;
            
            return (
              <FormItem>
                <FormLabel>Custom Loan Purpose (min 10 characters) *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe the loan purpose in detail..."
                    {...field}
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

export default LoanPurposeSection;
