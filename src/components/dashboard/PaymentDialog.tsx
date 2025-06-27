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
import PaymentProgressBar from './PaymentProgressBar';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: Report;
}

type RepaymentType = 'open-payment' | 'installment' | 'single-payment';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onOpenChange, report }) => {
  // Fix: Map single-payment to single for internal logic
  const getRepaymentType = (): RepaymentType => {
    const plan = report.loanInformation.repaymentPlan;
    if (plan === 'single-payment') return 'single-payment';
    if (plan === 'installment') return 'installment';
    if (plan === 'open-payment') return 'open-payment';
    return 'single-payment'; // default fallback
  };

  const repaymentType = getRepaymentType();
  const initialAmount = report.loanInformation.loanAmount;
  const frequency = report.loanInformation.installmentCount || 1;
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [openPaymentAmount, setOpenPaymentAmount] = useState('');
  const [installmentProofs, setInstallmentProofs] = useState<(File | null)[]>(Array(frequency).fill(null));
  const [installmentPaid, setInstallmentPaid] = useState<boolean[]>(Array(frequency).fill(false));
  const [openPayments, setOpenPayments] = useState(report.paymentInfo?.openPayments || []);
  const { toast } = useToast();

  // Calculate outstanding for open payment
  const totalPaid = openPayments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingAmount = Math.max(initialAmount - totalPaid, 0);

  // For Open Payment, calculate outstanding (simulate, as no payment history is given)
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
    const newPayment = {
      id: (openPayments.length + 1).toString(),
      amount: Number(openPaymentAmount),
      date: new Date().toISOString(),
      notes: paymentProof ? paymentProof.name : '',
      runningBalance: Math.max(outstandingAmount - Number(openPaymentAmount), 0)
    };
    setOpenPayments([...openPayments, newPayment]);
    setOpenPaymentAmount('');
    setPaymentProof(null);
    toast({
      title: 'Payment Updated',
      description: `Open payment of ${formatCurrency(Number(newPayment.amount))} submitted!`
    });
    // Don't close dialog immediately
  };

  const handleSubmitSingle = () => {
    // Update the report's payment status
    if (report.paymentInfo) {
      report.paymentInfo.status = 'paid';
    }
    
    toast({
      title: 'Payment Completed',
      description: `Single payment of ${formatCurrency(singleAmount)} has been processed successfully!`
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

  // Virtual report for progress bar
  const virtualReport = {
    ...report,
    paymentInfo: {
      ...report.paymentInfo,
      openPayments,
      totalPaid,
      remainingBalance: outstandingAmount
    }
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
            <>
              <PaymentProgressBar report={virtualReport} formatCurrency={formatCurrency} />
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
                  {/* Show payment history only if there are open payments */}
                  {openPayments.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Payment History
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {openPayments.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <div>
                                <span className="text-sm font-medium text-green-600">
                                  {formatCurrency(payment.amount)}
                                </span>
                                {payment.notes && (
                                  <p className="text-xs text-gray-500">{payment.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-600">
                                {new Date(payment.date).toLocaleDateString()}
                              </span>
                              <p className="text-xs text-gray-500">
                                Balance: {formatCurrency(payment.runningBalance)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
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
                <div
                  className="divide-y divide-gray-200 mt-4 overflow-y-auto"
                  style={{
                    maxHeight: '40vh',
                    minHeight: '120px',
                    borderRadius: '0.5rem',
                    background: '#fff'
                  }}
                >
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
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
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
          {repaymentType === 'single-payment' && (
            <Card className="border-0 shadow-none bg-gradient-to-br from-yellow-50 to-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-500" /> Single Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Initial Amount</span>
                  <span className="font-semibold">{formatCurrency(initialAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Outstanding Amount</span>
                  <span className="font-semibold">{formatCurrency(initialAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Repayment Amount</span>
                  <span className="font-semibold text-green-600">{formatCurrency(initialAmount)}</span>
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
                  Confirm Payment of {formatCurrency(initialAmount)}
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
