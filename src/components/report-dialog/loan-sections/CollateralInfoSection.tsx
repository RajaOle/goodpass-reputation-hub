
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFormData } from '@/types/report';

interface CollateralInfoSectionProps {
  control: Control<ReportFormData>;
  isRestructure?: boolean;
  isAddInfo?: boolean;
}

const CollateralInfoSection: React.FC<CollateralInfoSectionProps> = ({ 
  control, 
  isRestructure = false,
  isAddInfo = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Collateral Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="loanInformation.collateral"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Collateral Type 
                {isRestructure && <span className="text-orange-600">(Editable)</span>}
                {isAddInfo && <span className="text-gray-500">(Read-only)</span>}
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isAddInfo}
              >
                <FormControl>
                  <SelectTrigger className={isRestructure ? "border-orange-200 bg-orange-50" : isAddInfo ? "bg-gray-100" : ""}>
                    <SelectValue placeholder="Select collateral type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No Collateral</SelectItem>
                  <SelectItem value="property">Real Estate/Property</SelectItem>
                  <SelectItem value="vehicle">Vehicle</SelectItem>
                  <SelectItem value="savings">Savings Account</SelectItem>
                  <SelectItem value="stocks">Stocks/Securities</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="equipment">Equipment/Machinery</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          control={control}
          name="loanInformation.collateralDescription"
          render={({ field }) => {
            const collateral = control._formValues.loanInformation?.collateral;
            if (collateral === 'none') return null;
            
            return (
              <FormItem>
                <FormLabel>
                  Collateral Description (min 10 characters) * 
                  {isRestructure && <span className="text-orange-600">(Editable)</span>}
                  {isAddInfo && <span className="text-gray-500">(Read-only)</span>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please provide detailed description of the collateral..."
                    {...field}
                    readOnly={isAddInfo}
                    className={isRestructure ? "border-orange-200 bg-orange-50" : isAddInfo ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Controller
          control={control}
          name="loanInformation.collateralValue"
          render={({ field }) => {
            const collateral = control._formValues.loanInformation?.collateral;
            if (collateral === 'none') return null;
            
            return (
              <FormItem>
                <FormLabel>
                  Estimated Collateral Value (IDR) 
                  {isRestructure && <span className="text-orange-600">(Editable)</span>}
                  {isAddInfo && <span className="text-gray-500">(Read-only)</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter estimated value"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    readOnly={isAddInfo}
                    className={isRestructure ? "border-orange-200 bg-orange-50" : isAddInfo ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CollateralInfoSection;
