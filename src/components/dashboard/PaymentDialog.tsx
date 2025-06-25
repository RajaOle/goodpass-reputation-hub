import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Report } from '@/types/report';
import { CheckCircle, UploadCloud, FileCheck, DollarSign } from 'lucide-react';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: Report;
}

type RepaymentType = 'open-payment' | 'installment' | 'single';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onOpenChange, report }) => {
  const repaymentType: RepaymentType = report.loanInformation.repaymentPlan as RepaymentType;
  const initialAmount = report.loanInformation.loanAmount;
  const frequency = report.loanInformation.installmentCount || 1;
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [openPaymentAmount, setOpenPaymentAmount] = useState('');
  const [installmentProofs, setInstallmentProofs] = useState<(File | null)[]>(Array(frequency).fill(null));
  const [installmentPaid, setInstallmentPaid] = useState<boolean[]>(Array(frequency).fill(false));
  const { toast } = useToast();

  // For Open Payment, calculate outstanding (simulate, as no payment history is given)
  const outstandingAmount = initialAmount; // Replace with real calculation if available
  const installmentAmount = Math.round(initialAmount / frequency);
  const singleAmount = initialAmount;

  // UI logic for enabling buttons
  const canSaveOpenPayment = openPaymentAmount && paymentProof;
  const canSaveSingle = paymentProof;
  const canMarkInstallmentPaid = (idx: number) => !!installmentProofs[idx];

  // Handlers
  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>, idx?: number) => {
    if (e.target.files && e.target.files[0]) {
      if (repaymentType === 'installment' && typeof idx === 'number') {
        const newProofs = [...installmentProofs];
        newProofs[idx] = e.target.files[0];
        setInstallmentProofs(newProofs);
      } else {
        setPaymentProof(e.target.files[0]);
      }
    }
  };

  const handleSubmitOpenPayment = () => {
    toast({
      title: 'Payment Updated',
      description: `Open payment of ${formatCurrency(Number(openPaymentAmount))} submitted!`
    });
    onOpenChange(false);
  };

  const handleSubmitSingle = () => {
    toast({
      title: 'Payment Completed',
      description: 'Single payment proof submitted!'
    });
    onOpenChange(false);
  };

  const handleMarkInstallmentPaid = (idx: number) => {
    const newPaid = [...installmentPaid];
    newPaid[idx] = true;
    setInstallmentPaid(newPaid);
    toast({
      title: `Installment ${idx + 1} marked as paid!`,
      description: installmentProofs[idx]?.name
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full rounded-2xl shadow-2xl p-0 overflow-hidden border-0">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-500 p-6 text-white">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <UploadCloud className="w-7 h-7" /> Process Payment
          </DialogTitle>
          <DialogDescription className="text-white/80">
            {report.reporteeInformation.fullName}'s Loan Payment
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-6 bg-white">
          <div className="mb-4 p-3 rounded-lg text-white font-bold flex items-center gap-2"
               style={{
                 background: repaymentType === 'open-payment'
                   ? 'linear-gradient(90deg, #6366f1 0%, #2563eb 100%)'
                   : repaymentType === 'installment'
                   ? 'linear-gradient(90deg, #059669 0%, #10b981 100%)'
                   : 'linear-gradient(90deg, #f59e42 0%, #fbbf24 100%)'
               }}>
            <CheckCircle className="w-5 h-5" />
            Repayment Type: <span className="capitalize">{repaymentType.replace('-', ' ')}</span>
          </div>

          {/* Open Payment */}
          {repaymentType === 'open-payment' && (
            <Card className="border-0 shadow-none bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-500" /> Open Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Initial Amount</span>
                  <span className="font-semibold">{formatCurrency(initialAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Outstanding Amount</span>
                  <span className="font-semibold">{formatCurrency(outstandingAmount)}</span>
                </div>
                <div>
                  <Label htmlFor="open-amount" className="text-gray-700">Amount to Update <span className="text-red-500">*</span></Label>
                  <Input
                    id="open-amount"
                    type="number"
                    min={1}
                    max={outstandingAmount}
                    value={openPaymentAmount}
                    onChange={e => setOpenPaymentAmount(e.target.value)}
                    className="mt-1"
                    placeholder="Enter amount paid"
                  />
                </div>
                <div>
                  <Label htmlFor="open-proof" className="text-gray-700">Upload Payment Proof <span className="text-red-500">*</span></Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="open-proof"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleProofChange}
                    />
                    {paymentProof && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <FileCheck className="w-4 h-4" /> {paymentProof.name}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleSubmitOpenPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow mt-4"
                  disabled={!canSaveOpenPayment}
                >
                  Save Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Installment */}
          {repaymentType === 'installment' && (
            <Card className="border-0 shadow-none bg-gradient-to-br from-green-50 to-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" /> Installment Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Initial Amount</span>
                  <span className="font-semibold">{formatCurrency(initialAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Installment Frequency</span>
                  <span className="font-semibold">{frequency}x</span>
                </div>
                <div className="divide-y divide-gray-200 mt-4">
                  {Array.from({ length: frequency }).map((_, idx) => (
                    <div key={idx} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          Installment {idx + 1}
                          {installmentPaid[idx] && (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" /> Paid
                            </span>
                          )}
                        </div>
                        <div className="text-gray-500 text-sm">Amount: {formatCurrency(installmentAmount)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={e => handleProofChange(e, idx)}
                          disabled={installmentPaid[idx]}
                        />
                        {installmentProofs[idx] && (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <FileCheck className="w-4 h-4" /> {installmentProofs[idx]?.name}
                          </span>
                        )}
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded-lg shadow"
                          disabled={!canMarkInstallmentPaid(idx) || installmentPaid[idx]}
                          onClick={() => handleMarkInstallmentPaid(idx)}
                        >
                          Mark as Paid
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-2">* Payment amount is fixed per installment. Only payment proof can be updated.</div>
              </CardContent>
            </Card>
          )}

          {/* Single Payment */}
          {repaymentType === 'single' && (
            <Card className="border-0 shadow-none bg-gradient-to-br from-yellow-50 to-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-500" /> Single Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Initial Amount</span>
                  <span className="font-semibold">{formatCurrency(singleAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Outstanding Amount</span>
                  <span className="font-semibold">{formatCurrency(singleAmount)}</span>
                </div>
                <div>
                  <Label htmlFor="single-proof" className="text-gray-700">Upload Payment Proof <span className="text-red-500">*</span></Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="single-proof"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleProofChange}
                    />
                    {paymentProof && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <FileCheck className="w-4 h-4" /> {paymentProof.name}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleSubmitSingle}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow mt-4"
                  disabled={!canSaveSingle}
                >
                  Complete Payment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
