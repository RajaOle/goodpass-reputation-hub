
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Report, PaymentMethod } from '@/types/report';
import { CheckCircle, Circle, Plus, Trash2 } from 'lucide-react';

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
    report.paymentInfo?.status || 'unpaid'
  );
  const [installmentStatuses, setInstallmentStatuses] = useState(
    report.paymentInfo?.installments?.map(i => i.status) || []
  );
  
  // Open payment states
  const [openPayments, setOpenPayments] = useState(
    report.paymentInfo?.openPayments || []
  );
  const [newPaymentAmount, setNewPaymentAmount] = useState('');
  const [newPaymentDate, setNewPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPaymentNotes, setNewPaymentNotes] = useState('');
  
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/[^0-9]/g, '')) || 0;
  };

  const calculateTotalPaid = () => {
    return openPayments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const calculateRemainingBalance = () => {
    return report.loanInformation.loanAmount - calculateTotalPaid();
  };

  const toggleInstallmentStatus = (index: number) => {
    const newStatuses = [...installmentStatuses];
    newStatuses[index] = newStatuses[index] === 'paid' ? 'unpaid' : 'paid';
    setInstallmentStatuses(newStatuses);
  };

  const addOpenPayment = () => {
    const amount = parseCurrency(newPaymentAmount);
    if (amount <= 0) return;

    const totalPaid = calculateTotalPaid() + amount;
    const newPayment = {
      id: Date.now().toString(),
      amount,
      date: newPaymentDate,
      notes: newPaymentNotes,
      runningBalance: report.loanInformation.loanAmount - totalPaid
    };

    setOpenPayments([...openPayments, newPayment]);
    setNewPaymentAmount('');
    setNewPaymentNotes('');
    setNewPaymentDate(new Date().toISOString().split('T')[0]);
  };

  const removeOpenPayment = (paymentId: string) => {
    const updatedPayments = openPayments.filter(p => p.id !== paymentId);
    // Recalculate running balances
    let runningTotal = 0;
    const recalculatedPayments = updatedPayments.map(payment => {
      runningTotal += payment.amount;
      return {
        ...payment,
        runningBalance: report.loanInformation.loanAmount - runningTotal
      };
    });
    setOpenPayments(recalculatedPayments);
  };

  const handleSave = () => {
    console.log('Updating payment info:', {
      reportId: report.id,
      method: paymentMethod,
      fullPaymentStatus,
      installmentStatuses,
      openPayments,
      totalPaid: calculateTotalPaid(),
      remainingBalance: calculateRemainingBalance()
    });

    toast({
      title: "Payment Updated",
      description: "Payment information has been successfully updated.",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="open-payment" id="open-payment" />
                  <Label htmlFor="open-payment">Open Payment (Flexible)</Label>
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
                      variant={fullPaymentStatus === 'paid' ? 'default' : 'outline'}
                      onClick={() => setFullPaymentStatus(
                        fullPaymentStatus === 'paid' ? 'unpaid' : 'paid'
                      )}
                      className="flex items-center space-x-2"
                    >
                      {fullPaymentStatus === 'paid' ? 
                        <CheckCircle className="h-4 w-4" /> : 
                        <Circle className="h-4 w-4" />
                      }
                      <span>{fullPaymentStatus === 'paid' ? 'Paid' : 'Unpaid'}</span>
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
                    const status = installmentStatuses[index] || 'unpaid';
                    const dueDate = new Date();
                    dueDate.setMonth(dueDate.getMonth() + installmentNumber);
                    
                    return (
                      <div key={installmentNumber} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Installment {installmentNumber}</div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(report.loanInformation.monthlyPayment)} - Due: {dueDate.toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          variant={status === 'paid' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleInstallmentStatus(index)}
                          className="flex items-center space-x-2"
                        >
                          {status === 'paid' ? 
                            <CheckCircle className="h-4 w-4" /> : 
                            <Circle className="h-4 w-4" />
                          }
                          <span>{status === 'paid' ? 'Paid' : 'Unpaid'}</span>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Open Payment */}
          {paymentMethod === 'open-payment' && (
            <div className="space-y-4">
              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">Loan Amount</div>
                      <div className="font-semibold">{formatCurrency(report.loanInformation.loanAmount)}</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Total Paid</div>
                      <div className="font-semibold">{formatCurrency(calculateTotalPaid())}</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-sm text-gray-600">Remaining</div>
                      <div className="font-semibold">{formatCurrency(calculateRemainingBalance())}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add New Payment */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="text"
                        placeholder="Enter amount"
                        value={newPaymentAmount}
                        onChange={(e) => setNewPaymentAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newPaymentDate}
                        onChange={(e) => setNewPaymentDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input
                        id="notes"
                        placeholder="Payment notes"
                        value={newPaymentNotes}
                        onChange={(e) => setNewPaymentNotes(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={addOpenPayment} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Payment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment History */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {openPayments.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No payments recorded yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {openPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div>
                                <div className="font-medium">{formatCurrency(payment.amount)}</div>
                                <div className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</div>
                              </div>
                              {payment.notes && (
                                <div className="text-sm text-gray-600 italic">"{payment.notes}"</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Balance After</div>
                            <div className="font-medium">{formatCurrency(payment.runningBalance)}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeOpenPayment(payment.id)}
                            className="ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
