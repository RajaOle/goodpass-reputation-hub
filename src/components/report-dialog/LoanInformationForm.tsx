
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ReportFormData } from '@/types/report';

interface LoanInformationFormProps {
  control: Control<ReportFormData>;
  isRestructure?: boolean;
}

const LoanInformationForm: React.FC<LoanInformationFormProps> = ({ 
  control, 
  isRestructure = false 
}) => {
  return (
    <div className="space-y-6">
      {/* Basic Loan Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="loanInformation.loanName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter loan name"
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
              name="loanInformation.loanType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Type * {isRestructure && <span className="text-orange-600">(Editable)</span>}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isRestructure ? false : false}
                  >
                    <FormControl>
                      <SelectTrigger className={isRestructure ? "border-orange-200 bg-orange-50" : ""}>
                        <SelectValue placeholder="Select loan type" />
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="loanInformation.loanAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Amount (IDR) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter loan amount"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    readOnly={isRestructure}
                    className={isRestructure ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Dates */}
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

      {/* Loan Purpose */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Loan Purpose</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="loanInformation.loanPurpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose of Loan *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isRestructure}
                >
                  <FormControl>
                    <SelectTrigger className={isRestructure ? "bg-gray-100" : ""}>
                      <SelectValue placeholder="Select loan purpose" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="business-expansion">Business Expansion</SelectItem>
                    <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
                    <SelectItem value="home-improvement">Home Improvement</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="medical-expenses">Medical Expenses</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={control}
            name="loanInformation.customLoanPurpose"
            render={({ field }) => {
              const loanPurpose = control._formValues.loanInformation?.loanPurpose;
              if (loanPurpose !== 'other') return null;
              
              return (
                <FormItem>
                  <FormLabel>Custom Loan Purpose (min 10 characters) *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe the loan purpose in detail..."
                      {...field}
                      readOnly={isRestructure}
                      className={isRestructure ? "bg-gray-100" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </CardContent>
      </Card>

      {/* Repayment Information */}
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
                  disabled={isRestructure}
                >
                  <FormControl>
                    <SelectTrigger className={isRestructure ? "bg-gray-100" : ""}>
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
                    <Input
                      type="number"
                      placeholder="Enter number of installments"
                      min={1}
                      max={60}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      readOnly={isRestructure}
                      className={isRestructure ? "bg-gray-100" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="loanInformation.applicationInterest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter interest rate"
                      step="0.01"
                      min={0}
                      max={100}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
              name="loanInformation.applicationLateFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Late Fee (IDR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter late fee amount"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      readOnly={isRestructure}
                      className={isRestructure ? "bg-gray-100" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Collateral Information */}
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
                <FormLabel>Collateral Type {isRestructure && <span className="text-orange-600">(Editable)</span>}</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isRestructure ? false : false}
                >
                  <FormControl>
                    <SelectTrigger className={isRestructure ? "border-orange-200 bg-orange-50" : ""}>
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
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide detailed description of the collateral..."
                      {...field}
                      readOnly={isRestructure ? false : false}
                      className={isRestructure ? "border-orange-200 bg-orange-50" : ""}
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
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter estimated value"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      readOnly={isRestructure ? false : false}
                      className={isRestructure ? "border-orange-200 bg-orange-50" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanInformationForm;
