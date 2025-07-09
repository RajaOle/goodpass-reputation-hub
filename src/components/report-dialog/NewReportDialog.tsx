import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, startOfDay, isBefore } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReportFormData, Report } from '@/types/report';
import { useReports } from '@/contexts/ReportsContext';
import { submitReport } from '@/services/reportService';
import LoanInformationForm from './LoanInformationForm';
import ReporteeInformationForm from './ReporteeInformationForm';
import SupportingDocumentsForm from './SupportingDocumentsForm';
import { DollarSign, User, FileText, Calendar } from 'lucide-react';
import { uploadSupportingDocuments } from '@/services/supportingDocumentService';
import axios from 'axios'; // Add this import for API calls
import { supabase } from '@/integrations/supabase/client';

const reportSchema = z.object({
  loanInformation: z.object({
    loanName: z.string().min(3, 'Loan name must be at least 3 characters'),
    loanType: z.enum(['personal', 'business', 'mortgage', 'auto', 'student', 'other']),
    loanAmount: z.number().min(1, 'Loan amount must be greater than 0'),
    agreementDate: z.string().optional(),
    disbursementDate: z.string().optional(),
    dueDate: z.string().optional().refine(
      (val) => {
        if (!val) return true;
        // Only allow today or future dates
        const today = startOfDay(new Date());
        const selected = startOfDay(new Date(val));
        return !isBefore(selected, today);
      },
      { message: "Due date cannot be before today", path: ["dueDate"] }
    ),
    loanPurpose: z.enum(['business-expansion', 'debt-consolidation', 'home-improvement', 'education', 'medical-expenses', 'wedding', 'travel', 'investment', 'emergency', 'other']),
    customLoanPurpose: z.string().optional(),
    repaymentPlan: z.enum(['single-payment', 'installment', 'open-payment']),
    installmentCount: z.number().optional(),
    applicationInterest: z.number().default(0),
    applicationLateFee: z.number().default(0),
    collateral: z.enum(['none', 'property', 'vehicle', 'savings', 'stocks', 'jewelry', 'equipment', 'other']).default('none'),
    collateralDescription: z.string().optional(),
    collateralValue: z.number().optional(),
  }).refine((data) => {
    if (data.loanPurpose === 'other') {
      return data.customLoanPurpose && data.customLoanPurpose.length >= 10;
    }
    return true;
  }, {
    message: "Please provide a detailed description when selecting 'Other' as loan purpose (at least 10 characters)",
    path: ["customLoanPurpose"],
  }).refine((data) => {
    if (data.repaymentPlan === 'installment') {
      return data.installmentCount && data.installmentCount > 0;
    }
    return true;
  }, {
    message: "Number of installments is required for installment repayment plan",
    path: ["installmentCount"],
  }).refine((data) => {
    if (data.collateral !== 'none') {
      return data.collateralDescription && data.collateralDescription.length >= 10;
    }
    return true;
  }, {
    message: "Please provide a detailed description of the collateral (at least 10 characters)",
    path: ["collateralDescription"],
  }),
  reporteeInformation: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
    email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
    nationalId: z.string().optional(),
    idType: z.enum([
      'national-id', 'passport', 'driver-license',
      'national_id', 'driver_license'
    ]).optional(),
    idPicture: z.instanceof(File).optional(),
    socialMediaLinks: z.array(z.string()).optional(),
    bankName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
  }),
  supportingDocuments: z.object({
    documents: z.array(z.instanceof(File)),
    additionalNotes: z.string().optional(),
  }),
});

const steps = [
  { 
    id: 1, 
    name: 'Loan Details', 
    icon: DollarSign, 
    title: 'Loan Details',
    description: "Let's start with the basic loan information."
  },
  { 
    id: 2, 
    name: 'Reportee Info', 
    icon: User, 
    title: 'Reportee Information',
    description: 'Now, tell us who the reportee is.'
  },
  { 
    id: 3, 
    name: 'Attachments', 
    icon: FileText, 
    title: 'Attachments',
    description: 'Add any supporting documents to strengthen the report.'
  },
];

