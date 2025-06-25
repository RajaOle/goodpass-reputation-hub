
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Calendar, DollarSign, FileText, AlertCircle } from 'lucide-react';
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
  const [proofDocuments, setProofDocuments] = useState<File[]>([]);
  const { toast } = useToast();

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
      
      return {
        number: index + 1,
        amount: installmentAmount,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'unpaid'
      };
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setProofDocuments(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setProofDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (proofDocuments.length === 0) {
      toast({
        title: "Error",
        description: "Please upload payment proof before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (report.loanInformation.repaymentPlan === 'open-payment' && !paymentAmount) {
      toast({
        title: "Error", 
        description: "Please enter the payment amount.",
        variant: "destructive"
      });
      return;
    }

    console.log('Processing payment:', {
      reportId: report.id,
      paymentType: report.loanInformation.repaymentPlan,
      amount: paymentAmount ? parseFloat(paymentAmount) : null,
      documents: proofDocuments,
      timestamp: new Date().toISOString()
    });
    
    toast({
      title: "Payment Processed",
      description: "Payment has been successfully recorded.",
    });
    
    onOpenChange(false);
  };

  const renderOpenPaymentInterface = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-500">Initial Loan Amount</Label>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(report.loanInformation.loanAmount)}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Current Outstanding</Label>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(getOutstandingAmount())}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <Label htmlFor="amount" className="text-base font-medium">Payment Amount Being Processed *</Label>
        <Input
          id="amount"
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          placeholder="Enter payment amount"
          className="mt-2 text-lg"
        />
      </div>
    </div>
  );

  const renderInstallmentInterface = () => {
    const installments = generateInstallments();
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Installment Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {installments.map((installment) => (
                <div 
                  key={installment.number}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-medium">
                      #{installment.number}
                    </Badge>
                    <div>
                      <p className="font-semibold text-lg">
                        {formatCurrency(installment.amount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Due: {new Date(installment.dueDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {installment.status === 'paid' ? 'Paid' : 'Unpaid'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSinglePaymentInterface = () => {
    const amount = report.loanInformation.loanAmount;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Single Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <Label className="text-sm font-medium text-gray-500">Initial Amount</Label>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {formatCurrency(amount)}
                </p>
              </div>
              <div className="text-center">
                <Label className="text-sm font-medium text-gray-500">Outstanding Amount</Label>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {formatCurrency(amount)}
                </p>
              </div>
              <div className="text-center">
                <Label className="text-sm font-medium text-gray-500">Repayment Amount</Label>
                <p className="text-lg font-bold text-green-600 mt-1">
                  {formatCurrency(amount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const getInterfaceTitle = () => {
    switch (report.loanInformation.repaymentPlan) {
      case 'open-payment':
        return 'Open Payment Processing';
      case 'installment':
        return 'Installment Payment Processing';
      case 'single-payment':
        return 'Single Payment Processing';
      default:
        return 'Payment Processing';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {getInterfaceTitle()} - {report.reporteeInformation.fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Type Specific Interface */}
          {report.loanInformation.repaymentPlan === 'open-payment' && renderOpenPaymentInterface()}
          {report.loanInformation.repaymentPlan === 'installment' && renderInstallmentInterface()}
          {report.loanInformation.repaymentPlan === 'single-payment' && renderSinglePaymentInterface()}

          {/* File Upload Section */}
          <div>
            <Label className="text-base font-medium mb-3 block">Upload Payment Proof/Receipt *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-3">Upload payment receipts, bank transfer proof, or other payment evidence</p>
                <Input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" type="button" className="bg-white">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </Label>
              </div>
            </div>

            {proofDocuments.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label className="text-sm font-medium">Uploaded Files:</Label>
                {proofDocuments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Process Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessPaymentDialog;
