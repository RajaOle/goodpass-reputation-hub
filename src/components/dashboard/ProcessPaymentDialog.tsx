
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
import { Report } from '@/types/report';
import { useToast } from "@/hooks/use-toast";
import PaymentInterfaceSelector from './payment/PaymentInterfaceSelector';
import FileUploadSection from './payment/FileUploadSection';
import { getPaymentMethod } from './payment/paymentUtils';

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-3 pb-6 border-b">
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Process Payment
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Submit payment proof for <span className="font-medium text-gray-900">{report.reporteeInformation.fullName}</span>'s loan
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-8">
          <PaymentInterfaceSelector
            report={report}
            paymentAmount={paymentAmount}
            onPaymentAmountChange={setPaymentAmount}
            selectedInstallment={selectedInstallment}
            onInstallmentChange={setSelectedInstallment}
          />

          <FileUploadSection
            proofDocuments={proofDocuments}
            onFilesChange={setProofDocuments}
          />
        </div>

        <DialogFooter className="pt-6 border-t bg-gray-50/50">
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
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-medium px-8"
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
