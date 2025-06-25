
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            Submit payment proof for {report.reporteeInformation.fullName}'s loan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
