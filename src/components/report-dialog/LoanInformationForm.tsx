
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, DollarSign } from 'lucide-react';
import { ReportFormData } from '@/types/report';

interface LoanInformationFormProps {
  control: Control<ReportFormData>;
}

const LoanInformationForm: React.FC<LoanInformationFormProps> = ({ control }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <FormField
          control={control}
          name="loanInformation.loanType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
                <span>Loan Type</span>
                <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Choose the type of loan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="personal">💳 Personal Loan</SelectItem>
                  <SelectItem value="business">🏢 Business Loan</SelectItem>
                  <SelectItem value="mortgage">🏠 Mortgage</SelectItem>
                  <SelectItem value="auto">🚗 Auto Loan</SelectItem>
                  <SelectItem value="student">🎓 Student Loan</SelectItem>
                  <SelectItem value="other">📋 Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="loanInformation.loanAmount"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span>Loan Amount</span>
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="$0"
                      className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors pl-8"
                      value={field.value ? formatCurrency(field.value) : ''}
                      onChange={(e) => {
                        const numericValue = parseCurrency(e.target.value);
                        field.onChange(numericValue);
                      }}
                    />
                    <DollarSign className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <FormDescription className="text-gray-500">
                  Enter the total amount of the loan
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="loanInformation.loanTerm"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
                  <span>Loan Term (months)</span>
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="24"
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription className="text-gray-500">
                  How many months is the loan for?
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="loanInformation.monthlyPayment"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span>Monthly Payment</span>
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="$0"
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors pl-8"
                    value={field.value ? formatCurrency(field.value) : ''}
                    onChange={(e) => {
                      const numericValue = parseCurrency(e.target.value);
                      field.onChange(numericValue);
                    }}
                  />
                  <DollarSign className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                </div>
              </FormControl>
              <FormDescription className="text-gray-500">
                Monthly payment cannot be negative
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="loanInformation.loanPurpose"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
                <span>Loan Purpose</span>
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe what this loan was used for (e.g., home renovation, business expansion, debt consolidation...)"
                  className="min-h-[100px] text-base border-2 border-gray-200 focus:border-blue-500 transition-colors resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Minimum 10 characters required
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="loanInformation.collateral"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
                <span>Collateral</span>
                <span className="text-gray-500">(optional)</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Assets pledged as security for the loan (e.g., property, vehicle, savings account)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., 2020 Honda Civic, Property deed for 123 Main St, Certificate of Deposit #12345..."
                  className="min-h-[80px] text-base border-2 border-gray-200 focus:border-blue-500 transition-colors resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Only required for secured loans
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </TooltipProvider>
  );
};

export default LoanInformationForm;
