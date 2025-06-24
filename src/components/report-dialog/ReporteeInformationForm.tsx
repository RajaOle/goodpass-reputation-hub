
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
import { Plus, X, User, Phone, Mail, IdCard, Globe } from 'lucide-react';
import { ReportFormData } from '@/types/report';
import CountryCodeSelector from '@/components/CountryCodeSelector';

interface ReporteeInformationFormProps {
  control: Control<ReportFormData>;
}

const ReporteeInformationForm: React.FC<ReporteeInformationFormProps> = ({ control }) => {
  const [socialLinks, setSocialLinks] = React.useState<string[]>(['']);
  const [countryCode, setCountryCode] = React.useState('+62');

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
      <FormField
        control={control}
        name="reporteeInformation.fullName"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-600" />
              <span>Full Name</span>
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter the borrower's full legal name"
                className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="reporteeInformation.phoneNumber"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
              <Phone className="h-4 w-4 text-green-600" />
              <span>Phone Number</span>
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="flex">
                <CountryCodeSelector
                  value={countryCode}
                  onChange={setCountryCode}
                />
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  className="h-12 text-base border-2 border-l-0 border-gray-200 focus:border-blue-500 transition-colors rounded-l-none"
                  value={field.value?.replace(/^\+\d+\s?/, '') || ''}
                  onChange={(e) => {
                    const phoneWithoutCode = e.target.value;
                    const fullPhone = `${countryCode} ${phoneWithoutCode}`;
                    field.onChange(fullPhone);
                  }}
                />
              </div>
            </FormControl>
            <FormDescription className="text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
              📱 <strong>Important:</strong> Phone numbers must be unique in our system for accurate credit tracking
            </FormDescription>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="reporteeInformation.email"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
                <Mail className="h-4 w-4 text-purple-600" />
                <span>Email Address</span>
                <span className="text-gray-500">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="borrower@example.com"
                  className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="reporteeInformation.nationalId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
                <IdCard className="h-4 w-4 text-orange-600" />
                <span>National ID / KTP</span>
                <span className="text-gray-500">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 1234567890123456"
                  className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                For verification purposes only
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
          <Globe className="h-4 w-4 text-indigo-600" />
          <span>Social Media Links</span>
          <span className="text-gray-500">(optional)</span>
        </FormLabel>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            💡 Social media profiles can help verify identity and improve credit assessment
          </p>
          
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-3 mb-3">
              <Input
                placeholder="https://facebook.com/username or @twitter_handle"
                value={link}
                onChange={(e) => updateSocialLink(index, e.target.value)}
                className="flex-1 h-10 border-2 border-gray-200 focus:border-blue-500 transition-colors"
              />
              {socialLinks.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
            className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" />
            <span>Add Another Social Link</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReporteeInformationForm;
