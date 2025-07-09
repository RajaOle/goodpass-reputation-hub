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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFormData } from '@/types/report';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { indonesianBanks } from '@/data/indonesianBanks';

interface BankingInformationSectionProps {
  control: Control<ReportFormData>;
  isRestructure?: boolean;
  isAddInfo?: boolean;
  showSensitiveData?: boolean;
  fetchedBankAccounts?: { bankName: string, bankAccountNumber: string }[];
}

const BankingInformationSection: React.FC<BankingInformationSectionProps> = ({
  control,
  isRestructure = false,
  isAddInfo = false,
  showSensitiveData = false,
  fetchedBankAccounts = [],
}) => {
  const isReadOnly = isRestructure;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Banking Information (Optional)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Divider and colored box for previously registered bank info */}
        {fetchedBankAccounts.length > 0 && (
          <div className="my-2">
            <div className="text-xs font-semibold text-green-700 mb-1">Previously Registered</div>
            <div className="border-t border-green-200 mb-2" />
            <div className="bg-green-50 p-3 rounded">
              {fetchedBankAccounts.map((bank, idx) => (
                <div key={idx} className="mb-1">
                  <span className="font-medium">Bank Name: </span>
                  <span>{bank.bankName}</span>
                  <span className="ml-4 font-medium">Account Number: </span>
                  <span>{bank.bankAccountNumber}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="reporteeInformation.bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  {isReadOnly ? (
                    <Input
                      placeholder="Enter bank name"
                      {...field}
                      readOnly
                      className="bg-gray-100"
                    />
                  ) : (
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {indonesianBanks.map((bank) => (
                          <SelectItem key={bank.code} value={bank.name}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="reporteeInformation.bankAccountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter account number"
                    {...field}
                    value={isRestructure && !showSensitiveData && field.value ? '***-***-***' : (field.value || '')}
                    readOnly={isReadOnly}
                    className={isReadOnly ? "bg-gray-100" : isAddInfo ? "border-green-200 bg-green-50" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BankingInformationSection;
