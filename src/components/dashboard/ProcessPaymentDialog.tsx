
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Calculator, 
  DollarSign, 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle 
} from 'lucide-react';
import { Report } from '@/types/report';
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, getPaymentMethod, getOutstandingAmount } from './payment/paymentUtils';
import FileUploadSection from './payment/FileUploadSection';

interface ProcessPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: Report;
}

const ProcessPaymentDialog: React.FC<ProcessPaymentDialogProps> = ({
  open,
  onOpenChange,
  report
}) => {
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [selectedInstallment, setSelectedInstallment] = useState<string>('');
  const [proofDocuments, setProofDocuments] = useState<File[]>([]);
  const { toast } = useToast();

  const paymentMethod = getPaymentMethod(report);
  const outstandingAmount = getOutstandingAmount(report);
  const loanAmount = report.loanInformation.loanAmount;

  // Generate installments for installment payment method
  const installments = paymentMethod === 'installment' && report.paymentInfo?.installments 
    ? report.paymentInfo.installments.map((inst, index) => {
        const dueDate = new Date(inst.dueDate);
        const isOverdue = inst.status === 'unpaid' && new Date() > dueDate;
        
        return {
          id: `installment-${inst.number}`,
          number: inst.number,
          amount: inst.amount,
          dueDate: inst.dueDate,
          status: inst.status,
          isOverdue
        };
      }).filter(inst => inst.status === 'unpaid')
    : [];

  const handleSubmit = () => {
    if (proofDocuments.length === 0) {
      toast({
        title: "Missing Documentation",
        description: "Please upload payment proof before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === 'open-payment' && !paymentAmount) {
      toast({
        title: "Missing Amount", 
        description: "Please enter the payment amount.",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === 'installment' && !selectedInstallment) {
      toast({
        title: "Missing Selection",
        description: "Please select which installment to pay.",
        variant: "destructive"
      });
      return;
    }

    console.log('Processing payment:', {
      reportId: report.id,
      paymentType: paymentMethod,
      amount: paymentAmount ? parseFloat(paymentAmount) : null,
      installmentId: selectedInstallment,
      documents: proofDocuments,
      timestamp: new Date().toISOString()
    });
    
    toast({
      title: "Payment Processed Successfully",
      description: "Your payment has been recorded and is under review.",
    });
    
    onOpenChange(false);
  };

  const renderPaymentInterface = () => {
    if (paymentMethod === 'single-payment' || paymentMethod === 'full') {
      return (
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Single Payment</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-white rounded-lg border border-purple-100">
              <div className="text-sm text-purple-600 font-medium mb-2">Total Payment Required</div>
              <div className="text-3xl font-bold text-purple-700">{formatCurrency(loanAmount)}</div>
              <div className="text-sm text-gray-600 mt-2">Complete loan repayment in one transaction</div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (paymentMethod === 'open-payment') {
      const paymentValue = parseFloat(paymentAmount) || 0;
      const remainingAfterPayment = Math.max(0, outstandingAmount - paymentValue);

      return (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Open Payment</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-xs text-orange-600 font-medium mb-1">Outstanding</div>
                <div className="text-xl font-bold text-orange-700">{formatCurrency(outstandingAmount)}</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-xs text-green-600 font-medium mb-1">After Payment</div>
                <div className="text-xl font-bold text-green-700">{formatCurrency(remainingAfterPayment)}</div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="amount" className="text-base font-semibold">
                Enter Payment Amount
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount to pay"
                  className="text-lg font-semibold h-12 pl-12"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  IDR
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '50%', value: Math.round(outstandingAmount * 0.5) },
                { label: 'Full', value: outstandingAmount }
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => setPaymentAmount(option.value.toString())}
                  className="p-3 text-center border-2 border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
                >
                  <div className="font-semibold text-sm">{option.label}</div>
                  <div className="text-xs text-gray-600">{formatCurrency(option.value)}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (paymentMethod === 'installment') {
      const overdueInstallments = installments.filter(i => i.isOverdue);

      return (
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">Installment Payment</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {overdueInstallments.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <div className="font-semibold text-red-800 text-sm">
                    {overdueInstallments.length} Overdue Installment{overdueInstallments.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            )}

            {installments.length > 0 ? (
              <div className="space-y-4">
                <Label className="text-base font-semibold">Select Installment to Pay</Label>
                <RadioGroup value={selectedInstallment} onValueChange={setSelectedInstallment}>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {installments.map((installment) => (
                      <div 
                        key={installment.id} 
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedInstallment === installment.id 
                            ? 'border-blue-400 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        } ${installment.isOverdue ? 'ring-1 ring-red-200' : ''}`}
                        onClick={() => setSelectedInstallment(installment.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={installment.id} id={installment.id} />
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-semibold">Installment #{installment.number}</div>
                              {installment.isOverdue && (
                                <Badge variant="destructive" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Overdue
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              Due: {new Date(installment.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(installment.amount)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ) : (
              <div className="text-center p-8">
                <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">All Installments Paid!</h3>
                <p className="text-gray-600">All scheduled installments have been completed.</p>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Process Payment
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Submit payment proof for <span className="font-medium text-gray-900">{report.reporteeInformation.fullName}</span>'s loan
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {renderPaymentInterface()}
          
          <FileUploadSection
            proofDocuments={proofDocuments}
            onFilesChange={setProofDocuments}
          />
        </div>

        <DialogFooter className="pt-4 border-t">
          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
            >
              Process Payment
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessPaymentDialog;
