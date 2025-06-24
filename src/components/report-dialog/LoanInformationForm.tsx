import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ReportFormData } from '@/types/report';

interface LoanInformationFormProps {
  control: Control<ReportFormData>;
}

const LoanInformationForm: React.FC<LoanInformationFormProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="loanInformation.loanType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loan Type *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
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

      <FormField
        control={control}
        name="loanInformation.loanAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loan Amount ($) *</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter loan amount"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="loanInformation.loanTerm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loan Term (months) *</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter loan term in months"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="loanInformation.monthlyPayment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Payment ($) *</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter monthly payment"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="loanInformation.loanPurpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loan Purpose *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the purpose of the loan"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="loanInformation.collateral"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Collateral (if applicable)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe any collateral provided"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Only required for secured loans
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LoanInformationForm;
