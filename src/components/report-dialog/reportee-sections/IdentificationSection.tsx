
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFormData } from '@/types/report';

interface IdentificationSectionProps {
  control: Control<ReportFormData>;
  isRestructure?: boolean;
  isAddInfo?: boolean;
  showSensitiveData?: boolean;
}

const IdentificationSection: React.FC<IdentificationSectionProps> = ({
  control,
  isRestructure = false,
  isAddInfo = false,
  showSensitiveData = false
}) => {
  const isReadOnly = isRestructure;
  const isEditable = !isRestructure;

  return (
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
  );
};

export default IdentificationSection;
