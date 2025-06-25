
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle2,
  X,
  Circle,
  CheckCircle
} from 'lucide-react';
import { Report } from '@/types/report';
import { useToast } from "@/hooks/use-toast";

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

  // Determine payment method - prioritize paymentInfo.method, fallback to repaymentPlan
  const getPaymentMethod = () => {
    const method = report.paymentInfo?.method || report.loanInformation.repaymentPlan;
    console.log('Payment method determination:', {
      paymentInfoMethod: report.paymentInfo?.method,
      repaymentPlan: report.loanInformation.repaymentPlan,
      finalMethod: method
    });
    return method;
  };

  const paymentMethod = getPaymentMethod();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getOutstandingAmount = () => {
    if (report.paymentInfo?.remainingBalance !== undefined) {
      return report.paymentInfo.remainingBalance;
    }
    return report.loanInformation.loanAmount;
  };

  const calculateInstallmentAmount = () => {
    const totalAmount = report.loanInformation.loanAmount;
    const installmentCount = report.loanInformation.installmentCount || 1;
    return totalAmount / installmentCount;
  };

  const generateInstallments = () => {
    const installmentAmount = calculateInstallmentAmount();
    const count = report.loanInformation.installmentCount || 1;
    const startDate = new Date(report.loanInformation.disbursementDate);
    
    return Array.from({ length: count }, (_, index) => {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + index + 1);
      
      const isPaid = report.paymentInfo?.installments?.[index]?.status === 'paid';
      const isOverdue = !isPaid && new Date() > dueDate;
      
      return {
        id: `installment-${index + 1}`,
        number: index + 1,
        amount: installmentAmount,
        dueDate: dueDate.toISOString().split('T')[0],
        status: isPaid ? 'paid' : 'unpaid',
        isOverdue
      };
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit
    
    if (validFiles.length !== files.length) {
      toast({
        title: "File Size Warning",
        description: "Some files were too large (max 10MB) and were not uploaded.",
        variant: "destructive"
      });
    }
    
    setProofDocuments(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setProofDocuments(prev => prev.filter((_, i) => i !== index));
  };

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

  const renderOpenPaymentInterface = () => (
    <Card>
      <CardHeader>
        <CardTitle>Open Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Loan Amount</div>
              <div className="font-semibold">{formatCurrency(report.loanInformation.loanAmount)}</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600">Outstanding</div>
              <div className="font-semibold">{formatCurrency(getOutstandingAmount())}</div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="amount">Payment Amount</Label>
            <Input
              id="amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Enter payment amount"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderInstallmentInterface = () => {
    const installments = generateInstallments();
    const unpaidInstallments = installments.filter(i => i.status === 'unpaid');
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Installment Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600">Per Installment</div>
                <div className="font-semibold">{formatCurrency(calculateInstallmentAmount())}</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600">Remaining</div>
                <div className="font-semibold">{unpaidInstallments.length} of {installments.length}</div>
              </div>
            </div>

            <div>
              <Label>Select Installment to Pay</Label>
              <RadioGroup value={selectedInstallment} onValueChange={setSelectedInstallment}>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {unpaidInstallments.map((installment) => (
                    <div key={installment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={installment.id} id={installment.id} />
                        <div>
                          <div className="font-medium">Installment #{installment.number}</div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(installment.amount)} - Due: {new Date(installment.dueDate).toLocaleDateString()}
                          </div>
                          {installment.isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {unpaidInstallments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                  <p className="text-lg font-medium">All installments have been paid!</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSinglePaymentInterface = () => {
    const amount = report.loanInformation.loanAmount;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Single Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Total Payment Required</div>
              <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
            </div>
            
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Full Payment Required</p>
                  <p className="text-sm text-blue-700">
                    This loan requires full payment of {formatCurrency(amount)} to complete the repayment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            Submit payment proof for {report.reporteeInformation.fullName}'s loan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Interface */}
          {paymentMethod === 'open-payment' && renderOpenPaymentInterface()}
          {paymentMethod === 'installment' && renderInstallmentInterface()}
          {(paymentMethod === 'single-payment' || paymentMethod === 'full') && renderSinglePaymentInterface()}

          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Payment Proof</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-4">
                    Upload bank transfer receipts, payment confirmations, or other proof of payment
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" type="button">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </Label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supports: JPG, PNG, PDF, DOC, DOCX (Max 10MB each)
                  </p>
                </div>

                {proofDocuments.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Uploaded Files ({proofDocuments.length})
                    </Label>
                    {proofDocuments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Process Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessPaymentDialog;