interface NewReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDraft?: boolean;
  reportId?: string;
  isRestructure?: boolean;
  isAddInfo?: boolean;
  existingReport?: Report;
}

const NewReportDialog: React.FC<NewReportDialogProps> = ({ 
  open, 
  onOpenChange, 
  isDraft = false,
  reportId,
  isRestructure = false,
  isAddInfo = false,
  existingReport
}) => {
  const [currentStep, setCurrentStep] = useState(isAddInfo ? 2 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { refreshReports } = useReports();

  const todayISOString = new Date().toISOString().split('T')[0];

  const isSubmittingRef = useRef(false);

  const getDefaultValues = () => {
    if ((isRestructure || isAddInfo) && existingReport) {
      return {
        loanInformation: {
          ...existingReport.loanInformation,
          agreementDate: existingReport.loanInformation.agreementDate || todayISOString,
          disbursementDate: existingReport.loanInformation.disbursementDate || todayISOString,
          customLoanPurpose: existingReport.loanInformation.customLoanPurpose ?? '',
          collateralDescription: existingReport.loanInformation.collateralDescription ?? '',
        },
        reporteeInformation: existingReport.reporteeInformation,
        supportingDocuments: existingReport.supportingDocuments,
      };
    }
    
    return {
      loanInformation: {
        loanName: '',
        loanType: 'personal' as const,
        loanAmount: 0,
        agreementDate: todayISOString,
        disbursementDate: todayISOString,
        dueDate: '',
        loanPurpose: 'business-expansion' as const,
        customLoanPurpose: '',
        repaymentPlan: 'installment' as const,
        installmentCount: undefined,
        applicationInterest: 0,
        applicationLateFee: 0,
        collateral: 'none' as const,
        collateralDescription: '',
        collateralValue: undefined,
      },
      reporteeInformation: {
        fullName: '',
        phoneNumber: '',
        email: '',
        nationalId: '',
        idType: undefined,
        idPicture: undefined,
        socialMediaLinks: [],
        bankName: '',
        bankAccountNumber: '',
      },
      supportingDocuments: {
        documents: [],
        additionalNotes: '',
      },
    };
  };

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    mode: 'onChange',
    defaultValues: getDefaultValues(),
  });

  const [fetchedBankAccounts, setFetchedBankAccounts] = useState<{ bankName: string, bankAccountNumber: string }[]>([]);
  const [fetchedSocialProfiles, setFetchedSocialProfiles] = useState<string[]>([]);

  // Reset form when dialog opens/closes or mode changes
  useEffect(() => {
    if (open) {
      const defaultValues = getDefaultValues();
      form.reset(defaultValues);
      setCurrentStep(isAddInfo ? 2 : 1); // Ensure correct step on open/mode change
    }
  }, [open, isRestructure, isAddInfo, existingReport]);

  // Fetch existing info every time the dialog opens in Add Info mode
  useEffect(() => {
    const fetchAdditionalInfo = async () => {
      if (open && isAddInfo && existingReport?.id) {
        try {
          // Get Supabase access token
          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token;
          const supabaseUrl = "https://nnkeqdvbkudgfrtkskae.supabase.co";
          // Fetch bank accounts
          const bankRes = await fetch(
            `${supabaseUrl}/functions/v1/submit-reportee-bank-account?reportId=${existingReport.id}&cb=${Date.now()}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
              },
            }
          );
          let banks = [];
          if (bankRes.ok) {
            const bankJson = await bankRes.json();
            banks = Array.isArray(bankJson) ? bankJson : (bankJson.data || []);
          }
          if (banks.length > 0) {
            // Map API fields to frontend fields
            const mappedBanks = banks.map(b => ({
              bankName: b.bankName || b.bank_name,
              bankAccountNumber: b.bankAccountNumber || b.account_number,
            }));
            setFetchedBankAccounts(mappedBanks);
            form.setValue('reporteeInformation.bankName', mappedBanks[0]?.bankName || '');
            form.setValue('reporteeInformation.bankAccountNumber', mappedBanks[0]?.bankAccountNumber || '');
          }
          // Fetch social profiles
          const socialRes = await fetch(
            `${supabaseUrl}/functions/v1/submit-reportee-social-profile?reportId=${existingReport.id}&cb=${Date.now()}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
              },
            }
          );
          let socials = [];
          if (socialRes.ok) {
            const socialJson = await socialRes.json();
            socials = Array.isArray(socialJson) ? socialJson : (socialJson.data || []);
          }
          if (socials.length > 0) {
            // Extract profile_url from each social profile object
            const socialUrls = socials.map(social => social.profile_url || social);
            setFetchedSocialProfiles(socialUrls);
            form.setValue('reporteeInformation.socialMediaLinks', socialUrls);
          }
        } catch (err) {
          toast({
            title: "Failed to fetch additional info",
            description: "Could not load previously registered bank accounts or social profiles.",
            variant: "destructive",
          });
        }
      }
    };
    fetchAdditionalInfo();
    // eslint-disable-next-line
  }, [open, isAddInfo, existingReport?.id]);

  const getProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  const onSubmit = async (data: ReportFormData) => {
    console.trace("Submitting report...");
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      let uploadedDocuments = [];
      const files = data.supportingDocuments.documents || [];
      if (files.length > 0) {
        let uploadResult;
        try {
          uploadResult = await uploadSupportingDocuments(files, data.supportingDocuments.additionalNotes || '');
          console.log('uploadResult', uploadResult);
        } catch (err) {
          console.error('Document upload threw error:', err);
          toast({
            title: "❌ Document Upload Failed",
            description: err?.message || 'Failed to upload document',
            variant: "destructive",
          });
          setIsSubmitting(false);
          isSubmittingRef.current = false;
          return;
        }
        if (!uploadResult || !uploadResult.data || !Array.isArray(uploadResult.data.files)) {
          console.error('Document upload missing files array:', uploadResult);
          toast({
            title: "❌ Document Upload Failed",
            description: "Upload succeeded but response is missing files info. See console for details.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          isSubmittingRef.current = false;
          return;
        }
        for (const fileMeta of uploadResult.data.files) {
          uploadedDocuments.push({
            file_url: fileMeta.url,
            file_type: fileMeta.type,
            file_size: fileMeta.size,
            description: data.supportingDocuments.additionalNotes || '',
          });
        }
      }

      // Prepare the report data with uploaded document metadata
      const reportDataToSubmit = {
        ...data,
        supportingDocuments: {
          ...data.supportingDocuments,
          documents: uploadedDocuments,
        },
      };

      // Continue with the original logic
      if (isRestructure && existingReport) {
        console.log('Restructure request submitted for report:', existingReport.id);
        toast({
          title: "✅ Restructure Request Submitted",
          description: `Your restructure request for ${data.reporteeInformation.fullName} has been submitted for admin approval.`,
        });
      } else if (isAddInfo && existingReport) {
        // Compare and POST new bank account if changed
        const currentBank = {
          bankName: data.reporteeInformation.bankName,
          bankAccountNumber: data.reporteeInformation.bankAccountNumber,
        };
        const hasNewBank =
          currentBank.bankName &&
          currentBank.bankAccountNumber &&
          !fetchedBankAccounts.some(
            b =>
              b.bankName === currentBank.bankName &&
              b.bankAccountNumber === currentBank.bankAccountNumber
          );
        if (hasNewBank) {
          const supabaseUrl = "https://nnkeqdvbkudgfrtkskae.supabase.co";
          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token;
          await axios.post(`${supabaseUrl}/functions/v1/submit-reportee-bank-account`, {
            report_id: existingReport.id,
            bank_name: currentBank.bankName,
            account_number: currentBank.bankAccountNumber,
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
        }

        // Compare and POST new social profiles
        const newSocials = (data.reporteeInformation.socialMediaLinks || []).filter(
          link => !fetchedSocialProfiles.includes(link)
        );
        for (const link of newSocials) {
          const supabaseUrl = "https://nnkeqdvbkudgfrtkskae.supabase.co";
          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token;
          // Extract platform name from the URL
          let platform_name = '';
          try {
            const urlObj = new URL(link);
            platform_name = urlObj.hostname.split('.').slice(-2, -1)[0]; // e.g., 'instagram'
          } catch {
            platform_name = 'unknown';
          }
          await axios.post(`${supabaseUrl}/functions/v1/submit-reportee-social-profile`, {
            report_id: existingReport.id,
            platform_name,
            profile_url: link,
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
        }

        // Continue with the original Add Info submit logic
        console.log('Additional information submitted for report:', existingReport.id);
        toast({
          title: "✅ Information Updated",
          description: `Additional information for ${data.reporteeInformation.fullName} has been updated successfully.`,
        });
      } else {
        const result = await submitReport(reportDataToSubmit);
        if (result.success) {
          await refreshReports();
          toast({
            title: "✅ Report submitted successfully",
            description: `Your loan report for ${data.reporteeInformation.fullName} has been submitted and is now under review.`,
          });
        } else {
          throw new Error(result.error || 'Failed to submit report');
        }
      }
      form.reset();
      setCurrentStep(1);
      onOpenChange(false);
    } catch (error) {
      console.error('Report submission error:', error);
      toast({
        title: "❌ Submission Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const getFieldsForStep = (step: number): (keyof ReportFormData)[] => {
    switch (step) {
      case 1:
        return ['loanInformation'];
      case 2:
        return ['reporteeInformation'];
      case 3:
        return ['supportingDocuments'];
      default:
        return [];
    }
  };

  const handleNext = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    console.log('Form validation result:', isValid);
    console.log('Form errors:', form.formState.errors);
    console.log('Current form values:', form.getValues());
    
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (stepNumber: number) => {
    const fieldsForStep = getFieldsForStep(stepNumber);
    const errors = form.formState.errors;
    
    for (const fieldPath of fieldsForStep) {
      if (errors[fieldPath]) {
        console.log(`Validation error for step ${stepNumber}:`, errors[fieldPath]);
        return false;
      }
    }
    return true;
  };

  const isCurrentStepValid = () => {
    return isStepValid(currentStep);
  };

  const isAddInfoFormValid = () => {
    // Only require reporteeInformation and supportingDocuments to be valid
    return isStepValid(2) && isStepValid(3);
  };

  const currentStepData = steps[currentStep - 1];

  const getDialogTitle = () => {
    if (isRestructure) return 'Restructure Report';
    if (isAddInfo) return 'Add Additional Information';
    return 'Create New Report';
  };

  const getDialogDescription = () => {
    if (isRestructure) {
      return 'Review and modify the loan details below. Only certain fields can be edited.';
    }
    if (isAddInfo) {
      return 'Add or update reportee information and supporting documents. Loan details are read-only.';
    }
    return 'Follow the steps below to create a comprehensive loan report';
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) return 'Submitting...';
    if (isRestructure) return 'Submit Restructure Request';
    if (isAddInfo) return 'Update Information';
    return 'Submit Report';
  };

  const getSubmitButtonColor = () => {
    if (isRestructure) return 'bg-orange-600 hover:bg-orange-700';
    if (isAddInfo) return 'bg-green-600 hover:bg-green-700';
    return 'bg-green-600 hover:bg-green-700';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border-b">
          <div className="flex justify-between items-start">
            <DialogHeader className="flex-1">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {getDialogTitle()}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm mt-1">
                {getDialogDescription()}
              </DialogDescription>
            </DialogHeader>
            
            {/* Timestamp Information */}
            <div className="bg-white/80 rounded-lg p-3 ml-4 min-w-[200px]">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {isRestructure ? 'Original Report Info' : isAddInfo ? 'Report Information' : 'Report Information'}
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Report Date:</span>
                  <span className="font-medium">
                    {(isRestructure || isAddInfo) && existingReport 
                      ? format(new Date(existingReport.createdAt), 'MMM dd, yyyy')
                      : format(new Date(), 'MMM dd, yyyy')
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Agreement Date:</span>
                  <span className="font-medium">
                    {(isRestructure || isAddInfo) && existingReport?.loanInformation.agreementDate
                      ? format(new Date(existingReport.loanInformation.agreementDate), 'MMM dd, yyyy')
                      : format(new Date(), 'MMM dd, yyyy')
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Disbursement Date:</span>
                  <span className="font-medium">
                    {(isRestructure || isAddInfo) && existingReport?.loanInformation.disbursementDate
                      ? format(new Date(existingReport.loanInformation.disbursementDate), 'MMM dd, yyyy')
                      : format(new Date(), 'MMM dd, yyyy')
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator and form content remain the same */}
        <div className="px-6 py-2 bg-white border-b">
          <div className="flex items-center justify-between mb-1">
            {steps.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`
                        w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300
                        ${isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isCurrent 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                        }
                      `}
                    >
                      {step.id}
                    </div>
                    <p className={`text-xs mt-0.5 ${isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                      {step.name}
                    </p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div 
                      className={`
                        flex-1 h-0.5 mx-2 rounded transition-all duration-300
                        ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>
          
          <Progress value={getProgress()} className="h-0.5" />
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step Card */}
              <div className="bg-white rounded-xl shadow-sm border p-4 transition-all duration-300">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {currentStepData.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {isRestructure && currentStep === 1 
                      ? "Review loan details. You can edit Loan type, Due date, and Collateral information."
                      : isAddInfo && currentStep === 1
                      ? "Loan details are read-only. Use Restructure to modify loan information."
                      : currentStepData.description
                    }
                  </p>
                </div>

                {/* Step Content */}
                <div className="transition-all duration-300">
                  {currentStep === 1 && (
                    <LoanInformationForm 
                      control={form.control}
                      isRestructure={isRestructure}
                      isAddInfo={isAddInfo}
                    />
                  )}

                  {currentStep === 2 && (
                    <ReporteeInformationForm 
                      control={form.control}
                      setValue={form.setValue}
                      isRestructure={isRestructure}
                      isAddInfo={isAddInfo}
                      fetchedBankAccounts={fetchedBankAccounts}
                    />
                  )}

                  {currentStep === 3 && (
                    <SupportingDocumentsForm 
                      control={form.control} 
                      setValue={form.setValue}
                      isRestructure={isRestructure}
                      isAddInfo={isAddInfo}
                    />
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-3 border-t bg-gray-50 -mx-6 px-6 -mb-6 pb-3">
                <div className="flex space-x-3">
                  {currentStep > 1 && (!isAddInfo || currentStep > 2) && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={(e) => handlePrevious(e)}
                      className="flex items-center space-x-2"
                      disabled={isSubmitting}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>
                  )}
                </div>
                <div className="flex space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  {isAddInfo && (
                    <pre style={{ maxWidth: 400, maxHeight: 120, overflow: 'auto', background: '#f8f8f8', color: '#c00', fontSize: 12 }}>
                      {JSON.stringify(form.formState.errors, null, 2)}
                    </pre>
                  )}
                  {currentStep < steps.length ? (
                    <Button 
                      type="button" 
                      onClick={(e) => handleNext(e)}
                      disabled={!isCurrentStepValid() || isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isAddInfo ? !isAddInfoFormValid() || isSubmitting : !form.formState.isValid || isSubmitting}
                      className={`${getSubmitButtonColor()} flex items-center space-x-2`}
                    >
                      <span>{getSubmitButtonText()}</span>
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewReportDialog;
