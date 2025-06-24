import React, { useState } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { format } from 'date-fns';
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
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Info, DollarSign, Calendar as CalendarIcon, ChevronDown, ChevronUp, FileText, Shield } from 'lucide-react';
import { ReportFormData } from '@/types/report';
import { cn } from '@/lib/utils';

interface LoanInformationFormProps {
  control: Control<ReportFormData>;
}

const LoanInformationForm: React.FC<LoanInformationFormProps> = ({ control }) => {
  const [isCollateralOpen, setIsCollateralOpen] = useState(false);
  const [noDueDate, setNoDueDate] = useState(false);
  
  const repaymentPlan = useWatch({
    control,
    name: 'loanInformation.repaymentPlan',
    defaultValue: 'installment'
  });

  const loanPurpose = useWatch({
    control,
    name: 'loanInformation.loanPurpose',
    defaultValue: 'business-expansion'
  });

  const collateral = useWatch({
    control,
    name: 'loanInformation.collateral',
    defaultValue: 'none'
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
        {/* Loan Name */}
        <FormField
          control={control}
          name="loanInformation.loanName"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Loan Name</span>
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Business Expansion Loan - Q1 2024"
                  className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Give this loan a descriptive name for easy identification
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Loan Amount and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loan Amount */}
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
                  Total amount of the loan in IDR
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Loan Type */}
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
                      <SelectValue placeholder="Choose loan type" />
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
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Loan Purpose */}
        <FormField
          control={control}
          name="loanInformation.loanPurpose"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-900">
                Loan Purpose <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select loan purpose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="business-expansion">🏢 Business Expansion</SelectItem>
                  <SelectItem value="debt-consolidation">💳 Debt Consolidation</SelectItem>
                  <SelectItem value="home-improvement">🏠 Home Improvement</SelectItem>
                  <SelectItem value="education">📚 Education</SelectItem>
                  <SelectItem value="medical-expenses">🏥 Medical Expenses</SelectItem>
                  <SelectItem value="wedding">💒 Wedding</SelectItem>
                  <SelectItem value="travel">✈️ Travel</SelectItem>
                  <SelectItem value="investment">📈 Investment</SelectItem>
                  <SelectItem value="emergency">🚨 Emergency</SelectItem>
                  <SelectItem value="other">📝 Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Custom Loan Purpose */}
        {loanPurpose === 'other' && (
          <FormField
            control={control}
            name="loanInformation.customLoanPurpose"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium text-gray-900">
                  Please specify the loan purpose <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe the specific purpose of this loan..."
                    className="min-h-[80px] text-base border-2 border-gray-200 focus:border-blue-500 transition-colors resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        )}

        {/* Due Date Section (Agreement and Disbursement dates are now shown in header) */}
        <div className="space-y-6">
          <h3 className="font-medium text-gray-900 flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-blue-600" />
            <span>Loan Due Date</span>
          </h3>
          
          {/* Due Date with Optional Checkbox */}
          <FormField
            control={control}
            name="loanInformation.dueDate"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium text-gray-900">
                  Due Date
                </FormLabel>
                
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox
                    id="no-due-date"
                    checked={noDueDate}
                    onCheckedChange={(checked) => {
                      setNoDueDate(checked === true);
                      if (checked) {
                        field.onChange(undefined);
                      }
                    }}
                  />
                  <label
                    htmlFor="no-due-date"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    No Due Date
                  </label>
                </div>

                {!noDueDate && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-12 w-full text-base border-2 border-gray-200 focus:border-blue-500 transition-colors justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(new Date(field.value), "PPP") : "Select due date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                )}

                <FormDescription className="text-gray-500">
                  {noDueDate ? "This loan has no specific due date" : "Final due date for the loan (optional)"}
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Repayment Plan - Simplified to 3 options */}
        <FormField
          control={control}
          name="loanInformation.repaymentPlan"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-900">
                Repayment Plan <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select repayment plan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single-payment">💰 Single Payment</SelectItem>
                  <SelectItem value="installment">📋 Installment</SelectItem>
                  <SelectItem value="open-payment">🔄 Open Payment</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-500">
                Choose how the loan will be repaid
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Installment Count - Only show for installment plan */}
        {repaymentPlan === 'installment' && (
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
                    placeholder="Enter number of installments"
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    min="1"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormDescription className="text-gray-500">
                  How many installments will be made to pay off this loan?
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        )}

        {/* Application Fees (Disabled) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="loanInformation.applicationInterest"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium text-gray-500 flex items-center space-x-2">
                  <span>Application Interest (%)</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Interest rate applied to this loan (calculated automatically)</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="h-12 text-base border-2 border-gray-200 bg-gray-50 cursor-not-allowed"
                    disabled
                    value={field.value || 0}
                  />
                </FormControl>
                <FormDescription className="text-gray-500">
                  Auto-calculated based on loan terms
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="loanInformation.applicationLateFee"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium text-gray-500 flex items-center space-x-2">
                  <span>Application Late Fee</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Late fee amount for overdue payments (calculated automatically)</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Rp 0"
                    className="h-12 text-base border-2 border-gray-200 bg-gray-50 cursor-not-allowed"
                    disabled
                    value={field.value ? formatCurrency(field.value) : 'Rp 0'}
                  />
                </FormControl>
                <FormDescription className="text-gray-500">
                  Auto-calculated based on loan terms
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        {/* Collateral Information (Expandable) */}
        <Collapsible open={isCollateralOpen} onOpenChange={setIsCollateralOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between h-12 text-base border-2 border-gray-200 hover:border-blue-500 transition-colors"
              type="button"
            >
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-orange-600" />
                <span>Collateral Information</span>
                <span className="text-gray-500">(optional)</span>
              </div>
              {isCollateralOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <FormField
              control={control}
              name="loanInformation.collateral"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-medium text-gray-900">
                    Collateral Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors">
                        <SelectValue placeholder="Select collateral type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">🚫 No Collateral</SelectItem>
                      <SelectItem value="property">🏠 Property/Real Estate</SelectItem>
                      <SelectItem value="vehicle">🚗 Vehicle</SelectItem>
                      <SelectItem value="savings">💰 Savings Account</SelectItem>
                      <SelectItem value="stocks">📈 Stocks/Securities</SelectItem>
                      <SelectItem value="jewelry">💎 Jewelry</SelectItem>
                      <SelectItem value="equipment">🔧 Equipment/Machinery</SelectItem>
                      <SelectItem value="other">📝 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {collateral !== 'none' && (
              <>
                <FormField
                  control={control}
                  name="loanInformation.collateralDescription"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium text-gray-900">
                        Collateral Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide detailed description of the collateral..."
                          className="min-h-[100px] text-base border-2 border-gray-200 focus:border-blue-500 transition-colors resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Include serial numbers, addresses, or other identifying information
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="loanInformation.collateralValue"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium text-gray-900">
                        Estimated Collateral Value
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter estimated value"
                          className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                          value={field.value ? formatCurrency(field.value) : ''}
                          onChange={(e) => {
                            const numericValue = parseCurrency(e.target.value);
                            field.onChange(numericValue);
                          }}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Current market value of the collateral in IDR
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </TooltipProvider>
  );
};

export default LoanInformationForm;
