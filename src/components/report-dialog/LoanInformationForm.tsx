
import React from 'react';
import { Control, useWatch } from 'react-hook-form';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, DollarSign, Calendar } from 'lucide-react';
import { ReportFormData } from '@/types/report';

interface LoanInformationFormProps {
  control: Control<ReportFormData>;
}

const LoanInformationForm: React.FC<LoanInformationFormProps> = ({ control }) => {
  const paymentMethod = useWatch({
    control,
    name: 'loanInformation.paymentMethod',
    defaultValue: 'one-time'
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/[^0-9]/g, '')) || 0;
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <FormField
          control={control}
          name="loanInformation.loanType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-900">
                Loan Type <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Choose the type of loan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="personal">Personal Loan</SelectItem>
                  <SelectItem value="business">Business Loan</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

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
                <Input
                  type="text"
                  placeholder="Enter loan amount"
                  className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  value={field.value ? formatCurrency(field.value) : ''}
                  onChange={(e) => {
                    const numericValue = parseCurrency(e.target.value);
                    field.onChange(numericValue);
                  }}
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Enter the total amount of the loan in IDR
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
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Loan Term (in months)</span>
                <span className="text-red-500">*</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How many months is the loan for? Example: 12 months</p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 12"
                  className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 0 || e.target.value === '') {
                      field.onChange(value || 0);
                    }
                  }}
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Duration of the loan in months
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
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Expected monthly payment amount for this loan</p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter monthly payment amount"
                  className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  value={field.value ? formatCurrency(field.value) : ''}
                  onChange={(e) => {
                    const numericValue = parseCurrency(e.target.value);
                    if (numericValue >= 0) {
                      field.onChange(numericValue);
                    }
                  }}
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Monthly payment amount in IDR
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="loanInformation.paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-medium text-gray-900">
                Payment Method <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className={`font-medium ${field.value === 'one-time' ? 'text-blue-600' : 'text-gray-500'}`}>
                      🧾 One-Time
                    </span>
                    <Switch
                      checked={field.value === 'installments'}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? 'installments' : 'one-time');
                      }}
                    />
                    <span className={`font-medium ${field.value === 'installments' ? 'text-blue-600' : 'text-gray-500'}`}>
                      📆 Installment
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {paymentMethod === 'installments' && (
          <FormField
            control={control}
            name="loanInformation.installmentCount"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium text-gray-900">
                  Number of Installments <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="2"
                    placeholder="Enter number of payments"
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 2 || e.target.value === '') {
                        field.onChange(value || undefined);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription className="text-gray-500">
                  How many installment payments will be made?
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="loanInformation.loanPurpose"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-900">
                Loan Purpose <span className="text-red-500">*</span>
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
