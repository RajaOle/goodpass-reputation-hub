
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Check, ChevronLeft, ChevronRight, FileText, DollarSign, User } from 'lucide-react';
import { ReportFormData } from '@/types/report';
import LoanInformationForm from './LoanInformationForm';
import ReporteeInformationForm from './ReporteeInformationForm';
import SupportingDocumentsForm from './SupportingDocumentsForm';

const reportSchema = z.object({
  loanInformation: z.object({
    loanType: z.enum(['personal', 'business', 'mortgage', 'auto', 'student', 'other']),
    loanAmount: z.number().min(1, 'Loan amount must be greater than 0'),
    loanTerm: z.number().min(1, 'Loan term must be at least 1 month'),
    monthlyPayment: z.number().min(0, 'Monthly payment cannot be negative'),
    loanPurpose: z.string().min(10, 'Please provide a detailed loan purpose (at least 10 characters)'),
    collateral: z.string().optional(),
  }),
  reporteeInformation: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
    email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
    nationalId: z.string().optional(),
    socialMediaLinks: z.array(z.string()).optional(),
  }),
  supportingDocuments: z.object({
    documents: z.array(z.instanceof(File)),
    additionalNotes: z.string().optional(),
  }),
});

interface NewReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDraft?: boolean;
  reportId?: string;
}

const steps = [
  { id: 1, name: 'Loan Details', icon: DollarSign, description: 'Basic loan information' },
  { id: 2, name: 'Borrower Info', icon: User, description: 'Personal details' },
  { id: 3, name: 'Documents', icon: FileText, description: 'Supporting files' },
];

const NewReportDialog: React.FC<NewReportDialogProps> = ({ 
  open, 
  onOpenChange, 
  isDraft = false,
  reportId 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    mode: 'onChange',
    defaultValues: {
      loanInformation: {
        loanType: 'personal',
        loanAmount: 0,
        loanTerm: 0,
        monthlyPayment: 0,
        loanPurpose: '',
        collateral: '',
      },
      reporteeInformation: {
        fullName: '',
        phoneNumber: '',
        email: '',
        nationalId: '',
        socialMediaLinks: [],
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
    try {
      console.log('Submitting report:', data);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "🎉 Report Submitted Successfully!",
        description: "Your loan report is now pending review. We'll notify you once it's processed.",
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
    }
  };

  const saveDraft = async () => {
    try {
      const data = form.getValues();
      console.log('Saving draft:', data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "💾 Draft Saved",
        description: "Your progress has been saved. You can continue later.",
      });
    } catch (error) {
      toast({
        title: "❌ Save Failed",
        description: "Couldn't save your draft. Please try again.",
        variant: "destructive",
      });
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

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              💸 Create Loan Report
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Help us understand your loan details to create an accurate credit report
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-white border-b">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                        ${isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isCurrent 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <p className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                        {step.name}
                      </p>
                      <p className="text-xs text-gray-400">{step.description}</p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div 
                      className={`
                        flex-1 h-1 mx-4 rounded transition-all duration-300
                        ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>
          
          <Progress value={getProgress()} className="h-2" />
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        💸 Let's set up the loan details
                      </h3>
                      <p className="text-gray-600">
                        Tell us about the loan you're reporting on
                      </p>
                    </div>
                    <LoanInformationForm control={form.control} />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        👤 Borrower Information
                      </h3>
                      <p className="text-gray-600">
                        Who is this loan report for?
                      </p>
                    </div>
                    <ReporteeInformationForm control={form.control} />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        📄 Supporting Documents
                      </h3>
                      <p className="text-gray-600">
                        Upload any relevant documents to support your report
                      </p>
                    </div>
                    <SupportingDocumentsForm 
                      control={form.control} 
                      setValue={form.setValue}
                    />
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t bg-gray-50 -mx-6 px-6 -mb-6 pb-6">
                <div className="flex space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={saveDraft}
                    className="flex items-center space-x-2"
                  >
                    <span>💾</span>
                    <span>Save Draft</span>
                  </Button>
                  
                  {currentStep > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handlePrevious}
                      className="flex items-center space-x-2"
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
                  >
                    Cancel
                  </Button>
                  
                  {currentStep < steps.length ? (
                    <Button 
                      type="button" 
                      onClick={handleNext}
                      disabled={!isCurrentStepValid()}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={!form.formState.isValid}
                      className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                    >
                      <span>✨</span>
                      <span>Submit Report</span>
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
