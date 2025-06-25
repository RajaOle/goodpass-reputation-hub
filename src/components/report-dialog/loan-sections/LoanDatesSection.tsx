
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ReportFormData } from '@/types/report';

interface LoanDatesSectionProps {
  control: Control<ReportFormData>;
  isRestructure?: boolean;
}

const LoanDatesSection: React.FC<LoanDatesSectionProps> = ({ 
  control, 
  isRestructure = false 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Important Dates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="loanInformation.agreementDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agreement Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    readOnly={isRestructure}
                    className={isRestructure ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="loanInformation.disbursementDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disbursement Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    readOnly={isRestructure}
                    className={isRestructure ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="loanInformation.dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date {isRestructure && <span className="text-orange-600">(Editable)</span>}</FormLabel>
                {isRestructure ? (
                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal border-orange-200 bg-orange-50",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>No Due Date Set</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date ? date.toISOString().split('T')[0] : '');
                          }}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    
                    {field.value && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange('')}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear Due Date
                      </Button>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      You can set a due date or leave it empty for no due date
                    </p>
                  </div>
                ) : (
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanDatesSection;
