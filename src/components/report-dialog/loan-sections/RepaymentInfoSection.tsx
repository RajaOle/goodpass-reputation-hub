import React from 'react';
import { Control, Controller } from 'react-hook-form';
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

interface RepaymentInfoSectionProps {
  control: Control<ReportFormData>;
  isRestructure?: boolean;
  isAddInfo?: boolean;
}

const RepaymentInfoSection: React.FC<RepaymentInfoSectionProps> = ({ 
  control, 
  isRestructure = false,
  isAddInfo = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Repayment Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="loanInformation.repaymentPlan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repayment Plan *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isAddInfo}
              >
                <FormControl>
                  <SelectTrigger className={isRestructure ? "border-orange-200 bg-orange-50" : isAddInfo ? "bg-gray-100" : ""}>
                    <SelectValue placeholder="Select repayment plan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single-payment">Single Payment (Lump Sum)</SelectItem>
                  <SelectItem value="installment">Installment Payments</SelectItem>
                  <SelectItem value="open-payment">Open Payment (Flexible)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          control={control}
          name="loanInformation.installmentCount"
          render={({ field }) => {
            const repaymentPlan = control._formValues.loanInformation?.repaymentPlan;
            if (repaymentPlan !== 'installment') return null;
            
            return (
              <FormItem>
                <FormLabel>Number of Installments *</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={value => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ''}
                    disabled={isAddInfo}
                  >
                    <SelectTrigger className={isRestructure ? "border-orange-200 bg-orange-50" : isAddInfo ? "bg-gray-100" : ""}>
                      <SelectValue placeholder="Select number of installments" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 34 }, (_, i) => i + 3).map(num => (
                        <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Interest Rate and Late Fee fields removed for friend-to-friend loans */}
      </CardContent>
    </Card>
  );
};

export default RepaymentInfoSection;
