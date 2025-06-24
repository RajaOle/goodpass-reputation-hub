
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Report, PaymentMethod } from '@/types/report';
import { CheckCircle, Circle } from 'lucide-react';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: Report;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onOpenChange,
  report
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    report.paymentInfo?.method || 'full'
  );
  const [fullPaymentStatus, setFullPaymentStatus] = useState(
    report.paymentInfo?.status || 'belum-lunas'
  );
  const [installmentStatuses, setInstallmentStatuses] = useState(
    report.paymentInfo?.installments?.map(i => i.status) || []
  );
  
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const toggleInstallmentStatus = (index: number) => {
    const newStatuses = [...installmentStatuses];
    newStatuses[index] = newStatuses[index] === 'lunas' ? 'belum-lunas' : 'lunas';
    setInstallmentStatuses(newStatuses);
  };

  const handleSave = () => {
    // In real app, this would update the report via API
    console.log('Updating payment info:', {
      reportId: report.id,
      method: paymentMethod,
      fullPaymentStatus,
      installmentStatuses
    });

    toast({
      title: "Payment Updated",
      description: "Payment information has been successfully updated.",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            Update payment status for {report.reporteeInformation.fullName}'s loan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full">Full Payment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="installment" id="installment" />
                  <Label htmlFor="installment">Installment</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Full Payment */}
          {paymentMethod === 'full' && (
            <Card>
              <CardHeader>
                <CardTitle>Full Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Total Amount</div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(report.loanInformation.loanAmount)}
                      </div>
                    </div>
                    <Button
                      variant={fullPaymentStatus === 'lunas' ? 'default' : 'outline'}
                      onClick={() => setFullPaymentStatus(
                        fullPaymentStatus === 'lunas' ? 'belum-lunas' : 'lunas'
                      )}
                      className="flex items-center space-x-2"
                    >
                      {fullPaymentStatus === 'lunas' ? 
                        <CheckCircle className="h-4 w-4" /> : 
                        <Circle className="h-4 w-4" />
                      }
                      <span>{fullPaymentStatus === 'lunas' ? 'Lunas' : 'Belum Lunas'}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Installment Payment */}
          {paymentMethod === 'installment' && (
            <Card>
              <CardHeader>
                <CardTitle>Installment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: report.loanInformation.loanTerm }, (_, index) => {
                    const installmentNumber = index + 1;
                    const status = installmentStatuses[index] || 'belum-lunas';
                    const dueDate = new Date();
                    dueDate.setMonth(dueDate.getMonth() + installmentNumber);
                    
                    return (
                      <div key={installmentNumber} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Cicilan {installmentNumber}</div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(report.loanInformation.monthlyPayment)} - Due: {dueDate.toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          variant={status === 'lunas' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleInstallmentStatus(index)}
                          className="flex items-center space-x-2"
                        >
                          {status === 'lunas' ? 
                            <CheckCircle className="h-4 w-4" /> : 
                            <Circle className="h-4 w-4" />
                          }
                          <span>{status === 'lunas' ? 'Lunas' : 'Belum Lunas'}</span>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
