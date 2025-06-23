
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
import { ReportFormData } from '@/types/report';

interface ReporteeInformationFormProps {
  control: Control<ReportFormData>;
}

const ReporteeInformationForm: React.FC<ReporteeInformationFormProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="reporteeInformation.companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name *</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter company name"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="reporteeInformation.contactPerson"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Person *</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter contact person name"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="reporteeInformation.phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number *</FormLabel>
            <FormControl>
              <Input
                type="tel"
                placeholder="Enter phone number"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="reporteeInformation.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address *</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="Enter email address"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="reporteeInformation.address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address *</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter company address"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="reporteeInformation.website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website (optional)</FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder="Enter website URL"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Company website if available
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ReporteeInformationForm;
