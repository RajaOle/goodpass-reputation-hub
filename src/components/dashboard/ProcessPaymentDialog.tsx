
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Calendar, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { Report, OpenPayment } from '@/types/report';

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
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank-transfer'>('cash');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [proofDocuments, setProofDocuments] = useState<File[]>([]);
  const [selectedInstallment, setSelectedInstallment] = useState<number | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPaymentType = () => {
    if (report.loanInformation.repaymentPlan === 'single-payment') return 'single';
    if (report.loanInformation.repaymentPlan === 'installment') return 'installment';
    return 'open';
  };

  const getOutstandingAmount = () => {
    if (report.paymentInfo?.remainingBalance !== undefined) {
      return report.paymentInfo.remainingBalance;
    }
    return report.loanInformation.loanAmount;
  };

  const getNextInstallmentAmount = () => {
    if (report.paymentInfo?.installments) {
      const nextUnpaid = report.paymentInfo.installments.find(inst => inst.status === 'unpaid');
      return nextUnpaid?.amount || 0;
    }
    if (report.loanInformation.monthlyPayment) {
      return report.loanInformation.monthlyPayment;
    }
    return 0;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setProofDocuments(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setProofDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log('Processing payment:', {
      method: paymentMethod,
      amount: parseFloat(paymentAmount),
      date: paymentDate,
      notes: paymentNotes,
      documents: proofDocuments,
      installment: selectedInstallment
    });
    
    // Here you would integrate with your payment processing logic
    onOpenChange(false);
  };

  const renderSinglePaymentContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Loan Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
              <p className="text-lg font-semibold">{formatCurrency(report.loanInformation.loanAmount)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Outstanding</Label>
              <p className="text-lg font-semibold text-red-600">{formatCurrency(getOutstandingAmount())}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Payment Amount *</Label>
          <Input
            id="amount"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="Enter amount"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="date">Payment Date *</Label>
          <Input
            id="date"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );

  const renderInstallmentContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Installment Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {report.paymentInfo?.installments && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {report.paymentInfo.installments.map((installment) => (
                <div 
                  key={installment.number}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedInstallment === installment.number 
                      ? 'border-blue-500 bg-blue-50' 
                      : installment.status === 'paid' 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => installment.status === 'unpaid' && setSelectedInstallment(installment.number)}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={installment.status === 'paid' ? 'default' : 'secondary'}>
                      #{installment.number}
                    </Badge>
                    <div>
                      <p className="font-medium">{formatCurrency(installment.amount)}</p>
                      <p className="text-sm text-gray-500">Due: {new Date(installment.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant={installment.status === 'paid' ? 'default' : 'outline'}>
                    {installment.status === 'paid' ? 'Paid' : 'Unpaid'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedInstallment && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Payment Amount *</Label>
            <Input
              id="amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Enter amount"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="date">Payment Date *</Label>
            <Input
              id="date"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderOpenPaymentContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {report.paymentInfo?.openPayments && report.paymentInfo.openPayments.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {report.paymentInfo.openPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                    {payment.notes && <p className="text-sm text-gray-400">{payment.notes}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Balance: {formatCurrency(payment.runningBalance)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>No payment history available</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Payment Amount *</Label>
          <Input
            id="amount"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="Enter amount"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="date">Payment Date *</Label>
          <Input
            id="date"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );

  const paymentType = getPaymentType();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Process Payment - {report.reporteeInformation.fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <Label className="text-base font-medium">Payment Method</Label>
            <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'cash' | 'bank-transfer')} className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cash">Cash Payment</TabsTrigger>
                <TabsTrigger value="bank-transfer">Bank Transfer</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Payment Type Specific Content */}
          <div>
            <Label className="text-base font-medium mb-4 block">Payment Details</Label>
            {paymentType === 'single' && renderSinglePaymentContent()}
            {paymentType === 'installment' && renderInstallmentContent()}
            {paymentType === 'open' && renderOpenPaymentContent()}
          </div>

          {/* Payment Notes */}
          <div>
            <Label htmlFor="notes">Payment Notes</Label>
            <Textarea
              id="notes"
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder="Add any additional notes about this payment..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* File Upload */}
          <div>
            <Label className="text-base font-medium">Proof of Payment</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload payment receipts or proof</p>
                <Input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" type="button">Choose Files</Button>
                </Label>
              </div>
            </div>

            {proofDocuments.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label className="text-sm font-medium">Uploaded Files:</Label>
                {proofDocuments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
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
            <Button 
              onClick={handleSubmit}
              disabled={!paymentAmount || !paymentDate || (paymentType === 'installment' && !selectedInstallment)}
            >
              Process Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessPaymentDialog;
