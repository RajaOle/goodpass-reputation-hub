
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
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
import LoanInformationForm from './LoanInformationForm';
import ReporteeInformationForm from './ReporteeInformationForm';
import SupportingDocumentsForm from './SupportingDocumentsForm';
import { DollarSign, User, FileText, Calendar } from 'lucide-react';

const reportSchema = z.object({
  loanInformation: z.object({
    loanName: z.string().min(3, 'Loan name must be at least 3 characters'),
    loanType: z.enum(['personal', 'business', 'mortgage', 'auto', 'student', 'other']),
    loanAmount: z.number().min(1, 'Loan amount must be greater than 0'),
    agreementDate: z.string().optional(),
    disbursementDate: z.string().optional(),
    dueDate: z.string().optional(),
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
    // Require custom loan purpose when 'other' is selected
    if (data.loanPurpose === 'other') {
      return data.customLoanPurpose && data.customLoanPurpose.length >= 10;
    }
    return true;
  }, {
    message: "Please provide a detailed description when selecting 'Other' as loan purpose (at least 10 characters)",
    path: ["customLoanPurpose"],
  }).refine((data) => {
    // Require installment count for installment repayment plan
    if (data.repaymentPlan === 'installment') {
      return data.installmentCount && data.installmentCount > 0;
    }
    return true;
  }, {
    message: "Number of installments is required for installment repayment plan",
    path: ["installmentCount"],
  }).refine((data) => {
    // Require collateral description when collateral is not 'none'
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
    idType: z.enum(['national-id', 'passport', 'driver-license']).optional(),
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
}

const NewReportDialog: React.FC<NewReportDialogProps> = ({ 
  open, 
  onOpenChange, 
  isDraft = false,
  reportId 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { addReport } = useReports();

  // Get today's date in ISO format
  const todayISOString = new Date().toISOString().split('T')[0];

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    mode: 'onChange',
    defaultValues: {
      loanInformation: {
        loanName: '',
        loanType: 'personal',
        loanAmount: 0,
        agreementDate: todayISOString,
        disbursementDate: todayISOString,
        dueDate: '',
        loanPurpose: 'business-expansion',
        customLoanPurpose: '',
        repaymentPlan: 'installment',
        installmentCount: undefined,
        applicationInterest: 0,
        applicationLateFee: 0,
        collateral: 'none',
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
    },
  });

  const getProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  const onSubmit = async (data: ReportFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log('Submitting report:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new report object
      const newReport: Report = {
        id: Date.now().toString(),
        status: 'pending',
        loanInformation: data.loanInformation,
        reporteeInformation: data.reporteeInformation,
        supportingDocuments: data.supportingDocuments,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        submittedAt: new Date().toISOString()
      };

      // Add report to context
      addReport(newReport);
      
      // Log activity to Recent Activity Feed
      const activityLog = {
        id: Date.now().toString(),
        reportId: `R${Date.now()}`,
        action: `✅ Report Submitted – Your report is under review`,
        timestamp: new Date().toISOString(),
        details: `${data.loanInformation.loanType} loan report submitted successfully`
      };
      
      console.log('Activity logged:', activityLog);
      
      toast({
        title: "✅ Report submitted successfully",
        description: `Your loan report for ${data.reporteeInformation.fullName} has been submitted and is now under review.`,
      });
      
      form.reset();
      setCurrentStep(1);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "❌ Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
        return false;
      }
    }
    return true;
  };

  const isCurrentStepValid = () => {
    return isStepValid(currentStep);
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border-b">
          <div className="flex justify-between items-start">
            <DialogHeader className="flex-1">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Create New Report
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm mt-1">
                Follow the steps below to create a comprehensive loan report
              </DialogDescription>
            </DialogHeader>
            
            {/* Timestamp Information */}
            <div className="bg-white/80 rounded-lg p-3 ml-4 min-w-[200px]">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Report Information</span>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Report Date:</span>
                  <span className="font-medium">{format(new Date(), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Agreement Date:</span>
                  <span className="font-medium">{format(new Date(), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Disbursement Date:</span>
                  <span className="font-medium">{format(new Date(), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simplified Progress Indicator */}
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
                    {currentStepData.description}
                  </p>
                </div>

                {/* Step Content */}
                <div className="transition-all duration-300">
                  {currentStep === 1 && (
                    <LoanInformationForm control={form.control} />
                  )}

                  {currentStep === 2 && (
                    <ReporteeInformationForm 
                      control={form.control}
                      setValue={form.setValue}
                    />
                  )}

                  {currentStep === 3 && (
                    <SupportingDocumentsForm 
                      control={form.control} 
                      setValue={form.setValue}
                    />
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-3 border-t bg-gray-50 -mx-6 px-6 -mb-6 pb-3">
                <div className="flex space-x-3">
                  {currentStep > 1 && (
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
                      disabled={!form.formState.isValid || isSubmitting}
                      className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                    >
                      <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
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
