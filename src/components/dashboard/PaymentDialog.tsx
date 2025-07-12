import React, { useState, useEffect } from 'react';
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
import { CheckCircle, UploadCloud, FileCheck, DollarSign, Loader2 } from 'lucide-react';
import PaymentProgressBar from './PaymentProgressBar';
import { 
  uploadRepaymentProof, 
  getRepaymentStatus, 
  getInstallmentSchedule,
  getRepaymentProofs,
  updateInstallmentAmount,
  type RepaymentStatus,
  type InstallmentSchedule
} from '@/services/paymentService';

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
  const getRepaymentType = (): RepaymentType => {
    const plan = report.loanInformation.repaymentPlan;
    if (plan === 'single-payment') return 'single-payment';
    if (plan === 'installment') return 'installment';
    if (plan === 'open-payment') return 'open-payment';
    return 'single-payment';
  };

  const repaymentType = getRepaymentType();
  const initialAmount = report.loanInformation.loanAmount;
  const frequency = report.loanInformation.installmentCount || 1;
  
  // State management
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [openPaymentAmount, setOpenPaymentAmount] = useState('');
  const [installmentProofs, setInstallmentProofs] = useState<(File | null)[]>(Array(frequency).fill(null));
  const [installmentPaid, setInstallmentPaid] = useState<boolean[]>(Array(frequency).fill(false));
  const [isLoading, setIsLoading] = useState(false);
  const [repaymentStatus, setRepaymentStatus] = useState<RepaymentStatus | null>(null);
  const [installmentSchedule, setInstallmentSchedule] = useState<InstallmentSchedule[]>([]);
  const [existingProofs, setExistingProofs] = useState<any[]>([]);
  
  const { toast } = useToast();

  // Calculate amounts
  const installmentAmount = Math.round(initialAmount / frequency);
  const singleAmount = initialAmount;

  // Load initial data
  useEffect(() => {
    if (open && report.id) {
      loadRepaymentData();
    }
  }, [open, report.id]);

  const loadRepaymentData = async () => {
    try {
      setIsLoading(true);
      
      // Load repayment status
      const statusResponse = await getRepaymentStatus(Number(report.id));
      if (statusResponse.success && statusResponse.status) {
        setRepaymentStatus(statusResponse.status);
      }

      // Load existing proofs
      const proofs = await getRepaymentProofs(Number(report.id));
      setExistingProofs(proofs);

      // Load installment schedule for installment payments
      if (repaymentType === 'installment') {
        const scheduleResponse = await getInstallmentSchedule(Number(report.id));
        if (scheduleResponse.success && scheduleResponse.schedule) {
          setInstallmentSchedule(scheduleResponse.schedule);
          // Update paid status based on schedule
          const paidStatus = scheduleResponse.schedule.map(item => item.status === 'paid');
          setInstallmentPaid(paidStatus);
        }
      }

      // Update installment amount in database if needed
      if (repaymentType === 'installment' && installmentAmount) {
        await updateInstallmentAmount(Number(report.id), installmentAmount);
      }
    } catch (error) {
      console.error('Error loading repayment data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment information',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // UI logic for enabling buttons
  const canSaveOpenPayment = openPaymentAmount && paymentProof && !isLoading;
  const canSaveSingle = paymentProof && !isLoading;
  const canMarkInstallmentPaid = (idx: number) => !!installmentProofs[idx] && !isLoading;

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

  const handleSubmitOpenPayment = async () => {
    if (!paymentProof || !openPaymentAmount) return;

    try {
      setIsLoading(true);
      
      const response = await uploadRepaymentProof({
        reportId: Number(report.id),
        file: paymentProof,
        amount: Number(openPaymentAmount),
        uploadedBy: 'reporter', // or get from context
        description: `Open payment - ${openPaymentAmount}`
      });

      if (response.success) {
        toast({
          title: 'Payment Uploaded',
          description: `Open payment of ${formatCurrency(Number(openPaymentAmount))} submitted successfully!`
        });
        
        // Reset form and reload data
        setOpenPaymentAmount('');
        setPaymentProof(null);
        await loadRepaymentData();
      } else {
        toast({
          title: 'Upload Failed',
          description: response.error || 'Failed to upload payment proof',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error submitting open payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit payment',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSingle = async () => {
    if (!paymentProof) return;

    try {
      setIsLoading(true);
      
      const response = await uploadRepaymentProof({
        reportId: Number(report.id),
        file: paymentProof,
        amount: singleAmount,
        uploadedBy: 'reporter', // or get from context
        description: `Single payment - ${singleAmount}`
      });

      if (response.success) {
        toast({
          title: 'Payment Completed',
          description: `Single payment of ${formatCurrency(singleAmount)} has been processed successfully!`
        });
        onOpenChange(false);
      } else {
        toast({
          title: 'Upload Failed',
          description: response.error || 'Failed to upload payment proof',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error submitting single payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit payment',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkInstallmentPaid = async (idx: number) => {
    const proof = installmentProofs[idx];
    if (!proof) return;

    try {
      setIsLoading(true);
      
      const response = await uploadRepaymentProof({
        reportId: Number(report.id),
        file: proof,
        installmentNumber: idx + 1,
        amount: installmentAmount,
        uploadedBy: 'reporter', // or get from context
        description: `Installment ${idx + 1} payment proof - ${installmentAmount}`
      });

      if (response.success) {
        toast({
          title: `Installment ${idx + 1} marked as paid!`,
          description: proof.name
        });
        
        // Update local state
        const newPaid = [...installmentPaid];
        newPaid[idx] = true;
        setInstallmentPaid(newPaid);
        
        // Clear the proof for this installment
        const newProofs = [...installmentProofs];
        newProofs[idx] = null;
        setInstallmentProofs(newProofs);
        
        // Reload data to get updated status
        await loadRepaymentData();
      } else {
        toast({
          title: 'Upload Failed',
          description: response.error || 'Failed to upload payment proof',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error marking installment as paid:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark installment as paid',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Virtual report for progress bar
  const virtualReport = {
    ...report,
    paymentInfo: {
      ...report.paymentInfo,
      totalPaid: repaymentStatus?.totalPaid || 0,
      remainingBalance: repaymentStatus?.remainingBalance || initialAmount
    }
  };

  if (isLoading && !repaymentStatus) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg w-full rounded-2xl shadow-2xl p-0 overflow-hidden border-0">
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2">Loading payment information...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
                    <span className="font-semibold">{formatCurrency(repaymentStatus?.remainingBalance || initialAmount)}</span>
                  </div>
                  <div>
                    <Label htmlFor="open-amount" className="text-gray-700">Amount to Update <span className="text-red-500">*</span></Label>
                    <Input
                      id="open-amount"
                      type="number"
                      min={1}
                      max={repaymentStatus?.remainingBalance || initialAmount}
                      value={openPaymentAmount}
                      onChange={e => setOpenPaymentAmount(e.target.value)}
                      className="mt-1"
                      placeholder="Enter amount paid"
                      disabled={isLoading}
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
                        disabled={isLoading}
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
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving Payment...
                      </>
                    ) : (
                      'Save Payment'
                    )}
                  </Button>
                  
                  {/* Show existing payment proofs */}
                  {existingProofs.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Payment History
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {existingProofs.map((proof) => (
                          <div key={proof.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <div>
                                <span className="text-sm font-medium text-green-600">
                                  {proof.description}
                                </span>
                                <p className="text-xs text-gray-500">{proof.file_name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-600">
                                {new Date(proof.uploaded_at).toLocaleDateString()}
                              </span>
                              <p className="text-xs text-gray-500">
                                {proof.verification_status}
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
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount per Installment</span>
                  <span className="font-semibold">{formatCurrency(installmentAmount)}</span>
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
                  {Array.from({ length: frequency }).map((_, idx) => {
                    const scheduleItem = installmentSchedule[idx];
                    const isPaid = installmentPaid[idx];
                    const isOverdue = scheduleItem?.status === 'overdue';
                    
                    return (
                      <div key={idx} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            Installment {idx + 1}
                            {isPaid && (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Paid
                              </span>
                            )}
                            {isOverdue && !isPaid && (
                              <span className="text-red-600 flex items-center gap-1">
                                <span className="w-2 h-2 bg-red-600 rounded-full"></span> Overdue
                              </span>
                            )}
                          </div>
                          <div className="text-gray-500 text-sm">
                            Amount: {formatCurrency(installmentAmount)}
                          </div>
                          {scheduleItem?.dueDate && (
                            <div className="text-gray-400 text-xs">
                              Due: {new Date(scheduleItem.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={e => handleProofChange(e, idx)}
                            disabled={isPaid || isLoading}
                          />
                          {installmentProofs[idx] && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <FileCheck className="w-4 h-4" /> {installmentProofs[idx]?.name}
                            </span>
                          )}
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded-lg shadow"
                            disabled={!canMarkInstallmentPaid(idx) || isPaid || isLoading}
                            onClick={() => handleMarkInstallmentPaid(idx)}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Mark as Paid'
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
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
                  <span className="font-semibold">{formatCurrency(repaymentStatus?.remainingBalance || initialAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Repayment Amount</span>
                  <span className="font-semibold text-green-600">{formatCurrency(repaymentStatus?.remainingBalance || initialAmount)}</span>
                </div>
                <div>
                  <Label htmlFor="single-proof" className="text-gray-700">Upload Payment Proof <span className="text-red-500">*</span></Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="single-proof"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleProofChange}
                      disabled={isLoading}
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
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Confirm Payment of ${formatCurrency(repaymentStatus?.remainingBalance || initialAmount)}`
                  )}
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
