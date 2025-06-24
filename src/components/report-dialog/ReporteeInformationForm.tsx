
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
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { ReportFormData } from '@/types/report';

interface ReporteeInformationFormProps {
  control: Control<ReportFormData>;
}

const ReporteeInformationForm: React.FC<ReporteeInformationFormProps> = ({ control }) => {
  const [socialLinks, setSocialLinks] = React.useState<string[]>(['']);

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, '']);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Reportee Information</h3>
        <p className="text-sm text-gray-600 mb-6">
          Provide details about the person or entity you're reporting.
        </p>
      </div>

      <FormField
        control={control}
        name="reporteeInformation.fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name *</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter full name"
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
            <FormDescription>
              Phone number must be unique in the system
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="reporteeInformation.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address (optional)</FormLabel>
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
        name="reporteeInformation.nationalId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>National ID / KTP (optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter National ID or KTP number"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Provide National ID or KTP for verification purposes
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel>Social Media Links (optional)</FormLabel>
        {socialLinks.map((link, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              placeholder="Enter social media URL"
              value={link}
              onChange={(e) => updateSocialLink(index, e.target.value)}
              className="flex-1"
            />
            {socialLinks.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSocialLink(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSocialLink}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Social Media Link</span>
        </Button>
      </div>
    </div>
  );
};

export default ReporteeInformationForm;
