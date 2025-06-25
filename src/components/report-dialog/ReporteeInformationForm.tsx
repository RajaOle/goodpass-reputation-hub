
import React, { useState } from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Upload, Eye, EyeOff, Info } from 'lucide-react';
import { ReportFormData } from '@/types/report';

interface ReporteeInformationFormProps {
  control: Control<ReportFormData>;
  setValue: UseFormSetValue<ReportFormData>;
  isRestructure?: boolean;
  isAddInfo?: boolean;
}

const ReporteeInformationForm: React.FC<ReporteeInformationFormProps> = ({ 
  control, 
  setValue,
  isRestructure = false,
  isAddInfo = false
}) => {
  const [socialMediaInput, setSocialMediaInput] = useState('');
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  const addSocialMediaLink = () => {
    if (socialMediaInput.trim() && !isRestructure) {
      const currentLinks = control._formValues.reporteeInformation?.socialMediaLinks || [];
      setValue('reporteeInformation.socialMediaLinks', [...currentLinks, socialMediaInput.trim()]);
      setSocialMediaInput('');
    }
  };

  const removeSocialMediaLink = (index: number) => {
    if (!isRestructure) {
      const currentLinks = control._formValues.reporteeInformation?.socialMediaLinks || [];
      const updatedLinks = currentLinks.filter((_, i) => i !== index);
      setValue('reporteeInformation.socialMediaLinks', updatedLinks);
    }
  };

  const isReadOnly = isRestructure;
  const isEditable = !isRestructure; // In Add Info mode, this section is editable

  return (
    <div className="space-y-6">
      {isAddInfo && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800 font-medium">
              ✏️ You can edit all reportee information and add additional details in this mode.
            </p>
          </div>
        </div>
      )}

      {isRestructure && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 font-medium">
              All reportee information is read-only during restructure
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              className="flex items-center gap-2"
            >
              {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showSensitiveData ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        </div>
      )}
      
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      readOnly={isReadOnly}
                      className={isReadOnly ? "bg-gray-100" : isAddInfo ? "border-green-200 bg-green-50" : ""}
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
                      placeholder="Enter phone number"
                      {...field}
                      value={isRestructure && !showSensitiveData ? '***-***-****' : field.value}
                      readOnly={isReadOnly}
                      className={isReadOnly ? "bg-gray-100" : isAddInfo ? "border-green-200 bg-green-50" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="reporteeInformation.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                    value={isRestructure && !showSensitiveData && field.value ? '***@***.***' : field.value}
                    readOnly={isReadOnly}
                    className={isReadOnly ? "bg-gray-100" : isAddInfo ? "border-green-200 bg-green-50" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Identification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="reporteeInformation.idType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isReadOnly}
                  >
                    <FormControl>
                      <SelectTrigger className={isReadOnly ? "bg-gray-100" : isAddInfo ? "border-green-200 bg-green-50" : ""}>
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="national-id">National ID</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="driver-license">Driver's License</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="reporteeInformation.nationalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter ID number"
                      {...field}
                      value={isRestructure && !showSensitiveData && field.value ? '***-***-***' : field.value}
                      readOnly={isReadOnly}
                      className={isReadOnly ? "bg-gray-100" : isAddInfo ? "border-green-200 bg-green-50" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isEditable && (
            <FormField
              control={control}
              name="reporteeInformation.idPicture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Picture (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                        className={isAddInfo ? "border-green-200 bg-green-50 flex-1" : "flex-1"}
                      />
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isRestructure && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              ID picture on file {showSensitiveData ? '(available for viewing in admin panel)' : '(hidden for privacy)'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Social Media (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditable && (
            <div className="flex gap-2">
              <Input
                placeholder="Enter social media profile URL"
                value={socialMediaInput}
                onChange={(e) => setSocialMediaInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSocialMediaLink())}
                className={isAddInfo ? "border-green-200 bg-green-50" : ""}
              />
              <Button type="button" onClick={addSocialMediaLink} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {control._formValues.reporteeInformation?.socialMediaLinks?.map((link, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-2">
                <span className={isRestructure && !showSensitiveData ? "blur-sm" : ""}>
                  {link}
                </span>
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => removeSocialMediaLink(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Banking Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Banking Information (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="reporteeInformation.bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter bank name"
                      {...field}
                      readOnly={isReadOnly}
                      className={isReadOnly ? "bg-gray-100" : isAddInfo ? "border-green-200 bg-green-50" : ""}
                    />
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
                      value={isRestructure && !showSensitiveData && field.value ? '***-***-***' : field.value}
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
    </div>
  );
};

export default ReporteeInformationForm;
