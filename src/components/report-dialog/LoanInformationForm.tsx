
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, DollarSign, CreditCard, Calendar } from 'lucide-react';
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
                      placeholder="Enter loan amount"
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
                    placeholder="Enter loan term in months"
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    value={field.value || ''}
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
          name="loanInformation.paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span>Payment Method</span>
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="one-time" id="one-time" />
                    <label htmlFor="one-time" className="flex items-center space-x-2 cursor-pointer">
                      <span>🧾</span>
                      <span>One-time payment</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="installments" id="installments" />
                    <label htmlFor="installments" className="flex items-center space-x-2 cursor-pointer">
                      <span>📆</span>
                      <span>Installments</span>
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="loanInformation.installmentCount"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span>Number of Installments</span>
                {control._formValues?.loanInformation?.paymentMethod === 'installments' && (
                  <span className="text-red-500">*</span>
                )}
              </FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                defaultValue={field.value?.toString()}
                disabled={control._formValues?.loanInformation?.paymentMethod !== 'installments'}
              >
                <FormControl>
                  <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select number of payments" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="2">2 payments</SelectItem>
                  <SelectItem value="3">3 payments</SelectItem>
                  <SelectItem value="4">4 payments</SelectItem>
                  <SelectItem value="6">6 payments</SelectItem>
                  <SelectItem value="12">12 payments</SelectItem>
                  <SelectItem value="24">24 payments</SelectItem>
                  <SelectItem value="36">36 payments</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-500">
                Only required for installment payments
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

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
                    placeholder="Enter monthly payment amount"
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
