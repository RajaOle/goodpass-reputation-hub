
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Report, PaymentMethod } from '@/types/report';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RestructureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: Report;
}

const RestructureDialog: React.FC<RestructureDialogProps> = ({
  open,
  onOpenChange,
  report
}) => {
  const [restructureType, setRestructureType] = useState<'due-date' | 'payment-method'>('due-date');
  const [newDueDate, setNewDueDate] = useState<Date>();
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>('installment');
  const [newInstallmentTerm, setNewInstallmentTerm] = useState(12);
  const [reason, setReason] = useState('');
  
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateNewMonthlyPayment = () => {
    if (newPaymentMethod === 'installment') {
      return report.loanInformation.loanAmount / newInstallmentTerm;
    }
    return report.loanInformation.loanAmount;
  };

  const handleSubmit = () => {
    // In real app, this would submit restructure request via API
    console.log('Submitting restructure request:', {
      reportId: report.id,
      type: restructureType,
      newDueDate,
      newPaymentMethod,
      newInstallmentTerm,
      reason
    });

    toast({
      title: "Restructure Request Submitted",
      description: "Your restructure request has been submitted for admin approval.",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Restructure Request</DialogTitle>
          <DialogDescription>
            Propose changes to the loan terms for {report.reporteeInformation.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Restructure Type */}
          <Card>
            <CardHeader>
              <CardTitle>Restructure Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={restructureType} 
                onValueChange={(value: 'due-date' | 'payment-method') => setRestructureType(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="due-date" id="due-date" />
                  <Label htmlFor="due-date">Change Due Date</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="payment-method" id="payment-method" />
                  <Label htmlFor="payment-method">Change Payment Method</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Due Date Change */}
          {restructureType === 'due-date' && (
            <Card>
              <CardHeader>
                <CardTitle>New Due Date</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select New Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newDueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newDueDate ? format(newDueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newDueDate}
                        onSelect={setNewDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method Change */}
          {restructureType === 'payment-method' && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Change</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Payment Method</Label>
                  <p className="text-sm text-gray-600 capitalize">
                    {report.paymentInfo?.method || 'Not set'}
                  </p>
                </div>
                
                <div>
                  <Label>New Payment Method</Label>
                  <RadioGroup 
                    value={newPaymentMethod} 
                    onValueChange={(value: PaymentMethod) => setNewPaymentMethod(value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full" id="new-full" />
                      <Label htmlFor="new-full">Full Payment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="installment" id="new-installment" />
                      <Label htmlFor="new-installment">Installment</Label>
                    </div>
                  </RadioGroup>
                </div>

                {newPaymentMethod === 'installment' && (
                  <div>
                    <Label htmlFor="installment-term">Installment Term (months)</Label>
                    <Input
                      id="installment-term"
                      type="number"
                      value={newInstallmentTerm}
                      onChange={(e) => setNewInstallmentTerm(parseInt(e.target.value) || 12)}
                      min={1}
                      max={60}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      New monthly payment: {formatCurrency(calculateNewMonthlyPayment())}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Reason */}
          <Card>
            <CardHeader>
              <CardTitle>Reason for Restructure</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Please provide a reason for this restructure request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Original Loan Amount:</span>
                <span className="ml-2">{formatCurrency(report.loanInformation.loanAmount)}</span>
              </div>
              <div>
                <span className="font-medium">Original Monthly Payment:</span>
                <span className="ml-2">{formatCurrency(report.loanInformation.monthlyPayment)}</span>
              </div>
              {restructureType === 'payment-method' && newPaymentMethod === 'installment' && (
                <div className="text-blue-600">
                  <span className="font-medium">New Monthly Payment:</span>
                  <span className="ml-2">{formatCurrency(calculateNewMonthlyPayment())}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!reason.trim() || (restructureType === 'due-date' && !newDueDate)}
          >
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RestructureDialog;
