
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
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Upload, 
  Calendar, 
  DollarSign, 
  FileText, 
  AlertCircle, 
  CheckCircle2,
  X,
  Receipt,
  CreditCard,
  TrendingUp
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

  const calculateProgress = () => {
    if (paymentMethod === 'installment') {
      const installments = generateInstallments();
      const paidCount = installments.filter(i => i.status === 'paid').length;
      return (paidCount / installments.length) * 100;
    }
    return 0;
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
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Payment Overview</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Original Loan Amount</Label>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(report.loanInformation.loanAmount)}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Outstanding Balance</Label>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(getOutstandingAmount())}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="amount" className="text-base font-semibold flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Payment Amount *
        </Label>
        <Input
          id="amount"
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          placeholder="Enter payment amount (IDR)"
          className="text-lg h-14 border-2 focus:border-blue-500 transition-colors"
        />
        <p className="text-sm text-gray-600">
          Enter any amount you wish to pay towards the outstanding balance
        </p>
      </div>
    </div>
  );

  const renderInstallmentInterface = () => {
    const installments = generateInstallments();
    const unpaidInstallments = installments.filter(i => i.status === 'unpaid');
    const progress = calculateProgress();
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Payment Progress</h3>
            </div>
            <Badge variant="outline" className="bg-white">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{installments.filter(i => i.status === 'paid').length} of {installments.length} paid</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-600">Total Installments</Label>
              <p className="text-lg font-bold text-gray-900">{installments.length}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-600">Amount per Installment</Label>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(calculateInstallmentAmount())}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Select Installment to Pay *
          </Label>
          
          <RadioGroup value={selectedInstallment} onValueChange={setSelectedInstallment}>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {unpaidInstallments.map((installment) => (
                <div key={installment.id} className="relative">
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-blue-200 transition-colors bg-white">
                    <RadioGroupItem value={installment.id} id={installment.id} />
                    <label 
                      htmlFor={installment.id} 
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-medium">
                              Installment #{installment.number}
                            </Badge>
                            {installment.isOverdue && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(installment.amount)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Due: {new Date(installment.dueDate).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <CreditCard className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </label>
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
    );
  };

  const renderSinglePaymentInterface = () => {
    const amount = report.loanInformation.loanAmount;
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Single Payment Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white rounded-lg border">
              <Label className="text-sm font-medium text-gray-500">Loan Amount</Label>
              <p className="text-xl font-bold text-gray-900 mt-2">
                {formatCurrency(amount)}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Label className="text-sm font-medium text-gray-500">Outstanding</Label>
              <p className="text-xl font-bold text-gray-900 mt-2">
                {formatCurrency(amount)}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Label className="text-sm font-medium text-green-600">Payment Required</Label>
              <p className="text-xl font-bold text-green-700 mt-2">
                {formatCurrency(amount)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Single Payment</p>
              <p className="text-sm text-blue-700">
                This loan requires full payment of {formatCurrency(amount)} to complete the repayment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getInterfaceTitle = () => {
    switch (paymentMethod) {
      case 'open-payment':
        return 'Flexible Payment Processing';
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
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div>{getInterfaceTitle()}</div>
              <div className="text-sm font-normal text-gray-600 mt-1">
                {report.reporteeInformation.fullName} • {report.loanInformation.loanName}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Payment Type Specific Interface */}
          {paymentMethod === 'open-payment' && renderOpenPaymentInterface()}
          {paymentMethod === 'installment' && renderInstallmentInterface()}
          {paymentMethod === 'single-payment' && renderSinglePaymentInterface()}

          {/* Enhanced File Upload Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Payment Documentation *
            </Label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="text-center">
                <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to upload</p>
                <p className="text-sm text-gray-600 mb-6">
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
                  <Button variant="outline" type="button" className="bg-white hover:bg-gray-50">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </Label>
                <p className="text-xs text-gray-500 mt-2">
                  Supports: JPG, PNG, PDF, DOC, DOCX (Max 10MB each)
                </p>
              </div>
            </div>

            {proofDocuments.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Uploaded Files ({proofDocuments.length})
                </Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {proofDocuments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded">
                          <FileText className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown type'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="px-8 bg-blue-600 hover:bg-blue-700">
            <Receipt className="h-4 w-4 mr-2" />
            Process Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessPaymentDialog;
